import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  role: string;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  refreshToken: { type: String },
});

const User = model<IUser>("User", userSchema);

export default User;
