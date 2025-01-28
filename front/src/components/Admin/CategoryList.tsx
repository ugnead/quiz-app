import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  getAPIErrorMessage,
} from "../../types";
import { extractChangedFields } from "../../utils/extractChangedFields";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import Label from "../Common/Label";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { categoryFormSchema } from "../../schemas/formSchemas";
import Table, { Column } from "../Common/Table";
import Button from "../Common/Button";
import Message from "../Common/Message";

import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
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
    return toast.error("Error loading data");
  }

  const pageSize = 10;
  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = categories.slice(startIndex, startIndex + pageSize);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsDeleteMode(false);
    setInitialFormValues({ name: "", status: "enabled" });
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteMode(false);
    setInitialFormValues({
      id: category._id,
      name: category.name,
      status: category.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteMode(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    setIsDeleteMode(false);
  };

  const handleSubmit = async (values: Record<string, string | string[]>) => {
    const changedFields = extractChangedFields(initialFormValues, values);

    try {
      if (!selectedCategory) {
        await createCategory(changedFields as unknown as CreateCategoryDto);
        toast.success("Category created successfully!");
      } else {
        await updateCategory(
          selectedCategory._id,
          changedFields as UpdateCategoryDto
        );
        toast.success("Category updated successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: unknown) {
      toast.error(getAPIErrorMessage(error));
    }
    handleModalClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory._id);
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      toast.error("Failed to delete category");
    }
    handleModalClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (category: Category) => {
    navigate(`/admin/categories/${category._id}/subcategories`, {
      state: { category },
    });
  };

  const columns: Column<Category>[] = [
    {
      header: "ID",
      accessor: "_id",
      render: (category) => (
        <span title={category._id}>{`...${category._id.slice(-4)}`}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Status",
      accessor: "status",
      render: (category) => {
        const variant = category.status === "enabled" ? "primary" : "secondary";
        return <Label text={category.status} variant={variant} />;
      },
    },
    {
      header: "",
      render: (category) => (
        <DropdownMenu
          items={[
            {
              label: "Edit",
              onClick: () => handleEdit(category),
              icon: <FiEdit />,
            },
            {
              label: "Delete",
              onClick: () => handleDelete(category),
              icon: <FiTrash2 />,
              className: "text-red-600",
            },
          ]}
        />
      ),
      cellClassName: "text-right",
    },
  ];

  return (
    <>
      {categories.length > 0 ? (
        <Table
          title="Category List"
          data={currentPageData}
          getRowKey={(row) => row._id}
          columns={columns}
          onRowClick={handleRowClick}
        />
      ) : (
        <Message message="No categories found" variant="info" />
      )}
      <Button
        variant="lightGray"
        onClick={handleCreate}
        className="mt-3 mb-2 w-full"
      >
        + Add Category
      </Button>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={
            isDeleteMode
              ? "Delete Category"
              : selectedCategory
                ? "Update Category"
                : "Create Category"
          }
          actions={
            isDeleteMode
              ? [
                  {
                    label: "Cancel",
                    onClick: handleModalClose,
                    variant: "secondary",
                  },
                  {
                    label: "Confirm",
                    onClick: handleDeleteConfirm,
                    variant: "danger",
                  },
                ]
              : []
          }
        >
          {isDeleteMode ? (
            <p>Are you sure you want to delete this category?</p>
          ) : (
            <DynamicForm
              schema={categoryFormSchema}
              initialValues={initialFormValues}
              onSubmit={handleSubmit}
              formMode={selectedCategory ? "update" : "create"}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default CategoryList;
