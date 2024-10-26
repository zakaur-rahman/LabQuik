import React, { useState } from 'react';
import { Search, ListPlus, Edit, RefreshCw, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TestList = () => {
  const router = useRouter();

  // Sample data - in real app would likely come from props or API
  const tests = [
    {
      id: 1,
      name: "ULTRASONOGRAPHY OF ARTERIAL SYSTEM OF BOTH LOWER LIMBS PERFORMED",
      code: "USG OF BOTH LOWER LIMBS PERFORMED",
      department: "RADIOLOGY",
      sampleType: "",
      cost: 5,
      interpretation: true,
      enabled: false
    },
    {
      id: 2,
      name: "2D ECHO",
      code: "2D ECHO",
      department: "RADIOLOGY",
      sampleType: "",
      cost: 0,
      interpretation: true,
      enabled: false
    },
    // Add more sample data as needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 13;

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            className={`w-8 h-8 rounded ${
              currentPage === i
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }
    return buttons;
  };

  const handleEditTest = (testId: number) => {
    router.push(`/admin?component=EditTest&testId=${testId}`);
  };

  return (
    <div className="p-6 w-full text-black mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Test List</h1>
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="department-select" className="sr-only">Select Department</label>
          <select id="department-select" className="w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="RADIOLOGY">RADIOLOGY</option>
            <option value="PATHOLOGY">PATHOLOGY</option>
          </select>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search by test name or test code"
              className="w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <ListPlus className="h-4 w-4 mr-2" />
            Test Sequence
          </button>
          <button className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Mass Update Price List
          </button>
          <button className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tests</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Test Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sample Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cost</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Interpretation</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr
                key={test.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm">{test.name}</td>
                <td className="px-4 py-3 text-sm">{test.code}</td>
                <td className="px-4 py-3 text-sm">{test.department}</td>
                <td className="px-4 py-3 text-sm">{test.sampleType}</td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    value={test.cost}
                    className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={() => {}}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={test.interpretation}
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    onChange={() => {}}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={() => handleEditTest(test.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      className={`px-3 py-1 text-sm text-white rounded transition-colors ${
                        test.enabled
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {test.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2">
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default TestList;
