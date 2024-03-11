import mongoose, { Schema } from "mongoose";

let categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

const Category = mongoose.model("Category", categorySchema);
