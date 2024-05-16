import { Document, Schema, model } from "mongoose";

interface ICategory extends Document {
  name: string;
  subcategories: Schema.Types.ObjectId[];
}

let categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: "Subcategory"
  }],
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
