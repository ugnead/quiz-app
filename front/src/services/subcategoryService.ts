import api from "./api";

export const fetchSubcategories = async (categoryId: string) => {
  const response = await api.get(`/categories/${categoryId}/subcategories`);
  return response.data.data.subcategories;
};

export const fetchSubcategoryById = async (subcategoryId: string) => {
  const response = await api.get(`/subcategories/${subcategoryId}`);
  return response.data.data.subcategory;
};

export const createSubcategory = async (
  categoryId: string,
  subcategoryData: Record<string, string>
) => {
  const response = await api.post(
    `/categories/${categoryId}/subcategories`,
    subcategoryData
  );
  return response.data.data.subcategory;
};

export const updateSubcategory = async (
  subcategoryId: string,
  subcategoryData: Record<string, string>
) => {
  const response = await api.patch(
    `/subcategories/${subcategoryId}`,
    subcategoryData
  );
  return response.data.data.subcategory;
};

export const deleteSubcategory = async (subcategoryId: string) => {
  const response = await api.delete(`/subcategories/${subcategoryId}`);
  return response.data;
};
