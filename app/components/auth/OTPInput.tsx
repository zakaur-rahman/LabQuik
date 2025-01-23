"use client";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";
import React, {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

interface OTPInputProps {
  length?: number;
  onChange?: (value: string) => void;
  value?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onChange = () => {},
  value = "",
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const {token}  = useSelector((state: any) => state.auth);



  const [invalidError, setInvalidError] = useState<boolean>(false);
  const [activation, { error, isSuccess }] = useActivationMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged in successfully");
      redirect("/admin");
    }
    if (error) {
      const errorData = error as any;
      console.log("errorData: ", errorData);
      toast.error(errorData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess]);

  //Handle otp input
  const handleChange = (index: number, value: string) => {
    setInvalidError(false);
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    if (sanitizedValue.length > 1) {
      const chars = sanitizedValue.split("");
      const newOtp = [...otp];

      chars.forEach((char, charIndex) => {
        const targetIndex = index + charIndex;
        if (targetIndex < length) {
          newOtp[targetIndex] = char;
        }
      });

      setOtp(newOtp);
      onChange(newOtp.join(""));

      const nextIndex = Math.min(index + chars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = sanitizedValue;
      setOtp(newOtp);
      onChange(newOtp.join(""));

      if (sanitizedValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index]) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.join("").length !== 4) {
      setInvalidError(true);
      toast.error("Please enter a complete 4-digit code");
      return;
    }
    
    setInvalidError(false);
    await activation({
      token: token,
      otp: otp.join(""),
    });
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  useEffect(() => {
    if (value) {
      const newOtp = value
        .slice(0, length)
        .split("")
        .concat(Array(length - value.length).fill(""));
      setOtp(newOtp);
    }
  }, [value, length]);

  return (
    <div className="flex gap-8 my-6 border-2 border-gray-200 bg-white rounded-lg p-4 flex-col py-20 w-full max-w-[400px] items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Verify Your Account</h1>
        <br />
        <div className="w-full flex items-center justify-center mt-2">
          <div className=" w-[80px] h-[80px] rounded-full bg-blue-500 flex items-center justify-center ">
            <VscWorkspaceTrusted size={40} />
          </div>
        </div>
        <br />
        <br />
        <div className="flex flex-row gap-4">
          {Array(length)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={`w-12 h-12 text-center  border rounded-md text-lg 
            transition-all duration-200
            focus:border-blue-200 focus:ring-1 focus:ring-blue-200
            hover:border-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed ${invalidError ? "border-red-500 shake" : "border-gray-200"}`}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoComplete="off"
              />
            ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-[6px] mt-4 max-w-[200px] rounded-md hover:bg-blue-600 transition-colors"
        onClick={handleVerify}
      >
        Verify
      </button>
    </div>
  );
};
