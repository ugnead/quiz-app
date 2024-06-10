import React, { useState, useEffect } from "react";
import {
  fetchQuestionsForLearning,
  updateUserProgress,
} from "../../services/quiz";
import { useParams } from "react-router-dom";

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

  if (questions.length === 0) return <div>No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Learn</h1>
      <h2>{currentQuestion.question}</h2>
      <ul className="flex flex-col space-y-4">
        {currentQuestion.options.map((option) => (
          <li key={option}>
            <button
              onClick={() => handleOptionSelect(option)}
              disabled={showExplanation}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={!selectedOption || showExplanation}
      >
        Submit
      </button>
      {showExplanation && (
        <div>
          {selectedOption === currentQuestion.correctAnswer ? (
            <p>Correct!</p>
          ) : (
            <p>Incorrect!</p>
          )}
          <p>{currentQuestion.explanation}</p>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </div>
  );
};

export default LearnQuestions;
