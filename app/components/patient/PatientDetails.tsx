import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useGetPatientDetailsQuery } from "@/redux/features/patient/getPatientList";
import { toast } from "react-hot-toast";

interface PatientDetailsProps {
  patientId: string;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const [patient, setPatient] = useState<any>({});
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const {
    data: patientDetails,
    isError,
    error,
  } = useGetPatientDetailsQuery(patientId);
  useEffect(() => {
    if (patientDetails?.patient) {
      setPatient(patientDetails.patient);
    }
    if (isError) {
      console.log(error);
    }
  }, [patientDetails, isError]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white text-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-2xl text-gray-600">
            {patient?.firstName?.[0]}
          </div>
          <div className="mr-12">
            <h3 className="text-lg font-semibold">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-gray-600">#{patient.patientId}</p>
          </div>
          <div className="flex-1 grid grid-cols-5 pl-12 gap-4">
            <InfoItem label="Gender" value={patient.gender} />
            <InfoItem label="Age" value={`${patient.age} year`} />
            <InfoItem label="Contact" value={patient.phoneNumber} />
            <InfoItem label="Email Id" value={patient.email || "-"} />
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
            <tr className="border-b">
              <td className="p-2">
                {new Date(patient?.bill?.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">{patient.bill?.billId || "-"}</td>
              <td className="p-2">
                {patient.bill?.tests.map((test: any) => test.name).join(", ") ||
                  "-"}
              </td>
              <td className="p-2">{patient?.organization?.name || "-"}</td>
              <td className="p-2 text-right">{patient.bill?.due || "0"}</td>
              <td className="p-2 text-right">{patient.bill?.grandTotal || "0"}</td>
              <td className="p-2">
                <span className="text-blue-500">
                  • {patient?.status || "-"}
                </span>
              </td>
              <td className="p-2">
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  View Report
                </button>
              </td>
            </tr>
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
