import api from "./api";

import { Question, CreateQuestionDto, UpdateQuestionDto } from "../types";

export const fetchQuestionsByUserProgress = async (
  subcategoryId: string
): Promise<Question[]> => {
  const response = await api.get(
    `/subcategories/${subcategoryId}/questions/learn`
  );
  return response.data.data.questions as Question[];
};

export const fetchEnabledQuestionsByUserProgress = async (
  subcategoryId: string
): Promise<Question[]> => {
  const response = await api.get(
    `/subcategories/${subcategoryId}/questions/learn?status=enabled`
  );
  return response.data.data.questions as Question[];
};

export const fetchQuestionsBySubcategoryId = async (
  subcategoryId: string
): Promise<Question[]> => {
  const response = await api.get(`/subcategories/${subcategoryId}/questions`);
  return response.data.data.questions as Question[];
};

export const fetchEnabledQuestionsBySubcategoryId = async (
  subcategoryId: string
): Promise<Question[]> => {
  const response = await api.get(
    `/subcategories/${subcategoryId}/questions?status=enabled`
  );
  return response.data.data.questions as Question[];
};

export const createQuestion = async (
  subcategoryId: string,
  questionData: CreateQuestionDto
): Promise<Question> => {
  const response = await api.post(
    `/subcategories/${subcategoryId}/questions`,
    questionData
  );
  return response.data.data.question;
};

export const updateQuestion = async (
  questionId: string,
  questionData: UpdateQuestionDto
): Promise<Question> => {
  const response = await api.patch(`/questions/${questionId}`, questionData);
  return response.data.data.question;
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const response = await api.delete(`/questions/${questionId}`);
  return response.data;
};
