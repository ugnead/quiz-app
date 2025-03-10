import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Category, Subcategory } from "../../types";

import { useQuery } from "@tanstack/react-query";
import { fetchCategoryById } from "../../services/categoryService";
import { fetchEnabledSubcategories } from "../../services/subcategoryService";
import { fetchProgressBySubcategory } from "../../services/userProgressService";

import Button from "../Common/Button";
import Pagination from "../Common/Pagination";
import Message from "../Common/Message";

import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";

interface SubcategoryProgress {
  subcategoryId: string;
  learnedQuestions: number;
  totalQuestions: number;
  correctTestAnswers: number | null;
}

const SubcategoryList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { category?: Category } };
  const { categoryId } = useParams<{ categoryId: string }>();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: selectedCategory,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery<Category>({
    queryKey: ["category", categoryId],
    queryFn: () =>
      location.state?.category
        ? Promise.resolve(location.state.category)
        : fetchCategoryById(categoryId!),
    enabled: !!categoryId,
    retry: false,
  });

  const {
    data: subcategories = [],
    isLoading: isSubcategoriesLoading,
    error: subcategoryError,
  } = useQuery<Subcategory[]>({
    queryKey: ["enabledSubcategories", categoryId],
    queryFn: () => fetchEnabledSubcategories(categoryId!),
    enabled: !!categoryId,
    retry: false,
  });

  const {
    data: progressData = [],
    isLoading: isProgressLoading,
    error: progressError,
  } = useQuery<SubcategoryProgress[]>({
    queryKey: ["userProgress", categoryId],
    queryFn: async () => {
      const progress = subcategories.map((subcategory) =>
        fetchProgressBySubcategory(subcategory._id)
      );
      return Promise.all(progress);
    },
    enabled: !!categoryId && subcategories.length > 0,
    retry: false,
  });

  if (isCategoryLoading || isSubcategoriesLoading || isProgressLoading) {
    return null;
  }

  if (subcategoryError || categoryError || progressError) {
    return toast.error("Error loading data");
  }

  const pageSize = 6;
  const totalPages = Math.ceil(subcategories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = subcategories.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleLearnSelect = (subcategoryId: string) => {
    navigate(`/quiz/subcategories/${subcategoryId}/questions/learn`);
  };

  const handleTestSelect = (subcategoryId: string) => {
    navigate(`/quiz/subcategories/${subcategoryId}/questions`, {
      state: { categoryId },
    });
  };

  const handleBackToCategories = () => {
    navigate("/quiz/categories");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLearnIcon = (progress: SubcategoryProgress) => {
    if (
      progress.learnedQuestions === progress.totalQuestions &&
      progress.totalQuestions > 0
    ) {
      return <FaCheckCircle className="text-green-500 ml-2 mt-0.5" />;
    }
    return null;
  };

  const getTestIcon = (progress: SubcategoryProgress) => {
    if (progress.correctTestAnswers === null) return null;
    if (progress.correctTestAnswers / progress.totalQuestions >= 0.8) {
      return <FaCheckCircle className="text-green-500 ml-2 mt-0.5" />;
    }
    return <FaTimesCircle className="text-red-500 ml-2 mt-0.5" />;
  };

  return (
    <>
      {subcategories.length > 0 ? (
        <>
          <div className="flex items-center justify-center relative">
            <button
              onClick={handleBackToCategories}
              className="absolute top-2.5 left-0"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div className="text-center mb-7">
              <h2 className="max-w-xs sm:max-w-md break-words">{selectedCategory?.name}</h2>
            </div>
          </div>
          <ul className="flex flex-col space-y-4">
            {currentPageData.map((subcategory) => {
              const progress = progressData.find(
                (p) => p.subcategoryId === subcategory._id
              );

              return (
                <li
                  key={subcategory._id}
                  className="flex flex-col justify-between"
                >
                  <span className="pb-1 pe-5 font-bold text-lg leading-5">
                    {subcategory.name}
                  </span>
                  <div className="flex space-x-4">
                    <Button
                      className="w-2/4 text-nowrap"
                      variant="secondary"
                      onClick={() => handleLearnSelect(subcategory._id)}
                    >
                      Learn{" "}
                      {progress
                        ? `${progress.learnedQuestions}/${progress.totalQuestions}`
                        : ""}
                      {progress && getLearnIcon(progress)}
                    </Button>
                    <Button
                      className="w-2/4 text-nowrap"
                      onClick={() => handleTestSelect(subcategory._id)}
                    >
                      Test{" "}
                      {progress && progress.correctTestAnswers !== null
                        ? `${progress.correctTestAnswers}/${progress.totalQuestions}`
                        : ""}
                      {progress && getTestIcon(progress)}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <Message message="No subcategories found in selected category" variant="info" />
      )}
    </>
  );
};

export default SubcategoryList;
