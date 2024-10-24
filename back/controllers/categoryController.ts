import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find();
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
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        status: "fail",
        message: "Category name is required",
      });
      return;
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(409).json({
        status: "fail",
        message: "Category already exists",
      });
      return;
    }

    const newCategory = await Category.create({ name });

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
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        status: "fail",
        message: "Category name is required",
      });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        category: updatedCategory,
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

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
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

