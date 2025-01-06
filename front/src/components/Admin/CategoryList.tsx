import React, { useEffect, useState } from "react";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import Label from "../Common/Label";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { categoryFormSchema } from "../../schemas/formSchemas";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";
import Message from "../Common/Message";
import { toast } from "react-toastify";

interface Category {
  _id: string;
  name: string;
  status: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = categories.slice(startIndex, startIndex + pageSize);

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

  const handleSubmit = async (values: Record<string, string>) => {
    const changedFields: Record<string, string> = {};

    for (const key in values) {
      if (values[key] !== initialFormValues[key]) {
        changedFields[key] = values[key];
      }
    }

    try {
      if (!selectedCategory) {
        const newCategory = await createCategory(changedFields);
        setCategories((prev) => [newCategory, ...prev]);
        toast.success("Category created successfully!");
      } else {
        const updatedCategory = await updateCategory(
          selectedCategory._id,
          changedFields
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === updatedCategory._id ? updatedCategory : cat
          )
        );
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }

    handleModalClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory._id);
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedCategory._id)
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
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
      {categories.length > 0 && (
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
