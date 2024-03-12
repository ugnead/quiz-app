import { Document, Schema, model } from "mongoose";

interface IQuestion extends Document {
  category: Schema.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

let questionSchema = new Schema<IQuestion>({
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: false },
});

const Question = model<IQuestion>("Question", questionSchema);

export default Question;
