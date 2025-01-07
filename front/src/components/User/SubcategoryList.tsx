import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchCategoryById } from "../../services/categoryService";
import { fetchSubcategories } from "../../services/subcategoryService";
import { fetchUserProgress } from "../../services/userProgressService";

import Button from "../Common/Button";
import Pagination from "../Common/Pagination";

import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";

interface Subcategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface SubcategoryProgress {
  subcategoryId: string;
  learnedQuestions: number;
  totalQuestions: number;
  correctTestAnswers: number | null;
}

const SubcategoryList: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [progressData, setProgressData] = useState<SubcategoryProgress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;
  const totalPages = Math.ceil(subcategories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = subcategories.slice(
    startIndex,
    startIndex + pageSize
  );

  useEffect(() => {
    const loadSubcategories = async () => {
      if (categoryId) {
        try {
          const [categoryData, subcategoryData] = await Promise.all([
            fetchCategoryById(categoryId),
            fetchSubcategories(categoryId),
          ]);
          setCategory(categoryData);
          setSubcategories(subcategoryData);

          const progressPromises = subcategoryData.map(
            (subcategory: Subcategory) => fetchUserProgress(subcategory._id)
          );
          const progressResults = await Promise.all(progressPromises);
          setProgressData(progressResults);
        } catch (error) {
          console.error("Failed to fetch subcategories or category:", error);
        }
      }
    };

    loadSubcategories();
  }, [categoryId]);

  const handleLearnSelect = (subcategoryId: string) => {
    navigate(`/quiz/subcategories/${subcategoryId}/questions/learn`);
  };

  const handleTestSelect = (subcategoryId: string) => {
    navigate(`/quiz/subcategories/${subcategoryId}/questions/test`);
  };

  const handleBackToCategories = () => {
    navigate("/quiz/categories");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLearnIcon = (progress: SubcategoryProgress) => {
    if (progress.learnedQuestions === progress.totalQuestions) {
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
    <div className="w-[30rem]">
      <div className="flex items-center justify-center relative pb-6 sm:pb-12">
        <button
          onClick={handleBackToCategories}
          className="absolute sm:top-5 top-2 left-0"
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <h1>{category?.name}</h1>
      </div>
      <ul className="flex flex-col space-y-4">
        {currentPageData.map((subcategory) => {
          const progress = progressData.find(
            (p) => p.subcategoryId === subcategory._id
          );

          return (
            <li key={subcategory._id} className="flex flex-col justify-between">
              <span className="pb-1 pe-5 font-bold text-lg">
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
    </div>
  );
};

export default SubcategoryList;
