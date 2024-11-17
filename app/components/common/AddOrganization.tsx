import React, { useEffect, useState } from "react";
import { useAddOrganizationMutation } from "../../../redux/features/patient/addOrganization";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
interface AddOrganizationProps {
  onClose: () => void;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  referralType: yup.string().required("Referral Type is required"),
  compliment: yup.number().required("Compliment is required"),
  degree: yup.string().notRequired(),
});


const AddOrganization: React.FC<AddOrganizationProps> = ({
  onClose,
}) => {
 

  const [addOrganization, { isLoading, isSuccess, error }] =
    useAddOrganizationMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      referralType: "doctor",
      degree: "",
      compliment: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, referralType, degree, compliment }) => {
      const organizationData =
        referralType === "doctor"
          ? { referralType, name, degree, compliment }
          : { referralType, name, compliment };
      console.log("organizationData: ", organizationData);
      await addOrganization(organizationData);
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
    <div className="w-full text-[#000000] bg-opacity-50 flex items-center justify-center">
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Organisation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="referralType">
              <span className="text-red-500">*</span> Referral Type:
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  id="referralType"
                  checked={values.referralType === "doctor"}
                  onChange={handleChange}
                />
                <span className="ml-2">Doctor</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  id="referralType"
                  checked={values.referralType === "hospital"}
                  onChange={handleChange}
                />
                <span className="ml-2">Hospital</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="name">
              <span className="text-red-500">*</span> Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={values.name}
              onChange={handleChange}
              placeholder="Name"
              id="name"
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {values.referralType === "doctor" && (
            <div className="mb-4">
              <label className="block mb-2" htmlFor="degree">
                Degree:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={values.degree}
                onChange={handleChange}
                placeholder="Degree"
                id="degree"
              />
              {touched.degree && errors.degree && (
                <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2" htmlFor="compliment">Compliment%:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={values.compliment}
              onChange={handleChange}
              placeholder="Compliment"
              id="compliment"
            />
            {touched.compliment && errors.compliment && (
              <p className="text-red-500 text-sm mt-1">{errors.compliment}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrganization;
