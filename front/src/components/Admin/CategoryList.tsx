import React, { useEffect, useState } from "react";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import {
  fetchCategories,
  createCategory,
  updateCategory,
} from "../../services/categoryService";
import Label from "../Common/Label";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { categoryFormSchema } from "../../schemas/formSchemas";
import Button from "../Common/Button";

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
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = categories.slice(startIndex, startIndex + pageSize);

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
    setInitialFormValues({ name: "", status: "enabled" });
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setInitialFormValues({
      id: category._id,
      name: category.name,
      status: category.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
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
    } catch (error) {
      console.error("Failed to create/update category:", error);
    }

    handleModalClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <Table title="Category List" data={currentPageData} columns={columns} />
      <Button
        variant="lightGray"
        onClick={handleCreate}
        className="mt-3 mb-2 w-full"
      >
        + Add Category
      </Button>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={selectedCategory ? "Update Category" : "Create Category"}
        >
          <DynamicForm
            schema={categoryFormSchema}
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            formMode={selectedCategory ? "update" : "create"}
          />
        </Modal>
      )}
    </>
  );
};

export default CategoryList;
