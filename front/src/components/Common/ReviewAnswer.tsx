import React from "react";
import Button from "./Button";

interface ReviewAnswerProps {
  answeredQuestions: {
    questionIndex: number;
    isCorrect: boolean;
    selectedOption: string | null;
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
        const colorClass = isCorrect
          ? "success"
          : selectedOption === null
          ? "warning"
          : "danger";

        return (
          <Button
            key={answerSequence}
            onClick={() => handleReviewQuestion(answerSequence)}
            variant={colorClass}
            className={`w-11 mx-[3.6px] my-[3.6px] px-0 py-2 text-white`}
            tabIndex={0}
            enableFocusRing
          >
            {index + 1}
          </Button>
        );
      })}
    </div>
  );
};

export default ReviewAnswer;
