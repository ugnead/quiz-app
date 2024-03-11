import mongoose, { Schema } from "mongoose";

let questionSchema = new mongoose.Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: false },
});

const Question = mongoose.model("Question", questionSchema);
