import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";

export const getSubcategoriesByCategoryId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const subcategories = await Subcategory.find({ category: categoryId });

    res.status(200).json({
      status: "success",
      results: subcategories.length,
      data: {
        subcategories,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const getSubcategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;

    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      res.status(404).json({
        status: "fail",
        message: "Subcategory not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        subcategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const createSubcategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { name, status } = req.body;

    if (!name) {
      res.status(400).json({
        status: "fail",
        message: "Subcategory name is required",
      });
      return;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
      return;
    }

    const allowedStatuses = ["enabled", "disabled"];
    if (status && !allowedStatuses.includes(status)) {
      res.status(400).json({
        status: "fail",
        message: `Invalid subcategory status`,
      });
      return;
    }

    const sanitizedName = name.trim();

    const newSubcategoryData: any = { name: sanitizedName };
    if (status) {
      newSubcategoryData.status = status;
    }

    const newSubcategory = await Subcategory.create(newSubcategoryData);

    res.status(201).json({
      status: "success",
      data: {
        subcategory: newSubcategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const updateSubcategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;
    const { name, status } = req.body;

    if (!name) {
      res.status(400).json({
        status: "fail",
        message: "Subcategory name is required",
      });
      return;
    }

    const allowedStatuses = ["enabled", "disabled"];
    if (status && !allowedStatuses.includes(status)) {
      res.status(400).json({
        status: "fail",
        message: `Invalid subcategory status`,
      });
      return;
    }

    const updateSubategoryData: any = {};
    if (name) {
      const sanitizedName = name.trim();
      updateSubategoryData.name = sanitizedName;
    }
    if (status) updateSubategoryData.status = status;

    const updateSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      updateSubategoryData,
      { new: true, runValidators: true }
    );

    if (!updateSubcategory) {
      res.status(404).json({
        status: "fail",
        message: "Subcategory not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        subcategory: updateSubcategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};

export const deleteSubcategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subcategoryId } = req.params;

    const deletedSubcategory = await Subcategory.findByIdAndDelete(
      subcategoryId
    );

    if (!deletedSubcategory) {
      res.status(404).json({
        status: "fail",
        message: "Subcategory not found",
      });
      return;
    }

    await Question.deleteMany({ subcategory: subcategoryId });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error || "Internal Server Error",
    });
  }
};
