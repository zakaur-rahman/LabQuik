"use client";
import React from "react";
import dynamic from "next/dynamic";

// Create a client-only wrapper for the admin dashboard
const AdminDashboard = dynamic(() => import("../components/admin/AdminDashboard"), {
  ssr: false
});

const Page = () => {
  return <AdminDashboard />;
};

export default Page;
