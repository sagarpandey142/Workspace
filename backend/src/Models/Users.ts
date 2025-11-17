import { Schema, model, Document } from "mongoose";

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

const UserSchema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default model<UserDoc>("User", UserSchema);
