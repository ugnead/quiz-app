import { Document, Schema, model } from "mongoose";

interface ISubcategory extends Document {
  name: string;
  category: Schema.Types.ObjectId;
  questions: Schema.Types.ObjectId[];
  status: "enabled" | "disabled";
  createdAt: Date;
}

let subcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  status: {
    type: String,
    required: true,
    enum: ["enabled", "disabled"],
    default: "enabled",
  },
  createdAt: { type: Date, default: Date.now },
});

const Subcategory = model<ISubcategory>("Subcategory", subcategorySchema);

export default Subcategory;
