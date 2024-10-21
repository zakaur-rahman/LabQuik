'use client';
import React, { useState } from "react";
import Heading from "../utils/Heading";
import SideBar from "../components/admin/sidebar/SideBar";
import PatientRegister from "../components/patient/PatientRegister";
import PatientList from "../components/patient/PatientList";
import PatientReport from "../components/patient/PatientReport";
import PatientDetails from "../components/patient/PatientDetails";
import Header from "../components/header/Header";
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('PatientRegister');
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'PatientRegister':
        return <PatientRegister />;
      case 'PatientList':
        return <PatientList onPatientSelect={handlePatientSelect} />;
      case 'PatientReport':
        return <PatientReport />;
      case 'PatientDetails':
        return patientId ? <PatientDetails patientId={patientId} /> : null;
      default:
        return <PatientRegister />;
    }
  };

  const handlePatientSelect = (id: string) => {
    setActiveComponent('PatientDetails');
    router.push(`/admin?patientId=${id}`);
  };

  return (
    <>
      <Heading title="Patient Register - Admin" description="" keywords="" />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <aside className={`fixed top-0 left-0 h-screen z-20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <SideBar 
              collapsed={collapsed} 
              setCollapsed={setCollapsed} 
              setActiveComponent={setActiveComponent}
            />
          </aside>
          <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
            <Header />
            <main className="pt-8">
              {renderComponent()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
