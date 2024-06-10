import React, { useEffect, useState } from "react";
import { fetchCategoryById, fetchSubcategories } from "../../services/quiz";
import { useParams, useNavigate } from "react-router-dom";

interface Subcategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

const SubcategoryList: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubcategories = async () => {
      if (categoryId) {
        try {
          const [categoryData, subcategoryData] = await Promise.all([
            fetchCategoryById(categoryId),
            fetchSubcategories(categoryId)
          ]);
          setCategory(categoryData);
          setSubcategories(subcategoryData);
        } catch (error) {
          console.error("Failed to fetch subcategories or category:", error);
        }
      }
    };

    loadSubcategories();
  }, [categoryId]);

  return (
    <div className="px-5 py-10">
      <h1 className="pb-12 text-center">{category?.name}</h1>
      <ul className="flex flex-col space-y-4">
        {subcategories.map((subcategory) => (
          <li key={subcategory._id}>
            <button
              className="w-80"
              onClick={() => navigate(`/learn/${subcategory._id}`)}
            >
              {subcategory.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategoryList;
