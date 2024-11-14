"use client";
import React, { useEffect, useState } from "react";
import { LoginFormData, UserType } from "../types";
import { Logo } from "../Logo";
import { CountryCodeSelect } from "../CountryCodeSelect";

import * as Yup from "yup";
import { useEmailLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { redirect } from "next/navigation";

interface LoginWithEmailProps {}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

export const LoginWithEmail: React.FC<LoginWithEmailProps> = ({}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [login, { isSuccess, error, data, isLoading }] = useEmailLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      setIsSubmitting(true);
      await login({ email, password });
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged In successfully!");
      redirect("/");
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="w-full px-3 py-2 border rounded-md"
          value={values.email}
          onChange={handleChange("email")}
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md"
          value={values.password}
          onChange={handleChange("password")}
        />
        {touched.password && errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
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
              {isSubmitting || isLoading ? "Processing..." : "Log In"}
            </span>
          </div>
        </button>
      </div>
    </form>
  );
};
