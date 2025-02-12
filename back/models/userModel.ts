import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
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
  role: { type: String, enum: ["user", "admin"], default: "admin" },
});

const User = model<IUser>("User", userSchema);

export default User;
