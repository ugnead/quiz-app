import { Document, Schema, model } from "mongoose";

interface IUserProgress extends Document {
  user: Schema.Types.ObjectId;
  subcategory: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  correctAnswersCount: number;
}

let userProgressSchema = new Schema<IUserProgress>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  correctAnswersCount: { type: Number, default: 0 },
});

const UserProgress = model<IUserProgress>("UserProgress", userProgressSchema);

export default UserProgress;
