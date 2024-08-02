import React from "react";

interface ReviewAnswerProps {
  answeredQuestions: {
    questionIndex: number;
    isCorrect: boolean;
    selectedOption: string;
    answerSequence: number;
  }[];
  handleReviewQuestion: (sequence: number) => void;
}

const ReviewAnswer: React.FC<ReviewAnswerProps> = ({
  answeredQuestions,
  handleReviewQuestion,
}) => {
  return (
    <div className="mt-4 flex flex-wrap">
      {answeredQuestions.map(({ answerSequence, isCorrect, selectedOption }, index) => {
        let colorClass;
        if (selectedOption === null) {
          colorClass = "bg-yellow-500";
        } else if (isCorrect) {
          colorClass = "bg-green-500";
        } else {
          colorClass = "bg-red-500";
        }
        return (
          <button
            key={answerSequence}
            onClick={() => handleReviewQuestion(answerSequence)}
            className={`w-11 mx-1 m-3 px-0 py-2 rounded-full text-white ${colorClass}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default ReviewAnswer;
