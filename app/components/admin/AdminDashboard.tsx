"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Protected from "../../hooks/useProtected";
import Heading from "../../utils/Heading";

// Dynamically import components that are not critical for initial render
const PatientRegister = dynamic(() => import("../patient/PatientRegister"));
const PatientList = dynamic(() => import("../patient/PatientList"));
const UpdateReport = dynamic(() => import("../patient/update-report/UpdateReport"));
const PatientDetails = dynamic(() => import("../patient/PatientDetails"));
const TestList = dynamic(() => import("../tests/TestList"));
const ViewReport = dynamic(() => import("../patient/update-report/ViewReport"));
const EditTest = dynamic(() => import("../tests/edit/EditTest"));
const CreateNewTest = dynamic(() => import("../tests/createTest/CreateNewTest"));

// Import components that need to be server-rendered
import Header from "../header/Header";
import SideBar from "./sidebar/SideBar";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeComponent") || "PatientRegister";
    }
    return "PatientRegister";
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [patientId, setPatientId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("patientId") || null;
    }
    return null;
  });

  useEffect(() => {
    const component = searchParams?.get("component");
    const id = searchParams?.get("patientId");
    if (component) {
      setActiveComponent(component);
      localStorage.setItem("activeComponent", component);
    }
    if (id) {
      setPatientId(id);
      localStorage.setItem("patientId", id);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
    if (patientId) {
      localStorage.setItem("patientId", patientId);
    }
  }, [activeComponent, patientId]);

  const handlePatientSelect = (id: string) => {
    setActiveComponent("PatientDetails");
    setPatientId(id);
    router.push(`/admin?component=PatientDetails&patientId=${id}`);
  };

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
    router.push(`/admin?component=${component}`);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "PatientRegister":
        return <PatientRegister setActiveComponent={setActiveComponent} />;
      case "PatientList":
        return <PatientList onPatientSelect={handlePatientSelect} />;
      case "PatientReport":
        return <UpdateReport />;
      case "PatientDetails":
        return patientId ? (
          <PatientDetails patientId={patientId} />
        ) : null;
      case "TestList":
        return <TestList />;
      case "EditTest":
        const testId = searchParams?.get("testId");
        return testId ? <EditTest testId={testId} /> : null;
      case "ViewReport":
        return patientId ? (
          <ViewReport
            patient={patientId}
            onClose={() => handleComponentChange("PatientReport")}
          />
        ) : null;
      case "CreateNewTest":
        return <CreateNewTest />;
      default:
        return <PatientRegister setActiveComponent={setActiveComponent} />;
    }
  };

  return (
    <Protected>
      <div className="flex flex-col min-h-screen">
        <Heading title="Patient Register - Admin" description="" keywords="" />
        <div className="flex flex-1">
          <aside
            className={`fixed top-0 left-0 h-screen z-20 transition-all duration-300 ${
              collapsed ? "w-20" : "w-64"
            }`}
          >
            <SideBar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              setActiveComponent={handleComponentChange}
              activeComponent={activeComponent}
            />
          </aside>
          <div
            className={`flex-1 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
            <Header />
            <main className="pt-8">{renderComponent()}</main>
          </div>
        </div>
      </div>
    </Protected>
  );
};

export default AdminDashboard; 