import React, { useEffect, useState } from "react";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import { fetchUsers } from "../../services/userService";
import Label from "../Common/Label";
import { FiEdit } from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default UserList;
