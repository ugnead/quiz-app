import React, { useState, useEffect } from "react";
import {
  fetchQuestionsForTesting,
  updateUserProgress,
  clearTestProgress,
  fetchSubcategoryById,
} from "../../services/quiz";
import { useParams, useNavigate } from "react-router-dom";
import OptionsList from "../Common/OptionsList";
import Modal from "../Common/Modal";
import Timer from "../Common/Timer";
import QuestionExplanation from "../Common/QuestionExplanation";
import ReviewAnswer from "../Common/ReviewAnswer";
import { FaArrowLeft } from "react-icons/fa";

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
  selectedOption: string | null;
  answerSequence: number;
}

const TestQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);
  const [answerSequence, setAnswerSequence] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    const loadSubcategory = async () => {
      if (subcategoryId) {
        try {
          const subcategory = await fetchSubcategoryById(subcategoryId);
          setCategoryId(subcategory.category);
        } catch (error) {
          console.error("Failed to fetch subcategory:", error);
        }
      }
    };

    loadSubcategory();
  }, [subcategoryId]);

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

  useEffect(() => {
    const updateProgressForCurrentQuestion = async () => {
      if (questions.length > 0 && !isTestFinished && !isReviewing) {
        const currentQuestion = questions[currentQuestionIndex];
        await updateUserProgress(
          currentQuestion._id,
          subcategoryId!,
          false,
          "test"
        );
      }
    };

    updateProgressForCurrentQuestion();
  }, [
    currentQuestionIndex,
    questions,
    subcategoryId,
    isTestFinished,
    isReviewing,
  ]);

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

    setAnsweredQuestions((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        isCorrect,
        selectedOption: selectedOption,
        answerSequence: answerSequence + 1,
      },
    ]);
    setAnswerSequence(answerSequence + 1);
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsTestFinished(true);
    }
  };

  const handleEndTest = () => {
    setIsModalOpen(true);
  };

  const handleConfirmEndTest = async () => {
    setIsModalOpen(false);

    const unansweredQuestions = questions.slice(currentQuestionIndex);
    for (const question of unansweredQuestions) {
      await updateUserProgress(question._id, subcategoryId!, false, "test");
    }

    const unansweredAnswers: AnsweredQuestion[] = unansweredQuestions.map(
      (question, index) => ({
        questionIndex: currentQuestionIndex + index,
        isCorrect: false,
        selectedOption: null,
        answerSequence: answerSequence + index + 1,
      })
    );

    setAnsweredQuestions((prev) => [...prev, ...unansweredAnswers]);
    setAnswerSequence(answerSequence + unansweredQuestions.length);
    setIsTestFinished(true);
  };

  const handleCancelEndTest = () => {
    setIsModalOpen(false);
  };

  const handleTimeUp = () => {
    handleConfirmEndTest();
  };

  const handleBackToSubcategories = () => {
    navigate(`/subcategories/${categoryId}`);
  };

  const handleReviewAnswers = () => {
    setIsReviewing(true);
    const firstAnsweredQuestion = answeredQuestions[0];
    setCurrentQuestionIndex(firstAnsweredQuestion.questionIndex);
    setSelectedOption(firstAnsweredQuestion.selectedOption);
  };

  const handleReviewQuestion = (sequence: number) => {
    const answeredQuestion = answeredQuestions.find(
      (aq) => aq.answerSequence === sequence
    );
    if (answeredQuestion) {
      setCurrentQuestionIndex(answeredQuestion.questionIndex);
      setSelectedOption(answeredQuestion.selectedOption);
    }
  };

  if (questions.length === 0)
    return <div className="text-lg">No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const optionList = currentQuestion.options.map((option) => ({
    id: option,
    name: option,
  }));

  if (isTestFinished && !isReviewing) {
    return (
      <div className="w-[30rem] text-center">
        <h2 className="mb-5">Test Finished</h2>
        <p className="mb-5 text-xl">
          Your score: {score}/{questions.length}
        </p>
        <div>
          <button className="w-60 bg-blue-600" onClick={handleReviewAnswers}>
            <div>Review Answers</div>
          </button>
          <div className="m-2 text-xl">OR</div>
          <button
            className="flex items-center mx-auto w-60"
            onClick={handleBackToSubcategories}
          >
            <FaArrowLeft className="me-3" />
            <div>Back to Subcategories</div>
          </button>
        </div>
      </div>
    );
  }

  if (isTestFinished && isReviewing) {
    return (
      <div className="w-[30rem]">
        <h2 className="mb-6 text-center">{currentQuestion.question}</h2>
        <OptionsList
          options={optionList}
          selectedOption={selectedOption}
          correctAnswer={currentQuestion.correctAnswer}
          showExplanation={true}
          onSelectOption={() => {}}
        />
        <ReviewAnswer
          answeredQuestions={answeredQuestions}
          handleReviewQuestion={handleReviewQuestion}
        />
        <QuestionExplanation
          selectedOption={selectedOption}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={currentQuestion.explanation}
        />
      </div>
    );
  }

  return (
    <div className="w-[30rem]">
      <div className="flex justify-between mb-5">
        <Timer
          duration={questions.length * 60}
          onTimeUp={handleTimeUp}
          label="Time left"
        />
        <button className="bg-red-500" onClick={handleEndTest}>
          End Test
        </button>
      </div>
      <h2 className="mb-3 text-center">{currentQuestion.question}</h2>
      <p className="text-center text-sm mb-4">
        Question {currentQuestionIndex + 1} / {questions.length}
      </p>
      <OptionsList
        options={optionList}
        selectedOption={selectedOption}
        correctAnswer={currentQuestion.correctAnswer}
        onSelectOption={handleOptionSelect}
      />
      <div className="flex justify-end mt-7">
        {!isTestFinished && (
          <button
            className={`cursor-pointer ${
              !selectedOption ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onConfirm={handleConfirmEndTest}
        onCancel={handleCancelEndTest}
        message="Are you sure you want to end the test?"
      />
    </div>
  );
};

export default TestQuestions;
