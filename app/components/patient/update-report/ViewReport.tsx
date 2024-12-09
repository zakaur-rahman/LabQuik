"use client";
import React, { useEffect, useState } from "react";
import MedicalTestForm from "./MedicalTestForm";
import { usePatientDetailsForReportQuery } from "@/redux/features/patient/patientReport";
import CustomModal from "@/app/utils/CustomModal";
import ApproveAndPrintReport from "./ApproveAndPrintReport";
import PrintWrap from "./PrintWrap";

interface ViewReportProps {
  patient: string;
  onClose: () => void;
}

const ReportEditor: React.FC<ViewReportProps> = ({ patient }) => {
  // State
  const [activeTab, setActiveTab] = useState("tests");
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [showInterpretations, setShowInterpretations] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch patient data
  const { data: patientData } = usePatientDetailsForReportQuery(patient);

  useEffect(() => {
    setPatientDetails(patientData?.data);
  }, [patientData]);

  // Form handlers
  const handleObservedValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string,
    testCode: string
  ) => {
    const key = `${testCode}-${fieldName}`;
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInterpretationToggle = (testCode: string) => {
    setShowInterpretations((prev) => ({
      ...prev,
      [testCode]: !prev[testCode],
    }));
  };

  const formatFormDataForSubmission = () => {
    const formattedTests = patientDetails?.tests?.map((test: any) => ({
      ...test,
      showInterpretation: showInterpretations[test.testCode] || false,
      finalData: test.finalData.map((item: any) => {
        if ("fieldType" in item && item.fieldType === "Single field") {
          return {
            ...item,
            observedValue:
              formData[`${test.testCode}-${(item as any).name}`] || "",
          };
        } else if ("multipleFieldsData" in item) {
          return {
            ...item,
            multipleFieldsData: item.multipleFieldsData.map((subField: any) => ({
              ...subField,
              observedValue:
                formData[`${test.testCode}-${subField.name}`] || "",
            })),
          };
        }
        return item;
      }),
    }));

    return {
      ...patientDetails,
      status: "ongoing",
      tests: formattedTests || [],
    };
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formattedData = formatFormDataForSubmission();
    console.log("Formatted Data:", formattedData);
    // Here you can add your API call to save the data
  };

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const formattedData = formatFormDataForSubmission();
      setPreviewData(formattedData);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  // Modal wrapper component
  const PreviewWrapper = ({ setOpen }: { setOpen: (open: boolean) => void }) => (
    <div className="w-full h-full">
      <ApproveAndPrintReport 
        reportData={previewData}
        onClose={() => setOpen(false)}
      />
    </div>
  );
  const PrintWrapper = ({ setOpen }: { setOpen: (open: boolean) => void }) => (
    <div className="w-full h-full">
      <PrintWrap
        reportData={previewData}
        onClose={() => setOpen(false)}
      />
    </div>
  );

  const handlePrint = () => {
    try {
      const formattedData = formatFormDataForSubmission();
      setPreviewData(formattedData);
      setShowPrint(true);
    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  return (
    <div className="w-full text-black mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center my-4 border border-gray-200 p-4 rounded-lg">
        <div className="flex gap-6">
          <span>
            <strong className="text-md">Name:</strong>{" "}
            {patientDetails?.firstName} {patientDetails?.lastName}
          </span>
          <span>
            <strong className="text-md">Gender:</strong> {patientDetails?.gender}
          </span>
          <span>
            <strong className="text-md">Age:</strong> {patientDetails?.age}
          </span>
          <span className="">
            <strong className="text-md">Status:</strong> {patientDetails?.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleFormSubmit}>Save</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md" type="button" onClick={handlePreview}>
            Report Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="border rounded-lg bg-white shadow-sm">
        <MedicalTestForm
          testData={patientDetails?.tests}
          patientInfo={{
            patientId: patientDetails?.patientId,
            firstName: patientDetails?.firstName,
            lastName: patientDetails?.lastName,
            age: patientDetails?.age,
            ageType: patientDetails?.ageType,
            gender: patientDetails?.gender,
          }}
          formRef={setFormRef}
          formData={formData}
          showInterpretations={showInterpretations}
          onObservedValueChange={handleObservedValueChange}
          onInterpretationToggle={handleInterpretationToggle}
          onSubmit={handleFormSubmit}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md">Note on Report</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md">Add Issue for technician</button>
        </div>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={handlePrint}>Approve and Print</button>
      </div>

      <CustomModal
        open={showPreview}
        setOpen={setShowPreview}
        component={PreviewWrapper}
        className="w-[800px] max-h-[95vh] overflow-y-hidden"
      />
      <CustomModal
        open={showPrint}
        setOpen={setShowPrint}
        component={PrintWrapper}  
        className="w-[900px] max-h-[95vh] overflow-y-hidden"
      />
    </div>
  );
};

export default ReportEditor;
