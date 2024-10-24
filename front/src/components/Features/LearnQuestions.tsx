import React, { useState, useEffect } from "react";
import {
  fetchQuestionsForLearning,
  updateUserProgress,
} from "../../services/quiz";
import { useParams } from "react-router-dom";
import OptionsList from "../Common/OptionsList";
import QuestionExplanation from "../Common/QuestionExplanation";
import ReviewAnswer from "../Common/ReviewAnswer";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface AnsweredQuestion {
  questionIndex: number;
  isCorrect: boolean;
  selectedOption: string;
  answerSequence: number;
}

const LearnQuestions: React.FC = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);
  const [answerSequence, setAnswerSequence] = useState(0);

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

    await updateUserProgress(
      currentQuestion._id,
      subcategoryId!,
      isCorrect,
      "learn"
    );

    setShowExplanation(true);
    setSubmissionCount((prevCount) => prevCount + 1);
    setAnsweredQuestions((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        isCorrect,
        selectedOption: selectedOption!,
        answerSequence: answerSequence + 1,
      },
    ]);
    setAnswerSequence(answerSequence + 1);
  };

  const handleNextQuestion = async () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (submissionCount >= 5) {
      try {
        const data = await fetchQuestionsForLearning(subcategoryId!);
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setSubmissionCount(0);
      } catch (error) {
        console.error("Failed to refetch questions:", error);
      }
    } else {
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % questions.length
      );
    }
  };

  const handleReviewQuestion = (sequence: number) => {
    const answeredQuestion = answeredQuestions.find(
      (aq) => aq.answerSequence === sequence
    );
    if (answeredQuestion) {
      setCurrentQuestionIndex(answeredQuestion.questionIndex);
      setSelectedOption(answeredQuestion.selectedOption);
      setShowExplanation(true);
    }
  };

  if (questions.length === 0)
    return <div className="text-lg">No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const optionList = currentQuestion.options.map((option) => ({
    id: option,
    name: option,
  }));

  return (
    <div className="w-[30rem]">
      <h2 className="pb-6 text-center">{currentQuestion.question}</h2>
      <OptionsList
        options={optionList}
        selectedOption={selectedOption}
        correctAnswer={currentQuestion.correctAnswer}
        onSelectOption={handleOptionSelect}
        showExplanation={showExplanation}
      />
      <div className="flex justify-end mt-7">
        {!showExplanation ? (
          <button
            className={`cursor-pointer ${
              !selectedOption ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </button>
        ) : (
          <button onClick={handleNextQuestion} className="cursor-pointer">
            Next Question
          </button>
        )}
      </div>
      <ReviewAnswer
        answeredQuestions={answeredQuestions}
        handleReviewQuestion={handleReviewQuestion}
      />
      {showExplanation && (
        <QuestionExplanation
          selectedOption={selectedOption}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={currentQuestion.explanation}
        />
      )}
    </div>
  );
};

export default LearnQuestions;
