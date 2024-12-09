import React, { useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Printer, Send, Download } from "lucide-react";
import PatientInformation from "./prepare-report/PatientInformation";
import ReportTable from "./prepare-report/ReportTable";
import HeaderImage from "@/public/assests/header.png";
import FooterImage from "@/public/assests/footer.png";
import TestInterpretation from "./prepare-report/TestInterpretation";
import Sample from "./Sample";
import { downloadReport, printReport, sendReport } from "./utils/reportActions";
import { PDFViewer } from "@react-pdf/renderer";

interface TestResult {
  department: string;
  testName: string;
  showInterpretation: boolean;
  interpretation: string;
  fields: Array<{
    test: string;
    value?: string | number;
    unit?: string;
    reference?: string;
    flag?: "H" | "L" | "D";
    isParent?: boolean;
    isChild?: boolean;
  }>;
}

interface Range {
  numeric?: { min: string; max: string };
  numeric_unbound?: { operator: string; value: string };
  text?: string;
  multiple_range?: string;
  custom?: { defaultOption: string };
}

interface TestField {
  name: string;
  observedValue: string;
  units?: string;
  range?: Range;
  titleName?: string;
  multipleFieldsData?: Array<{
    name: string;
    observedValue: string;
    units?: string;
    range?: Range;
  }>;
}

interface ReportOptions {
  showHeaderFooter: boolean;
  reportType: 'single' | 'combined';
  selectedTests: string[];
}

// Update the component to accept props
interface ApproveAndPrintReportProps {
  reportData: any;
  onClose: () => void;
}

const PrintWrap: React.FC<ApproveAndPrintReportProps> = ({
  reportData,
  onClose,
}) => {
  // State management with proper initialization
  const [settings, setSettings] = useState({
    showHeaderFooter: true,
    separateTestReports: false
  });

  const [selectedTests, setSelectedTests] = useState<string[]>(() => 
    reportData?.tests?.map((test: any) => test.testName) || []
  );
  const [patientDetails, setPatientDetails] = useState<any>({
    firstName   : reportData?.firstName,
    lastName    : reportData?.lastName,
    gender      : reportData?.gender,
    age         : reportData?.age,
    ageType     : reportData?.ageType,
    patientId   : reportData?.patientId,
    designation : reportData?.designation,
  });
  
console.log("reportData", reportData);
  // Memoized test results transformation
  const testResults = useMemo(() => 
    transformTestResults(reportData?.tests || []), 
    [reportData]
  );

  // Memoized filtered results
  const filteredTestResults = useMemo(() => 
    testResults.filter((test: TestResult) => selectedTests.includes(test.testName)),
    [testResults, selectedTests]
  );

  // Handlers
  const handleSettingChange = (key: keyof typeof settings) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleTestSelection = useCallback((testName: string) => {
    setSelectedTests(prev => {
      // Prevent deselecting the last test
      if (prev.length === 1 && prev.includes(testName)) {
        return prev;
      }
      return prev.includes(testName) 
        ? prev.filter(name => name !== testName)
        : [...prev, testName];
    });
  }, []);

  const handleAction = useCallback(async (action: 'download' | 'print' | 'send') => {
    try {
      const options: ReportOptions = {
        showHeaderFooter: settings.showHeaderFooter,
        reportType: settings.separateTestReports ? 'combined' : 'single',
        selectedTests
      };

      switch (action) {
        case 'download':
          await downloadReport(reportData, options);
          break;
        case 'print':
          await printReport(reportData, options);
          break;
        case 'send':
          const blob = await sendReport(reportData, options);
          console.log('Ready to send blob:', blob);
          break;
      }
    } catch (error) {
      console.error(`${action} failed:`, error);
    }
  }, [reportData, settings, selectedTests]);

  return (
    <div className="relative h-[95vh] flex flex-col bg-white text-black">
      {/* Controls Header */}
      <div className="sticky top-0 z-10 bg-white border-b no-print">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <ToggleSwitch
              label="Include Header & Footer"
              checked={settings.showHeaderFooter}
              onChange={handleSettingChange('showHeaderFooter')}
            />
            <ToggleSwitch
              label="Separate Test Reports"
              checked={settings.separateTestReports}
              onChange={handleSettingChange('separateTestReports')}
            />
          </div>
          <div className="flex gap-4">
            <ActionButton icon={Send} label="Send" onClick={() => handleAction('send')} />
            <ActionButton icon={Printer} label="Print" onClick={() => handleAction('print')} />
            <ActionButton icon={Download} label="Download" onClick={() => handleAction('download')} />
          </div>
        </div>

        <TestSelection
          tests={testResults}
          selectedTests={selectedTests}
          onTestSelection={handleTestSelection}
        />
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-y-auto">
        <PDFViewer style={{width: '100%', height: '700px'}}>
          <Sample 
            reportData={filteredTestResults}
            showHeaderFooter={settings.showHeaderFooter}
            selectedTests={selectedTests}
            separateTestReports={settings.separateTestReports}
            patientDetails={patientDetails}
          />
        </PDFViewer>
      </div>
    </div>
  );
};

