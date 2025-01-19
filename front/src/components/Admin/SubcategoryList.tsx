import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Category, Subcategory } from "../../types";   

import { fetchCategoryById } from "../../services/categoryService";
import {
  fetchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../../services/subcategoryService";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import Label from "../Common/Label";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { subcategoryFormSchema } from "../../schemas/formSchemas";
import Button from "../Common/Button";
import Message from "../Common/Message";

import { FiEdit, FiTrash2 } from "react-icons/fi";

const SubcategoryList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { category?: Category } };
  const { categoryId } = useParams<{ categoryId: string }>();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.ceil(subcategories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = subcategories.slice(
    startIndex,
    startIndex + pageSize
  );

  useEffect(() => {
    const loadCategory = async () => {
      if (location.state?.category) {
        setSelectedCategory(location.state.category);
      } else if (categoryId) {
        try {
          const data = await fetchCategoryById(categoryId);
          setSelectedCategory(data);
        } catch (error) {
          console.error("Failed to fetch category:", error);
        }
      }
    };

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

    loadCategory();
    loadSubcategories();
  }, [categoryId, location.state?.category]);

  const handleCreate = () => {
    setSelectedSubcategory(null);
    setIsDeleteMode(false);
    setInitialFormValues({
      parentName: selectedCategory?.name || "",
      name: "",
      status: "enabled",
    });
    setModalOpen(true);
  };

  const handleEdit = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteMode(false);
    setInitialFormValues({
      id: subcategory._id,
      parentName: selectedCategory?.name || "",
      name: subcategory.name,
      status: subcategory.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteMode(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubcategory(null);
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
      if (!selectedSubcategory) {
        if (!categoryId) {
          throw new Error("No categoryId specified for creation.");
        }
        const newSubcategory = await createSubcategory(
          categoryId,
          changedFields
        );
        setSubcategories((prev) => [newSubcategory, ...prev]);
      } else {
        const updatedSubcategory = await updateSubcategory(
          selectedSubcategory._id,
          changedFields
        );
        setSubcategories((prev) =>
          prev.map((subcat) =>
            subcat._id === updatedSubcategory._id ? updatedSubcategory : subcat
          )
        );
      }
    } catch (error) {
      console.error("Failed to create/update subcategory:", error);
    }

    handleModalClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubcategory) return;

    try {
      await deleteSubcategory(selectedSubcategory._id);
      setSubcategories((prev) =>
        prev.filter((subcat) => subcat._id !== selectedSubcategory._id)
      );
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }

    handleModalClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (subcategory: Subcategory) => {
    navigate(`/admin/subcategories/${subcategory._id}/questions`, {
      state: { category: selectedCategory, subcategory },
    });
  };

  const columns: Column<Subcategory>[] = [
    {
      header: "ID",
      accessor: "_id",
      render: (subcategory) => (
        <span title={subcategory._id}>{`...${subcategory._id.slice(-4)}`}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Status",
      accessor: "status",
      render: (subcategory) => {
        const variant =
          subcategory.status === "enabled" ? "primary" : "secondary";
        return <Label text={subcategory.status} variant={variant} />;
      },
    },
    {
      header: "",
      render: (subcategory) => (
        <DropdownMenu
          items={[
            {
              label: "Edit",
              onClick: () => handleEdit(subcategory),
              icon: <FiEdit />,
            },
            {
              label: "Delete",
              onClick: () => handleDelete(subcategory),
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
      {subcategories.length > 0 ? (
        <Table
          title="Subcategory List"
          subtitle={
            <Label
              text={
                selectedCategory ? `Category: ${selectedCategory.name}` : ""
              }
              variant="warning"
            />
          }
          data={currentPageData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      ) : (
        <Message
          message="No subcategories found in selected category"
          variant="info"
        />
      )}
      <Button
        variant="lightGray"
        onClick={handleCreate}
        className="mt-3 mb-2 w-full"
      >
        + Add Subcategory
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
              ? "Delete Subcategory"
              : selectedSubcategory
                ? "Update Subcategory"
                : "Create Subcategory"
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
            <p>Are you sure you want to delete this subcategory?</p>
          ) : (
            <DynamicForm
              schema={subcategoryFormSchema}
              initialValues={initialFormValues}
              onSubmit={handleSubmit}
              formMode={selectedSubcategory ? "update" : "create"}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default SubcategoryList;
