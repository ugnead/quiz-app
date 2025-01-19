import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Category } from "../../types";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../services/categoryService";

import OptionsList from "../Common/OptionsList";
import Pagination from "../Common/Pagination";
import Message from "../Common/Message";

import { toast } from "react-toastify";

const CategoryList: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return toast.error("Error loading categories");
  }

  const pageSize = 10;
  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = categories.slice(startIndex, startIndex + pageSize);

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/quiz/categories/${categoryId}/subcategories`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const categoryOptions = currentPageData.map((category) => ({
    id: category._id,
    name: category.name,
  }));

  return (
    <div>
      {categories.length > 0 ? (
        <>
          <h1 className="pb-6 sm:pb-12 text-center">Categories</h1>
          <OptionsList
            options={categoryOptions}
            onSelectOption={handleCategorySelect}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <Message message="No categories found" variant="info" />
      )}
    </div>
  );
};

export default CategoryList;
