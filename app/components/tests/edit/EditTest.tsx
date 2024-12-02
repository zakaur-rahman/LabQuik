import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon, PencilIcon } from "lucide-react";
import { TestFieldsTable } from "../TestFieldsTable";
import CustomModal from "@/app/utils/CustomModal";
import AddComment from "../../common/AddComment";
import ViewComment from "../../common/ViewComment";
import Interpretation from "../../common/Interpretation";
import TestBasicInfo from "../TestBasicInfo";
import TestFieldsForm from "../TestFieldsForm";
import { FieldTableData as TestFieldsData } from "../TestFieldsForm";
import { useFormik } from "formik";
import { useGetTestQuery } from "@/redux/features/test/testApi";
import { FieldTableData, MultipleFieldsTableData, TestData } from "../types";
import { validationSchemas, INITIAL_VALUES, INITIAL_FIELD_VALUES } from "../constants";

interface EditTestProps {
  testId: number;
}

const EditTestPage: React.FC<EditTestProps> = ({ testId }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isViewCommentModalOpen, setIsViewCommentModalOpen] = useState(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] =
    useState(false);
  const [multipleFieldsData, setMultipleFieldsData] =
    useState<MultipleFieldsTableData>(INITIAL_VALUES.multipleFields);
  const [testData, setTestData] = useState<TestData["finalData"]>(
    INITIAL_VALUES.finalData
  );
  const [isFormula, setIsFormula] = useState(false);
  const [fieldType, setFieldType] = useState("Single field");
  const [titleName, setTitleName] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Basic info form handling
  const basicInfoForm = useFormik({
    initialValues: INITIAL_VALUES.basicInfo,
    validationSchema: validationSchemas.basicInfo,
    onSubmit: () => {},
  });

  // Define handleFormSubmit first, without using fieldsForm for single field
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

          //const currentField = newData[selectedRowIndex];

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


  const { data: test, isLoading, isError } = useGetTestQuery(testId);
  useEffect(() => {
    if (test) {
      console.log(test);
    }
  }, [test]);

  // Single fieldsForm definition
  const fieldsForm = useFormik({
    initialValues: INITIAL_VALUES.fieldData,
    onSubmit: handleFormSubmit,
  });

  // Handle save
  const handleSave = useCallback(() => {
    const finalData = {
      ...basicInfoForm.values,
      finalData: testData,
    };
    console.log(finalData);
  }, [testData]);

  // Handle field type change
  const handleFieldTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newFieldType = e.target.value;
      setFieldType(newFieldType);
      fieldsForm.setFieldValue("fieldType", newFieldType);
      setMultipleFieldsData((prev) => ({ ...prev, fieldType: newFieldType }));
    },
    []
  );

  // Add subfield
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

  // Delete parent or child
  const handleDelete = useCallback(
    (parentIndex: number, childIndex?: number) => {
      setTestData((prevData) => {
        const newData = [...prevData];

        // If childIndex is provided, delete the specific child
        if (
          typeof childIndex === "number" &&
          "multipleFieldsData" in newData[parentIndex]
        ) {
          const parentField = {
            ...newData[parentIndex],
          } as MultipleFieldsTableData;
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
            if (
              selectedRowIndex === parentIndex &&
              selectedChildIndex === childIndex
            ) {
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
    },
    [selectedRowIndex, selectedChildIndex]
  );

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
  const handleRowSelect = useCallback(
    (field: any, parentIndex: number, childIndex?: number) => {
      // Deselecting (field is null)
      if (field === null) {
        setSelectedRowIndex(null);
        setSelectedChildIndex(null);
        setIsFormula(false);
        setIsEditing(false);
        // Reset form with initial values including range
        fieldsForm.resetForm({
          values: INITIAL_FIELD_VALUES,
        });
        setTitleName("");
        setFieldType("Single field");
        return;
      }

      // If we're deselecting a child row (clicking on parent when child is selected)
      if ("multipleFieldsData" in field && selectedChildIndex !== null) {
        setSelectedChildIndex(null);
        setIsFormula(false);
        // Reset form with initial values including range
        fieldsForm.resetForm({
          values: INITIAL_FIELD_VALUES,
        });
        setFieldType("Multiple fields");
        setTitleName(field.titleName);
        return;
      }

      // Rest of the function remains the same...
      setSelectedRowIndex(parentIndex);
      setSelectedChildIndex(childIndex ?? null);
      setIsFormula(false);
      setIsEditing(true);

      if ("multipleFieldsData" in field) {
        setFieldType("Multiple fields");
        setTitleName(field.titleName);
      } else {
        setFieldType(
          childIndex !== undefined ? "Multiple fields" : "Single field"
        );
        // Ensure custom range data is properly structured
        const formValues = {
          ...field,
          range: {
            ...field.range,
            custom: field.range.custom || { options: [], defaultOption: "" },
          },
        };
        fieldsForm.setValues(formValues);
      }
    },
    [fieldsForm]
  );

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

  // Update title for multiple fields
  const handleUpdateTitle = useCallback(
    (newTitle: string) => {
      setTestData((prevData) => {
        const newData = [...prevData];
        if (selectedRowIndex !== null) {
          const field = newData[selectedRowIndex];
          if ("multipleFieldsData" in field) {
            newData[selectedRowIndex] = {
              ...field,
              titleName: newTitle,
            };
          }
        }
        return newData;
      });
    },
    [selectedRowIndex]
  );

  // Reset test
  const handleResetTest = useCallback(() => {
    // Reset all form and state values in a single batch
    Promise.all([
      basicInfoForm.resetForm({ values: INITIAL_VALUES.basicInfo }),
      setTestData([]),
      setMultipleFieldsData(INITIAL_VALUES.multipleFields),
      resetFormState(),
    ]);
  }, [basicInfoForm, resetFormState]);

  const [comments, setComments] = useState([
    { id: 1, text: "hello" },
    // Add more comments as needed
  ]);

  const handleSubmit = () => {
    //console.log("Saving test data:", { testData, testFields, tableData });
    // Add your save logic here
  };

  const handleCommentSave = (comment: string) => {
    console.log("Saving comment:", comment);
    setIsCommentModalOpen(false);
  };

  const handleEditComment = (id: number) => {
    console.log("Editing comment:", id);
    // Add your edit logic here
  };

  const handleRemoveComment = (id: number) => {
    console.log("Removing comment:", id);
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleInterpretationSave = (interpretationData: any) => {
    console.log("Saving interpretation:", interpretationData);
    setIsInterpretationModalOpen(false);
  };

  return (
    <div className="bg-white p-6 text-black">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-medium text-gray-800">Edit Test</h1>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-red-500 border border-red-500 rounded text-sm hover:bg-red-50"
              onClick={() => setIsResetModalOpen(true)}
            >
              Reset Test
            </button>
            <button className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50">
              Report preview
            </button>
            <button
              onClick={() => setIsViewCommentModalOpen(true)}
              className="px-3 py-1.5 text-blue-500 border border-blue-500 rounded text-sm hover:bg-blue-50"
            >
              View Comments
            </button>
            <button
              onClick={() => setIsCommentModalOpen(true)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              <PlusIcon className="inline-block w-4 h-4 mr-1" />
              Add Comment
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Update Test
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
          showInterpretation={true}
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

      <CustomModal
        className="w-full max-w-3xl"
        open={isViewCommentModalOpen}
        setOpen={setIsViewCommentModalOpen}
        component={(props) => (
          <ViewComment
            comments={comments}
            onClose={() => setIsViewCommentModalOpen(false)}
            onEdit={handleEditComment}
            onRemove={handleRemoveComment}
            {...props}
          />
        )}
      />

      <CustomModal
        open={isCommentModalOpen}
        setOpen={setIsCommentModalOpen}
        component={(props) => (
          <AddComment
            onClose={() => setIsCommentModalOpen(false)}
            onSave={handleCommentSave}
            {...props}
          />
        )}
      />
      <CustomModal
        open={isResetModalOpen}
        setOpen={setIsResetModalOpen}
        isConfirmation={true}
        title="Reset Test"
        message="Are you sure you want to reset the test? This action cannot be undone."
        onConfirm={handleResetTest}
      />
    </div>
  );
};

export default EditTestPage;
