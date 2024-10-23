import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextEditor from '../../common/TextEditor';

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

// Checkbox Component
const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="w-4 h-4 border border-gray-300 rounded"
        checked={checked}
        onChange={onChange}
      />
      {checked && (
        <Check className="absolute top-0 left-0 w-4 h-4 text-blue-500 pointer-events-none" />
      )}
    </div>
    {label}
  </label>
);

// Main UltrasoundReportEditor Component
const UltrasoundReportEditor = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [showInterpretation, setShowInterpretation] = useState(false);

  return (
    <div className="w-full text-black mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-6">
          <span>Name: Arsalan Ahmad</span>
          <span>Gender: male</span>
          <span>Age: 12 year</span>
          <span className="text-green-500">Status: Completed</span>
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
        <div className="flex border-b mb-4">
          {['Tests', 'Observed Value', 'Units', 'Normal Range'].map(tab => (
            <Tab
              key={tab}
              active={activeTab === tab.toLowerCase()}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </Tab>
          ))}
        </div>

        <div className="mb-4 font-medium">
          ULTRASONOGRAPHY OF ARTERIAL SYSTEM OF BOTH LOWER LIMBS PERFORMED
        </div>

        <RichTextEditor />

        <div className="flex justify-between items-center mt-4">
          <Checkbox
            label="Show Interpretation"
            checked={showInterpretation}
            onChange={(e) => setShowInterpretation(e.target.checked)}
          />
          <Button variant="outline" size="sm">+ Comments</Button>
        </div>
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

export default UltrasoundReportEditor;
