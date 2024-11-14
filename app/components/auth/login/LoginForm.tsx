"use client";
import React, { useState } from "react";
import { UserType } from "../types";
import { Logo } from "../Logo";
import { LoginWithMobile } from "./LoginWithMobile";
import { LoginWithEmail } from "./LoginWithEmail";
import * as Yup from "yup";

interface LoginFormProps {
  onSignupClick: () => void;
  setOtpSent: (value: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSignupClick, setOtpSent}) => {

  const [loginWithPassword, setLoginWithPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<UserType>("Admin");

  const tabs: UserType[] = ["User", "Admin", "Organisation", "B2B"];
  const isOTPAllowed = activeTab === "User" || activeTab === "Admin";


  const handleTabChange = (tab: UserType) => {
    setActiveTab(tab);
    if (tab === "Organisation" || tab === "B2B") {
      setLoginWithPassword(true);
    }
  };

  const handlePasswordToggle = () => {
    setLoginWithPassword(!loginWithPassword);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <Logo />
      <h2 className="text-xl font-semibold mt-4 text-center">Log In</h2>

      <div className="flex mb-12 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
              }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {!loginWithPassword && isOTPAllowed ? (
        <LoginWithMobile setOtpSent={setOtpSent} />
      ) : (
        <LoginWithEmail />
      )}

      <div className="flex flex-col gap-4">
        {isOTPAllowed && (
          <div className="flex justify-center gap-4 pt-4 flex-col items-center">
            <span className="text-gray-500">OR</span>
            <button
              type="button"
              className="w-full text-gray-600 py-[6px] border rounded-md hover:bg-gray-50 transition-colors"
              onClick={handlePasswordToggle}
            >
              {loginWithPassword ? "Log In with OTP" : "Log In with password"}
            </button>
          </div>
        )}
      </div>

      {activeTab === "Admin" && (
        <div className="flex flex-row gap-1 justify-center text-sm items-center mt-2">
          <span>Don&apos;t have an account?</span>
          <button
            className="text-blue-500 hover:underline"
            onClick={onSignupClick}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};
