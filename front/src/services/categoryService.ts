import api from "./api";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "../types";

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data.data.categories as Category[];
};

export async function fetchEnabledCategories(): Promise<Category[]> {
  const response = await api.get("/categories?status=enabled");
  return response.data.data.categories as Category[];
}

export const fetchCategoryById = async (
  categoryId: string
): Promise<Category> => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data.data.category as Category;
};

export const createCategory = async (
  categoryData: CreateCategoryDto
): Promise<Category> => {
  const response = await api.post("/categories", categoryData);
  return response.data.data.category;
};

export const updateCategory = async (
  categoryId: string,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  const response = await api.patch(`/categories/${categoryId}`, categoryData);
  return response.data.data.category;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};
