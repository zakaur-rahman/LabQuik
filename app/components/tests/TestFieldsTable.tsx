import React, { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

// Use the TableData interface
interface TableData {
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
    custom:{
      options:string[];
      defaultOption:string;
    };
  };
}

interface TestFieldsTableProps {
  testFields: TableData[];
  onDragEnd: (result: { source: { index: number }, destination: { index: number } }) => void;
  onDelete?: (index: number) => void;
  onRowSelect: (field: TableData | null, index: number) => void;
  selectedRowIndex: number | null;
}

const TableRows: React.FC<{
  fields: TableData[];
  onDelete?: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onRowSelect: (field: TableData | null, index: number) => void;
  selectedRowIndex: number | null;
}> = React.memo(({ 
  fields, 
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onRowSelect,
  selectedRowIndex,
}) => (
  <>
    {fields.map((field, index) => (
      <tr
        key={`${field.name}-${index}`}
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
        <td className="p-2 min-w-[120px]">{field.name}</td>
        <td className="p-2 min-w-[120px]">{field.field}</td>
        <td className="p-2 min-w-[100px]">{field.units}</td>
        <td className="p-2 min-w-[100px]">
          {field.range.numeric.minRange && field.range.numeric.maxRange
            ? `${field.range.numeric.minRange} - ${field.range.numeric.maxRange}`
            : field.range.text || `${field.range.numeric_unbound.comparisonOperator} ${field.range.numeric_unbound.value}` || field.range.multiple_range}
        </td>
        <td className="p-2 w-20">
          <input
            type="checkbox"
            className="rounded"
            checked={!!field.formula}
            readOnly
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
            onRowSelect={onRowSelect}
            selectedRowIndex={selectedRowIndex}
          />
        </tbody>
      </table>
    </div>
  );
};

export default TestFieldsTable;
