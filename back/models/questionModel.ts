import { Document, Schema, model } from "mongoose";

interface IQuestion extends Document {
  name: string;
  answerOptions: string[];
  correctAnswer: string;
  explanation?: string;
  subcategory: Schema.Types.ObjectId;
  status: "enabled" | "disabled";
  createdAt: Date;
}

let questionSchema = new Schema<IQuestion>({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 character(s) long"],
    maxlength: [255, "Name cannot exceed 255 character(s)"],
  },
  answerOptions: [{ type: String, required: true }],
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
    default: "disabled",
  },
  createdAt: { type: Date, default: Date.now },
});

const Question = model<IQuestion>("Question", questionSchema);

export default Question;
