import { Edit2 } from 'lucide-react';
import React, { useState } from 'react';
import { TestData } from '../../tests/types';
import { demoTestData } from '../constants';
import MedicalTestForm from './MedicalTestForm';
import * as yup from 'yup';

// Define the Patient type (should match the one in AllReports.tsx)
type Patient = {
  id: string;
};

// Define the props for the ViewReport component
interface ViewReportProps {
  patient: Patient;
  onClose: () => void;
}

const validationSchema = yup.object({
  testName: yup.string().required('Test name is required'),
});
// Button Component
const Button = ({ variant = 'default', size = 'default', className = '', children, ...props }: {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-200 bg-white hover:bg-gray-100',
    ghost: 'hover:bg-gray-100'
  };
  
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-10 px-8',
    icon: 'h-9 w-9'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Tab Component
const Tab = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);


// Main UltrasoundReportEditor Component
const ReportEditor: React.FC<ViewReportProps> = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('tests');
  const [showInterpretation, setShowInterpretation] = useState(false);


  return (
    <div className="w-full text-black mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-6">
          <span>Name: {patient?.details.name}</span>
          <span>Gender: {patient?.details.gender}</span>
          <span>Age: {patient?.details.age}</span>
          <span className="text-green-500">Status: {patient?.status}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Print</Button>
          <Button variant="secondary">Save</Button>
          <Button variant="outline">View more</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="border rounded-lg bg-white shadow-sm p-4">
        {/* Tabs */}
        <MedicalTestForm testData={demoTestData} />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button variant="secondary">Note on Report</Button>
          <Button variant="outline">Add Issue for technician</Button>
        </div>
        <Button>Approve & Print</Button>
      </div>
    </div>
  );
};

export default ReportEditor;
