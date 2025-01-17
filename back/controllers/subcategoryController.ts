import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Subcategory from "../models/subcategoryModel";
import Question from "../models/questionModel";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
} from "../validators/subcategorySchemas";

export const getSubcategoriesByCategoryId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.params;

  try {
    const subcategories = await Subcategory.find({ category: categoryId })
      .select("_id name status")
      .sort({ createdAt: -1 });

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

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
      return;
    }

    const { error, value } = createSubcategorySchema.validate(req.body, {
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

    const existingSubcategory = await Subcategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingSubcategory) {
      res.status(409).json({
        status: "fail",
        message: "Subcategory name already exists",
      });
      return;
    }

    const data: any = {
      category: categoryId,
      name,
    };
    if (status) data.status = status;

    const newSubcategory = await Subcategory.create(data);

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
    const { error, value } = updateSubcategorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({
        status: "fail",
        message: error.details.map((d) => d.message).join("; "),
      });
      return;
    }

    const { subcategoryId } = req.params;
    const { name, status } = value;

    if (!name && !status) {
      res.status(400).json({
        status: "fail",
        message: "At least one field is required to update",
      });
      return;
    }

    if (name) {
      const existingSubcategory = await Subcategory.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (existingSubcategory) {
        res.status(409).json({
          status: "fail",
          message: "Subcategory name already exists",
        });
        return;
      }
    }

    const data: any = {};
    if (name) data.name = name;
    if (status) data.status = status;

    const updateSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      data,
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

    const deleteSubcategory = await Subcategory.findByIdAndDelete(
      subcategoryId
    );

    if (!deleteSubcategory) {
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
