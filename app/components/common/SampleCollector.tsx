import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import * as Yup from "yup";
import { useAddSampleCollectorMutation } from "@/redux/features/patient/addSampleCollector";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
interface SampleCollectorProps {
  onClose: () => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  gender: Yup.string().required("Please select your gender!"),
  phone: Yup.string().required("Please enter your phone number!"),
  email: Yup.string().email("Invalid email").required("Please enter your email!"),
});

const SampleCollector: React.FC<SampleCollectorProps> = ({
  onClose,
}) => {
 

  const [addSampleCollector, { isSuccess, error , isLoading}] = useAddSampleCollectorMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "male",
      phone: "",
      email: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await addSampleCollector(values);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Sample Collector added successfully!");
      onClose();
    }
    if (error) {
      const errorData = error as any;
      console.log("errorData: ", errorData);
      toast.error(errorData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="bg-transparent p-2 rounded text-[#000000] max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Sample Collector</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {touched.name && errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {["male", "female", "other"].map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={values.gender === gender}
                  onChange={handleChange}
                  className="mr-2"
                />
                {gender}
              </label>
            ))}
          </div>
          {touched.gender && errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SampleCollector;
