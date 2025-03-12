"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import FooterSection from "@/components/common/FooterSection";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InternationalTopupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [valid, setValid] = useState(false);

  const handlePhoneChange = (value: string, data: { dialCode: string }) => {
    setPhone(value);
    setValid(value.length >= data.dialCode.length + 6);
  };

  const handleTopUpNow = () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }
    
    if (!valid) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    router.push(`/screens/international-top-up/planSelection?phone=${encodeURIComponent(phone)}`);
  };
  // bg-gradient-to-r from-white via-[#05e27e3b] to-[#05e27e77]

  return (
    <main className="min-h-screen bg-white">
      <Navbar index={2} />
      <div className="bg-gray-200 h-[350px] max-w-[2000px] mx-auto">
        <div className="sm:pt-[160px] pt-[110px] px-4 lg:px-28 py-8 mx-auto max-w-[1800px]">
          <h1 className="heading1 text-left mb-3">International Top-up</h1>
          <p className="text-lg text-gray-600 mb-8 sm:w-[65%] w-full">
            Recharge your mobile seamlessly, anywhere in the world. Enter your
            phone number and enjoy instant top-up with secure payment options.{" "}
          </p>
        </div>
      </div>
      <div className="px-4 mt-8 lg:px-28 mx-auto max-w-[1800px]">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Ready to send top-up?
        </h2>
        <p className="text-gray-500 font-medium mb-8">
          Confirm the phone number and network provider, or update them if
          needed.
        </p>
        <span className="text-gray-600 font-medium">Enter mobile number</span>
        <div className="sm:w-[50%] w-full mt-2">
          <div className="relative space-y-[0.5px] mb-6">
            <PhoneInput
              country="be"
              value={phone}
              onChange={handlePhoneChange}
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
          </div>
          <button
            onClick={handleTopUpNow}
            className="w-full px-7 py-4 bg-primary text-gray-900 font-medium text-sm rounded-lg hover:bg-primary/80"
          >
            Top-up now
          </button>
        </div>
      </div>

      <div className="pt-[100px] ">
        <FooterSection />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}