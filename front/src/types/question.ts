export interface Question {
    _id: string;
    name: string;
    answerOptions: string[];
    correctAnswer: string;
    explanation?: string;
    status: "enabled" | "disabled";
  }