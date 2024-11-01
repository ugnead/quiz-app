import api from "./api";

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data.data.categories;
};

export const fetchCategoryById = async (categoryId: string) => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data.data.category;
};

export const createCategory = async (categoryName: string) => {
  const response = await api.post("/categories", categoryName);
  return response.data.data.category;
};

export const updateCategory = async (
  categoryId: string,
  categoryName: string
) => {
  const response = await api.put(
    `/categories/${categoryId}`,
    categoryName
  );
  return response.data.data.category;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};
