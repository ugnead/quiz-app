import { Document, Schema, model } from "mongoose";

interface ISubcategory extends Document {
  name: string;
  category: Schema.Types.ObjectId;
  questions: Schema.Types.ObjectId[];
}

let subcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

const Subcategory = model<ISubcategory>("Subcategory", subcategorySchema);

export default Subcategory;
