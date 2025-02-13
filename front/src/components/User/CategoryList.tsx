import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Category } from "../../types";

import { useQuery } from "@tanstack/react-query";
import { fetchEnabledCategories } from "../../services/categoryService";

import Pagination from "../Common/Pagination";
import Message from "../Common/Message";
import Button from "../Common/Button";

import { toast } from "react-toastify";

const CategoryList: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["enabledCategories"],
    queryFn: fetchEnabledCategories,
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return toast.error("Error loading data");
  }

  const pageSize = 10;
  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = categories.slice(startIndex, startIndex + pageSize);

  const handleCategorySelect = (category: Category) => {
    navigate(`/quiz/categories/${category._id}/subcategories`, {
      state: { category },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {categories.length > 0 ? (
        <>
          <div className="text-center mb-7">
            <h2>Categories</h2>
          </div>
          <ul className="flex flex-col space-y-4">
            {currentPageData.map((category) => (
              <li key={category._id}>
                <Button
                  variant="secondary"
                  onClick={() => handleCategorySelect(category)}
                  fullWidth
                >
                  {category.name}
                </Button>
              </li>
            ))}
          </ul>
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
    </>
  );
};

export default CategoryList;
