import { Request, Response } from "express";
import Category from "../models/categoryModel";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.categoryId);
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
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
