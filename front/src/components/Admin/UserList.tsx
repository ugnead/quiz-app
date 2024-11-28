import React, { useState } from "react";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" },
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" },
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" },
  { id: 10, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
];

const UserList: React.FC = () => {
  const [users] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(users.length / pageSize);

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user: User) => {
    console.log("Delete user:", user);
  };

  const columns: Column<User>[] = [
    {
      header: "ID",
      accessor: "id",
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
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "Admin"
              ? "bg-blue-200 text-blue-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: "",
      render: (user) => (
        <DropdownMenu
          onEdit={() => handleEdit(user)}
          onDelete={() => handleDelete(user)}
        />
      ),
      cellClassName: "text-right",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = users.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Table title="Users List" data={currentPageData } columns={columns} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default UserList;
