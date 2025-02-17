import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import {
  Category,
  Subcategory,
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  getAPIErrorMessage,
} from "../../types";
import { extractChangedFields } from "../../utils/extractChangedFields";
import { shortId, shortName } from "../../utils/textFormatting";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubcategoryById } from "../../services/subcategoryService";
import {
  fetchQuestionsBySubcategoryId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../services/questionService";

import Label from "../Common/Label";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { questionFormSchema } from "../../schemas/formSchemas";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import Button from "../Common/Button";
import Message from "../Common/Message";

import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const QuestionList: React.FC = () => {
  const location = useLocation() as {
    state?: { category?: Category; subcategory?: Subcategory };
  };
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string | string[]>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state?.category]);

  const {
    data: selectedSubcategory,
    isLoading: isSubcategoryLoading,
    error: subcategoryError,
  } = useQuery<Subcategory>({
    queryKey: ["subcategory", subcategoryId],
    queryFn: () =>
      location.state?.subcategory
        ? Promise.resolve(location.state.subcategory)
        : fetchSubcategoryById(subcategoryId!),
    enabled: !!subcategoryId,
    retry: false,
  });

  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuery<Question[]>({
    queryKey: ["questions", subcategoryId],
    queryFn: () => fetchQuestionsBySubcategoryId(subcategoryId!),
    enabled: !!subcategoryId,
    retry: false,
  });

  if (isSubcategoryLoading || isQuestionsLoading) {
    return null;
  }

  if (subcategoryError || questionsError) {
    return toast.error("Error loading data");
  }

  const pageSize = 10;
  const totalPages = Math.ceil(questions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = questions.slice(startIndex, startIndex + pageSize);

  const handleCreate = () => {
    setSelectedQuestion(null);
    setIsDeleteMode(false);
    setInitialFormValues({
      parentName: selectedSubcategory?.name || "",
      name: "",
      answerOptions: ["", ""],
      correctAnswer: "",
      explanation: "",
      status: "disabled",
    });
    setModalOpen(true);
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteMode(false);
    setInitialFormValues({
      id: question._id,
      parentName: selectedSubcategory?.name || "",
      name: question.name,
      answerOptions: question.answerOptions,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      status: question.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteMode(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedQuestion(null);
    setIsDeleteMode(false);
  };

  const handleSubmit = async (values: Record<string, string | string[]>) => {
    const changedFields = extractChangedFields(initialFormValues, values);

    try {
      if (!selectedQuestion) {
        if (!subcategoryId) {
          throw new Error("No subcategoryId specified for creation.");
        }
        await createQuestion(
          subcategoryId,
          changedFields as unknown as CreateQuestionDto
        );
        toast.success("Question created successfully!");
      } else {
        await updateQuestion(
          selectedQuestion._id,
          changedFields as UpdateQuestionDto
        );
        toast.success("Question updated successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    } catch (error: unknown) {
      toast.error(getAPIErrorMessage(error));
    }
    handleModalClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;

    try {
      await deleteQuestion(selectedQuestion._id);
      toast.success("Question deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    } catch (error) {
      toast.error("Failed to delete question");
    }
    handleModalClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Question>[] = [
    {
      header: "ID",
      accessor: "_id",
      render: (question) => (
        <span title={question._id}>{shortId(question._id)}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      render: (question) => (
        <span title={question.name}>{shortName(question.name)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (question) => {
        const variant = question.status === "enabled" ? "primary" : "secondary";
        return <Label text={question.status} variant={variant} />;
      },
    },
    {
      header: "",
      render: (question) => (
        <DropdownMenu
          items={[
            {
              label: "Edit",
              onClick: () => handleEdit(question),
              icon: <FiEdit />,
            },
            {
              label: "Delete",
              onClick: () => handleDelete(question),
              icon: <FiTrash2 />,
              className: "text-red-600",
            },
          ]}
        />
      ),
      cellClassName: "text-right",
    },
  ];

  return (
    <>
      {questions.length > 0 ? (
        <Table
          title="Question List"
          subtitle={
            <>
              <Label
                text={
                  selectedCategory ? `Category: ${selectedCategory.name}` : ""
                }
                variant="warning"
                className="mr-2"
              />
              <Label
                text={
                  selectedSubcategory
                    ? `Subcategory: ${selectedSubcategory.name}`
                    : ""
                }
                variant="success"
              />
            </>
          }
          data={currentPageData}
          getRowKey={(row) => row._id}
          columns={columns}
        />
      ) : (
        <Message
          message="No questions found in selected subcategory"
          variant="info"
        />
      )}
      <Button
        variant="lightGray"
        onClick={handleCreate}
        className="mt-3 mb-2 w-full"
      >
        + Add Question
      </Button>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={
            isDeleteMode
              ? "Delete Question"
              : selectedQuestion
                ? "Update Question"
                : "Create Question"
          }
          actions={
            isDeleteMode
              ? [
                  {
                    label: "Cancel",
                    onClick: handleModalClose,
                    variant: "secondary",
                  },
                  {
                    label: "Confirm",
                    onClick: handleDeleteConfirm,
                    variant: "danger",
                  },
                ]
              : []
          }
        >
          {isDeleteMode ? (
            <p>Are you sure you want to delete this question?</p>
          ) : (
            <DynamicForm
              schema={questionFormSchema}
              initialValues={initialFormValues}
              onSubmit={handleSubmit}
              formMode={selectedQuestion ? "update" : "create"}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default QuestionList;
