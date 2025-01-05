import { Document, Schema, model } from "mongoose";

interface IQuestion extends Document {
  name: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subcategory: Schema.Types.ObjectId;
  status: "enabled" | "disabled";
  createdAt: Date;
}

let questionSchema = new Schema<IQuestion>({
  name: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: false },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["enabled", "disabled"],
    default: "enabled",
  },
  createdAt: { type: Date, default: Date.now },
});

const Question = model<IQuestion>("Question", questionSchema);

export default Question;
