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
