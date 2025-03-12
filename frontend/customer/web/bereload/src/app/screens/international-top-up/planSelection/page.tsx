"use client";

import React, { useState, useEffect, createContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import DataPackageCard from "@/components/international-top-up/DatapackageCard";
import MobileTopupSection from "@/components/international-top-up/MobileTopupCard";
import FaqSection from "@/components/common/FaqSection";
import FooterSection from "@/components/common/FooterSection";
import RedeemInstructions from "@/components/common/RedeemInstructions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckoutData } from "@/types";

export const ManualTopupContext = createContext<boolean>(false);

export default function InternationalTopupPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isManualTopup, setIsManualTopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [manualAmount, setManualAmount] = useState("");

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (phone) {
      const formattedPhone = formatPhoneNumber(phone);
      setPhoneNumber(formattedPhone);
    }
  }, [searchParams]);

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return "";

    if (phone.startsWith("+")) {
      return phone;
    }
 
    const countryCodeEnd = Math.min(2, phone.length);
    return `+${phone.substring(0, countryCodeEnd)} ${phone.substring(
      countryCodeEnd
    )}`;
  };

  const handleChange = () => {
    router.push("/screens/international-top-up/");
  };

  const handleCheckboxChange = () => {
    setIsManualTopup(!isManualTopup);
  };

  const handleManualTopup = () => {
    if (!manualAmount || parseFloat(manualAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please provide a valid phone number");
      return;
    }

    const checkoutData: CheckoutData = {
      type: "topup",
      price: `€${manualAmount}`,
      quantity: 1,
      phoneNumber,
      isInternational: true,
      isManual: true
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    
    router.push("/screens/international-top-up/checkout");
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar index={2} />
      <ToastContainer />
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
          Network provider & Delivery mobile number
        </h2>
        <p className="text-gray-500 font-medium mb-8">
          Confirm the phone number and network provider, or update them if
          needed.
        </p>
        <h3 className="text-gray-500 mb-4">Network provider</h3>
        <div className="gap-2 flex items-center mb-6">
          <Image
            src="/lycalogo.png"
            alt="LycaLogo"
            width={32}
            height={32}
            priority
            className="select-none"
          />
          <span className="font-semibold text-gray-900">Lycamobile</span>
        </div>
        <h3 className="text-gray-500 mb-4">Phone number</h3>
        <div className="sm:w-[40%] w-full">
          <div className="flex justify-between">
            <span className="text-gray-900 font-semibold">
              {phoneNumber || "No phone number provided"}
            </span>
            <button
              onClick={handleChange}
              className="bg-gray-200 hover:bg-gray-100 py-1 px-3 rounded-xl text-sm text-gray-600 font-semibold"
            >
              Change
            </button>
          </div>
        </div>
        <div className="h-px bg-gray-300 w-full my-10" />
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Explore available plans & packages{" "}
        </h2>
        <p className="text-gray-500 font-medium mb-10">
          Please enter the top-up amount manually or choose from the available
          options below.
        </p>
        <div className="flex gap-2 items-center mb-6">
          <div className="relative">
            <input
              type="checkbox"
              id="manual-topup"
              checked={isManualTopup}
              onChange={handleCheckboxChange}
              className="w-5 h-5 opacity-0 absolute cursor-pointer"
            />
            <div
              className={`w-5 h-5 border ${
                isManualTopup
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              } rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200`}
            >
              {isManualTopup && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <label
            htmlFor="manual-topup"
            className="text-gray-900 font-medium cursor-pointer"
          >
            Enter top-up amount
          </label>
        </div>

        {isManualTopup && (
          <div className="flex flex-col gap-3 sm:w-[40%] w-full mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-0.5 pointer-events-none">
                <span className="text-gray-600 text-xl font-medium bg-slate-50 border-r border-r-gray-300 rounded-tl-lg rounded-bl-lg px-4 py-3.5">
                  €
                </span>
              </div>
              <input
                type="number"
                className="w-full pl-16 px-10 py-4 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter amount"
                min="1"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
              />
            </div>
            <button 
              onClick={handleManualTopup}
              className="w-full px-7 py-4 bg-primary text-gray-900 font-semibold rounded-lg hover:bg-primary/80"
            >
              Top-up now
            </button>
          </div>
        )}
      </div>

      <div className="pt-8">
        <ManualTopupContext.Provider value={isManualTopup}>
          <DataPackageCard />
          <MobileTopupSection />
          <RedeemInstructions />
          <FaqSection />
        </ManualTopupContext.Provider>
        <FooterSection />
      </div>
    </main>
  );
}