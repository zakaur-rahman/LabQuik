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

interface TestData {
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
        comparisonOperator: yup.string().required("Comparison operator is required"),
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
  test: {
    finalData: [],
  },
};

const CreateNewTest: React.FC = () => {
  const [multipleFieldsData, setMultipleFieldsData] = useState<MultipleFieldsTableData>(INITIAL_VALUES.multipleFields);
  const [testData, setTestData] = useState<TestData>(INITIAL_VALUES.test);
  const [isFormula, setIsFormula] = useState(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] = useState(false);
  const [fieldType, setFieldType] = useState("Single field");
  const [titleName, setTitleName] = useState("");

  // Basic info form handling
  const basicInfoForm = useFormik({
    initialValues: INITIAL_VALUES.basicInfo,
    validationSchema: validationSchemas.basicInfo,
    onSubmit: () => {},
  });

  // Fields form handling
  const fieldsForm = useFormik({
    initialValues: INITIAL_VALUES.fieldData,
    onSubmit: useCallback(async (values: FieldTableData) => {
      if (fieldType === "Single field") {
        setTestData(prev => ({
          ...prev,
          finalData: [...prev.finalData, values],
        }));
        fieldsForm.resetForm();
      } else if (fieldType === "Multiple fields" && titleName) {
        // Create the new state first
        const updatedMultipleFieldsData = {
          titleName,
          fieldType: "Multiple fields",
          multipleFieldsData: [...multipleFieldsData.multipleFieldsData, values]
        };

        // Update testData with the new complete state
        setTestData(prev => ({
          ...prev,
          finalData: [...prev.finalData, updatedMultipleFieldsData],
        }));
        
        // Reset everything
        setMultipleFieldsData(INITIAL_VALUES.multipleFields);
        fieldsForm.resetForm();
        setTitleName("");
        setFieldType("Single field");
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldType, titleName, multipleFieldsData]),
  });

  // Memoized handlers
  const handleSave = useCallback(() => {
    console.log(testData);
  }, [testData]);

  const handleFieldTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFieldType = e.target.value;
    setFieldType(newFieldType);
    fieldsForm.setFieldValue("fieldType", newFieldType);
    setMultipleFieldsData(prev => ({ ...prev, fieldType: newFieldType }));
  }, []);

  const handleInterpretationSave = useCallback((interpretationData: any) => {
    console.log("Saving interpretation:", interpretationData);
    setIsInterpretationModalOpen(false); 
  }, []);

  const handleAddSubField = useCallback(async () => {
    if (fieldType === "Multiple fields" && titleName) {
      setMultipleFieldsData(prev => {
        const newState = {
          ...prev,
          titleName,
          multipleFieldsData: [...prev.multipleFieldsData, fieldsForm.values],
        };
        console.log("Updated multipleFieldsData:", newState);
        return newState;
      });
      fieldsForm.resetForm();
    }
  }, [fieldType, titleName, fieldsForm]);

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
              disabled={testData.finalData.length === 0 || titleName !== ""}
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
              isFormula={isFormula}
              handleAddFormula={() => {}}
              errors={fieldsForm.errors}
              touched={fieldsForm.touched}
              fieldType={fieldType}
              titleName={titleName}
              setTitleName={setTitleName}
            />
          </div>
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