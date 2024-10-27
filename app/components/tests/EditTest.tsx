import React, { useState, useEffect } from "react";
import { Trash2Icon, PlusIcon, PencilIcon } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";
import { TestFieldsTable } from "./TestFieldsTable";
import { MultipleFieldsEditor } from "./MultipleFieldsEditor";
import { TextEditor } from "./TextEditor";
import CustomDropdown from "./CustomDropdown";

type EditorType = "Single field" | "Multiple fields" | "Text Editor";

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
    custom: {
      options: string[];
      defaultOption: string;
    };
  };
}

interface TestData {
  department: string;
  testName: string;
  cost: number;
  testCode: string;
  sex: string;
  sampleType: string;
  age: string;
  suffix: string;
  type: EditorType;
}

const initialTableData: TableData = {
  name: "",
  field: "numeric",
  units: "",
  formula: "",
  testMethod: "",
  range: {
    numeric: {
      minRange: "",
      maxRange: "",
    },
    text: "",
    numeric_unbound: {
      comparisonOperator: "",
      value: "",
    },
    multiple_range: "",
    custom: {
      options: [],
      defaultOption: "",
    },
  },
};

const initialTestData: TestData = {
  department: "MOLECULAR BIOLOGY",
  testName: "Biology Test",
  cost: 0,
  testCode: "",
  sex: "Male",
  sampleType: "Serum",
  age: "default",
  suffix: "",
  type: "Single field",
};

interface EditTestProps {
  testId: number;
}

