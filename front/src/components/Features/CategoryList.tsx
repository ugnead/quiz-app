import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../services/questions";
import { useNavigate } from "react-router-dom";
import OptionsList from "../Common/OptionsList";

interface Category {
  _id: string;
  name: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/subcategories/${categoryId}`);
  };

  const categoryOptions = categories.map((category) => ({
    id: category._id,
    name: category.name,
  }));

  return (
    <div className="w-96">
      <h1 className="pb-12 text-center">Categories</h1>
      <OptionsList
        options={categoryOptions}
        onSelectOption={handleCategorySelect}
      />
    </div>
  );
};

export default CategoryList;
