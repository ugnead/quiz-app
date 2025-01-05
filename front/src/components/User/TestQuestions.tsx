import React, { useState, useEffect } from "react";
import { getQuestionsBySubcategoryId } from "../../services/questionService";
import { updateUserProgress } from "../../services/userProgressService";
import { deleteUserTestProgress } from "../../services/userProgressService";
import { fetchSubcategoryById } from "../../services/subcategoryService";
import { useParams, useNavigate } from "react-router-dom";
import OptionsList from "../Common/OptionsList";
import Modal from "../Common/Modal";
import Timer from "../Common/Timer";
import QuestionExplanation from "../Common/QuestionExplanation";
import ReviewAnswer from "../Common/ReviewAnswer";
import { FaArrowLeft } from "react-icons/fa";
import Button from "../Common/Button";

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
          await deleteUserTestProgress(subcategoryId);
          const data = await getQuestionsBySubcategoryId(subcategoryId);
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
    navigate(`/categories/${categoryId}/subcategories`, { replace: true });
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
          <Button className="w-60" onClick={handleReviewAnswers}>
            <div>Review Answers</div>
          </Button>
          <div className="m-2 text-xl">OR</div>
          <Button
            className="w-60"
            onClick={handleBackToSubcategories}
            startIcon={<FaArrowLeft />}
            variant="secondary"
          >
            <div>Back to Subcategories</div>
          </Button>
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
        <Button variant="danger" onClick={handleEndTest}>
          End Test
        </Button>
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
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            variant="secondary"
          >
            Submit
          </Button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelEndTest}
        title="End Test"
        actions={[
          {
            label: "Cancel",
            onClick: handleCancelEndTest,
            variant: "secondary",
          },
          {
            label: "Confirm",
            onClick: handleConfirmEndTest,
            variant: "danger",
          },
        ]}
      >
        <p>Are you sure you want to end the test?</p>
      </Modal>
    </div>
  );
};

export default TestQuestions;
