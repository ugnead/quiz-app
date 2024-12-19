import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

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
    const { name, status } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        status: "fail",
        message: "Category name is required",
      });
      return;
    }

    if (name && (name.trim().length < 1 || name.trim().length > 50)) {
      res.status(400).json({
        status: "fail",
        message: "Category name must be between 1 and 50 characters",
      });
      return;
    }

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

    const allowedStatuses = ["enabled", "disabled"];
    if (status && !allowedStatuses.includes(status)) {
      res.status(400).json({
        status: "fail",
        message: `Invalid category status`,
      });
      return;
    }

    const sanitizedName = name.trim();

    const newCategoryData: any = { name: sanitizedName };
    if (status) {
      newCategoryData.status = status;
    }

    const newCategory = await Category.create(newCategoryData);

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
    const { name, status } = req.body;

    if (!name && !status) {
      res.status(400).json({
        status: "fail",
        message: "At least one field is required to update",
      });
      return;
    }

    if (name && (typeof name !== "string" || !name.trim())) {
      res.status(400).json({
        status: "fail",
        message: "Category name is required",
      });
      return;
    }

    if (name && (name.trim().length < 1 || name.trim().length > 50)) {
      res.status(400).json({
        status: "fail",
        message: "Category name must be between 1 and 50 characters",
      });
      return;
    }

    const allowedStatuses = ["enabled", "disabled"];
    if (status && !allowedStatuses.includes(status)) {
      res.status(400).json({
        status: "fail",
        message: `Invalid category status`,
      });
      return;
    }

    const updateCategoryData: any = {};
    if (name) {
      const sanitizedName = name.trim();
      updateCategoryData.name = sanitizedName;
    }
    if (status) updateCategoryData.status = status;

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateCategoryData,
      { new: true, runValidators: true }
    );

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
