import React, { useEffect, useState } from "react";
import { fetchCategoryById, fetchSubcategories } from "../../services/quiz";
import { useParams, useNavigate } from "react-router-dom";
import OptionsList from "../Common/OptionsList";

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

  const handleSubcategorySelect = (subcategoryId: string) => {
    navigate(`/learn/${subcategoryId}`);
  };

  const subcategoryOptions = subcategories.map(subcategory => ({ id: subcategory._id, name: subcategory.name }));

  return (
    <div className="w-96">
      <h1 className="pb-12 text-center">{category?.name}</h1>
      <OptionsList 
        options={subcategoryOptions}
        onSelectOption={handleSubcategorySelect} 
      />
    </div>
  );
};

export default SubcategoryList;
