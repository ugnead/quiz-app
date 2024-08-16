import React, { useEffect, useRef } from "react";

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
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, []);

  return (
    <div className="mt-4 flex flex-wrap">
      {answeredQuestions.map(({ answerSequence, isCorrect, selectedOption }, index) => {
        const colorClass = isCorrect
          ? "bg-green-500"
          : selectedOption === null
          ? "bg-yellow-500"
          : "bg-red-500";

        return (
          <button
            key={answerSequence}
            ref={index === 0 ? firstButtonRef : null}
            onClick={() => handleReviewQuestion(answerSequence)}
            className={`w-11 mx-1 m-3 px-0 py-2 rounded-full text-white ${colorClass}`}
            tabIndex={0}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default ReviewAnswer;
