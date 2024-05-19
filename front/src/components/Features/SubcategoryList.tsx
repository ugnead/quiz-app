import React, { useEffect, useState } from "react";
import { fetchSubcategories } from "../../services/quiz";

interface Subcategory {
  _id: string;
  name: string;
}

interface SubcategoryListProps {
  categoryId: string;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ categoryId }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const data = await fetchSubcategories(categoryId);
        setSubcategories(data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    loadSubcategories();
  }, [categoryId]);

  return (
    <div>
      <h1>Subcategories</h1>
      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory._id}>{subcategory.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategoryList;
