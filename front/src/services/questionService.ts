import api from "./api";

export const fetchQuestionsByUserProgress = async (subcategoryId: string) => {
  const response = await api.get(
    `/subcategories/${subcategoryId}/questions/learn`
  );
  return response.data.data.questions;
};

export const fetchQuestionsBySubcategoryId = async (subcategoryId: string) => {
  const response = await api.get(`/subcategories/${subcategoryId}/questions`);
  return response.data.data.questions;
};

export const createQuestion = async (
  subcategoryId: string,
  questionData: Record<string, string | string[]>
) => {
  const response = await api.post(
    `/subcategories/${subcategoryId}/questions`,
    questionData
  );
  return response.data.data.question;
};

export const updateQuestion = async (
  questionId: string,
  questionData: Record<string, string | string[]>
) => {
  const response = await api.patch(`/questions/${questionId}`, questionData);
  return response.data.data.question;
};

export const deleteQuestion = async (questionId: string) => {
  const response = await api.delete(`/questions/${questionId}`);
  return response.data;
};
