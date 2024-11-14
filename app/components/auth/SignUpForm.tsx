"use client";
import React, { FC, useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

interface SignUpFormProps {
  onClose: () => void;
  setOtpSent: (value: boolean) => void;
}

const schema = Yup.object().shape({
  labName: Yup.string().required("Please enter your lab name!"),
  ownerName: Yup.string().required("Please enter your name!"),
  email: Yup.string().email("Invalid email").required("Please enter your email!"),
  phoneNumber: Yup.string()
    .required("Please enter your phone number!")
    .min(10, "Phone number must be at least 10 digits long"),
  countryCode: Yup.string().required("Please select your country code!"),
});

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onClose,
  setOtpSent,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [register, { data, isError, error, isSuccess, isLoading }] =
    useRegisterMutation();

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
      labName: "",
      ownerName: "",
      email: "",
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
          labName: values.labName,
          ownerName: values.ownerName,
          email: values.email,
          phone: `${values.countryCode}${values.phoneNumber}`,
        };
        await register(data);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="bg-white rounded-lg shadow-lg text-black p-8 w-full max-w-md">
      <Logo />
      <h2 className="text-xl font-semibold mt-4 text-center">
        Sign-Up for 7 days free trial!
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <div>
          <label htmlFor="labName">Lab Name</label>
          <input
            type="text"
            placeholder="Lab Name"
            className="w-full px-3 py-2 border rounded-md"
            value={values.labName}
            id="labName"
            onChange={handleChange("labName")}
          />
          {errors.labName && touched.labName && (
            <span className="text-red-500 pt-2 block">{errors.labName}</span>
          )}
        </div>
        <div>
          <label htmlFor="ownerName">Owner Name</label>
          <input
            type="text"
            placeholder="Owner Name"
            className="w-full px-3 py-2 border rounded-md"
            value={values.ownerName}
            id="ownerName"
            onChange={handleChange("ownerName")}
          />
          {errors.ownerName && touched.ownerName && (
            <span className="text-red-500 pt-2 block">{errors.ownerName}</span>
          )}
        </div>
        <div>
          <label htmlFor="email">Email Id</label>
          <input
            type="email"
            placeholder="Email Id"
            className="w-full px-3 py-2 border rounded-md"
            value={values.email}
            id="email"
            onChange={handleChange("email")}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>
        <div className="space-y-2 flex flex-col">
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="flex gap-2">
            <CountryCodeSelect
              value={values.countryCode}
              onChange={handleChange("countryCode")}
            />
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 px-3 py-2 border rounded-md"
              value={values.phoneNumber}
              id="phoneNumber"
              onChange={handleChange("phoneNumber")}
            />
          </div>
          {errors.phoneNumber && touched.phoneNumber && (
            <span className="text-red-500 pt-2 block">
              {errors.phoneNumber}
            </span>
          )}
        </div>
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

        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={onClose}
            >
              Log In
            </button>
          </p>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms & Condition
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
