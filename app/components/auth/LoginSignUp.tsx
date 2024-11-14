"use client";
import React, { useState } from "react";
import { LoginForm } from "./login/LoginForm";
import { SignUpForm } from "./SignUpForm";
import { OTPInput } from "./OTPInput";

export const LoginSignup: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white text-black p-4">
      {otpSent ? (
        <OTPInput length={4} />
      ) : showSignup ? (
        <SignUpForm onClose={() => setShowSignup(false)} setOtpSent={setOtpSent} />
      ) : (
        <LoginForm onSignupClick={() => setShowSignup(true)} setOtpSent={setOtpSent}/>
      )}
      <div className="text-center text-gray-500 text-sm mt-8">
        copyright©2024 LabQuik
      </div>
    </div>
  );
};

export default LoginSignup;
