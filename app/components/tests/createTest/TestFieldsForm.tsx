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

type FieldType = "numeric" | "text" | "numeric_unbound" | "multiple_range" | "custom";
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
}

const TEST_METHODS: TestMethod[] = ["pcr", "elisa", "immunoassay", ""];
const FIELD_TYPES: FieldType[] = ["numeric", "text", "numeric_unbound", "multiple_range", "custom"];
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
          [field]: value
        }
      };
      
      // Create a synthetic event-like object
      const syntheticEvent = {
        target: {
          name: `range.numeric_unbound.${field}`,
          value: value
        }
      };
      
      handleTestFieldsDataChange(syntheticEvent);
    },
    [handleTestFieldsDataChange, testFieldsData.range]
  );

  const handleCustomOptionsChange = useCallback(
    (options: string[]) => {
      const syntheticEvent = {
        target: {
          name: 'range.custom.options',
          value: options
        }
      };
      handleTestFieldsDataChange(syntheticEvent);
    },
    [handleTestFieldsDataChange]
  );

  const handleDefaultOptionChange = useCallback(
    (defaultOption: string) => {
      const syntheticEvent = {
        target: {
          name: 'range.custom.defaultOption',
          value: defaultOption
        }
      };
      handleTestFieldsDataChange(syntheticEvent);
    },
    [handleTestFieldsDataChange]
  );

  // Common styles
  const inputClass = "w-full border rounded px-3 py-1.5 text-sm";
  const labelClass = "text-sm text-gray-600 mb-1";
  const buttonClass = "px-3 py-1.5 text-white border bg-blue-500 rounded text-sm hover:bg-blue-600";

  // Render field-specific range inputs
  const renderRangeField = () => {
    switch (testFieldsData?.field) {
      case "numeric":
        return (
          <div className="flex gap-2 items-center justify-between">
            <label className={labelClass}>Range:</label>
            <input
              type="number"
              name="range.numeric.minRange"
              value={testFieldsData?.range?.numeric?.minRange}
              onChange={handleTestFieldsDataChange}
              className={inputClass}
              placeholder="Minimum"
            />
            <span className="text-gray-400">to</span>
            <input
              type="number"
              name="range.numeric.maxRange"
              value={testFieldsData?.range?.numeric?.maxRange}
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
                value={testFieldsData?.range?.numeric_unbound?.comparisonOperator}
                onChange={handleTestFieldsDataChange}
                className={inputClass}
              >
                <option value="">Select Comparison Operator</option>
                {COMPARISON_OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op === "<=" ? "less than equal to" :
                     op === "<" ? "less than" :
                     op === ">" ? "greater than" :
                     op === "=" ? "equal to" :
                     "greater than equal to"}
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
        <div>
          <label className={labelClass}>Title Name:</label>
          <input
            type="text"
            name="titleName"
            data-field="titleName"
            value={titleName}
            onChange={handleTitleNameChange}
            className={inputClass}
          />
        </div>
      )}

      { (
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
              onChange={handleTestFieldsDataChange}
              className={inputClass}
              required
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").charAt(0).toUpperCase() + type.slice(1)}
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
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className={buttonClass}
        >
          {isEditing ? "Update Field" : fieldType === "Multiple fields" ? "Save Multiple Fields" : "Add Field"}
        </button>
        {fieldType === "Multiple fields" && titleName.trim() && (
          <button
            type="button"
            onClick={handleAddSubField}
            className="px-3 py-1.5 text-blue-500 border hover:text-white border-blue-500 rounded text-sm hover:bg-blue-500"
          >
            Add SubField
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