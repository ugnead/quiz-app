import { Document, Schema, model } from "mongoose";

interface ICategory extends Document {
  name: string;
  parentCategory: Schema.Types.ObjectId;
}

let categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
