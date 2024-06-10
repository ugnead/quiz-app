import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../services/quiz";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="px-5 py-10">
      <h1 className="pb-12 text-center">Categories</h1>
      <ul className="flex flex-col space-y-4">
        {categories.map((category) => (
          <li key={category._id}>
            <button className="w-80" onClick={() => navigate(`/subcategories/${category._id}`)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
