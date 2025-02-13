import { Document, Schema, model } from "mongoose";

interface ISubcategory extends Document {
  name: string;
  category: Schema.Types.ObjectId;
  questions: Schema.Types.ObjectId[];
  status: "enabled" | "disabled";
  createdAt: Date;
}

let subcategorySchema = new Schema<ISubcategory>({
  name: {
    type: String,
    required: true,
    minlength: [1, "Name must be at least 1 character(s) long"],
    maxlength: [50, "Name cannot exceed 50 character(s)"],
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  status: {
    type: String,
    required: true,
    enum: ["enabled", "disabled"],
    default: "disabled",
  },
  createdAt: { type: Date, default: Date.now },
});

const Subcategory = model<ISubcategory>("Subcategory", subcategorySchema);

export default Subcategory;
