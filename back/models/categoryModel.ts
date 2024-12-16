import { Document, Schema, model } from "mongoose";

interface ICategory extends Document {
  name: string;
  subcategories: Schema.Types.ObjectId[];
  status: "enabled" | "disabled";
  createdAt: Date;
}

let categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    minlength: [1, "Name must be at least 1 character(s) long"],
    maxlength: [50, "Name cannot exceed 50 character(s)"],
  },
  subcategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["enabled", "disabled"],
    default: "enabled",
  },
  createdAt: { type: Date, default: Date.now },
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
