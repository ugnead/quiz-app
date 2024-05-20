import api from "./api";

export const fetchCategories = async () => {
  const response = await api.get("/categories");
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

export async function fetchQuestionsForLearning(subcategoryId: string) {
  const response = await api.get(`/learn/${subcategoryId}`);
  return response.data.data.questions;
}

export async function updateUserProgress(
  questionId: string,
  subcategoryId: string,
  isCorrect: boolean
) {
  const response = await api.post(`/learn/user_progress`, {
    questionId,
    subcategoryId,
    isCorrect,
  });
  return response.data;
}
