"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ScreenIndicator from "@/components/common/ScreenIndicator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PhoneInputPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!phone) {
      toast.error("Phone number is required");
      return;
    }
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    sessionStorage.setItem("userPhone", phone);
    router.push("/auth/signin/phone/verify");
  };

  return (
    <div className="min-h-screen max-w-[1800px] mx-auto bg-white">
      <ScreenIndicator totalScreens={5} currentScreen={0} />
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
            Sign in to your account
          </h1>

          <div className="mt-8 space-y-6">
            <div className="relative space-y-[0.5px]">
              <PhoneInput
                country="be"
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                }}
                inputProps={{
                  name: "mobile",
                  required: true,
                  className:
                    "mt-[-0.5px] w-full pl-[50px] pr-[12px] py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 mt-1",
                }}
                containerClass="!static"
                buttonClass="!absolute !top-1/2 !-translate-y-1/2 !left-2 !z-10 !border-none !bg-transparent !size-8"
                dropdownClass="!absolute !top-full !left-0 !mt-1"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 font-inter">{error}</p>
              )}
            </div>

            <button
              onClick={handleVerify}
              className="w-full p-4 rounded-lg bg-primary text-gray-900 font-inter font-medium text-base hover:bg-primary/90"
            >
              Verify
            </button>

            <p className="text-center font-inter text-sm text-gray-700">
              By clicking on Sign in, I accept all the{" "}
              <span className="underline cursor-pointer">
                terms and conditions
              </span>{" "}
              of Berelord.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneInputPage;
