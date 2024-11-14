"use client";
import React, { useEffect, useState } from "react";
import { CountryCodeSelect } from "../CountryCodeSelect";

import * as Yup from "yup";
import { useMobileLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";

interface LoginWithMobileProps {
  setOtpSent: (value: boolean) => void;
}

const schema = Yup.object().shape({
  countryCode: Yup.string().required("Please select your country code!"),
  phoneNumber: Yup.string().required("Please enter your phone number!"),
});

export const LoginWithMobile: React.FC<LoginWithMobileProps> = ({ setOtpSent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [login, { data, isError, error, isSuccess, isLoading }] =
    useMobileLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "OTP sent successfully";
      toast.success(message);
      setOtpSent(true);
    }
    if (isError) {
      const errorData = error as any;
      console.log("errorData: ", errorData);
      toast.error(errorData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess]);

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      countryCode: "+91",
    },
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const data = {
          phone: `${values.countryCode}${values.phoneNumber}`,
        };
        await login(data);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <CountryCodeSelect
              value={values.countryCode}
              onChange={handleChange("countryCode")}
            />
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 px-3 py-2 border rounded-md"
              id="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <span className="text-red-500 pt-2 block">
                {errors.phoneNumber}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full py-2.5 rounded-md transition-all duration-200 font-medium
            ${
              isSubmitting || isLoading
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            relative overflow-hidden
          `}
            onClick={() => formik.handleSubmit()}
          >
            <div className="flex items-center justify-center gap-2">
              {(isSubmitting || isLoading) && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>
                {isSubmitting || isLoading ? "Processing..." : "Get OTP"}
              </span>
            </div>
          </button>
        </div>
      </form>
  );
};
