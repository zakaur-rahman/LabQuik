import React, { useState } from "react";
import { Search, ChevronDown, Save, Edit2 } from "lucide-react";

interface Range {
    numeric?: {
      minRange: string;
      maxRange: string;
    };
    text?: string;
    numeric_unbound?: {
      comparisonOperator: string;
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
  finalData: (TestField | MultipleFieldsType)[];
}

interface FormValues {
  [key: string]: string;
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
    finalData: [],
  },
];

const MedicalTestForm = ({
  testData = defaultTestData,
}: {
  testData?: TestDataItem[];
}) => {
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  const handleValueChange = (
    testName: string,
    fieldName: string,
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [`${testName}-${fieldName}`]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving form values:", formValues);
  };

  const renderField = (
    field: TestField,
    testName: string,
    isSubField: boolean = false
  ) => (
    <tr
      key={`${testName}-${field.name}`}
      className={`
        border-t border-gray-200 hover:bg-gray-50 transition-colors
        ${isSubField ? "pl-8" : ""}
      `}
    >
      <td className="px-4 py-3 text-gray-700 font-medium text-sm">
        {isSubField && <span className="inline-block w-4" />}
        {field.name}
      </td>
      <td className="px-4 py-2">
        {field.field==="custom"? (
          <select
            title={field.name}
            value={formValues[`${testName}-${field.name}`] || ""}
            onChange={(e) => handleValueChange(testName, field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none  focus:border-blue-500
              placeholder:text-gray-400 text-gray-900
              disabled:bg-gray-50 disabled:text-gray-500"
          >
            {field.range?.custom?.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select> 
        ):(
            <input
            type="text"
            value={formValues[`${testName}-${field.name}`] || ""}
            onChange={(e) =>
              handleValueChange(testName, field.name, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none  focus:border-blue-500
              placeholder:text-gray-400 text-gray-900
              disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Enter value"
          />
        )}
      </td>
      <td className="px-4 py-2 text-gray-600 text-sm">{field.units}</td>
      {field.field==="text" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.text || "-"}
        </td>
      )}
      {field.field==="numeric" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.numeric?.minRange || "-"} - {field.range?.numeric?.maxRange || "-"}
        </td>
      )}
      {field.field==="numeric_unbound" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.numeric_unbound?.comparisonOperator || "-"} {field.range?.numeric_unbound?.value || "-"}
        </td>
      )}
      {field.field==="multiple_range" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.multiple_range || "-"}
        </td>
      )}
      {field.field==="custom" && (
        <td className="px-4 py-2 text-gray-600 text-sm">
          {field.range?.custom?.defaultOption || "-"}
        </td>
      )}

      <td className="px-4 py-2 text-gray-600 text-sm">{field.testMethod}</td>
    </tr>
  );

  const testsToRender =
    Array.isArray(testData) && testData.length > 0 ? testData : defaultTestData;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b border-gray-200">
          <tr className="text-left bg-gray-200">
            <th className="px-4 py-2">Test Name</th>
            <th className="px-4 py-2">Observed Value</th>
            <th className="px-4 py-2">Units</th>
            <th className="px-4 py-2">Reference Range</th>
            <th className="px-4 py-2">Method</th>
          </tr>
        </thead>
        <tbody>
          {testsToRender.map((test) => (
            <React.Fragment key={test.testCode}>
              <tr className="bg-gray-50">
                <td colSpan={5} className="px-4 py-3 font-medium">
                  <div className="flex items-center justify-between">
                    <span>{test.testName}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={showInterpretation}
                          onChange={(e) =>
                            setShowInterpretation(e.target.checked)
                          }
                        />
                        Show Interpretation
                      </label>
                      <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                        Comments
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              {test.finalData?.map((item, index) => {
                if ("fieldType" in item && item.fieldType === "Single field") {
                  return renderField(item as TestField, test.testName);
                } else if ("multipleFieldsData" in item) {
                  const multipleField = item as MultipleFieldsType;
                  return (
                    <React.Fragment key={`${test.testName}-${index}`}>
                      <tr className="bg-gray-100">
                        <td colSpan={5} className="px-4 py-2 font-medium">
                          {multipleField.titleName}
                        </td>
                      </tr>

                      {multipleField.multipleFieldsData.map((subField) =>
                        renderField(subField, test.testName, true)
                      )}
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalTestForm;
