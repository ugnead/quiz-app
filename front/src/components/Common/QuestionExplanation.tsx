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
  return (
    <>
      <div className="flex justify-between mb-3">
        {selectedOption === correctAnswer ? (
          <p className="pt-1.5 font-bold text-lg text-green-600">
            Correct!
          </p>
        ) : (
          <p className="pt-1.5 font-bold text-lg text-red-600">
            Incorrect!
          </p>
        )}
      </div>
      <p className="text-lg">{explanation}</p>
    </>
  );
};

export default QuestionExplanation;
