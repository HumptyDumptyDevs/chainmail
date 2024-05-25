// ListingTable.tsx
import React from "react";

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
}

interface ListingTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowActions?: (row: T) => RowAction<T>[];
}

const ListingTable = <T,>({
  columns,
  data,
  getRowActions,
}: ListingTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {getRowActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{column.accessor(row)}</td>
              ))}
              {getRowActions && (
                <td>
                  {getRowActions(row).map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className="btn btn-primary"
                      onClick={() => action.onClick(row)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListingTable;
