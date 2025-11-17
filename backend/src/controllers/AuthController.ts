import { Request, Response } from "express";
import UserModel, { UserDoc } from "../Models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password ,role} = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashed,role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role,name: name }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id, role: user.role ,name:user.name}, JWT_SECRET, { expiresIn: "1d" });
  return  res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
}
