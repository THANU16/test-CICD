"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScreenIndicator from "@/components/common/ScreenIndicator";

const PhoneVerify = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [isResendActive, setIsResendActive] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const phone = sessionStorage.getItem("userPhone");
    if (!phone) {
      router.push("/auth/signin/phone");
      return;
    }
    setUserPhone(phone);
  }, [router]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      } else {
        setIsResendActive(true);
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every((digit) => digit !== "")) {
      const enteredOtp = otp.join("");
      if (enteredOtp === "6666") {
        router.push("/auth/signin/phone/email");
      } else {
        toast.error("Incorrect OTP. Please try again.", {});
      }
    } else {
      toast.warning("Please enter all digits of the OTP.", {});
    }
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", ""]);
    setIsResendActive(false);
    inputRefs[0].current?.focus();
    toast.success("New OTP has been sent to your phone.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return userPhone ? (
    <div className="min-h-screen max-w-[1800px] mx-auto bg-white">
      <ScreenIndicator totalScreens={5} currentScreen={1} />
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-[450px]">
          <div className="flex justify-center">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={180}
              height={180}
              priority
              className="select-none"
            />
          </div>

          <h1 className="mt-6 text-center font-inter text-[30px] font-extrabold text-gray-900">
            OTP Verification
          </h1>

          <p className="mt-2 text-center font-inter text-base text-gray-500">
            Enter the verification code we just sent to{" "}
            <span className="font-semibold">&quot;+{userPhone}&quot;</span>
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="sm:w-[88px] w-[66px] sm:px-[34px] px-6 py-4 text-center sm:text-[22px] text-[22px] font-bold text-gray-900 border-[1.2px] border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={1}
              />
            ))}
          </div>

          <p className="mt-2 text-center font-inter text-base text-gray-900">
            Time remaining: <span className="font-semibold">{timer}s</span>
          </p>

          <button
            onClick={handleVerify}
            className="mt-8 w-full p-4 rounded-lg bg-primary text-gray-900 font-inter font-medium text-base hover:bg-primary/90"
          >
            Verify
          </button>

          <p className="mt-4 text-center font-inter text-base text-gray-600">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={!isResendActive}
              className={`font-semibold ${
                isResendActive
                  ? "text-gray-900 cursor-pointer"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              Re-send
            </button>
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export default PhoneVerify;
