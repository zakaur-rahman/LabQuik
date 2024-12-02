import React, { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";

// Use the TableData interface
import { TestData, SingleFieldTableData, MultipleFieldsTableData } from "./types";


interface TestFieldsTableProps {
  testFields: TestData["finalData"];
  onDragEnd: (result: {
    source: { index: number };
    destination: { index: number };
  }) => void;
  onDelete?: (parentIndex: number, childIndex?: number) => void;
  onRowSelect: (
    field: SingleFieldTableData | MultipleFieldsTableData | null,
    parentIndex: number,
    childIndex?: number
  ) => void;
  selectedRowIndex: number | null;
  selectedChildIndex: number | null;
  setFormula: (isFormula: boolean) => void;
  isFormula: boolean;
}

const TableRowsForSingleField: React.FC<{
  fields: TestFieldsTableProps["testFields"];
  onDelete?: (parentIndex: number, childIndex?: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onRowSelect: (
    field: SingleFieldTableData | MultipleFieldsTableData | null,
    parentIndex: number,
    childIndex?: number
  ) => void;
  selectedRowIndex: number | null;
  selectedChildIndex: number | null;
  setFormula: (formula: boolean) => void;
  isFormula: boolean;
}> = React.memo(
  ({
    fields,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
    onRowSelect,
    selectedRowIndex,
    selectedChildIndex,
    setFormula,
    isFormula,
  }) => (
    <>
      {fields.map((field, index) => {
        // Handle multiple fields case
        if ("multipleFieldsData" in field) {
          return (
            <React.Fragment key={`${field.titleName}-${index}`}>
              {/* Parent row */}
              <tr
                className={`border-b bg-gray-50 ${
                  selectedRowIndex === index && selectedChildIndex === null ? "bg-blue-100" : ""
                }`}
              >
                <td className="p-2 w-8">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedRowIndex === index}
                    onChange={() => {
                      if (selectedRowIndex === index) {
                        onRowSelect(null, -1);
                      } else {
                        onRowSelect(field as any, index);
                      }
                    }}
                  />
                </td>
                <td className="p-2 w-8"></td>
                <td colSpan={4} className="p-2 text-left font-medium text-sm">
                  Test Name: {field.titleName}
                </td>
                <td className="p-2 w-20"></td>
                <td className="p-2 w-8">
                  <button
                    aria-label="Delete"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => onDelete?.(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {/* Child rows */}
              {field.multipleFieldsData.map((subField, subIndex) => (
                <tr
                  key={`${subField.name}-${index}-${subIndex}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={`border-b hover:bg-gray-50 ${
                    selectedRowIndex === index && selectedChildIndex === subIndex ? "bg-blue-100" : ""
                  }`}
                >
                  <td className="p-2 w-8">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                  </td>
                  <td className="p-2 w-8">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedRowIndex === index && selectedChildIndex === subIndex}
                      disabled={selectedRowIndex !== index}
                      onChange={() => {
                        if (selectedRowIndex === index) {
                          if (selectedChildIndex === subIndex) {
                            onRowSelect(field as any, index);
                          } else {
                            onRowSelect(subField as any, index, subIndex);
                          }
                        }
                      }}
                    />
                  </td>
                  <td className="p-2 min-w-[120px] pl-8">{subField.name}</td>
                  <td className="p-2 min-w-[120px]">{subField.field}</td>
                  <td className="p-2 min-w-[100px]">{subField.units}</td>
                  <td className="p-2 min-w-[100px]">
                    {renderRange(subField.range, subField.field)}
                  </td>
                  <td className="p-2 w-20">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedRowIndex === index && isFormula}
                      onChange={(e) => {
                        if (selectedRowIndex === index) {
                          setFormula(e.target.checked);
                        }
                      }}
                      disabled={selectedRowIndex !== index}
                    />
                  </td>
                  <td className="p-2 w-8">
                    <button
                      aria-label="Delete"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => onDelete?.(index, subIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          );
        }

        // Handle single field case
        return (
          <tr
            key={`${field.name}-${index}`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className={`border-b hover:bg-gray-50 ${
              selectedRowIndex === index && selectedChildIndex === null ? "bg-blue-100" : ""
            }`}
          >
            <td className="p-2 w-8 cursor-grab">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </td>
            <td className="p-2 w-8">
              <input
                type="checkbox"
                className="rounded"
                checked={selectedRowIndex === index && selectedChildIndex === null}
                onChange={() => {
                  // If already selected, deselect it
                  if (selectedRowIndex === index && selectedChildIndex === null) {
                    onRowSelect(null, -1);
                  } else {
                    onRowSelect(field as any, index);
                  }
                }}
              />
            </td>
            <td className="p-2 min-w-[120px]">{field.name}</td>
            <td className="p-2 min-w-[120px]">{field.field}</td>
            <td className="p-2 min-w-[100px]">{field.units}</td>
            <td className="p-2 min-w-[100px]">
              {renderRange(field.range, field.field)}
            </td>
            <td className="p-2 w-20">
              <input
                type="checkbox"
                className="rounded"
                checked={selectedRowIndex === index && isFormula}
                onChange={(e) => {
                  if (selectedRowIndex === index) {
                    setFormula(e.target.checked);
                  }
                }}
                disabled={selectedRowIndex !== index}
              />
            </td>
            <td className="p-2 w-8">
              <button
                aria-label="Delete"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => onDelete?.(index)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  )
);

TableRowsForSingleField.displayName = "TableRowsForSingleField";

// Add helper function to render range values
const renderRange = (range: any, fieldType: string) => {
  switch (fieldType) {
    case "numeric":
      return range?.numeric
        ? `${range.numeric.minRange} - ${range.numeric.maxRange}`
        : "";
    case "text":
      return range?.text || "";
    case "numeric_unbound":
      return range?.numeric_unbound
        ? `${range.numeric_unbound.comparisonOperator} ${range.numeric_unbound.value}`
        : "";
    case "multiple_range":
      return range?.multiple_range || "";
    case "custom":
      return range?.custom?.defaultOption || "";
    default:
      return "";
  }
};

export const TestFieldsTable: React.FC<TestFieldsTableProps> = ({
  testFields,
  onDragEnd,
  onDelete,
  onRowSelect,
  selectedRowIndex,
  selectedChildIndex,
  isFormula,
  setFormula,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null) {
      onDragEnd({
        source: { index: draggedIndex },
        destination: { index: dragOverIndex },
      });
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRowSelect = (
    field: SingleFieldTableData | MultipleFieldsTableData | null,
    parentIndex: number,
    childIndex?: number
  ) => {
    onRowSelect(field, parentIndex, childIndex);
    setFormula(false); // Reset formula when selecting/deselecting a row
  };

  return (
    <div className="flex-1 border overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-2 w-8"></th>
            <th className="p-2 w-8"></th>
            <th className="p-2 text-left font-medium text-sm min-w-[120px]">
              Name
            </th>
            <th className="p-2 text-left font-medium text-sm min-w-[120px]">
              Field
            </th>
            <th className="p-2 text-left font-medium text-sm min-w-[100px]">
              Units
            </th>
            <th className="p-2 text-left font-medium text-sm min-w-[100px]">
              Range
            </th>
            <th className="p-2 text-left font-medium text-sm w-20">Formula</th>
            <th className="p-2 w-8">Delete</th>
          </tr>
        </thead>
        <tbody>
          <TableRowsForSingleField
            fields={testFields}
            onDelete={onDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onRowSelect={handleRowSelect}
            selectedRowIndex={selectedRowIndex}
            selectedChildIndex={selectedChildIndex}
            setFormula={setFormula}
            isFormula={isFormula}
          />
        </tbody>
      </table>
    </div>
  );
};

export default TestFieldsTable;
