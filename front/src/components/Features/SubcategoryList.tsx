import React, { useEffect, useState } from "react";
import { fetchSubcategories } from "../../services/quiz";
import { useParams, useNavigate } from "react-router-dom";

interface Subcategory {
  _id: string;
  name: string;
}

const SubcategoryList: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubcategories = async () => {
      if (categoryId) {
        try {
          const data = await fetchSubcategories(categoryId);
          setSubcategories(data);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      }
    };

    loadSubcategories();
  }, [categoryId]);

  return (
    <div>
      <h1 className="pb-12 text-center">{category?.name}</h1>
      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory._id}>
            <button onClick={() => navigate(`/learn/${subcategory._id}`)}>
              {subcategory.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategoryList;
