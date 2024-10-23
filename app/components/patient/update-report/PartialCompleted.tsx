import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
//import Sidebar from './Sidebar';

const PartialCompleted = () => {
  const [startDate, setStartDate] = useState('2024-10-20');
  const [endDate, setEndDate] = useState('2024-10-21');
  const [showCalendar, setShowCalendar] = useState(false);

  const tabs = ['All', 'Incomplete', 'Partial', 'Complete'];

  const patients = [
    {
      id: '241021001',
      details: { name: 'ahmad', age: '22 year', gender: 'Male' },
      doctor: 'Tony',
      status: 'Ongoing'
    },
    {
      id: '241020002',
      details: { name: 'Zakaur Rahman', age: '30 year', gender: 'Male' },
      doctor: 'Moin Ali',
      status: 'Ongoing'
    },
    {
      id: '241020001',
      details: { name: 'Ghazi Sultan', age: '26 year', gender: 'Male' },
      doctor: 'Tony',
      status: 'Ongoing'
    }
  ];

  return (
    <>
      {/* Search and filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or barc..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>

        <select className="border rounded-lg px-4 py-2 bg-white" aria-label="Filter options">
          <option>All</option>
        </select>

        <div className="relative">
          <button
            className="flex items-center border rounded-lg px-4 py-2 bg-white"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span>{startDate} — {endDate}</span>
          </button>

          {showCalendar && (
            <div className="absolute top-12 bg-white border rounded-lg shadow-lg p-4 z-10">
              <div className="grid grid-cols-7 gap-1">
                {/* Calendar cells would go here */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Patient Id</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Patient Details</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rf. Doctor</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tests</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No data
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="border-b">
                  <td className="px-6 py-4 text-sm">{patient.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{patient.details.name}</div>
                    <div className="text-sm text-gray-500">
                      {patient.details.age}, {patient.details.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{patient.doctor}</td>
                  <td className="px-6 py-4 text-sm">-</td>
                  <td className="px-6 py-4 text-sm">-</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-blue-600 bg-blue-50 rounded-full text-sm">
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                      View report
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PartialCompleted;
