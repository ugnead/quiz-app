import React, { useEffect, useState } from "react";

import { fetchUsers, updateUserRole } from "../../services/userService";

import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import Label from "../Common/Label";
import Modal from "../Common/Modal";
import DynamicForm from "../Common/Form/DynamicForm";
import { userFormSchema } from "../../schemas/formSchemas";

import { FiEdit } from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = users.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();
  }, []);

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

  const handleSubmit = async (values: Record<string, string>) => {
    if (!selectedUser) return;

    try {
      const updatedUser = await updateUserRole(selectedUser._id, values.role);
      setUsers((prev) =>
        prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
    } catch (error) {
      console.error("Failed to update user role:");
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
        <span title={user._id}>{`...${user._id.slice(-4)}`}</span>
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
      <Table title="Users List" data={currentPageData} columns={columns} />
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
