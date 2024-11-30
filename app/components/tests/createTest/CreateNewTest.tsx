import React, { useState, useCallback } from "react";
import { PlusIcon, PencilIcon } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { TestFieldsTable } from "../TestFieldsTable";
import { TextEditor } from "../TextEditor";
import CustomModal from "@/app/utils/CustomModal";
import Interpretation from "../../common/Interpretation";
import TestBasicInfo from "./TestBasicInfo";
import TestFieldsForm from "./TestFieldsForm";
import { FieldTableData as TestFieldsData } from "./TestFieldsForm";

// Move types to separate types.ts file
interface Range {
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
}

interface FieldTableData {
  name: string;
  fieldType: string;
  field: string;
  units: string;
  formula: string;
  testMethod: string;
  range: Range;
}

interface MultipleFieldsTableData {
  titleName: string;
  fieldType: string;
  multipleFieldsData: FieldTableData[];
}

export interface TestData {
  finalData: (FieldTableData | MultipleFieldsTableData)[];
}

// Move validation schemas to separate validation.ts file
const validationSchemas = {
  singleField: yup.object({
    name: yup.string().required("Name is required"),
    fieldType: yup.string().required("Field type is required"),
    field: yup.string().required("Field is required"),
    units: yup.string().required("Units is required"),
    formula: yup.string().required("Formula is required"),
    testMethod: yup.string().required("Test method is required"),
    range: yup.object({
      numeric: yup.object({
        minRange: yup.string().required("Min range is required"),
        maxRange: yup.string().required("Max range is required"),
      }),
      text: yup.string().required("Text is required"),
      numeric_unbound: yup.object({
        comparisonOperator: yup
          .string()
          .required("Comparison operator is required"),
        value: yup.string().required("Value is required"),
      }),
      multiple_range: yup.string().required("Multiple range is required"),
      custom: yup.object({
        options: yup.array().of(yup.string()).required("Options are required"),
        defaultOption: yup.string().required("Default option is required"),
      }),
    }),
  }),
  basicInfo: yup.object({
    department: yup.string().required("Department is required"),
    testName: yup.string().required("Test name is required"),
    cost: yup.number().required("Cost is required"),
    testCode: yup.string().required("Test code is required"),
    sex: yup.string().required("Sex is required"),
    sampleType: yup.string().required("Sample type is required"),
    age: yup.string().required("Age is required"),
    suffix: yup.string().required("Suffix is required"),
  }),
};

// Move initial values to separate constants.ts file
const INITIAL_VALUES = {
  basicInfo: {
    department: "",
    testName: "",
    cost: 0,
    testCode: "",
    sex: "Male",
    sampleType: "Serum",
    age: "default",
    suffix: "",
  },
  fieldData: {
    name: "",
    fieldType: "Single field",
    field: "numeric",
    units: "",
    formula: "",
    testMethod: "",
    range: {
      numeric: { minRange: "", maxRange: "" },
      text: "",
      numeric_unbound: { comparisonOperator: "", value: "" },
      multiple_range: "",
      custom: { options: [], defaultOption: "" },
    },
  },
  multipleFields: {
    titleName: "",
    fieldType: "Multiple fields",
    multipleFieldsData: [],
  },

  finalData: [],
};

