import React, { useEffect, useState } from "react";
import Table, { Column } from "../Common/Table";
import DropdownMenu from "../Common/Dropdown";
import Pagination from "../Common/Pagination";
import { fetchCategories } from "../../services/categoryService";

interface Category {
    _id: string;
    name: string;
  }

const UserList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(categories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = categories.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (category: Category) => {
    console.log("Edit user:", category);
  };

  const handleDelete = (category: Category) => {
    console.log("Delete user:", category);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Category>[] = [
    {
      header: "ID",
      accessor: "_id",
    },
    {
      header: "Name",
      accessor: "name",
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
      <Table title="Category List" data={currentPageData } columns={columns} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default UserList;
