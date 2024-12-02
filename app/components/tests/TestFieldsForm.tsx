import React, { useCallback } from "react";
import CustomDropdown from "./CustomDropdown";

// Type definitions remain the same...
type ComparisonOperator = "<=" | "<" | ">" | "=" | ">=";

type NumericRange = {
  minRange: string;
  maxRange: string;
};

type NumericUnbound = {
  comparisonOperator: ComparisonOperator | "";
  value: string;
};

type CustomRange = {
  options: string[];
  defaultOption: string;
};

type Range = {
  numeric?: NumericRange;
  text?: string;
  numeric_unbound?: NumericUnbound;
  multiple_range?: string;
  custom?: CustomRange;
};

export interface FieldTableData {
  name: string;
  fieldType: string;
  field: FieldType;
  units: string;
  formula: string;
  testMethod: TestMethod;
  range: Range;
}

type FieldType =
  | "numeric"
  | "text"
  | "numeric_unbound"
  | "multiple_range"
  | "custom";
type TestMethod = "pcr" | "elisa" | "immunoassay" | "";

interface MultipleFieldsFormProps {
  testFieldsData: FieldTableData;
  handleTestFieldsDataChange: (field: any) => void;
  handleAddField: (e?: React.FormEvent<HTMLFormElement>) => void;
  handleAddSubField: () => void;
  isFormula: boolean;
  handleAddFormula: () => void;
  fieldType: string;
  titleName: string;
  setTitleName: (titleName: string) => void;
  errors: any;
  touched: any;
  isEditing?: boolean;
  selectedChildIndex: number | null;
  selectedRowIndex: number | null;
  handleUpdateSubField: () => void;
  editTitle: boolean;
  setEditTitle: (editTitle: boolean) => void;
  handleUpdateTitle: (newTitle: string) => void;
}

const TEST_METHODS: TestMethod[] = ["pcr", "elisa", "immunoassay", ""];
const FIELD_TYPES: FieldType[] = [
  "numeric",
  "text",
  "numeric_unbound",
  "multiple_range",
  "custom",
];
const COMPARISON_OPERATORS: ComparisonOperator[] = ["<=", "<", ">", "=", ">="];

