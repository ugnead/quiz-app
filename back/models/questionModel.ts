import { Document, Schema, model } from "mongoose";

interface IQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subcategory: Schema.Types.ObjectId;
  status: "enabled" | "disabled";
  createdAt: Date;
}

let questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: false },
  subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
});

const Question = model<IQuestion>("Question", questionSchema);

export default Question;
