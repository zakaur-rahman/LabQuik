import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Import the X icon from lucide-react

interface QuotationFormProps {
  onClose: () => void; // Add this prop to handle closing the quotation
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onClose }) => {
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    designation: '',
    name: '',
    phoneCountry: 'in',
    phoneNumber: '',
    email: '',
    searchType: 'tests',
    discount: '',
    discountAmount: '',
  });

  useEffect(() => {
    // Any initialization that might cause hydration issues can go here
    // For example, if you need to set a random value or fetch data
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 text-[#000000] relative">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Close quotation"
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4">Quotation</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label htmlFor="designation" className="block text-sm mb-1">Designation</label>
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="mr">MR.</option>
            <option value="mrs">MRS.</option>
            <option value="ms">MS.</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Name"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <div className="flex">
            <select
              name="phoneCountry"
              value={formData.phoneCountry}
              onChange={handleInputChange}
              className="w-24 p-2 border rounded-l"
              aria-label="Country code"
            >
              <option value="in">IN +91</option>
              <option value="us">US +1</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
              className="flex-1 p-2 border-t border-b border-r rounded-r"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Sr No. Test / Package</h3>
          <h3 className="font-medium">Price</h3>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/api/placeholder/64/64" alt="No data" className="opacity-50" />
            </div>
            <p>No data</p>
          </div>
        ) : null}

        <div className="flex items-center gap-4 mt-4">
          <input
            type="text"
            placeholder="Search by test name or test code"
            className="flex-1 p-2 border rounded"
          />
          <label htmlFor="searchType" className="sr-only">Search Type</label>
          <select
            id="searchType"
            name="searchType"
            value={formData.searchType}
            onChange={handleInputChange}
            className="w-32 p-2 border rounded"
          >
            <option value="tests">Tests</option>
            <option value="packages">Packages</option>
          </select>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1">Discount(%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="0"
              className="w-32 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Discount(₹)</label>
            <input
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleInputChange}
              placeholder="Add Discount"
              className="w-32 p-2 border rounded"
            />
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 border rounded mr-2">Send</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Print</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