const MultipleFieldsForm: React.FC<MultipleFieldsFormProps> = ({
  testFieldsData,
  handleTestFieldsDataChange,
  handleAddField,
  handleAddSubField,
  isFormula,
  handleAddFormula,
  fieldType,
  titleName,
  setTitleName,
  errors,
  touched,
  isEditing = false,
  selectedChildIndex,
  handleUpdateSubField,
  selectedRowIndex,
  editTitle,
  setEditTitle,
  handleUpdateTitle,
}) => {
  // Memoized handlers for better performance
  const handleTitleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitleName(e.target.value),
    [setTitleName]
  );

  const handleNumericUnboundChange = useCallback(
    (field: "comparisonOperator" | "value", value: string) => {
      const updatedRange = {
        ...testFieldsData.range,
        numeric_unbound: {
          ...testFieldsData.range.numeric_unbound,
          [field]: value,
        },
      };

      // Create a synthetic event-like object
      const syntheticEvent = {
        target: {
          name: `range.numeric_unbound.${field}`,
          value: value,
        },
      };

      handleTestFieldsDataChange(syntheticEvent);
    },
    [handleTestFieldsDataChange, testFieldsData.range]
  );

  const handleCustomOptionsChange = useCallback(
    (options: string[]) => {
      const syntheticEvent = {
        target: {
          name: "range.custom.options",
          value: options,
        },
      };
      handleTestFieldsDataChange(syntheticEvent);
    },
    [handleTestFieldsDataChange]
  );

  const handleDefaultOptionChange = useCallback(
    (defaultOption: string) => {
      const syntheticEvent = {
        target: {
          name: "range.custom.defaultOption",
          value: defaultOption,
        },
      };
      handleTestFieldsDataChange(syntheticEvent);
    },
    [handleTestFieldsDataChange]
  );

  const handleEditToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(e.target.checked);
    },
    [setEditTitle]
  );

  const handleTitleUpdate = useCallback(() => {
    if (editTitle && selectedRowIndex !== null) {
      // Update the title in parent component
      handleUpdateTitle(titleName);
      setEditTitle(false);
    } else {
      setEditTitle(true);
    }
  }, [editTitle, selectedRowIndex, titleName, handleUpdateTitle, setEditTitle]);

  // Updated handler for field type changes
  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFieldType = e.target.value as FieldType;
    
    // Create empty range based on field type
    const getEmptyRange = (type: FieldType) => {
      switch(type) {
        case 'numeric':
          return { minRange: '', maxRange: '' };
        case 'numeric_unbound':
          return { comparisonOperator: '', value: '' };
        case 'custom':
          return { options: [], defaultOption: '' };
        default:
          return '';
      }
    };

    // Create a synthetic event with empty range of correct type
    const rangeEvent = {
      target: {
        name: 'range',
        value: {
          [newFieldType]: getEmptyRange(newFieldType)
        }
      }
    };

    // For multiple fields, update the field type in the correct structure
    if (fieldType === "Multiple fields") {
      const fieldEvent = {
        target: {
          name: 'field',
          value: newFieldType
        }
      };
      handleTestFieldsDataChange(fieldEvent);
    } else {
      // For single fields, update directly
      handleTestFieldsDataChange(e);
    }

    // Update the range structure
    handleTestFieldsDataChange(rangeEvent);
  }, [handleTestFieldsDataChange, fieldType]);

  // Common styles
  const inputClass = "w-full border rounded px-3 py-1.5 text-sm";
  const labelClass = "text-sm text-gray-600 mb-1";
  const buttonClass =
    "px-3 py-1.5 text-white border bg-blue-500 rounded text-sm hover:bg-blue-600";

  // Render field-specific range inputs
  const renderRangeField = () => {
    const range = testFieldsData?.range || {};
    
    switch (testFieldsData?.field) {
      case "numeric":
        return (
          <div className="flex gap-2 items-center justify-between">
            <label className={labelClass}>Range:</label>
            <input
              type="number"
              name="range.numeric.minRange"
              value={range.numeric?.minRange || ""}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
              placeholder="Minimum"
            />
            <span className="text-gray-400">to</span>
            <input
              type="number"
              name="range.numeric.maxRange"
              value={range.numeric?.maxRange || ""}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
              placeholder="Maximum"
            />
          </div>
        );

      case "text":
        return (
          <div>
            <label className={labelClass}>Range:</label>
            <textarea
              name="range.text"
              value={testFieldsData?.range?.text}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
            />
          </div>
        );

      case "numeric_unbound":
        return (
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Range:</label>
            <div className="flex gap-2 items-center justify-between">
              <select
                title="Comparison Operator"
                name="range.numeric_unbound.comparisonOperator"
                value={
                  testFieldsData?.range?.numeric_unbound?.comparisonOperator
                }
                onChange={handleTestFieldsDataChange}
                className={inputClass}
              >
                <option value="">Select Comparison Operator</option>
                {COMPARISON_OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op === "<="
                      ? "less than equal to"
                      : op === "<"
                      ? "less than"
                      : op === ">"
                      ? "greater than"
                      : op === "="
                      ? "equal to"
                      : "greater than equal to"}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="range.numeric_unbound.value"
                value={testFieldsData?.range?.numeric_unbound?.value}
                onChange={handleTestFieldsDataChange}
                className={inputClass}
                placeholder="Value"
              />
            </div>
          </div>
        );

      case "multiple_range":
        return (
          <div>
            <label className={labelClass}>Multiple Range:</label>
            <textarea
              name="range.multiple_range"
              value={testFieldsData.range.multiple_range}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
            />
          </div>
        );

      case "custom":
        return (
          <div>
            <label className={labelClass}>Custom:</label>
            <CustomDropdown
              placeholder="Select or create options"
              onOptionsChange={handleCustomOptionsChange}
              onDefaultOptionChange={handleDefaultOptionChange}
              initialOptions={range.custom?.options || []}
              initialDefaultOption={range.custom?.defaultOption || ""}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleAddField} className="space-y-4">
      {fieldType === "Multiple fields" && (
        <div className="flex flex-row w-full justify-between items-center gap-2">
          <div className="w-full">
            <label className={labelClass}>Title Name:</label>
            <input
              type="text"
              name="titleName"
              value={titleName}
              onChange={handleTitleNameChange}
              className={`${inputClass} ${
                editTitle ? 'border-blue-500' : ''
              }`}
              disabled={!editTitle && selectedRowIndex !== null}
              placeholder="Enter title name"
            />
          </div>
          {selectedRowIndex !== null && selectedChildIndex === null && (
            <div className="w-auto h-full mt-6 flex flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleTitleUpdate}
                className={`px-3 py-1.5 rounded text-sm ${
                  editTitle 
                    ? 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600' 
                    : 'text-blue-500 border border-blue-500 hover:text-blue-600'
                }`}
              >
                {editTitle ? 'Update' : 'Edit'}
              </button>
            </div>
          )}
        </div>
      )}

      {
        <>
          <div>
            <label className={labelClass}>Test Name:</label>
            <input
              type="text"
              title="Test Name"
              id="name"
              name="name"
              value={testFieldsData.name}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Test Method:</label>
            <select
              title="Test Method"
              name="testMethod"
              value={testFieldsData.testMethod}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
              required
            >
              <option value="">Select Test Method</option>
              {TEST_METHODS.filter(Boolean).map((method) => (
                <option key={method} value={method}>
                  {method.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Field:</label>
            <select
              title="Field"
              name="field"
              value={testFieldsData.field}
              onChange={handleFieldChange}
              className={inputClass}
              required
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").charAt(0).toUpperCase() +
                    type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Units:</label>
            <input
              type="text"
              name="units"
              value={testFieldsData.units}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
            />
          </div>

          {renderRangeField()}
        </>
      }

      <div className="flex gap-2">
        {fieldType === "Single field" && (
          <button type="submit" className={buttonClass}>
            {isEditing ? "Update Field" : "Add Field"}
          </button>
        )}
        {fieldType === "Multiple fields" &&
          titleName.trim() &&
          selectedChildIndex === null && (
            <button
              type="button"
              onClick={handleAddSubField}
              className="px-3 py-1.5 text-blue-500 border hover:text-white border-blue-500 rounded text-sm hover:bg-blue-500"
            >
              Add SubField
            </button>
          )}
        {isEditing && selectedChildIndex !== null && (
          <button
            type="button"
            onClick={handleUpdateSubField}
            className="px-3 py-1.5 text-blue-500 border hover:text-white border-blue-500 rounded text-sm hover:bg-blue-500"
          >
            Update SubField
          </button>
        )}

        {isFormula && (
          <button
            type="button"
            onClick={handleAddFormula}
            className={buttonClass}
          >
            Add Formula
          </button>
        )}
      </div>
    </form>
  );
};

export default MultipleFieldsForm;
