import React, { useState } from "react";

interface Range {
  numeric?: {
    min: string;
    max: string;
  };
  text?: string;
  numeric_unbound?: {
    operator: string;
    value: string;
  };
  multiple_range?: string;
  custom?: {
    options: string[];
    defaultOption: string;
  };
}

interface TestField {
  name: string;
  fieldType: string;
  field: string;
  units: string;
  formula: string;
  observedValue?: string | number;
  testMethod: string;
  range: Range;
}

interface MultipleFieldsType {
  titleName: string;
  fieldType: string;
  multipleFieldsData: TestField[];
}

interface TestDataItem {
  department: string;
  testName: string;
  cost: number;
  testCode: string;
  sex: string;
  sampleType: string;
  age: string;
  suffix: string;
  showInterpretation: boolean;
  finalData: (TestField | MultipleFieldsType)[];
}

interface FormattedTestData {
  patientId: string;
  firstName: string;
  lastName: string;
  age: number;
  ageType: string;
  gender: string;
  status: string;
  tests: TestDataItem[];
}

const defaultTestData: TestDataItem[] = [
  {
    department: "Default",
    testName: "No Tests Available",
    cost: 0,
    testCode: "DEFAULT",
    sex: "",
    sampleType: "",
    age: "",
    suffix: "",
    showInterpretation: false,
    finalData: [],
  },
];
interface PatientInfo {
  patientId: string;
  firstName: string;
  lastName: string;
  age: number;
  ageType: string;
  gender: string;
}

const getFieldValidationStyle = (field: TestField, value: string): string => {
  if (!value) return ""; // No validation for empty values

  // Handle custom field type
  if (field.field === "custom" && field.range?.custom) {
    if (value !== field.range.custom.defaultOption) {
      return "border-yellow-500 focus:border-yellow-500";
    }
    return "border-gray-300 focus:border-blue-500";
  }

  // For numeric fields
  if (!field.field || !field.range) return "";

  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return "";

  if (field.field === "numeric" && field.range.numeric) {
    const { min, max } = field.range.numeric;
    if (numericValue > parseFloat(max)) {
      return "border-red-500 focus:border-red-500";
    }
    if (numericValue < parseFloat(min)) {
      return "border-blue-500 focus:border-blue-500";
    }
  }

  if (field.field === "numeric_unbound" && field.range.numeric_unbound) {
    const { operator, value: threshold } = field.range.numeric_unbound;
    const thresholdValue = parseFloat(threshold);

    if (operator === "<" || operator === "<=") {
      return numericValue < thresholdValue
        ? "border-blue-500 focus:border-blue-500"
        : "border-red-500 focus:border-red-500";
    }
    if (operator === ">" || operator === ">=") {
      return numericValue > thresholdValue
        ? "border-blue-500 focus:border-blue-500"
        : "border-red-500 focus:border-red-500";
    }
  }

  return "border-gray-300 focus:border-blue-500";
};

