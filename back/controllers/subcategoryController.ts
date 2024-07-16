import { Request, Response } from "express";
import Subcategory from "../models/subcategoryModel";

export const getAllSubcategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subcategories = await Subcategory.find({ category: req.params.categoryId });
    res.status(200).json({
      status: "success",
      results: subcategories.length,
      data: {
        subcategories,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const getSubcategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subcategoryId = req.params.subcategoryId;
    console.log(`Fetching subcategory with ID: ${subcategoryId}`); // Add this line

    const subcategory = await Subcategory.findById(subcategoryId);
    console.log(`Fetched subcategory:`, subcategory); // Add this line

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
    console.error("Error fetching subcategory:", error); // Add this line
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
