import { Document, Schema, model } from "mongoose";

interface ICategory extends Document {
  name: string;
  subcategories: Schema.Types.ObjectId[];
  status: "enabled" | "disabled";
}

let categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  subcategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  status: {
    type: String,
    enum: ["enabled", "disabled"],
    default: "enabled",
  },
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
