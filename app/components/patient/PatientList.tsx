import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Printer, Eye, Edit2, Trash2 } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  referringDoctor: string;
  tests: string[];
  amount: number;
  date: string;
  status: 'Ongoing' | 'Completed';
  contact: string;
  createdBy: string;
  sampleCollector: string;
  collectionLocation: string;
}
const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    // Fetch patients data here
    // For now, we'll use mock data
    setPatients([
      {
        id: '241019001',
        name: 'Arsalan Ahmad',
        age: 12,
        gender: 'Male',
        referringDoctor: 'Moin Ahmad',
        tests: ['Vitamin D3'],
        amount: 30,
        date: '2024-10-19 11:15 PM',
        status: 'Ongoing',
        contact: '9876543210',
        createdBy: 'Arsalan',
        sampleCollector: 'Zak',
        collectionLocation: 'Ejaz Labs'
      },
      // Add more mock patients here
    ]);
  }, []);

  const toggleRowExpansion = (patientId: string) => {
    setExpandedRows(prevState => {
      const newState = new Set(prevState);
      if (newState.has(patientId)) {
        newState.delete(patientId);
      } else {
        newState.add(patientId);
      }
      return newState;
    });
  };

  const filteredPatients = patients.filter(patient => 
    (patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.id.includes(searchQuery)) &&
    (statusFilter === 'All' || patient.status === statusFilter) &&
    (dateRange.start === '' || new Date(patient.date) >= new Date(dateRange.start)) &&
    (dateRange.end === '' || new Date(patient.date) <= new Date(dateRange.end))
  );

  return (
    <div className="p-4 space-y-4 text-[#000000]">
      <h1 className="text-2xl font-bold">Patient List</h1>
      
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or barcode"
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <label htmlFor="statusFilter" className="sr-only">Filter by status</label>
        <select
          id="statusFilter"
          className="p-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
        </select>
        
        <input
          type="date"
          className="p-2 border rounded-lg"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
        />
        <input
          type="date"
          className="p-2 border rounded-lg"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left"></th>
              <th className="p-2 text-left">Patient ID</th>
              <th className="p-2 text-left">Patient Details</th>
              <th className="p-2 text-left">Rf. Doctor</th>
              <th className="p-2 text-left">Tests</th>
              <th className="p-2 text-left">Amount (in ₹)</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <React.Fragment key={patient.id}>
                <tr className="border-b">
                  <td className="p-2">
                    <button onClick={() => toggleRowExpansion(patient.id)}>
                      {expandedRows.has(patient.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </td>
                  <td className="p-2">{patient.id}</td>
                  <td className="p-2">
                    {patient.name}<br />
                    <span className="text-sm text-gray-500">{patient.age} year, {patient.gender}</span>
                  </td>
                  <td className="p-2">{patient.referringDoctor}</td>
                  <td className="p-2">{patient.tests.join(', ')}</td>
                  <td className="p-2">₹{patient.amount}</td>
                  <td className="p-2">{patient.date}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      patient.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-2 space-y-2">
                    <button className="border border-blue-500 text-black px-4 py-1 rounded mr-2 w-40 lg:w-auto ">Bill</button>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded flex w-40 lg:w-auto items-center">
                      <Printer size={16} className="mr-1" /> Print Report
                    </button>
                  </td>
                </tr>
                {expandedRows.has(patient.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={9} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Contact:</strong> {patient.contact}</p>
                          <p><strong>Created By:</strong> {patient.createdBy}</p>
                        </div>
                        <div>
                          <p><strong>Sample Collector:</strong> {patient.sampleCollector}</p>
                          <p><strong>Collected at:</strong> {patient.collectionLocation}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-x-2">
                        <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded flex items-center">
                          <Eye size={16} className="mr-1" /> View Details
                        </button>
                        <button className="bg-yellow-500 text-white px-4 py-1 rounded flex items-center">
                          <Edit2 size={16} className="mr-1" /> Edit Patient
                        </button>
                        <button className="bg-red-500 text-white px-4 py-1 rounded flex items-center">
                          <Trash2 size={16} className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
