import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  Category,
  Subcategory,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  getAPIErrorMessage,
} from "../../types";
import { extractChangedFields } from "../../utils/extractChangedFields";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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

import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SubcategoryList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { category?: Category } };
  const { categoryId } = useParams<{ categoryId: string }>();
  const queryClient = useQueryClient();

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: selectedCategory,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery<Category>({
    queryKey: ["category", categoryId],
    queryFn: () =>
      location.state?.category
        ? Promise.resolve(location.state.category)
        : fetchCategoryById(categoryId!),
    enabled: !!categoryId,
    retry: false,
  });

  const {
    data: subcategories = [],
    isLoading: isSubcategoriesLoading,
    error: subcategoriesError,
  } = useQuery<Subcategory[]>({
    queryKey: ["subcategories", categoryId],
    queryFn: () => fetchSubcategories(categoryId!),
    enabled: !!categoryId,
    retry: false,
  });

  if (isCategoryLoading || isSubcategoriesLoading) {
    return null;
  }

  if (categoryError || subcategoriesError) {
    return toast.error("Error loading data");
  }

  const pageSize = 10;
  const totalPages = Math.ceil(subcategories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = subcategories.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleCreate = () => {
    setSelectedSubcategory(null);
    setIsDeleteMode(false);
    setInitialFormValues({
      parentName: selectedCategory?.name || "",
      name: "",
      status: "disabled",
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

  const handleSubmit = async (values: Record<string, string | string[]>) => {
    const changedFields = extractChangedFields(initialFormValues, values);

    try {
      if (!selectedSubcategory) {
        if (!categoryId) {
          throw new Error("No categoryId specified for creation.");
        }
        await createSubcategory(
          categoryId,
          changedFields as unknown as CreateSubcategoryDto
        );
        toast.success("Subcategory created successfully!");
      } else {
        await updateSubcategory(
          selectedSubcategory._id,
          changedFields as UpdateSubcategoryDto
        );
        toast.success("Subcategory updated successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    } catch (error: unknown) {
      toast.error(getAPIErrorMessage(error));
    }
    handleModalClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubcategory) return;

    try {
      await deleteSubcategory(selectedSubcategory._id);
      toast.success("Subcategory deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    } catch (error) {
      toast.error("Failed to delete subcategory");
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
          getRowKey={(row) => row._id}
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
