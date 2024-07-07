import React, { useState, useEffect } from "react";
import {
  fetchQuestionsForTesting,
  updateUserProgress,
  clearTestProgress,
} from "../../services/questions";
import { useParams } from "react-router-dom";
import OptionsList from "../Common/OptionsList";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const TestQuestions: React.FC = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      if (subcategoryId) {
        try {
          await clearTestProgress(subcategoryId);
          const data = await fetchQuestionsForTesting(subcategoryId);
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

    await updateUserProgress(
      currentQuestion._id,
      subcategoryId!,
      isCorrect,
      "test"
    );

    if (isCorrect) setScore(score + 1);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsTestFinished(true);
    }
  };

  if (questions.length === 0) return <div>No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const optionList = currentQuestion.options.map((option) => ({
    id: option,
    name: option,
  }));

  if (isTestFinished) {
    return (
      <div className="w-96">
        <h2 className="pb-6 text-center">Test Finished</h2>
        <p className="text-center">
          Your score: {score}/{questions.length}
        </p>
      </div>
    );
  }

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
          <p className="text-wrap text-lg">{currentQuestion.explanation}</p>
        </>
      )}
    </div>
  );
};

export default TestQuestions;