const CreateNewTest: React.FC = () => {
  const [multipleFieldsData, setMultipleFieldsData] =
    useState<MultipleFieldsTableData>(INITIAL_VALUES.multipleFields);
  const [testData, setTestData] = useState<TestData["finalData"]>(
    INITIAL_VALUES.finalData
  );
  const [isFormula, setIsFormula] = useState(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] =
    useState(false);
  const [fieldType, setFieldType] = useState("Single field");
  const [titleName, setTitleName] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(false);

  // Basic info form handling
  const basicInfoForm = useFormik({
    initialValues: INITIAL_VALUES.basicInfo,
    validationSchema: validationSchemas.basicInfo,
    onSubmit: () => {},
  });

  // Define handleFormSubmit first, without using fieldsForm
  const handleFormSubmit = useCallback(
    async (values: FieldTableData, formikHelpers: any) => {
      if (!isEditing) {
        setTestData((prev) => [...prev, values]);
        formikHelpers.resetForm();
      } else {
        // Handle updates...
        setTestData((prev) => {
          const newData = [...prev];
          if (selectedRowIndex === null) return prev;

          const currentField = newData[selectedRowIndex];

          newData[selectedRowIndex] = values;

          return newData;
        });

        setIsEditing(false);
        setSelectedRowIndex(null);
        formikHelpers.resetForm();
        setTitleName("");
        setFieldType("Single field");
      }
    },
    [fieldType, titleName, multipleFieldsData, isEditing, selectedRowIndex]
  );

  // Single fieldsForm definition
  const fieldsForm = useFormik({
    initialValues: INITIAL_VALUES.fieldData,
    onSubmit: handleFormSubmit,
  });

  // Memoized handlers
  const handleSave = useCallback(() => {
    console.log(testData);
  }, [testData]);

  const handleFieldTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newFieldType = e.target.value;
      setFieldType(newFieldType);
      fieldsForm.setFieldValue("fieldType", newFieldType);
      setMultipleFieldsData((prev) => ({ ...prev, fieldType: newFieldType }));
    },
    []
  );

  const handleInterpretationSave = useCallback((interpretationData: any) => {
    console.log("Saving interpretation:", interpretationData);
    setIsInterpretationModalOpen(false);
  }, []);

  const handleAddSubField = useCallback(async () => {
    if (fieldType === "Multiple fields" && titleName) {
      // First update multipleFieldsData
      setMultipleFieldsData((prev) => ({
        ...prev,
        titleName,
        multipleFieldsData: [...prev.multipleFieldsData, fieldsForm.values],
      }));

      // Then immediately update testData and get the new parent index
      setTestData((prev) => {
        const existingParentIndex = prev.findIndex(
          (item) => "multipleFieldsData" in item && item.titleName === titleName
        );

        if (existingParentIndex !== -1) {
          // Update existing parent
          const newData = [...prev];
          const parent = {
            ...newData[existingParentIndex],
          } as MultipleFieldsTableData;
          parent.multipleFieldsData = [
            ...parent.multipleFieldsData,
            fieldsForm.values,
          ];
          newData[existingParentIndex] = parent;

          // Select the existing parent row
          setTimeout(() => {
            setSelectedRowIndex(existingParentIndex);
            setSelectedChildIndex(null);
            setIsEditing(true);
          }, 0);

          return newData;
        } else {
          // Create new parent with first subfield
          const newParent: MultipleFieldsTableData = {
            titleName,
            fieldType: "Multiple fields",
            multipleFieldsData: [fieldsForm.values],
          };
          const newData = [...prev, newParent];

          // Select the new parent row
          setTimeout(() => {
            setSelectedRowIndex(newData.length - 1);
            setSelectedChildIndex(null);
            setIsEditing(true);
          }, 0);

          return newData;
        }
      });

      fieldsForm.resetForm();
    }
  }, [fieldType, titleName, fieldsForm]);

  const handleDelete = useCallback((parentIndex: number, childIndex?: number) => {
    setTestData(prevData => {
      const newData = [...prevData];
      
      // If childIndex is provided, delete the specific child
      if (typeof childIndex === 'number' && "multipleFieldsData" in newData[parentIndex]) {
        const parentField = { ...newData[parentIndex] } as MultipleFieldsTableData;
        const newChildren = [...parentField.multipleFieldsData];
        newChildren.splice(childIndex, 1);
        
        // If no more children, remove the parent as well
        if (newChildren.length === 0) {
          newData.splice(parentIndex, 1);
          // Reset form when deleting last child (parent gets deleted)
          resetFormState();
        } else {
          parentField.multipleFieldsData = newChildren;
          newData[parentIndex] = parentField;
          // Reset form if we're deleting the currently selected child
          if (selectedRowIndex === parentIndex && selectedChildIndex === childIndex) {
            resetFormState();
          }
        }
      } else {
        // Delete the entire parent (and all its children if any)
        newData.splice(parentIndex, 1);
        // Reset form when deleting parent or single field
        if (selectedRowIndex === parentIndex) {
          resetFormState();
        }
      }
      
      return newData;
    });
  }, [selectedRowIndex, selectedChildIndex]);

  // Add a helper function to reset all form-related state
  const resetFormState = useCallback(() => {
    setSelectedRowIndex(null);
    setSelectedChildIndex(null);
    setIsFormula(false);
    setIsEditing(false);
    fieldsForm.resetForm();
    setTitleName("");
    setFieldType("Single field");
  }, [fieldsForm]);

  // Add handler for row selection
  const handleRowSelect = useCallback((field: any, parentIndex: number, childIndex?: number) => {
    // First check if we're deselecting (field is null)
    if (field === null) {
      setSelectedRowIndex(null);
      setSelectedChildIndex(null);
      setIsFormula(false);
      setIsEditing(false);
      fieldsForm.resetForm();
      setTitleName("");
      setFieldType("Single field");
      return;
    }

    // If we're deselecting a child row (clicking on parent when child is selected)
    if ("multipleFieldsData" in field && selectedChildIndex !== null) {
      setSelectedChildIndex(null);
      setIsFormula(false);
      fieldsForm.resetForm();
      setFieldType("Multiple fields");
      setTitleName(field.titleName);
      return;
    }

    // If we have a valid field, proceed with selection logic
    setSelectedRowIndex(parentIndex);
    setSelectedChildIndex(childIndex ?? null);
    setIsFormula(false);
    setIsEditing(true);

    // Handle multiple fields parent row
    if ("multipleFieldsData" in field) {
      setFieldType("Multiple fields");
      setTitleName(field.titleName);
    } else {
      // Handle single field or child row
      setFieldType(childIndex !== undefined ? "Multiple fields" : "Single field");
      fieldsForm.setValues(field);
    }
  }, [fieldsForm]);

  // Add handler for formula toggle
  const handleFormulaToggle = useCallback((value: boolean) => {
    setIsFormula(value);
  }, []);

  // Add a new handler for updating subfields
  const handleUpdateSubField = useCallback(() => {
    if (selectedRowIndex !== null && selectedChildIndex !== null) {
      setTestData((prev) => {
        const newData = [...prev];
        const parentField = newData[
          selectedRowIndex
        ] as MultipleFieldsTableData;

        if ("multipleFieldsData" in parentField) {
          // Create a new array of subfields
          const updatedSubFields = [...parentField.multipleFieldsData];
          // Update the specific child with form values
          updatedSubFields[selectedChildIndex] = {
            ...fieldsForm.values,
            fieldType: "Multiple fields", // Ensure fieldType is preserved
          };

          // Create new parent object with updated children
          const updatedParent: MultipleFieldsTableData = {
            ...parentField,
            multipleFieldsData: updatedSubFields,
          };

          newData[selectedRowIndex] = updatedParent;
        }

        return newData;
      });

      // Don't reset the form or clear selections after update
      setIsEditing(true);
    }
  }, [selectedRowIndex, selectedChildIndex, fieldsForm.values]);

  const handleEditTitle = useCallback(() => {
    setEditTitle(!editTitle);
  }, [editTitle]);

  const handleUpdateTitle = useCallback((newTitle: string) => {
    setTestData(prevData => {
      const newData = [...prevData];
      if (selectedRowIndex !== null) {
        const field = newData[selectedRowIndex];
        if ('multipleFieldsData' in field) {
          newData[selectedRowIndex] = {
            ...field,
            titleName: newTitle
          };
        }
      }
      return newData;
    });
  }, [selectedRowIndex]);

  return (
    <div className="bg-white p-6 text-black">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-medium text-gray-800">New Test</h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-red-500 border border-red-500 rounded text-sm hover:bg-red-50">
              Reset Test
            </button>
            <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
              Report preview
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
              disabled={testData.length === 0 || titleName !== ""}
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>

        <TestBasicInfo
          values={basicInfoForm.values}
          handleChange={basicInfoForm.handleChange}
          handleBlur={basicInfoForm.handleBlur}
          touched={basicInfoForm.touched}
          errors={basicInfoForm.errors}
          setIsInterpretationModalOpen={setIsInterpretationModalOpen}
        />

        <div className="flex gap-8">
          <div className="w-96 space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1">Type:</label>
              <select
                title="fieldType"
                name="fieldType"
                value={fieldType}
                onChange={handleFieldTypeChange}
                className="w-full border rounded px-3 py-1.5 text-sm"
                disabled={titleName !== ""}
              >
                <option>Single field</option>
                <option>Multiple fields</option>
                <option>Text Editor</option>
              </select>
            </div>

            <TestFieldsForm
              testFieldsData={fieldsForm.values as TestFieldsData}
              handleTestFieldsDataChange={fieldsForm.handleChange}
              handleAddField={fieldsForm.handleSubmit}
              handleAddSubField={handleAddSubField}
              handleUpdateSubField={handleUpdateSubField}
              isFormula={isFormula}
              handleAddFormula={() => {}}
              errors={fieldsForm.errors}
              touched={fieldsForm.touched}
              fieldType={fieldType}
              titleName={titleName}
              setTitleName={setTitleName}
              isEditing={isEditing}
              selectedChildIndex={selectedChildIndex}
              selectedRowIndex={selectedRowIndex}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              handleUpdateTitle={handleUpdateTitle}
            />
          </div>
          <TestFieldsTable
            testFields={testData as TestData["finalData"]}
            onDelete={handleDelete}
            onDragEnd={() => {}}
            onRowSelect={handleRowSelect}
            selectedRowIndex={selectedRowIndex}
            selectedChildIndex={selectedChildIndex}
            setFormula={handleFormulaToggle}
            isFormula={isFormula}
          />
        </div>
      </div>

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
