import api from "./api";

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data.data.categories;
};

export const fetchCategoryById = async (categoryId: string) => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data.data.category;
};

export const fetchSubcategories = async (categoryId: string) => {
  const response = await api.get(`/subcategories/${categoryId}`);
  return response.data.data.subcategories;
};

export const fetchUserProgress = async (subcategoryId: string) => {
  const response = await api.get(`/questions/${subcategoryId}/progress`);
  return response.data.data;
};

export const fetchQuestionsForLearning = async (subcategoryId: string) => {
  const response = await api.get(`/questions/${subcategoryId}/learn`);
  return response.data.data.questions;
};

export const fetchQuestionsForTesting = async (subcategoryId: string) => {
  const response = await api.get(`/questions/${subcategoryId}/test`);
  return response.data.data.questions;
};

export const updateUserProgress = async (
  questionId: string,
  subcategoryId: string,
  isCorrect: boolean,
  mode: "learn" | "test"
) => {
  const response = await api.post(`/questions/user_progress`, {
    questionId,
    subcategoryId,
    isCorrect,
    mode,
  });
  return response.data;
};