const EditTestPage: React.FC<EditTestProps> = ({ testId }) => {
  const [tableData, setTableData] = useState<TableData>(initialTableData);
  const [testData, setTestData] = useState<TestData>(initialTestData);
  const [testFields, setTestFields] = useState<TableData[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleTableDataChange = (newData: Partial<TableData>) => {
    setTableData((prevData) => {
      let updatedData = { ...prevData, ...newData };

      // Reset range and units when field type changes
      if (newData.field && newData.field !== prevData.field) {
        updatedData = {
          ...updatedData,
          units: "",
          range: {
            numeric: { minRange: "", maxRange: "" },
            text: "",
            numeric_unbound: { comparisonOperator: "", value: "" },
            multiple_range: "",
            custom: { options: [], defaultOption: "" },
          },
        };
      }

      return updatedData;
    });

    if (selectedRowIndex !== null) {
      setTestFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[selectedRowIndex] = {
          ...updatedFields[selectedRowIndex],
          ...newData,
        };

        // Reset range and units in testFields when field type changes
        if (newData.field && newData.field !== prevFields[selectedRowIndex].field) {
          updatedFields[selectedRowIndex] = {
            ...updatedFields[selectedRowIndex],
            units: "",
            range: {
              numeric: { minRange: "", maxRange: "" },
              text: "",
              numeric_unbound: { comparisonOperator: "", value: "" },
              multiple_range: "",
              custom: { options: [], defaultOption: "" },
            },
          };
        }

        return updatedFields;
      });
    }
  };

  const handleTestDataChange = (newData: Partial<TestData>) => {
    setTestData((prevData) => ({ ...prevData, ...newData }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(testFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTestFields(items);
  };

  const handleDeleteField = (index: number) => {
    setTestFields((prev) => prev.filter((_, i) => i !== index));
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
      setTableData(initialTableData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    handleTestDataChange({ [name]: value });

    if (name === "testName") {
      handleTableDataChange({ name: value });
    }
  };

  const handleRowSelect = (field: TableData | null, index: number) => {
    if (field) {
      setTableData(field);
      setTestData((prevData) => ({ ...prevData, testName: field.name }));
      setSelectedRowIndex(index);
    } else {
      setTableData(initialTableData);
      setTestData((prevData) => ({ ...prevData, testName: "" }));
      setSelectedRowIndex(null);
    }
  };

  const resetForm = () => {
    setTestData(initialTestData);
    setTableData(initialTableData);
    setSelectedRowIndex(null);
  };

  const handleSubmit = () => {
    console.log("Saving test data:", { testData, testFields, tableData });
    // Add your save logic here
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      resetForm();
      setTestFields([]);
    }
  };

  useEffect(() => {
    if (selectedRowIndex === null && tableData.name) {
      const newIndex = testFields.length;
      setTestFields((prev) => [...prev, tableData]);
      setSelectedRowIndex(newIndex);
    }
  }, [tableData, selectedRowIndex, testFields.length]);

  const renderEditor = () => {
    switch (testData.type) {
      case "Single field":
        return (
          <TestFieldsTable
            testFields={testFields}
            onDragEnd={onDragEnd}
            onDelete={handleDeleteField}
            onRowSelect={handleRowSelect}
            selectedRowIndex={selectedRowIndex}
          />
        );
      case "Multiple fields":
        return <MultipleFieldsEditor />;
      case "Text Editor":
        return <TextEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 text-black">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-medium text-gray-800">Edit Test</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-red-500 border border-red-500 rounded text-sm hover:bg-red-50"
            >
              Reset Test
            </button>
            <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
              Report preview
            </button>
            <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
              View Comments
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
              <PlusIcon className="inline-block w-4 h-4 mr-1" />
              Add Comment
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>

        {/* Main Form Section */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-3">
            <label className="text-sm text-gray-600 mb-1">Department:</label>
            <select
              name="department"
              value={testData.department}
              onChange={handleInputChange}
              aria-label="Department"
              className="w-full border rounded px-3 py-1.5 text-sm"
            >
              <option>MOLECULAR BIOLOGY</option>
              <option>BIOCHEMISTRY</option>
              <option>HEMATOLOGY</option>
            </select>
          </div>
          <div className="col-span-5">
            <label className="text-sm text-gray-600 mb-1">Test Name:</label>
            <input
              type="text"
              name="testName"
              value={testData.testName}
              onChange={handleInputChange}
              aria-label="Test Name"
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1">Cost:</label>
            <input
              type="number"
              name="cost"
              value={testData.cost}
              onChange={handleInputChange}
              aria-label="Cost"
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1">Test Code:</label>
            <input
              type="text"
              name="testCode"
              value={testData.testCode}
              onChange={handleInputChange}
              aria-label="Test Code"
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        {/* Secondary Form Section */}
        <div className="flex gap-4 mb-8 items-end">
          <div className="w-48">
            <label className="text-sm text-gray-600 mb-1">By Sex:</label>
            <select
              name="sex"
              value={testData.sex}
              onChange={handleInputChange}
              aria-label="Gender"
              className="w-full border rounded px-3 py-1.5 text-sm"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Both</option>
            </select>
          </div>
          <div className="w-48">
            <label className="text-sm text-gray-600 mb-1">Sample type:</label>
            <select
              name="sampleType"
              value={testData.sampleType}
              onChange={handleInputChange}
              aria-label="Sample Type"
              className="w-full border rounded px-3 py-1.5 text-sm"
            >
              <option>Serum</option>
              <option>Plasma</option>
              <option>Whole Blood</option>
              <option>Urine</option>
            </select>
          </div>
          <div className="w-48">
            <label className="text-sm text-gray-600 mb-1">Age:</label>
            <select
              name="age"
              value={testData.age}
              onChange={handleInputChange}
              aria-label="Age"
              className="w-full border rounded px-3 py-1.5 text-sm"
            >
              <option value="default">Default</option>
              <option value="pediatric">Pediatric</option>
              <option value="adult">Adult</option>
              <option value="geriatric">Geriatric</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button aria-label="Add" className="px-2 py-1.5 border rounded">
              <PlusIcon className="w-4 h-4" />
            </button>
            <button aria-label="Edit" className="px-2 py-1.5 border rounded">
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-1">Suffix:</label>
            <input
              type="text"
              name="suffix"
              value={testData.suffix}
              onChange={handleInputChange}
              placeholder="Enter Barcode Suffix"
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <button className="px-4 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
            View Interpretation
          </button>
        </div>

        {/* Content Section with Editor and Form */}
        <div className="flex gap-8">
          {/* Right Side Form */}
          <div className="w-96 space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1">Type:</label>
              <select
                name="type"
                value={testData.type}
                onChange={handleInputChange}
                aria-label="Type"
                className="w-full border rounded px-3 py-1.5 text-sm"
              >
                <option>Single field</option>
                <option>Multiple fields</option>
                <option>Text Editor</option>
              </select>
            </div>
            {testData.type === "Single field" && (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={tableData.name}
                    onChange={(e) =>
                      handleTableDataChange({ name: e.target.value })
                    }
                    aria-label="Name"
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1">
                    Test Method:
                  </label>
                  <select
                    name="testMethod"
                    value={tableData.testMethod}
                    onChange={(e) =>
                      handleTableDataChange({ testMethod: e.target.value })
                    }
                    aria-label="Test Method"
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  >
                    <option value="">Select Test Method</option>
                    <option value="pcr">PCR</option>
                    <option value="elisa">ELISA</option>
                    <option value="immunoassay">Immunoassay</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1">Field:</label>
                  <select
                    name="field"
                    value={tableData.field}
                    onChange={(e) =>
                      handleTableDataChange({ field: e.target.value })
                    }
                    aria-label="Field"
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  >
                    <option value="numeric">Numeric</option>
                    <option value="text">Text</option>
                    <option value="numeric_unbound">Numeric Unbound</option>
                    <option value="multiple_range">Multiple Range</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {tableData.field === "custom" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Custom:
                    </label>
                    <CustomDropdown
                      placeholder="Select or create options"
                      onOptionsChange={(options) =>
                        handleTableDataChange({
                          range: {
                            ...tableData.range,
                            custom: { ...tableData.range.custom, options },
                          },
                        })
                      }
                      onDefaultOptionChange={(defaultOption) =>
                        handleTableDataChange({
                          range: {
                            ...tableData.range,
                            custom: {
                              ...tableData.range.custom,
                              defaultOption,
                            },
                          },
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600 mb-1">Units:</label>
                  <input
                    type="text"
                    name="units"
                    value={tableData.units}
                    onChange={(e) =>
                      handleTableDataChange({ units: e.target.value })
                    }
                    aria-label="Units"
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                {tableData.field === "numeric" && (
                  <div className="flex gap-2 items-center justify-between">
                    <label className="text-sm text-gray-600 mb-1">Range:</label>
                    <input
                      type="text"
                      name="minRange"
                      value={tableData.range.numeric.minRange}
                      onChange={(e) =>
                        handleTableDataChange({
                          range: {
                            ...tableData.range,
                            numeric: {
                              ...tableData.range.numeric,
                              minRange: e.target.value,
                            },
                          },
                        })
                      }
                      aria-label="Minimum"
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="Minimum"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="text"
                      name="maxRange"
                      value={tableData.range.numeric.maxRange}
                      onChange={(e) =>
                        handleTableDataChange({
                          range: {
                            ...tableData.range,
                            numeric: {
                              ...tableData.range.numeric,
                              maxRange: e.target.value,
                            },
                          },
                        })
                      }
                      aria-label="Maximum"
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="Maximum"
                    />
                  </div>
                )}
                {tableData.field === "text" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Formula:
                    </label>
                    <textarea
                      name="textRange"
                      value={tableData.range.text}
                      onChange={(e) =>
                        handleTableDataChange({
                          range: { ...tableData.range, text: e.target.value },
                        })
                      }
                      aria-label="Formula"
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                  </div>
                )}
                {tableData.field === "numeric_unbound" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 mb-1">Range:</label>
                    <div className="flex gap-2 items-center justify-between">
                      <select
                        name="comparisonOperator"
                        value={
                          tableData.range.numeric_unbound.comparisonOperator
                        }
                        onChange={(e) =>
                          handleTableDataChange({
                            range: {
                              ...tableData.range,
                              numeric_unbound: {
                                ...tableData.range.numeric_unbound,
                                comparisonOperator: e.target.value,
                              },
                            },
                          })
                        }
                        aria-label="Comparison Operator"
                        className="w-full border rounded px-3 py-1.5 text-sm"
                      >
                        <option value="">Select Comparison Operator</option>
                        <option value="<=">less than equal to</option>
                        <option value="<">less than</option>
                        <option value=">">greater than</option>
                        <option value="=">equal to</option>
                        <option value=">=">greater than equal to</option>
                      </select>
                      <input
                        type="text"
                        name="value"
                        value={tableData.range.numeric_unbound.value}
                        onChange={(e) =>
                          handleTableDataChange({
                            range: {
                              ...tableData.range,
                              numeric_unbound: {
                                ...tableData.range.numeric_unbound,
                                value: e.target.value,
                              },
                            },
                          })
                        }
                        aria-label="Value"
                        className="w-full border rounded px-3 py-1.5 text-sm"
                        placeholder="Value"
                      />
                    </div>
                  </div>
                )}
                {tableData.field === "multiple_range" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Multiple Range:
                    </label>
                    <textarea
                      name="multipleRange"
                      value={tableData.range.multiple_range}
                      onChange={(e) =>
                        handleTableDataChange({
                          range: {
                            ...tableData.range,
                            multiple_range: e.target.value,
                          },
                        })
                      }
                      aria-label="Multiple Range"
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
                    Add Field
                  </button>
                  <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
                    Add Formula
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Dynamic Editor Section */}
          {renderEditor()}
        </div>
      </div>
    </div>
  );
};

export default EditTestPage;
