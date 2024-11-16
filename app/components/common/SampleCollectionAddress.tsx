"use client";
import React, { useEffect, useState } from "react";
import { useAddSampleCollectionAddressMutation } from "@/redux/features/patient/addSampleCollectionAddress";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
interface SampleCollectionAddressProps {
  onSave: (address: string) => void;
  onClose: () => void;
}
const schema = yup.object({
  address: yup.string().required("Address is required"),
});

const SampleCollectionAddress: React.FC<SampleCollectionAddressProps> = ({
  onSave,
  onClose,
}) => {
  
  const [addSampleCollectionAddress, { isSuccess, error, isLoading }] = useAddSampleCollectionAddressMutation();
const formik = useFormik({
  initialValues: {
    address: "",
  },
    validationSchema: schema,
    onSubmit: async (values) => {
      await addSampleCollectionAddress(values);
    },
  }); 

  useEffect(() => {
    if (isSuccess) {
      toast.success("Sample Collection Address added successfully!");
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
    <div className="p-4 text-[#000000]">
      <h2 className="text-xl font-semibold mb-4">Add Collected at</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <textarea
              cols={4}
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Enter new address"
              className="flex-grow px-2 py-1 border rounded"
            />
            {touched.address && errors.address && (
              <p className="text-red-500">{errors.address}</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SampleCollectionAddress;