// Helper Components
const ToggleSwitch = ({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
  </label>
);

const ActionButton = ({ icon: Icon, label, onClick }: {
  icon: any;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    <Icon size={16} />
    {label}
  </button>
);

// Separate the test selection component
const TestSelection: React.FC<{
  tests: any[];
  selectedTests: string[];
  onTestSelection: (testName: string) => void;
}> = React.memo(({ tests, selectedTests, onTestSelection }) => (
  <div className="px-4 pb-4">
    <h3 className="font-medium mb-3">Select Tests to Include:</h3>
    <div className="grid grid-cols-3 gap-4">
      {tests.map((test: any) => (
        <label 
          key={test.testName} 
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            checked={selectedTests.includes(test.testName)}
            onChange={() => onTestSelection(test.testName)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm">{test.testName}</span>
        </label>
      ))}
    </div>
  </div>
));

// Helper functions
const getReference = (range: any) => {
  if (!range) return "-";

  if (range.numeric) {
    return `${range.numeric.min} - ${range.numeric.max}`;
  }
  if (range.numeric_unbound) {
    return `${range.numeric_unbound.operator} ${range.numeric_unbound.value}`;
  }
  if (range.text) {
    return range.text;
  }
  if (range.multiple_range) {
    return range.multiple_range;
  }
  if (range.custom?.defaultOption) {
    return range.custom.defaultOption;
  }
  return "-";
};

const getFlagFromValue = (
  value: any,
  range: any
): "H" | "L" | "D" | undefined => {
  if (!value || !range) return undefined;

  if (range.custom) {
    if (range.custom.defaultOption.toLowerCase() !== value.toLowerCase()) {
      return "D";
    }
  }
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return undefined;

  if (range.numeric) {
    if (numValue > parseFloat(range.numeric.max)) return "H";
    if (numValue < parseFloat(range.numeric.min)) return "L";
  }

  if (range.numeric_unbound) {
    const threshold = parseFloat(range.numeric_unbound.value);
    const operator = range.numeric_unbound.operator;

    if ((operator === "<" || operator === "<=") && numValue >= threshold)
      return "H";
    if ((operator === ">" || operator === ">=") && numValue <= threshold)
      return "L";
  }

  return undefined;
};

const transformTestResults = (tests: any[]) => {
  if (!tests?.length) return [];

  return tests.map(test => ({
    department: test.department,
    testName: test.testName,
    showInterpretation: test.showInterpretation,
    interpretation: test.interpretation,
    fields: test.finalData.flatMap((item: TestField) => {
      // Handle multiple fields
      if ("multipleFieldsData" in item && item.multipleFieldsData) {
        return [
          // Parent field (title)
          { test: item.titleName, isParent: true },
          // Child fields (indented)
          ...item.multipleFieldsData.map(subField => ({
            test: subField.name,
            value: subField.observedValue,
            unit: subField.units,
            reference: getReference(subField.range),
            flag: getFlagFromValue(subField.observedValue, subField.range),
            isChild: true,
          })),
        ];
      }

      // Handle single fields
      return [{
        test: item.name,
        value: item.observedValue,
        unit: item.units,
        reference: getReference(item.range),
        flag: getFlagFromValue(item.observedValue, item.range),
      }];
    }),
  }));
};

export default PrintWrap;
