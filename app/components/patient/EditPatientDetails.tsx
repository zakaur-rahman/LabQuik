"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SelectMenu from "../common/SelectMenu";
import CustomModal from "../../utils/CustomModal";
import dynamic from "next/dynamic";
import AddOrganization from "../common/AddOrganization";
import SampleCollectionAddress from "../common/SampleCollectionAddress";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useGetSampleCollectorsQuery } from "@/redux/features/patient/addSampleCollector";
import { useGetOrganizationsQuery } from "@/redux/features/patient/addOrganization";
import { useGetSampleCollectionAddressQuery } from "@/redux/features/patient/addSampleCollectionAddress";
import { useGetPatientIdQuery } from "@/redux/features/patient/patientRegister";
import { useFormik } from "formik";
const SampleCollector = dynamic(() => import("../common/SampleCollector"), {
  ssr: false,
});

interface SampleCollectorData {
  id: string;
  name: string;
  type?: string;
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

const EditPatientDetails = ({
  selectedPatientForEdit,
}: {
  selectedPatientForEdit: any;
}) => {
  // Require fix in future update
  const token = useSelector((state: any) => state.auth);

  const initialFormValues: FormValues = {
    patientId: selectedPatientForEdit.patientId,
    designation: selectedPatientForEdit.designation,
    firstName: selectedPatientForEdit.firstName,
    lastName: selectedPatientForEdit.lastName,
    phoneNumber: selectedPatientForEdit.phoneNumber,
    gender: selectedPatientForEdit.gender,
    email: selectedPatientForEdit.email,
    age: selectedPatientForEdit.age,
    ageType: selectedPatientForEdit.ageType,
    address: selectedPatientForEdit.address,
    sampleCollector: {
      id: selectedPatientForEdit.sampleCollector.id,
      name: selectedPatientForEdit.sampleCollector.name,
    },
    organization: {
      id: selectedPatientForEdit.organization.id,
      name: selectedPatientForEdit.organization.name,
    },
    collectedAt: {
      id: selectedPatientForEdit.collectedAt.id,
      name: selectedPatientForEdit.collectedAt.name,
    },
  };

  const [isSampleCollectorModalOpen, setIsSampleCollectorModalOpen] =
    useState(false);
  const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] =
    useState(false);
  const [isCollectionAddressModalOpen, setIsCollectionAddressModalOpen] =
    useState(false);

  const [formattedSampleCollectors, setFormattedSampleCollectors] = useState<
    SampleCollectorData[]
  >([]);

  const [formattedOrganizations, setFormattedOrganizations] = useState<
    SampleCollectorData[]
  >([]);

  const [formattedCollectionAddresses, setFormattedCollectionAddresses] =
    useState<SampleCollectorData[]>([]);

  // Add a reset trigger
  const { data: patientIdData, isLoading: patientIdLoading } =
    useGetPatientIdQuery(undefined, {
      skip: !token, // Skip the query if there's no token
      refetchOnMountOrArgChange: true,
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
  }, [sampleCollectorsData, organizationsData, collectionAddressesData]);

  const formik = useFormik<FormValues>({
    initialValues: initialFormValues,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log({
        ...values,
        bill: selectedPatientForEdit.bill,
      });
    },
  });

  const { handleChange, handleSubmit, values, errors, touched, handleBlur } =
    formik;

  return (
    <main className="w-full mx-auto px-4 lg:px-8 xl:px-16 py-6 space-y-6 text-[#000000]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-lg font-semibold text-gray-800">
          Edit Patient Details
        </h1>
      </header>

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
            Save
          </button>
        </div>
      </form>

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
    </main>
  );
};

export default EditPatientDetails;
