import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';

interface TestBasicInfoProps {
  values: {
    department: string;
    testName: string;
    cost: number;
    testCode: string;
    sex: string;
    sampleType: string;
    age: string;
    suffix: string;
  };
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  setIsInterpretationModalOpen: (value: boolean) => void;
}

const TestBasicInfo: React.FC<TestBasicInfoProps> = ({
  values,
  handleChange,
  handleBlur,
  touched,
  errors,
  setIsInterpretationModalOpen,
}) => {
  return (
    <div>
      {/* Main Form Section */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-3">
          <label className="text-sm text-gray-600 mb-1">Department:</label>
          <select
            title="department"
            name="department"
            value={values.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          >
            <option value="">Select Department</option>
            <option value="MOLECULAR BIOLOGY">MOLECULAR BIOLOGY</option>
            <option value="BIOCHEMISTRY">BIOCHEMISTRY</option>
            <option value="HEMATOLOGY">HEMATOLOGY</option>
          </select>
          {touched.department && errors.department && (
            <div className="text-red-500 text-xs mt-1">{errors.department as string}</div>
          )}
        </div>

        <div className="col-span-5">
          <label className="text-sm text-gray-600 mb-1">Test Name:</label>
          <input
            type="text"
            name="testName"
            value={values.testName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          />
          {touched.testName && errors.testName && (
            <div className="text-red-500 text-xs mt-1">{errors.testName as string}</div>
          )}
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-600 mb-1">Cost:</label>
          <input
            type="number"
            name="cost"
            value={values.cost}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          />
          {touched.cost && errors.cost && (
            <div className="text-red-500 text-xs mt-1">{errors.cost as string}</div>
          )}
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-600 mb-1">Test Code:</label>
          <input
            type="text"
            name="testCode"
            value={values.testCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          />
          {touched.testCode && errors.testCode && (
            <div className="text-red-500 text-xs mt-1">{errors.testCode as string}</div>
          )}
        </div>
      </div>

      {/* Secondary Form Section */}
      <div className="flex gap-4 mb-8">
        <div className="w-48">
          <label className="text-sm text-gray-600 mb-1">By Sex:</label>
          <select
            title="sex"
            name="sex"
            value={values.sex}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Both">Both</option>
          </select>
          {touched.sex && errors.sex && (
            <div className="text-red-500 text-xs mt-1">{errors.sex as string}</div>
          )}
        </div>

        <div className="w-48">
          <label className="text-sm text-gray-600 mb-1">Sample type:</label>
          <select
            title="sampleType"
            name="sampleType"
            value={values.sampleType}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          >
            <option value="Serum">Serum</option>
            <option value="Plasma">Plasma</option>
            <option value="Whole Blood">Whole Blood</option>
            <option value="Urine">Urine</option>
          </select>
          {touched.sampleType && errors.sampleType && (
            <div className="text-red-500 text-xs mt-1">{errors.sampleType as string}</div>
          )}
        </div>

        <div className="w-48">
          <label className="text-sm text-gray-600 mb-1">Age:</label>
          <select
            title="age"
            name="age"
            value={values.age}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded px-3 py-1.5 text-sm"
          >
            <option value="default">Default</option>
            <option value="pediatric">Pediatric</option>
            <option value="adult">Adult</option>
            <option value="geriatric">Geriatric</option>
          </select>
          {touched.age && errors.age && (
            <div className="text-red-500 text-xs mt-1">{errors.age as string}</div>
          )}
        </div>

        <div className="flex-1">
          <label className="text-sm text-gray-600 mb-1">Suffix:</label>
          <input
            type="text"
            name="suffix"
            value={values.suffix}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Barcode Suffix"
            className="w-full border rounded px-3 py-1.5 text-sm"
          />
          {touched.suffix && errors.suffix && (
            <div className="text-red-500 text-xs mt-1">{errors.suffix as string}</div>
          )}
        </div>
        <div className="flex gap-4 mb-8 items-end">
          <button
            onClick={() => setIsInterpretationModalOpen(true)}
            className="px-4 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            View Interpretation
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestBasicInfo; 