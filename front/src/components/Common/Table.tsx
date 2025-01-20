import React from "react";
import { v4 as uuidv4 } from "uuid";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (data: T) => React.ReactNode;
  cellClassName?: string;
}

interface TableProps<T> {
  title?: string;
  subtitle?: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  getRowClass?: (row: T, rowIndex: number) => string;
}

function Table<T extends object>({
  title,
  subtitle,
  data,
  columns,
  onRowClick,
  getRowClass,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      {title && (
        <div className="text-center mb-7">
          <h3>{title}</h3>
          {subtitle && <div className="mt-6">{subtitle}</div>}
        </div>
      )}
      <div>
        <table className="w-full bg-white rounded-lg">
          <thead className="bg-gray-800">
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={uuidv4()}
                  className={`py-3 px-3 text-left text-white font-semibold ${
                    colIndex === 0 ? "rounded-tl-lg" : ""
                  } ${colIndex === columns.length - 1 ? "rounded-tr-lg" : ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const isLastRow = rowIndex === data.length - 1;
              const clickableClass = onRowClick ? "cursor-pointer" : "";
              const rowClasses = `${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 transition-colors duration-200
              ${clickableClass}
              ${getRowClass ? getRowClass(row, rowIndex) : ""}`;

              return (
                <tr
                  key={uuidv4()}
                  className={rowClasses}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={uuidv4()}
                      className={`py-3 px-3 text-gray-800 ${
                        column.cellClassName || ""
                      } ${isLastRow && colIndex === 0 ? "rounded-bl-lg" : ""} ${
                        isLastRow && colIndex === columns.length - 1
                          ? "rounded-br-lg"
                          : ""
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : column.accessor
                          ? String(row[column.accessor])
                          : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
