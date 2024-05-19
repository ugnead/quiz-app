import api from "./api";

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data.categories;
};

export const fetchSubcategories = async (categoryId: string) => {
  const response = await api.get(`/subcategories/${categoryId}`);
  return response.data.data.subcategories;
};

export const fetchQuestionsBySubcategory = async (subcategoryId: string) => {
  const response = await api.get(`/questions/subcategory/${subcategoryId}`);
  return response.data.data.questions;
};
