import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface PatientDetail {
  name: string;
  id: string;
  gender: string;
  age: number;
  contact: string;
  email: string;
  address: string;
}

interface MedicalHistory {
  date: string;
  billId: string;
  tests: string;
  rfDoctor: string;
  due: number;
  amount: number;
  status: string;
}

interface PatientDetailsProps {
  patientId: string;
  medicalHistory: Array<MedicalHistory>;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId, medicalHistory }) => {
  const [patient, setPatient] = useState<PatientDetail | null>(null);

  useEffect(() => {
    // Fetch patient data and medical history based on patientId
    // This is where you'd typically make an API call
    // For now, we'll use dummy data
    setPatient({
      name: "Ghazi Sultan",
      id: "241020001",
      gender: "male",
      age: 26,
      contact: "9342387132",
      email: "",
      address: "delhi",
    });
  }, [patientId]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white text-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-2xl text-gray-600">
            {patient.name[0]}
          </div>
          <div className="mr-12">
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className="text-gray-600">#{patient.id}</p>
          </div>
          <div className="flex-1 grid grid-cols-5 pl-12 gap-4">
            <InfoItem label="Gender" value={patient.gender} />
            <InfoItem label="Age" value={`${patient.age} year`} />
            <InfoItem label="Contact" value={patient.contact} />
            <InfoItem label="Email Id" value={patient.email || '-'} />
            <InfoItem label="Address" value={patient.address} />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold my-4">Medical History</h3>
      <div className="flex justify-end mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Test or Doctor"
            className="border rounded-full py-2 px-4 pr-10"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Bill Id</th>
              <th className="p-2 text-left">Tests</th>
              <th className="p-2 text-left">Rf. Doctors</th>
              <th className="p-2 text-right">Due (in ₹)</th>
              <th className="p-2 text-right">Amount (in ₹)</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {medicalHistory.map((history, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{history.date}</td>
                <td className="p-2">{history.billId}</td>
                <td className="p-2">{history.tests}</td>
                <td className="p-2">{history.rfDoctor}</td>
                <td className="p-2 text-right">{history.due}</td>
                <td className="p-2 text-right">{history.amount}</td>
                <td className="p-2">
                  <span className="text-blue-500">• {history.status}</span>
                </td>
                <td className="p-2">
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default PatientDetails;
