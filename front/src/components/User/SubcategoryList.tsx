import React, { useEffect, useState } from "react";
import { fetchCategoryById } from "../../services/categoryService";
import { fetchSubcategories } from "../../services/subcategoryService";
import { fetchUserProgress } from "../../services/userProgressService";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Button from "../Common/Button";

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
  const { categoryId } = useParams<{ categoryId: string }>();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [progressData, setProgressData] = useState<SubcategoryProgress[]>([]);
  const navigate = useNavigate();

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
    navigate(`/subcategories/${subcategoryId}/questions/learn`);
  };

  const handleTestSelect = (subcategoryId: string) => {
    navigate(`/subcategories/${subcategoryId}/questions/test`);
  };

  const handleBackToCategories = () => {
    navigate("/categories");
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
          className="absolute sm:top-2 top-0 left-0 sm:p-2 p-1.5 rounded-full"
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <h1>{category?.name}</h1>
      </div>
      <ul className="flex flex-col space-y-4">
        {subcategories.map((subcategory) => {
          const progress = progressData.find(
            (progress) => progress.subcategoryId === subcategory._id
          );
          return (
            <li key={subcategory._id} className="flex flex-col justify-between">
              <span className="pb-1 pe-5 font-bold text-lg">
                {subcategory.name}
              </span>
              <div className="flex space-x-4">
                <Button
                  className="w-2/4 text-nowrap"
                  onClick={() => handleLearnSelect(subcategory._id)}
                  variant="secondary"
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
    </div>
  );
};

export default SubcategoryList;
