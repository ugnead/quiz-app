import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  refreshToken?: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  refreshToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = model<IUser>("User", userSchema);

export default User;
