import React, { useState } from "react";

import { User, UpdateUserDto, getAPIErrorMessage } from "../../types";
import { extractChangedFields } from "../../utils/extractChangedFields";
import { partialDisplay } from "../../utils/textFormatting";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, updateUserRole } from "../../services/userService";

import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import Label from "../Common/Label";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { userFormSchema } from "../../schemas/formSchemas";

import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";

const UserList: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return toast.error("Error loading data");
  }

  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = users.slice(startIndex, startIndex + pageSize);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setInitialFormValues({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (values: Record<string, string | string[]>) => {
    if (!selectedUser) return;

    const changedFields = extractChangedFields(initialFormValues, values);

    try {
      await updateUserRole(
        selectedUser._id,
        changedFields as unknown as UpdateUserDto
      );
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      toast.error(getAPIErrorMessage(error));
    }

    handleModalClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<User>[] = [
    {
      header: "ID",
      accessor: "_id",
      render: (user) => (
        <span title={user._id}>{partialDisplay(user._id, 0, 4)}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
      render: (user) => {
        const variant = user.role === "admin" ? "success" : "primary";
        return <Label text={user.role} variant={variant} />;
      },
    },
    {
      header: "",
      render: (user) => (
        <DropdownMenu
          items={[
            {
              label: "Edit",
              onClick: () => handleEdit(user),
              icon: <FiEdit />,
            },
          ]}
        />
      ),
      cellClassName: "text-right",
    },
  ];

  return (
    <>
      <Table
        title="Users List"
        data={currentPageData}
        getRowKey={(row) => row._id}
        columns={columns}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {isModalOpen && selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={"Update User"}
        >
          <DynamicForm
            schema={userFormSchema}
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            formMode="update"
          />
        </Modal>
      )}
    </>
  );
};

export default UserList;
