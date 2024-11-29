import React, { useEffect, useState } from "react";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import { fetchUsers } from "../../services/userService";

interface User {
  _id: number;
  name: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers ] = useState<User[]>([]);
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
        console.error("Failed to fetch categories:", error);
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user: User) => {
    console.log("Delete user:", user);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<User>[] = [
    {
      header: "ID",
      accessor: "_id",
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
            user.role === "admin"
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
