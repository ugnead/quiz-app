import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (data: T) => React.ReactNode;
  cellClassName?: string;
}

interface TableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  getRowClass?: (row: T, rowIndex: number) => string;
}

function Table<T extends object>({
  title,
  data,
  columns,
  onRowClick,
  getRowClass,
}: TableProps<T>) {
  return (
    <div>
      {title && (
        <div className="text-center mb-7">
          <h3>{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={String(column.accessor)}
                  className={`py-3 px-3 text-left font-semibold ${
                    colIndex === 0 ? "first:rounded-tl-lg" : ""
                  } ${
                    colIndex === columns.length - 1 ? "last:rounded-tr-lg" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const isLastRow = rowIndex === data.length - 1;
              const rowClasses = `${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 transition-colors duration-200
              ${getRowClass ? getRowClass(row, rowIndex) : ""}`;

              return (
                <tr
                  key={rowIndex}
                  className={rowClasses}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={String(column.accessor)}
                      className={`py-3 px-3 text-gray-800 ${
                        column.cellClassName || ""
                      } ${
                        isLastRow && colIndex === 0 ? "first:rounded-bl-lg" : ""
                      } ${
                        isLastRow && colIndex === columns.length - 1
                          ? "last:rounded-br-lg"
                          : ""
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.accessor])}
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
