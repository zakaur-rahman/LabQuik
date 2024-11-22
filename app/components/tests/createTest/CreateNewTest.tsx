import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";
import { TestFieldsTable } from "../TestFieldsTable";
import { TextEditor } from "../TextEditor";
import CustomDropdown from "../CustomDropdown";
import CustomModal from "@/app/utils/CustomModal";
import Interpretation from "../../common/Interpretation";

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

interface TestData {
  department: string;
  testName: string;
  cost: number;
  testCode: string;
  sex: string;
  sampleType: string;
  age: string;
  suffix: string;
  finalData: (SingleFieldTableData | MultipleFieldsTableData)[];
}

const initialSingleFieldData: SingleFieldTableData = {
  name: "",
  fieldType: "Single field",
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

const initialMultipleFieldsData: MultipleFieldsTableData = {
  titleName: "",
  fieldType: "Multiple fields",
  finalMultipleFieldsData: [],
};

const initialTestData: TestData = {
  department: "",
  testName: "",
  cost: 0,
  testCode: "",
  sex: "Male",
  sampleType: "Serum",
  age: "default",
  suffix: "",
  finalData: [],
};

const CreateNewTest: React.FC = () => {
  const [singleFieldData, setSingleFieldData] = useState<SingleFieldTableData>(
    initialSingleFieldData
  );
  const [multipleFieldsData, setMultipleFieldsData] =
    useState<MultipleFieldsTableData>(initialMultipleFieldsData);
  const [testData, setTestData] = useState<TestData>(initialTestData);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isFormula, setIsFormula] = useState<boolean>(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] =
    useState(false);
  const [fieldType, setFieldType] = useState<string>("Single field");

  const [comments, setComments] = useState([
    { id: 1, text: "hello" },
    // Add more comments as needed
  ]);

  const handleSingleFieldDataChange = (
    newData: Partial<SingleFieldTableData>
  ) => {
    if (fieldType === "Single field") {
      setSingleFieldData((prevData) => {
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
    } else if (fieldType === "Multiple fields") {
      // For multiple fields, update singleFieldData for subfields
      setSingleFieldData((prevData) => ({ ...prevData, ...newData }));
    }
  };

  const handleTestDataChange = (newData: Partial<TestData>) => {
    setTestData((prevData) => ({ ...prevData, ...newData }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(testData.finalData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTestData((prevData) => ({ ...prevData, finalData: items }));
  };

  const handleDeleteField = (index: number) => {
    setTestData((prevData) => ({
      ...prevData,
      finalData: prevData.finalData.filter((_, i) => i !== index),
    }));
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
      setSingleFieldData(initialSingleFieldData);
      setMultipleFieldsData(initialMultipleFieldsData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle test data changes (including testName)
    if (
      name === "testName" ||
      name === "department" ||
      name === "cost" ||
      name === "testCode" ||
      name === "sex" ||
      name === "sampleType" ||
      name === "age" ||
      name === "suffix" ||
      name === "type"
    ) {
      handleTestDataChange({ [name]: value });
    }
  };

  const handleMultipleFieldsDataChange = (
    newData: Partial<MultipleFieldsTableData>
  ) => {
    setMultipleFieldsData((prevData) => ({ ...prevData, ...newData }));
  };
  // Separate handler for table data name
  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (fieldType === "Single field") {
      handleSingleFieldDataChange({ name: value });
    } else if (fieldType === "Multiple fields") {
      // If it's the title name input
      if (e.target.getAttribute('data-field') === 'titleName') {
        setMultipleFieldsData(prev => ({ ...prev, titleName: value }));
      } else {
        // If it's the subfield name input
        handleSingleFieldDataChange({ name: value });
      }
    }
  };


  //handle addField
  const handleAddField = () => {
    if (fieldType === "Single field" && singleFieldData.name) {
      setTestData((prevData) => ({
        ...prevData,
        finalData: [...prevData.finalData, { ...singleFieldData }],
      }));
      setSingleFieldData(initialSingleFieldData);
    } else if (fieldType === "Multiple fields" && multipleFieldsData.titleName) {
      setTestData((prevData) => ({
        ...prevData,
        finalData: [...prevData.finalData, { ...multipleFieldsData }],
      }));
      setMultipleFieldsData(initialMultipleFieldsData);
      setSingleFieldData(initialSingleFieldData);
    }
    setSelectedRowIndex(null);
  };

  const handleRowSelect = (field: SingleFieldTableData | MultipleFieldsTableData | null, index: number) => {
    if (field) {
      setSingleFieldData(field as SingleFieldTableData);
      setTestData((prevData) => ({ ...prevData, testName: (field as SingleFieldTableData).name }));
      setSelectedRowIndex(index);
    } else {
      setSingleFieldData(initialSingleFieldData);
      setTestData((prevData) => ({ ...prevData, testName: "" }));
      setSelectedRowIndex(null);
      setIsFormula(false);
    }
  };

  const resetForm = () => {
    setTestData(initialTestData);
    setSingleFieldData(initialSingleFieldData);
    setMultipleFieldsData(initialMultipleFieldsData);
    setSelectedRowIndex(null);
    setIsFormula(false);
  };

  const handleSubmit = () => {
    console.log("Saving test data:", { testData });
    // Add your save logic here
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      resetForm();
      setTestData((prevData) => ({ ...prevData, finalData: [] }));
    }
  };

  useEffect(() => {
    if (selectedRowIndex === null && singleFieldData.name) {
      const newIndex = testData.finalData.length;
      setTestData((prevData) => ({
        ...prevData,
        finalData: [...prevData.finalData, singleFieldData],
      }));
      setSelectedRowIndex(newIndex);
    }
  }, [singleFieldData, selectedRowIndex, testData.finalData.length]);

  const renderEditor = () => {
    switch (singleFieldData.fieldType) {
      case "Text Editor":
        return <TextEditor />;
      default:
        return (
          <TestFieldsTable
            testFields={testData.finalData}
            onDragEnd={() => onDragEnd}
            onDelete={handleDeleteField}
            onRowSelect={handleRowSelect}
            selectedRowIndex={selectedRowIndex}
            isFormula={isFormula}
            setFormula={setFormula}
          />
        );
    }
  };
  const handleFieldTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldType = e.target.value;
    setFieldType(fieldType);
    handleSingleFieldDataChange({ fieldType });
    setMultipleFieldsData({
      ...multipleFieldsData,
      fieldType,
    });
  };
  const setFormula = (value: boolean) => {
    setIsFormula(value);
  };

  const handleAddFormula = () => {
    console.log("Adding formula for row:", selectedRowIndex);
  };

  const handleInterpretationSave = (interpretationData: any) => {
    console.log("Saving interpretation:", interpretationData);
    setIsInterpretationModalOpen(false);
  };

  // Add new handler for subfields
  const handleAddSubField = () => {
    if (fieldType === "Multiple fields" && multipleFieldsData.titleName && singleFieldData.name) {
      const newSubField: SingleFieldTableData = { ...singleFieldData };
      setMultipleFieldsData((prevData) => ({
        ...prevData,
        finalMultipleFieldsData: [
          ...prevData.finalMultipleFieldsData,
          newSubField as unknown as MultipleFieldsTableData
        ],
      }));
      setSingleFieldData(initialSingleFieldData);
    }
  };

  return (
    <div className="bg-white p-6 text-black">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-medium text-gray-800">New Test</h1>
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
          <button
            onClick={() => setIsInterpretationModalOpen(true)}
            className="px-4 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
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
                name="fieldType"
                value={fieldType}
                onChange={handleFieldTypeChange}
                aria-label="Type"
                className="w-full border rounded px-3 py-1.5 text-sm"
              >
                <option>Single field</option>
                <option>Multiple fields</option>
                <option>Text Editor</option>
              </select>
            </div>
            {/* -------------------------------- Single Field -------------------------------- */}
            {fieldType === "Single field" && (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={singleFieldData.name}
                    onChange={(e)=>handleSingleFieldDataChange({name:e.target.value})}
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
                    value={singleFieldData.testMethod}
                    onChange={(e) =>
                      handleSingleFieldDataChange({
                        testMethod: e.target.value,
                      })
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
                    value={singleFieldData.field}
                    onChange={(e) =>
                      handleSingleFieldDataChange({ field: e.target.value })
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
                {singleFieldData.field === "custom" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Custom:
                    </label>
                    <CustomDropdown
                      placeholder="Select or create options"
                      onOptionsChange={(options) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            custom: {
                              ...singleFieldData.range.custom,
                              options,
                            },
                          },
                        })
                      }
                      onDefaultOptionChange={(defaultOption) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            custom: {
                              ...singleFieldData.range.custom,
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
                    value={singleFieldData.units}
                    onChange={(e) =>
                      handleSingleFieldDataChange({ units: e.target.value })
                    }
                    aria-label="Units"
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                {singleFieldData.field === "numeric" && (
                  <div className="flex gap-2 items-center justify-between">
                    <label className="text-sm text-gray-600 mb-1">Range:</label>
                    <input
                      type="text"
                      name="minRange"
                      value={singleFieldData.range.numeric.minRange}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            numeric: {
                              ...singleFieldData.range.numeric,
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
                      value={singleFieldData.range.numeric.maxRange}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            numeric: {
                              ...singleFieldData.range.numeric,
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
                {singleFieldData.field === "text" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Formula:
                    </label>
                    <textarea
                      name="textRange"
                      value={singleFieldData.range.text}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            text: e.target.value,
                          },
                        })
                      }
                      aria-label="Formula"
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                  </div>
                )}
                {singleFieldData.field === "numeric_unbound" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 mb-1">Range:</label>
                    <div className="flex gap-2 items-center justify-between">
                      <select
                        name="comparisonOperator"
                        value={
                          singleFieldData.range.numeric_unbound
                            .comparisonOperator
                        }
                        onChange={(e) =>
                          handleSingleFieldDataChange({
                            range: {
                              ...singleFieldData.range,
                              numeric_unbound: {
                                ...singleFieldData.range.numeric_unbound,
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
                        value={singleFieldData.range.numeric_unbound.value}
                        onChange={(e) =>
                          handleSingleFieldDataChange({
                            range: {
                              ...singleFieldData.range,
                              numeric_unbound: {
                                ...singleFieldData.range.numeric_unbound,
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
                {singleFieldData.field === "multiple_range" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Multiple Range:
                    </label>
                    <textarea
                      name="multipleRange"
                      value={singleFieldData.range.multiple_range}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
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
                  <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50"
                    onClick={handleAddField}
                    >
                    Add Field
                  </button>
                 {/*  {multipleFieldsData.titleName && (
                      <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
                        Add SubTest
                      </button>
                    )} */}
                  <button
                    onClick={() => handleAddFormula()}
                    className={`px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50 ${
                      isFormula ? "" : "hidden"
                    }`}
                  >
                    Add Formula
                  </button>
                </div>
              </>
            )}

            {/*-------------------------------- Multiple Fields --------------------------------*/}
            {fieldType === "Multiple fields" && (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1">Title Name:</label>
                  <input
                    type="text"
                    name="titleName"
                    data-field="titleName"
                    value={multipleFieldsData.titleName}
                    onChange={handleTableNameChange}
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1">SubTest Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={singleFieldData.name}
                    onChange={handleTableNameChange}
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1">
                    Test Method:
                  </label>
                  <select
                    name="testMethod"
                    value={singleFieldData.testMethod}
                    onChange={(e) =>
                      handleSingleFieldDataChange({
                        testMethod: e.target.value,
                      })
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
                    value={singleFieldData.field}
                    onChange={(e) =>
                      handleSingleFieldDataChange({ field: e.target.value })
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
                {singleFieldData.field === "custom" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Custom:
                    </label>
                    <CustomDropdown
                      placeholder="Select or create options"
                      onOptionsChange={(options) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            custom: {
                              ...singleFieldData.range.custom,
                              options,
                            },
                          },
                        })
                      }
                      onDefaultOptionChange={(defaultOption) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            custom: {
                              ...singleFieldData.range.custom,
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
                    value={singleFieldData.units}
                    onChange={(e) =>
                      handleSingleFieldDataChange({ units: e.target.value })
                    }
                    aria-label="Units"
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                {singleFieldData.field === "numeric" && (
                  <div className="flex gap-2 items-center justify-between">
                    <label className="text-sm text-gray-600 mb-1">Range:</label>
                    <input
                      type="text"
                      name="minRange"
                      value={singleFieldData.range.numeric.minRange}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            numeric: {
                              ...singleFieldData.range.numeric,
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
                      value={singleFieldData.range.numeric.maxRange}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            numeric: {
                              ...singleFieldData.range.numeric,
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
                {singleFieldData.field === "text" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Formula:
                    </label>
                    <textarea
                      name="textRange"
                      value={singleFieldData.range.text}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
                            text: e.target.value,
                          },
                        })
                      }
                      aria-label="Formula"
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                  </div>
                )}
                {singleFieldData.field === "numeric_unbound" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 mb-1">Range:</label>
                    <div className="flex gap-2 items-center justify-between">
                      <select
                        name="comparisonOperator"
                        value={
                          singleFieldData.range.numeric_unbound
                            .comparisonOperator
                        }
                        onChange={(e) =>
                          handleSingleFieldDataChange({
                            range: {
                              ...singleFieldData.range,
                              numeric_unbound: {
                                ...singleFieldData.range.numeric_unbound,
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
                        value={singleFieldData.range.numeric_unbound.value}
                        onChange={(e) =>
                          handleSingleFieldDataChange({
                            range: {
                              ...singleFieldData.range,
                              numeric_unbound: {
                                ...singleFieldData.range.numeric_unbound,
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
                {singleFieldData.field === "multiple_range" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1">
                      Multiple Range:
                    </label>
                    <textarea
                      name="multipleRange"
                      value={singleFieldData.range.multiple_range}
                      onChange={(e) =>
                        handleSingleFieldDataChange({
                          range: {
                            ...singleFieldData.range,
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
                  <button 
                    onClick={handleAddSubField}
                    className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50"
                  >
                    Add SubField
                  </button>
                  <button 
                    onClick={handleAddField}
                    className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50"
                  >
                    Add Field
                  </button>
                  {isFormula && (
                    <button
                      onClick={handleAddFormula}
                      className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50"
                    >
                      Add Formula
                    </button>
                  )}
                </div>
              </>
            )}
            {/* -------------------------------- Text Editor -------------------------------- */}
          </div>

          {/* Dynamic Editor Section */}
          {renderEditor()}
        </div>
      </div>
      {/* -------------------------------- Interpretation Modal -------------------------------- */}
      <CustomModal
        className="w-full max-w-4xl"
        open={isInterpretationModalOpen}
        setOpen={setIsInterpretationModalOpen}
        component={(props) => (
          <Interpretation
            onClose={() => setIsInterpretationModalOpen(false)}
            onSave={handleInterpretationSave}
            {...props}
          />
        )}
      />
    </div>
  );
};

export default CreateNewTest;
