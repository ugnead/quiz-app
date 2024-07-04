import React, { useEffect, useState } from "react";
import {
  fetchCategoryById,
  fetchSubcategories,
  fetchUserProgress,
} from "../../services/questions";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
          console.log("Progress results:", progressResults);
          setProgressData(progressResults);
        } catch (error) {
          console.error("Failed to fetch subcategories or category:", error);
        }
      }
    };

    loadSubcategories();
  }, [categoryId]);

  const handleLearnSelect = (subcategoryId: string) => {
    navigate(`/learn/${subcategoryId}`);
  };

  const handleTestSelect = (subcategoryId: string) => {
    navigate(`/test/${subcategoryId}`);
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
    <div>
      <h1 className="pb-12 text-center">{category?.name}</h1>
      <ul className="flex flex-col space-y-4">
        {subcategories.map((subcategory) => {
          const progress = progressData.find(
            (progress) => progress.subcategoryId === subcategory._id
          );
          return (
            <li
              key={subcategory._id}
              className="flex justify-between items-center"
            >
              <span className="pb-1 pe-5 font-bold text-lg">
                {subcategory.name}
              </span>
              <div className="flex space-x-4">
                <button className="flex items-center justify-center w-40 text-nowrap" onClick={() => handleLearnSelect(subcategory._id)}>
                  Learn{" "}
                  {progress
                    ? `${progress.learnedQuestions}/${progress.totalQuestions}`
                    : ""}
                  {progress && getLearnIcon(progress)}
                </button>
                <button
                  className="flex items-center justify-center bg-blue-600 w-40 text-nowrap"
                  onClick={() => handleTestSelect(subcategory._id)}
                >
                  Test{" "}
                  {progress && progress.correctTestAnswers !== null
                    ? `${progress.correctTestAnswers}/${progress.totalQuestions}`
                    : ""}
                  {progress && getTestIcon(progress)}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubcategoryList;
