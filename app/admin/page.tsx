'use client';
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Heading from "../utils/Heading";
import PatientRegister from "../components/patient/PatientRegister";
import PatientList from "../components/patient/PatientList";
import UpdateReport from "../components/patient/update-report/UpdateReport";
import PatientDetails from "../components/patient/PatientDetails";
import Header from "../components/header/Header";
import { useRouter, useSearchParams } from 'next/navigation';
import TestList from "../components/tests/TestList";
import ViewReport from "../components/patient/update-report/ViewReport";
import EditTest from "../components/tests/EditTest";

// Dynamically import SideBar with SSR disabled
const SideBar = dynamic(() => import("../components/admin/sidebar/SideBar"), { ssr: false });

const Page = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeComponent') || 'PatientRegister';
    }
    return 'PatientRegister';
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patientId, setPatientId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('patientId') || null;
    }
    return null;
  });

  useEffect(() => {
    const component = searchParams?.get('component');
    const id = searchParams?.get('patientId');
    if (component) {
      setActiveComponent(component);
      localStorage.setItem('activeComponent', component);
    }
    if (id) {
      setPatientId(id);
      localStorage.setItem('patientId', id);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem('activeComponent', activeComponent);
    if (patientId) {
      localStorage.setItem('patientId', patientId);
    }
  }, [activeComponent, patientId]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'PatientRegister':
        return <PatientRegister />;
      case 'PatientList':
        return <PatientList onPatientSelect={handlePatientSelect} />;
      case 'PatientReport':
        return <UpdateReport />;
      case 'PatientDetails':
        return patientId ? <PatientDetails patientId={patientId} medicalHistory={[]} /> : null;
      case 'TestList':
        return <TestList />;
      case 'EditTest':
        const testId = searchParams?.get('testId');
        return testId ? <EditTest testId={parseInt(testId, 10)} /> : null;
      case 'ViewReport':
        return patientId ? <ViewReport patientId={patientId} onClose={() => handleComponentChange('PatientReport')} /> : null;
      default:
        return <PatientRegister />;
    }
  };

  const handlePatientSelect = (id: string) => {
    setActiveComponent('PatientDetails');
    setPatientId(id);
    router.push(`/admin?component=PatientDetails&patientId=${id}`);
  };

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
    router.push(`/admin?component=${component}`);
  };

  return (
    <>
      <Heading title="Patient Register - Admin" description="" keywords="" />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          {typeof window !== 'undefined' && (
            <aside className={`fixed top-0 left-0 h-screen z-20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
              <SideBar 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
                setActiveComponent={handleComponentChange}
                activeComponent={activeComponent}
              />
            </aside>
          )}
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
