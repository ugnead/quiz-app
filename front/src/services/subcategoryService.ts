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
  subcategoryName: string
) => {
  const response = await api.post(
    `/categories/${categoryId}/subcategories`,
    subcategoryName
  );
  return response.data.data.subcategory;
};

export const updateSubcategory = async (
  subcategoryId: string,
  subcategoryName: string
) => {
  const response = await api.put(
    `/subcategories/${subcategoryId}`,
    subcategoryName
  );
  return response.data.data.subcategory;
};

export const deleteSubcategory = async (subcategoryId: string) => {
  const response = await api.delete(`/subcategories/${subcategoryId}`);
  return response.data;
};