interface MedicalTestFormProps {
  testData?: TestDataItem[];
  patientInfo: PatientInfo;
  formRef: (form: HTMLFormElement | null) => void;
  formData: { [key: string]: string };
  showInterpretations: { [key: string]: boolean };
  onObservedValueChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string,
    testCode: string
  ) => void;
  onInterpretationToggle: (testCode: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const MedicalTestForm = ({
  testData,
  patientInfo,
  formRef,
  formData,
  showInterpretations,
  onObservedValueChange,
  onInterpretationToggle,
  onSubmit,
}: MedicalTestFormProps) => {
  const testsToRender =
    Array.isArray(testData) && testData.length > 0 ? testData : defaultTestData;

  return (
    <div className="overflow-x-auto">
      <form ref={formRef} onSubmit={onSubmit}>
        <table className="w-full border-collapse rounded-lg">
          <thead className="border-b border-gray-200">
            <tr className="text-left bg-gray-300 rounded-t-lg">
              <th className="px-4 py-2 first:rounded-tl-lg last:rounded-tr-lg">
                Test Name
              </th>
              <th className="px-4 py-2">Observed Value</th>
              <th className="px-4 py-2">Units</th>
              <th className="px-4 py-2">Reference Range</th>
              <th className="px-4 py-2 last:rounded-tr-lg">Method</th>
            </tr>
          </thead>
          <tbody>
            {testsToRender.map((test) => (
              <React.Fragment key={test.testCode}>
                <tr className="bg-gray-100">
                  <td colSpan={5} className="px-4 py-3 font-medium">
                    <div className="flex items-center justify-between ">
                      <span className="text-gray-900 font-medium text-2xl">
                        {test.testName}
                      </span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={showInterpretations[test.testCode] || false}
                            onChange={() =>
                              onInterpretationToggle(test.testCode)
                            }
                          />
                          Show Interpretation
                        </label>
                        <button
                          type="button"
                          className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                        >
                          Comments
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                {test.finalData?.map((item, index) => {
                  if ("fieldType" in item && item.fieldType === "Single field") {
                    return renderField(
                      item as TestField,
                      test.testName,
                      test.testCode,
                      formData,
                      onObservedValueChange
                    );
                  } else if ("multipleFieldsData" in item) {
                    return renderMultipleFields(
                      item as MultipleFieldsType,
                      test.testName,
                      test.testCode,
                      formData,
                      onObservedValueChange,
                      index
                    );
                  }
                  return null;
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

// Helper render functions (moved outside component)
const renderField = (
  field: TestField,
  testName: string,
  testCode: string,
  formData: { [key: string]: string },
  onObservedValueChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string,
    testCode: string
  ) => void,
  isSubField: boolean = false
) => {
  const currentValue = formData[`${testCode}-${field.name}`] || "";
  const validationStyle = getFieldValidationStyle(field, currentValue);

  return (
    <tr key={`${testName}-${field.name}`}>
      <td
        className={`px-4 py-3  font-medium ${
          isSubField ? "text-gray-500 text-sm" : "text-gray-700 text-md"
        }`}
      >
        {isSubField && <span className="inline-block w-6" />}
        {field.name}
      </td>
      <td className="px-4 py-2">
        {field.field === "custom" ? (
          <select
            title={field.name}
            value={currentValue}
            onChange={(e) =>
              onObservedValueChange(e, field.name, testCode)
            }
            className={`w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:border-blue-500
              placeholder:text-gray-400 text-gray-900
              disabled:bg-gray-50 disabled:text-gray-500 ${validationStyle}`}
          >
            {field.range?.custom?.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={
              field.fieldType === "numeric" ||
              field.fieldType === "numeric_unbound"
                ? "number"
                : "text"
            }
            value={currentValue}
            onChange={(e) =>
              onObservedValueChange(e, field.name, testCode)
            }
            className={`w-full px-3 py-2 border rounded-md 
              focus:outline-none
              placeholder:text-gray-400 text-gray-900
              disabled:bg-gray-50 disabled:text-gray-500
              ${validationStyle || "border-gray-300 focus:border-blue-500"}`}
            placeholder="Enter value"
          />
        )}
      </td>
      <td className="px-4 py-2 text-gray-600 text-sm">{field.units}</td>
      {field.field === "text" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.text || "-"}
        </td>
      )}
      {field.field === "numeric" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.numeric?.min || "-"} -{" "}
          {field.range?.numeric?.max || "-"}
        </td>
      )}
      {field.field === "numeric_unbound" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.numeric_unbound?.operator || "-"}{" "}
          {field.range?.numeric_unbound?.value || "-"}
        </td>
      )}
      {field.field === "multiple_range" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.multiple_range || "-"}
        </td>
      )}
      {field.field === "custom" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.custom?.defaultOption || "-"}
        </td>
      )}

      <td className="px-4 py-2 text-gray-600 text-sm">{field.testMethod}</td>
    </tr>
  );
};

const renderMultipleFields = (
  multipleField: MultipleFieldsType,
  testName: string,
  testCode: string,
  formData: { [key: string]: string },
  onObservedValueChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string,
    testCode: string
  ) => void,
  index: number
) => {
  return (
    <React.Fragment key={`${testName}-${index}`}>
      <tr className="">
        <td
          colSpan={5}
          className="px-4 py-2 font-medium text-gray-700 text-md"
        >
          {multipleField.titleName}
        </td>
      </tr>

      {multipleField.multipleFieldsData.map((subField) =>
        renderField(
          subField,
          testName,
          testCode,
          formData,
          onObservedValueChange,
          true
        )
      )}
    </React.Fragment>
  );
};

export default MedicalTestForm;
