import api from "./api";

export const fetchUserProgress = async (subcategoryId: string) => {
  const response = await api.get(`/subcategories/${subcategoryId}/progress`);
  return response.data.data;
};

export const updateUserProgress = async (
  questionId: string,
  subcategoryId: string,
  isCorrect: boolean,
  mode: "learn" | "test"
) => {
  const response = await api.post(`/progress`, {
    questionId,
    subcategoryId,
    isCorrect,
    mode,
  });
  return response.data;
};

export const deleteUserTestProgress = async (subcategoryId: string) => {
  const response = await api.delete(`/subcategories/${subcategoryId}/progress`);
  return response.data;
};
