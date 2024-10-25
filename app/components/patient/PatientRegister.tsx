"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import SelectMenu from "../common/SelectMenu";
import CustomModal from "../../utils/CustomModal";
import dynamic from 'next/dynamic';
import AddOrganization from '../common/AddOrganization';
import SampleCollectionAddress from '../common/SampleCollectionAddress';
import BillingTab from './BillingTab';
import Invoice from './Invoice';
import NewModal from "@/app/utils/NewModal";

const QuotationForm = dynamic(() => import('./Quotation'), { ssr: false });
const SampleCollector = dynamic(() => import('../common/SampleCollector'), { ssr: false });

// Add this interface above the component or in a separate types file
interface SampleCollectorData {
  // Define the expected properties of the data object
  name: string;
  // Add other relevant properties
}

// Add this interface near the top of the file
interface InvoiceData {
  // Define the expected properties of the invoice data
  // For example:
  total: number;
  items: Array<{ name: string; price: number }>;
  // Add other relevant properties
}

const PatientRegister = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "241019002",
    designation: "MR",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "male",
    email: "",
    age: "",
    ageType: "Year",
    address: "",
    sampleCollector: "",
    organisation: "",
    collectedAt: "",
  });

  const [isSampleCollectorModalOpen, setIsSampleCollectorModalOpen] = useState(false);
  const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] = useState(false);
  const [isCollectionAddressModalOpen, setIsCollectionAddressModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOption = (field: string) => {
    // Implement the logic to add a new option
    console.log(`Add new option for ${field}`);
  };

  const handleQuotationClick = () => {
    setIsQuotationModalOpen(true);
  };

  const handleCloseQuotation = () => {
    setIsQuotationModalOpen(false);
  };

  const handleAddSampleCollector = () => {
    setIsSampleCollectorModalOpen(true);
  };

  const handleCloseSampleCollector = () => {
    setIsSampleCollectorModalOpen(false);
  };

  const handleSaveSampleCollector = (data: SampleCollectorData) => {
    console.log('New Sample Collector:', data);
    // Here you would typically update your list of sample collectors
    // For now, we'll just log the data
  };

  const handleAddOrganization = () => {
    setIsAddOrganizationModalOpen(true);
  };

  const handleCloseAddOrganization = () => {
    setIsAddOrganizationModalOpen(false);
  };
  const handleBilling = () => {
    setIsBillingModalOpen(true);
  };

  const handleCloseBilling = () => {
    setIsBillingModalOpen(false);
  };

  const handleSaveOrganization = (organizationData: any) => {
    console.log('New Organization:', organizationData);
    // Here you would typically update your list of organizations
    // For now, we'll just log the data and close the modal
    setIsAddOrganizationModalOpen(false);
  };

  const handleAddCollectionAddress = () => {
    setIsCollectionAddressModalOpen(true);
  };

  const handleCloseCollectionAddress = () => {
    setIsCollectionAddressModalOpen(false);
  };

  const handleSaveCollectionAddress = (address: string) => {
    console.log('New Collection Address:', address);
    // Here you would typically update your list of collection addresses
    // For now, we'll just log the data and update the formData
    setFormData(prev => ({ ...prev, collectedAt: address }));
    setIsCollectionAddressModalOpen(false);
  };

  const sampleCollectors = [
    { id: '1', name: 'Collector 1' },
    { id: '2', name: 'Collector 2' },
    { id: '3', name: 'Collector 3' },
  ];

  const organisations = [
    { id: '1', name: 'Org 1', type: 'Hospital' },
    { id: '2', name: 'Org 2', type: 'Doctor' },
    { id: '3', name: 'Org 3', type: 'Hospital' },
  ];

  const collectionLocations = [
    { id: '1', name: 'Ejaz Labs' },
    { id: '2', name: 'Lab 2' },
    { id: '3', name: 'Lab 3' },
  ];

  const handleRegisterAndPrintBill = (data: InvoiceData) => {
    setIsBillingModalOpen(false);
    setInvoiceData(data);
    setIsInvoiceModalOpen(true);
  };

  const handleCloseInvoice = () => {
    setIsInvoiceModalOpen(false);
    setInvoiceData(null);
  };

  return (
    <main className="w-full mx-auto px-4 lg:px-8 xl:px-16 py-6 space-y-6 text-[#000000]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-lg font-semibold text-gray-800">
          Register New Patient
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-orange-500">Demo Videos</p>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded text-sm">
            Watch Videos
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <section aria-label="Patient Search">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-[70%] lg:w-[50%]">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search patient"
              className="w-full px-4 py-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search patient"
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400 w-5 h-5"
              aria-hidden="true"
            />
          </div>
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded"
            onClick={handleQuotationClick}
          >
            Quotation
          </button>
        </div>
      </section>

      <form className="space-y-6">
        <section
          aria-label="Patient Information"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div className="space-x-6 flex flex-row col-span-1">
            <p className="flex items-center">
              <span className="text-md text-gray-700">
                Patient ID: {formData.patientId}
              </span>
            </p>
            <div className="w-40">
              <label htmlFor="designation" className="block text-sm mb-1">
                Designation
              </label>
              <select
                id="designation"
                className="w-full px-3 py-2 border rounded"
              >
                <option>MR</option>
                <option>MS</option>
                <option>MRS</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm mb-1">
              First Name{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm mb-1">
              Phone Number
            </label>
            <div className="flex">
              <select
                className="px-3 py-2 border rounded-l-lg border-r-0 bg-gray-50 w-24"
                aria-label="Country code"
              >
                <option>🇮🇳 +91</option>
              </select>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                className="flex-1 px-3 py-2 border rounded-r-lg"
              />
            </div>
          </div>
        </section>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="mb-2">
              <label className="block text-sm mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    className="mr-2"
                  />
                  male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="mr-2"
                  />
                  female
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    className="mr-2"
                  />
                  other
                </label>
              </div>
            </div>
            <div className="pt-4">
              <label className="block text-sm mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Age"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email ID</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="ageType" className="block text-sm mb-1">
                Age Type <span className="text-red-500">*</span>
              </label>
              <select
                id="ageType"
                className="w-full px-3 py-2 border rounded"
              >
                <option>Year</option>
                <option>Month</option>
                <option>Day</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <textarea
              placeholder="Address"
              className="w-full px-3 py-2 border rounded resize-none h-32"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <section
          aria-label="Additional Information"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <SelectMenu
            label="Select Sample Collector"
            options={sampleCollectors}
            value={formData.sampleCollector}
            onChange={(value) => handleInputChange("sampleCollector", value)}
            onAdd={handleAddSampleCollector}
            placeholder="Select Sample Collector"
          />

          <SelectMenu
            label="Select Organisation"
            options={organisations}
            value={formData.organisation}
            onChange={(value) => handleInputChange("organisation", value)}
            onAdd={handleAddOrganization}
            placeholder="Select Organisation"
          />

          <SelectMenu
            label="Collected at"
            options={collectionLocations}
            value={formData.collectedAt}
            onChange={(value) => handleInputChange("collectedAt", value)}
            onAdd={handleAddCollectionAddress}
            placeholder="Select Collection Location"
          />
        </section>
      </form>

      <footer className="flex justify-end">
        <button
          onClick={handleBilling}
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded w-full sm:w-auto"
        >
          Go to Billing
        </button>
      </footer>

      {isQuotationModalOpen && (
        <CustomModal
          open={isQuotationModalOpen}
          setOpen={setIsQuotationModalOpen}
          component={() => <QuotationForm onClose={handleCloseQuotation} />}
          className="w-full max-w-4xl mx-4"
        />
      )}

      {isSampleCollectorModalOpen && (
        <CustomModal
          open={isSampleCollectorModalOpen}
          setOpen={setIsSampleCollectorModalOpen}
          component={() => (
            <SampleCollector
              onClose={handleCloseSampleCollector}
              onSave={handleSaveSampleCollector}
            />
          )}
        />
      )}

      {isAddOrganizationModalOpen && (
        <CustomModal
          open={isAddOrganizationModalOpen}
          setOpen={setIsAddOrganizationModalOpen}
          component={() => (
            <AddOrganization
              onSave={handleSaveOrganization}
              onClose={handleCloseAddOrganization}
            />
          )}
        />
      )}

      {isCollectionAddressModalOpen && (
        <CustomModal
          open={isCollectionAddressModalOpen}
          setOpen={setIsCollectionAddressModalOpen}
          component={() => (
            <SampleCollectionAddress
              onSave={handleSaveCollectionAddress}
              onClose={handleCloseCollectionAddress}
            />
          )}
        />
      )}

      {isBillingModalOpen && (
        <CustomModal
          open={isBillingModalOpen}
          setOpen={setIsBillingModalOpen}
          component={(props) => (
            <BillingTab 
              {...props} 
              onClose={handleCloseBilling} 
              onRegisterAndPrintBill={handleRegisterAndPrintBill}
            />
          )}
          className="w-full max-w-7xl mx-4 h-[80vh]"
        />
      )}

      {isInvoiceModalOpen && invoiceData && (
        <NewModal
          open={isInvoiceModalOpen}
          setOpen={setIsInvoiceModalOpen}
          component={(props) => (
            <Invoice 
              {...props} 
              {...invoiceData}
              onClose={handleCloseInvoice}
            />
          )}
          className="w-full max-w-4xl mx-4 h-[80vh] overflow-y-scroll "
        />
      )}
    </main>
  );
};

export default PatientRegister;
