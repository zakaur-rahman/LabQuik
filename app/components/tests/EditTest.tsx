import React, { useState } from "react";
import { Trash2Icon, PlusIcon, PencilIcon } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";
import { TestFieldsTable } from "./TestFieldsTable";
import { MultipleFieldsEditor } from "./MultipleFieldsEditor";
import { TextEditor } from "./TextEditor";

type EditorType = "Single field" | "Multiple fields" | "Text Editor";

interface TestField {
  name: string;
  field: string;
  units: string;
  range: string;
  formula: string;
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
  method: string;
  field: string;
  units: string;
  minRange: string;
  maxRange: string;
}

interface EditTestProps {
  testId: number;
}

const EditTestPage: React.FC<EditTestProps> = ({ testId }) => {
  // State for the test fields (table data)
  const [testFields, setTestFields] = useState<TestField[]>([
    {
      name: "HIV VIRAL LOAD",
      field: "text",
      units: "Copies/ml",
      range: "",
      formula: "",
    },
    {
      name: "CD4 COUNT",
      field: "number",
      units: "cells/µL",
      range: "500-1500",
      formula: "",
    },
    {
      name: "HIV ANTIBODY",
      field: "select",
      units: "",
      range: "Positive,Negative",
      formula: "",
    },
  ]);

  // State for form data
  const [formData, setFormData] = useState<TestData>({
    department: "MOLECULAR BIOLOGY",
    testName: "HIV VIRAL LOAD",
    cost: 0,
    testCode: "HIV",
    sex: "Male",
    sampleType: "Serum",
    age: "default",
    suffix: "",
    type: "Single field",
    method: "",
    field: "text",
    units: "Copies/ml",
    minRange: "",
    maxRange: "",
  });

  // Handle drag and drop in the table
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(testFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTestFields(items);
  };

  // Handle deleting a field from the table
  const handleDeleteField = (index: number) => {
    setTestFields((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Saving test data:", { formData, testFields });
    // Add your save logic here
  };

  // Handle resetting the form
  const handleReset = () => {
    // Add confirmation dialog before resetting
    if (window.confirm("Are you sure you want to reset all fields?")) {
      setFormData({
        department: "MOLECULAR BIOLOGY",
        testName: "",
        cost: 0,
        testCode: "",
        sex: "Male",
        sampleType: "Serum",
        age: "default",
        suffix: "",
        type: "Single field",
        method: "",
        field: "text",
        units: "",
        minRange: "",
        maxRange: "",
      });
      setTestFields([]);
    }
  };

  // Render the appropriate editor based on type selection
  const renderEditor = () => {
    switch (formData.type) {
      case "Single field":
        return (
          <TestFieldsTable
            testFields={testFields}
            onDragEnd={onDragEnd}
            onDelete={handleDeleteField}
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
              value={formData.department}
              onChange={handleInputChange}
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
              value={formData.testName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1">Cost:</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 mb-1">Test Code:</label>
            <input
              type="text"
              name="testCode"
              value={formData.testCode}
              onChange={handleInputChange}
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
              value={formData.sex}
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
              value={formData.sampleType}
              onChange={handleInputChange}
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
              value={formData.age}
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
              value={formData.suffix}
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
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
              >
                <option>Single field</option>
                <option>Multiple fields</option>
                <option>Text Editor</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1">Name:</label>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1">Test Method:</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
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
                value={formData.field}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1">Units:</label>
              <input
                type="text"
                name="units"
                value={formData.units}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex gap-2 items-center justify-between">
              <label className="text-sm text-gray-600 mb-1">Range:</label>
              <input
                type="text"
                name="minRange"
                value={formData.minRange}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
                placeholder="Minimum"
              />
              <span className="text-gray-400">to</span>
              <input
                type="text"
                name="maxRange"
                value={formData.maxRange}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
                placeholder="Maximum"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
                Add Field
              </button>
              <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
                Add Formula
              </button>
            </div>
          </div>

          {/* Dynamic Editor Section */}
          {renderEditor()}
        </div>
      </div>
    </div>
  );
};

export default EditTestPage;
