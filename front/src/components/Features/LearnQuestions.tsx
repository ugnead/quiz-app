import React, { useState, useEffect } from "react";
import {
  fetchQuestionsForLearning,
  updateUserProgress,
} from "../../services/quiz";
import { useParams } from "react-router-dom";
import OptionsList from "../Common/OptionsList";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const LearnQuestions: React.FC = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      if (subcategoryId) {
        try {
          const data = await fetchQuestionsForLearning(subcategoryId);
          setQuestions(data);
        } catch (error) {
          console.error("Failed to fetch questions:", error);
        }
      }
    };

    loadQuestions();
  }, [subcategoryId]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    await updateUserProgress(currentQuestion._id, subcategoryId!, isCorrect);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  if (questions.length === 0) return <div className="text-lg">No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const optionList = currentQuestion.options.map(option => ({ id: option, name: option }));

  return (
    <div className="w-96">
      <h2 className="pb-6 text-center">{currentQuestion.question}</h2>
      <OptionsList
        options={optionList}
        selectedOption={selectedOption}
        correctAnswer={currentQuestion.correctAnswer}
        onSelectOption={handleOptionSelect}
        showExplanation={showExplanation}
      />
      {!showExplanation && (
        <div className="flex justify-end mt-7">
          <button
            className="cursor-pointer"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </button>
        </div>
      )}
      {showExplanation && (
        <>
          <div className="flex justify-between my-7">
            {selectedOption === currentQuestion.correctAnswer ? (
              <p className="pt-1.5 pe-5 font-bold text-lg text-green-600">
                Correct!
              </p>
            ) : (
              <p className="pt-1.5 pe-5 font-bold text-lg text-red-600">
                Incorrect!
              </p>
            )}
            <button onClick={handleNextQuestion} className="cursor-pointer">
              Next Question
            </button>
          </div>
          <p className="text-lg">{currentQuestion.explanation}</p>
        </>
      )}
    </div>
  );
};

export default LearnQuestions;
