import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categorySchemas";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find()
      .select("_id name status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createCategorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({
        status: "fail",
        message: error.details.map((d) => d.message).join("; "),
      });
      return;
    }

    const { name, status } = value;

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      res.status(409).json({
        status: "fail",
        message: "Category name already exists",
      });
      return;
    }

    const data: any = { name };
    if (status) data.status = status;

    const newCategory = await Category.create(data);

    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error || "Internal Server Error",
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = updateCategorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({
        status: "fail",
        message: error.details.map((d) => d.message).join("; "),
      });
      return;
    }

    const { categoryId } = req.params;
    const { name, status } = value;

    if (!name && !status) {
      res.status(400).json({
        status: "fail",
        message: "At least one field is required to update",
      });
      return;
    }

    if (name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (existingCategory) {
        res.status(409).json({
          status: "fail",
          message: "Category name already exists",
        });
        return;
      }
    }

    const data: any = {};
    if (name) data.name = name;
    if (status) data.status = status;

    const updateCategory = await Category.findByIdAndUpdate(categoryId, data, {
      new: true,
      runValidators: true,
    });

    if (!updateCategory) {
      res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        category: updateCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error || "Internal Server Error",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const deleteCategory = await Category.findByIdAndDelete(categoryId);

    if (!deleteCategory) {
      res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
      return;
    }

    const subcategories = await Subcategory.find({ category: categoryId });
    const subcategoryIds = subcategories.map((sub) => sub._id);

    await Subcategory.deleteMany({ category: categoryId });

    await Question.deleteMany({ subcategory: { $in: subcategoryIds } });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error || "Internal Server Error",
    });
  }
};
