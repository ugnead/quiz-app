import api from "./api";

export interface QuestionData {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }

export const fetchQuestionsForLearning = async (subcategoryId: string) => {
  const response = await api.get(
    `/subcategories/${subcategoryId}/questions/learn`
  );
  return response.data.data.questions;
};

export const fetchQuestionsForTesting = async (subcategoryId: string) => {
  const response = await api.get(
    `/subcategories/${subcategoryId}/questions/test`
  );
  return response.data.data.questions;
};

export const createQuestion = async (subcategoryId: string, questionData: QuestionData) => {
    const response = await api.post(`/subcategories/${subcategoryId}/questions`, questionData);
    return response.data.data.question;
  };
  
  export const updateQuestion = async (questionId: string, questionData: QuestionData) => {
    const response = await api.put(`/questions/${questionId}`, questionData);
    return response.data.data.question;
  };
  
  export const deleteQuestion = async (questionId: string) => {
    const response = await api.delete(`/questions/${questionId}`);
    return response.data;
  };