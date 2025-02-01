import api from "./api";

import {
  Subcategory,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
} from "../types";

export const fetchSubcategories = async (
  categoryId: string
): Promise<Subcategory[]> => {
  const response = await api.get(`/categories/${categoryId}/subcategories`);
  return response.data.data.subcategories as Subcategory[];
};

export const fetchEnabledSubcategories = async (
  categoryId: string
): Promise<Subcategory[]> => {
  const response = await api.get(
    `/categories/${categoryId}/subcategories?status=enabled`
  );
  return response.data.data.subcategories as Subcategory[];
};

export const fetchSubcategoryById = async (
  subcategoryId: string
): Promise<Subcategory> => {
  const response = await api.get(`/subcategories/${subcategoryId}`);
  return response.data.data.subcategory as Subcategory;
};

export const createSubcategory = async (
  categoryId: string,
  subcategoryData: CreateSubcategoryDto
): Promise<Subcategory> => {
  const response = await api.post(
    `/categories/${categoryId}/subcategories`,
    subcategoryData
  );
  return response.data.data.subcategory;
};

export const updateSubcategory = async (
  subcategoryId: string,
  subcategoryData: UpdateSubcategoryDto
): Promise<Subcategory> => {
  const response = await api.patch(
    `/subcategories/${subcategoryId}`,
    subcategoryData
  );
  return response.data.data.subcategory;
};

export const deleteSubcategory = async (
  subcategoryId: string
): Promise<void> => {
  const response = await api.delete(`/subcategories/${subcategoryId}`);
  return response.data;
};
