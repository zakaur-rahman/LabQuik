"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SelectMenu from "../common/SelectMenu";
import CustomModal from "../../utils/CustomModal";
import dynamic from "next/dynamic";
import AddOrganization from "../common/AddOrganization";
import SampleCollectionAddress from "../common/SampleCollectionAddress";
import BillingTab from "./BillingTab";
import Invoice from "./Invoice";
import NewModal from "@/app/utils/NewModal";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useGetSampleCollectorsQuery } from "@/redux/features/patient/addSampleCollector";
import { useGetOrganizationsQuery } from "@/redux/features/patient/addOrganization";
import { useGetSampleCollectionAddressQuery } from "@/redux/features/patient/addSampleCollectionAddress";
import { useGetPatientIdQuery } from "@/redux/features/patient/patientRegister";
import { useFormik } from "formik";
const QuotationForm = dynamic(() => import("./Quotation"), { ssr: false });
const SampleCollector = dynamic(() => import("../common/SampleCollector"), {
    ssr: false,
});

interface SampleCollectorData {
    id: string;
    name: string;
    type?: string;
}

interface InvoiceData {
    total: number;
    items: Array<{ name: string; price: number }>;
}

interface FormValues {
    patientId: string;
    designation: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    email: string;
    age: number;
    ageType: string;
    address: string;
    sampleCollector: { id: string; name: string };
    organization: { id: string; name: string };
    collectedAt: { id: string; name: string };
}

const initialFormValues: FormValues = {
    patientId: "",
    designation: "MR",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "male",
    email: "",
    age: 0,
    ageType: "year",
    address: "",
    sampleCollector: { id: "", name: "" },
    organization: { id: "", name: "" },
    collectedAt: { id: "", name: "" },
};

