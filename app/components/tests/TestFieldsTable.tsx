import React, { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

// Use the TableData interface
interface TableData {
  name: string;
  field: string;
  units: string;
  formula: string;
  testMethod: string;
  fieldType: string;
  range: {
    numeric: {
      minRange: string;
      maxRange: string;
    };
    text: string;
    numeric_unbound: {
      comparisonOperator: string;
      value: string;
    };
    multiple_range: string;
    custom:{
      options:string[];
      defaultOption:string;
    };
  };
}

interface SingleFieldTableData {
  fieldType: string;
  name: string;
  field: string;
  units: string;
  formula: string;
  testMethod: string;
  range: {
    numeric: {
      minRange: string;
      maxRange: string;
    };
    text: string;
    numeric_unbound: {
      comparisonOperator: string;
      value: string;
    };
    multiple_range: string;
    custom: {
      options: string[];
      defaultOption: string;
    };
  };
}
interface MultipleFieldsTableData {
  titleName: string;
  fieldType: string;
  finalMultipleFieldsData: MultipleFieldsTableData[];
}



interface TestFieldsTableProps {
  testFields: (SingleFieldTableData | MultipleFieldsTableData)[];
  onDragEnd: (result: { source: { index: number }, destination: { index: number } }) => void;
  onDelete?: (index: number) => void;
  onRowSelect: (field: SingleFieldTableData | MultipleFieldsTableData | null, index: number) => void;
  selectedRowIndex: number | null;
  setFormula: (isFormula: boolean) => void;
  isFormula: boolean;
}

const TableRows: React.FC<{
  fields: TestFieldsTableProps["testFields"];
  onDelete?: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onRowSelect: (field: SingleFieldTableData | MultipleFieldsTableData | null, index: number) => void;
  selectedRowIndex: number | null;
  setFormula: (formula: boolean) => void;
  isFormula: boolean;
}> = React.memo(({ 
  fields, 
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onRowSelect,
  selectedRowIndex,
  setFormula,
  isFormula,
}) => (
  <>
    {fields.map((field, index) => (
      <tr
        key={`${(field as SingleFieldTableData).name || (field as MultipleFieldsTableData).titleName}-${index}`}
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragEnd={onDragEnd}
        className={`border-b hover:bg-gray-50 ${selectedRowIndex === index ? 'bg-blue-100' : ''}`}
      >
        <td className="p-2 w-8 cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </td>
        <td className="p-2 w-8">
          <input 
            type="checkbox" 
            className="rounded"
            checked={selectedRowIndex === index}
            onChange={() => onRowSelect(selectedRowIndex === index ? null : field, index)}
          />
        </td>
        <td className="p-2 min-w-[120px]">{(field as SingleFieldTableData).name}</td>
        <td className="p-2 min-w-[120px]">{(field as SingleFieldTableData).field}</td>
        <td className="p-2 min-w-[100px]">{(field as SingleFieldTableData).units}</td>
        <td className="p-2 min-w-[100px]">
          {(field as SingleFieldTableData).range.numeric.minRange && (field as SingleFieldTableData).range.numeric.maxRange
            ? `${(field as SingleFieldTableData).range.numeric.minRange} - ${(field as SingleFieldTableData).range.numeric.maxRange}`
            : (field as SingleFieldTableData).range.text || `${(field as SingleFieldTableData).range.numeric_unbound.comparisonOperator} ${(field as SingleFieldTableData).range.numeric_unbound.value}` || (field as SingleFieldTableData).range.multiple_range}
        </td>
        <td className="p-2 w-20">
          <input
            type="checkbox"
            className="rounded"
            checked={selectedRowIndex === index && isFormula}
            onChange={() => {
              if (selectedRowIndex === index) {
                setFormula(!isFormula);
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
    ))}
  </>
));

TableRows.displayName = 'TableRows'; 

export const TestFieldsTable: React.FC<TestFieldsTableProps> = ({
  testFields,
  onDragEnd,
  onDelete,
  onRowSelect,
  selectedRowIndex,
  isFormula,
  setFormula,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
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
        destination: { index: dragOverIndex }
      });
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRowSelect = (field: SingleFieldTableData | MultipleFieldsTableData | null, index: number) => {
    onRowSelect(field, index);
    setFormula(false); // Reset formula when selecting/deselecting a row
  };

  return (
    <div className="flex-1 border overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-2 w-8"></th>
            <th className="p-2 w-8"></th>
            <th className="p-2 text-left font-medium text-sm min-w-[120px]">Name</th>
            <th className="p-2 text-left font-medium text-sm min-w-[120px]">Field</th>
            <th className="p-2 text-left font-medium text-sm min-w-[100px]">Units</th>
            <th className="p-2 text-left font-medium text-sm min-w-[100px]">Range</th>
            <th className="p-2 text-left font-medium text-sm w-20">Formula</th>
            <th className="p-2 w-8">Delete</th>
          </tr>
        </thead>
        <tbody>
          <TableRows 
            fields={testFields} 
            onDelete={onDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onRowSelect={handleRowSelect}
            selectedRowIndex={selectedRowIndex}
            setFormula={setFormula}
            isFormula={isFormula}
          /> 
        </tbody>
      </table>
    </div>
  );
};

export default TestFieldsTable;
