
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend listening http://localhost:${PORT}`));
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('Failed to connect to DB', err.message);
    } else {
      console.error('Failed to connect to DB', err);
    }
    process.exit(1);
  });
