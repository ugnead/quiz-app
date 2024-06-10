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

export const fetchQuestionsBySubcategory = async (subcategoryId: string) => {
  const response = await api.get(`/questions/${subcategoryId}`);
  return response.data.data.questions;
};

export const fetchQuestionsForLearning = async (subcategoryId: string) => {
  const response = await api.get(`/learn/${subcategoryId}`);
  return response.data.data.questions;
}

export const updateUserProgress = async (
  questionId: string,
  subcategoryId: string,
  isCorrect: boolean
) => {
  const response = await api.post(`/learn/user_progress`, {
    questionId,
    subcategoryId,
    isCorrect,
  });
  return response.data;
}
