import React, { useState } from "react";
import AllReports from "./ReportLists";
import ViewReport from "./ViewReport";
import { useRouter } from "next/navigation";

// Add this import

type Patient = {
  id: string;
  details: { name: string; age: string; gender: string };
  doctor: string;
  status: string;
};

const UpdateReport = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const tabs = ["All", "Incomplete", "Partial", "Complete", "Delivered"];

  const handleViewReport = (patientId: string) => {
    router.push(`/admin?component=ViewReport&patientId=${patientId}`);
  };

  const renderActiveComponent = () => {
    if (selectedPatient) {
      return (
        <ViewReport
          patient={selectedPatient.id}
          onClose={() => setSelectedPatient(null)}
        />
      );
    } else {
      return <AllReports onViewReport={handleViewReport} status={activeTab} />;
    }

  };

  return (
    <div className="flex h-screen text-gray-800 bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Render active component */}
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default UpdateReport;
