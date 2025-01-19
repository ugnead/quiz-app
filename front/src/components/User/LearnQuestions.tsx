import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { fetchQuestionsByUserProgress } from "../../services/questionService";
import { updateUserProgress } from "../../services/userProgressService";

import OptionsList from "../Common/OptionsList";
import QuestionExplanation from "../Common/QuestionExplanation";
import ReviewAnswer from "../Common/ReviewAnswer";
import Button from "../Common/Button";

interface Question {
  _id: string;
  name: string;
  answerOptions: string[];
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
          const data = await fetchQuestionsByUserProgress(subcategoryId);
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
        const data = await fetchQuestionsByUserProgress(subcategoryId!);
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

  const optionList = currentQuestion.answerOptions.map((option) => ({
    id: option,
    name: option,
  }));

  return (
    <>
      <h2 className="pb-6 text-center">{currentQuestion.name}</h2>
      <OptionsList
        options={optionList}
        selectedOption={selectedOption}
        correctAnswer={currentQuestion.correctAnswer}
        onSelectOption={handleOptionSelect}
        showExplanation={showExplanation}
      />
      <div className="flex justify-end mt-7">
        {!showExplanation ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            variant="secondary"
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="cursor-pointer"
            variant="secondary"
          >
            Next Question
          </Button>
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
    </>
  );
};

export default LearnQuestions;
