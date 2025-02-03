import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { Category, Subcategory, Question } from "../../types";

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

import { FiEdit, FiTrash2 } from "react-icons/fi";

const QuestionList: React.FC = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const location = useLocation() as {
    state?: { category?: Category; subcategory?: Subcategory };
  };
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

  if (location.state?.category) {
    setSelectedCategory(location.state.category);
  }

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
    return null;
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
      status: "enabled",
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
    const changedFields: Record<string, string | string[]> = {};

    for (const key in values) {
      if (Array.isArray(values[key]) && Array.isArray(initialFormValues[key])) {
        if (
          JSON.stringify(values[key]) !== JSON.stringify(initialFormValues[key])
        ) {
          changedFields[key] = values[key];
        }
      } else if (values[key] !== initialFormValues[key]) {
        changedFields[key] = values[key];
      }
    }

    try {
      if (!selectedQuestion) {
        if (!subcategoryId) {
          throw new Error("No subcategoryId specified for creation.");
        }
        await createQuestion(subcategoryId, changedFields);
      } else {
        await updateQuestion(
          selectedQuestion._id,
          changedFields
        );
      }
    } catch (error) {
      console.error("Failed to create/update question:", error);
    }

    handleModalClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;

    try {
      await deleteQuestion(selectedQuestion._id);
    } catch (error) {
      console.error("Failed to delete question:", error);
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
        <span title={question._id}>{`...${question._id.slice(-4)}`}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
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
                variant="success"
                className="mr-2"
              />
              <Label
                text={
                  selectedSubcategory
                    ? `Subcategory: ${selectedSubcategory.name}`
                    : ""
                }
                variant="warning"
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