const schema = yup.object({
    patientId: yup.string().required("Patient ID is required"),
    designation: yup.string().required("Designation is required"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string(),
    phoneNumber: yup.string(),
    gender: yup.string().required("Gender is required"),
    age: yup.number().required("Age is required"),
    ageType: yup.string().required("Age Type is required"),
    address: yup.string().required("Address is required"),
    sampleCollector: yup.object({
        id: yup.string(),
        name: yup.string(),
    }),
    organization: yup.object({
        id: yup.string(),
        name: yup.string(),
    }),
    collectedAt: yup.object({
        id: yup.string(),
        name: yup.string(),
    }),
    billingDate: yup.string(),
    bill: yup.object({}),
});

const PatientRegister = ({setActiveComponent}: {setActiveComponent: (component: string) => void}) => {
    // Require fix in future update
    const token = useSelector((state: any) => state.auth);

    const [searchQuery, setSearchQuery] = useState("");
    const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
    const formData = {
        patientId: "",
        designation: "MR",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        gender: "male",
        email: "",
        age: 0,
        ageType: "year",
        address: "",
        sampleCollector: { id: "", name: "" },
        organization: { id: "", name: "" },
        collectedAt: { id: "", name: "" },
    };

    const [isSampleCollectorModalOpen, setIsSampleCollectorModalOpen] =
        useState(false);
    const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] =
        useState(false);
    const [isCollectionAddressModalOpen, setIsCollectionAddressModalOpen] =
        useState(false);

    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [formattedSampleCollectors, setFormattedSampleCollectors] = useState<
        SampleCollectorData[]
    >([]);

    const [formattedOrganizations, setFormattedOrganizations] = useState<
        SampleCollectorData[]
    >([]);

    const [formattedCollectionAddresses, setFormattedCollectionAddresses] =
        useState<SampleCollectorData[]>([]);

    const [invoiceData, setInvoiceData] = useState<any>(null);

    // Add a reset trigger
    const [resetTrigger, setResetTrigger] = useState(0);

    /* const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }; */

    const { data: patientIdData, isLoading: patientIdLoading } =
        useGetPatientIdQuery(undefined, {
            skip: !token, // Skip the query if there's no token
            refetchOnMountOrArgChange: true
        });

    const { data: sampleCollectorsData, isLoading: sampleCollectorsLoading } =
        useGetSampleCollectorsQuery(undefined, {
            skip: !token, // Skip the query if there's no token
        });

    const { data: organizationsData, isLoading: organizationsLoading } =
        useGetOrganizationsQuery(undefined, {
            skip: !token, // Skip the query if there's no token
        });

    const {
        data: collectionAddressesData,
        isLoading: collectionAddressesLoading,
    } = useGetSampleCollectionAddressQuery(undefined, {
        skip: !token, // Skip the query if there's no token
    });

    useEffect(() => {
        if (sampleCollectorsData) {
            const formattedSampleCollectors =
                sampleCollectorsData?.sampleCollectors.map((collector: any) => ({
                    id: collector?._id,
                    name: collector.name,
                    type: "",
                }));
            setFormattedSampleCollectors(formattedSampleCollectors);
        }
        if (organizationsData) {
            const formattedOrganizations = organizationsData?.organizations.map(
                (organization: any) => ({
                    id: organization?._id,
                    name: organization.name,
                    type: organization.referralType,
                })
            );

            setFormattedOrganizations(formattedOrganizations);
        }
        if (collectionAddressesData) {
            const formattedCollectionAddresses =
                collectionAddressesData?.collectionAddresses.map((address: any) => ({
                    id: address?._id,
                    name: address.address,
                }));
            setFormattedCollectionAddresses(formattedCollectionAddresses);
        }
        if (patientIdData) {
            formik.setFieldValue("patientId", patientIdData.patientId);
        }
    }, [
        sampleCollectorsData,
        organizationsData,
        collectionAddressesData,
        patientIdData,
    ]);

    const handleRegisterAndPrintBill = (patientData: any) => {
        setInvoiceData(patientData);
        setIsBillingModalOpen(false);
        setIsInvoiceModalOpen(true);
    };

    const handleCloseInvoice = () => {
        setIsInvoiceModalOpen(false);
        setInvoiceData(null);
        setActiveComponent('PatientList')
        // Reset form and trigger refetch
        formik.resetForm();
        setResetTrigger(prev => prev + 1);
    };

    const formik = useFormik<FormValues>({
        initialValues: initialFormValues,
        validationSchema: schema,
        onSubmit: (values) => {
            setIsBillingModalOpen(true);
        },
    });


    const { handleChange, handleSubmit, values, errors, touched, handleBlur } = formik;

    // Reset all other form-related states
    useEffect(() => {
        if (resetTrigger > 0) {
            // Reset search query
            setSearchQuery("");
            
            // Reset modal states
            setIsQuotationModalOpen(false);
            setIsSampleCollectorModalOpen(false);
            setIsAddOrganizationModalOpen(false);
            setIsCollectionAddressModalOpen(false);
            setIsBillingModalOpen(false);
            
            // Reset selections
            formik.setValues({
                patientId: "",
                designation: "MR",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                gender: "male",
                email: "",
                age: 0,
                ageType: "year",
                address: "",
                sampleCollector: { id: "", name: "" },
                organization: { id: "", name: "" },
                collectedAt: { id: "", name: "" },
            });
        }
    }, [resetTrigger]);

    // Update patientId when new one is fetched
    useEffect(() => {
        if (patientIdData) {
            formik.setFieldValue("patientId", patientIdData.patientId);
        }
    }, [patientIdData, resetTrigger]);

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
                        onClick={() => setIsQuotationModalOpen(true)}
                    >
                        Quotation
                    </button>
                </div>
            </section>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <section
                    aria-label="Patient Information"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    <div className="space-x-6 flex flex-row justify-between col-span-1">
                        <p className="flex items-center">
                            <span className="text-md text-gray-700">
                                Patient ID: {values.patientId}
                            </span>
                        </p>
                        <div className="w-20">
                            <label htmlFor="designation" className="block text-sm mb-1">
                                Designation
                            </label>
                            <select
                                id="designation"
                                name="designation"
                                value={values.designation}
                                onChange={handleChange}
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
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
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
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
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
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                            >
                                <option>🇮🇳 +91</option>
                            </select>
                            <input
                                id="phoneNumber"
                                type="tel"
                                onChange={handleChange}
                                value={values.phoneNumber}
                                name="phoneNumber"
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
                                        checked={values.gender === "male"}
                                        className="mr-2"
                                        onChange={handleChange}
                                    />
                                    male
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={values.gender === "female"}
                                        className="mr-2"
                                        onChange={handleChange}
                                    />
                                    female
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={values.gender === "other"}
                                        className="mr-2"
                                        onChange={handleChange}
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
                                name="age"
                                id="age"
                                className="w-full px-3 py-2 border rounded"
                                value={values.age}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Email ID</label>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                className="w-full px-3 py-2 border rounded"
                                value={values.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="ageType" className="block text-sm mb-1">
                                Age Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="ageType"
                                name="ageType"
                                className="w-full px-3 py-2 border rounded"
                                value={values.ageType}
                                onChange={handleChange}
                            >
                                <option>year</option>
                                <option>month</option>
                                <option>day</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Address</label>
                        <textarea
                            placeholder="Address"
                            name="address"
                            className="w-full px-3 py-2 border rounded resize-none h-32"
                            value={values.address}
                            onChange={handleChange}
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
                        options={formattedSampleCollectors}
                        value={values.sampleCollector}
                        onChange={(value) => formik.setFieldValue("sampleCollector", value)}
                        onAdd={() => setIsSampleCollectorModalOpen(true)}
                        placeholder="Select Sample Collector"
                    />

                    <SelectMenu
                        label="Select Organization"
                        options={formattedOrganizations}
                        value={values.organization}
                        onChange={(value) => formik.setFieldValue("organization", value)}
                        onAdd={() => setIsAddOrganizationModalOpen(true)}
                        placeholder="Select Organization"
                    />

                    <SelectMenu
                        label="Collected at"
                        options={formattedCollectionAddresses}
                        value={values.collectedAt}
                        onChange={(value) => formik.setFieldValue("collectedAt", value)}
                        onAdd={() => setIsCollectionAddressModalOpen(true)}
                        placeholder="Select Collection Location"
                    />
                </section>
                <div className="flex justify-end">
                    <button
                        
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded w-full sm:w-auto"
                    >
                        Go to Billing
                    </button>
                </div>
            </form>


            {isQuotationModalOpen && (
                <CustomModal
                    open={isQuotationModalOpen}
                    setOpen={setIsQuotationModalOpen}
                    component={() => (
                        <QuotationForm onClose={() => setIsQuotationModalOpen(false)} />
                    )}
                    className="w-full max-w-4xl mx-4"
                />
            )}

            {isSampleCollectorModalOpen && (
                <CustomModal
                    open={isSampleCollectorModalOpen}
                    setOpen={setIsSampleCollectorModalOpen}
                    component={() => (
                        <SampleCollector
                            onClose={() => setIsSampleCollectorModalOpen(false)}
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
                            onClose={() => setIsAddOrganizationModalOpen(false)}
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
                            onClose={() => setIsCollectionAddressModalOpen(false)}
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
                            values={values}
                            onClose={() => setIsBillingModalOpen(false)}
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
                            invoiceData={invoiceData}
                            onClose={handleCloseInvoice}
                        />
                    )}
                    className="w-full max-w-4xl mx-4 h-[80vh] overflow-y-scroll"
                />
            )}
        </main>
    );
};

export default PatientRegister;
