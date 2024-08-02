import React from "react";

interface QuestionExplanationProps {
  selectedOption: string | null;
  correctAnswer: string;
  explanation: string;
}

const QuestionExplanation: React.FC<QuestionExplanationProps> = ({
  selectedOption,
  correctAnswer,
  explanation,
}) => {
  let statusText = "";
  if (selectedOption === null) {
    statusText = "Not Answered";
  } else if (selectedOption === correctAnswer) {
    statusText = "Correct!";
  } else {
    statusText = "Incorrect!";
  }

  return (
    <>
      <div className="flex justify-between mb-3">
        <p
          className={`pt-1.5 font-bold text-lg ${
            selectedOption === correctAnswer
              ? "text-green-600"
              : selectedOption === null
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {statusText}
        </p>
      </div>
      <p className="text-lg">{explanation}</p>
    </>
  );
};

export default QuestionExplanation;
