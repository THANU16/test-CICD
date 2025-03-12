"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import { FiPlus, FiMinus } from "react-icons/fi";
import FooterSection from "@/components/common/FooterSection";
import type { CheckoutData } from "@/types";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InternationalCheckoutPage() {
  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isManualTopup, setIsManualTopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("checkoutData");
      if (!storedData) {
        router.push("/screens/international-top-up");
        return;
      }
      const parsedData = JSON.parse(storedData);
      setCheckoutData(parsedData);
      
      // Check if this is a manual top-up (doesn't have planName for data package)
      // and is a topup type without predefined options
      setIsManualTopup(
        parsedData.type === "topup" && 
        !parsedData.planName && 
        parsedData.hasOwnProperty("isManual")
      );
      
      if (parsedData.phoneNumber) {
        setPhone(parsedData.phoneNumber);
        setPhoneValid(true);
      }
      
      if (parsedData.quantity) {
        setQuantity(parsedData.quantity);
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
      router.push("/screens/international-top-up");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/Logo.svg"
            alt="logo"
            width={180}
            height={48}
            priority
            className="select-none"
          />
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  const handleQuantityChange = (increment: boolean) => {
    if (!checkoutData?.type || checkoutData.type === "data-package" || isManualTopup) return;

    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : Math.max(1, prev - 1);
      const updatedData = { ...checkoutData, quantity: newQuantity };
      sessionStorage.setItem("checkoutData", JSON.stringify(updatedData));
      return newQuantity;
    });
  };

  const calculateTotal = () => {
    if (!checkoutData) return "€0.00";
    const basePrice = parseFloat(checkoutData.price.replace("€", ""));
    const serviceFee = 1.5;
    return `€${(basePrice * quantity + serviceFee).toFixed(2)}`;
  };

  const getSubtotal = () => {
    if (!checkoutData) return "€0.00";
    const basePrice = parseFloat(checkoutData.price.replace("€", ""));
    return `€${(basePrice * quantity).toFixed(2)}`;
  };

  const handlePhoneChange = (value: string, data: { dialCode: string }) => {
    setPhone(value);
    setPhoneValid(value.length >= data.dialCode.length + 6);
  };

  const handlePaymentSubmission = () => {
    if (!phoneValid) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    const paymentDetails = {
      phoneNumber: phone,
      selectedPayment,
      quantity: isManualTopup ? 1 : quantity,
      checkoutData,
      timestamp: new Date().toISOString(),
      reference: `#${Math.floor(Math.random() * 90000000) + 10000000}`,
      isManual: isManualTopup
    };
    sessionStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));

    router.push("/screens/international-top-up/paymentStatus");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar index={2} />
      <ToastContainer />
      <div className="px-4 lg:px-[120px] pt-[144px] lg:pt-[184px] h-auto max-w-[1800px] mx-auto">
        <div className="w-full sm:w-[60%]">
          <h1 className="heading1 text-left mb-4">Checkout</h1>
          <p className="text-xl text-gray-600 mb-10">
            Complete your purchase with confidence. Confirm the phone number to receive your top-up
            and choose from multiple secure payment options.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col gap-6 w-full mb-[120px]">
          <div className="flex flex-col gap-6 sm:w-[60%] w-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Delivery mobile number
              </h2>
              <p className="text-gray-600 font-medium mb-6">
                Your international top-up will be applied to the mobile number
                you provide below.
              </p>
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
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Payment method
              </h2>
              <p className="text-gray-600 font-medium mb-6">
                Safe and secure payment
              </p>
              <div className="flex flex-col gap-3">
                <div
                  onClick={() => setSelectedPayment("visa")}
                  className={`p-3 flex gap-3 items-center justify-start border ${
                    selectedPayment === "visa"
                      ? "border-primary border-2"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors`}
                >
                  <Image
                    src="/visa.png"
                    alt="visa"
                    width={60}
                    height={40}
                    priority
                    className="select-none"
                  />
                  <span className="text-gray-900 font-medium">Visa</span>
                </div>
                <div
                  onClick={() => setSelectedPayment("master")}
                  className={`p-3 flex gap-3 items-center justify-start border ${
                    selectedPayment === "master"
                      ? "border-primary border-2"
                      : "border-gray-300 "
                  } rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors`}
                >
                  <Image
                    src="/master.png"
                    alt="master"
                    width={60}
                    height={40}
                    priority
                    className="select-none"
                  />
                  <span className="text-gray-900 font-medium">Master</span>
                </div>
                <div
                  onClick={() => setSelectedPayment("bancontact")}
                  className={`p-3 flex gap-3 items-center justify-start border ${
                    selectedPayment === "bancontact"
                      ? "border-primary border-2"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors`}
                >
                  <Image
                    src="/bancontact.png"
                    alt="bancontact"
                    width={60}
                    height={40}
                    priority
                    className="select-none"
                  />
                  <span className="text-gray-900 font-medium">Bancontact</span>
                </div>
                <div
                  onClick={() => setSelectedPayment("paypal")}
                  className={`p-3 flex gap-3 items-center justify-start border ${
                    selectedPayment === "paypal"
                      ? "border-primary border-2"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors`}
                >
                  <Image
                    src="/paypal.png"
                    alt="paypal"
                    width={60}
                    height={40}
                    priority
                    className="select-none"
                  />
                  <span className="text-gray-900 font-medium">Paypal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md sm:w-[40%] w-full h-fit">
            <div className="flex justify-between">
              <div className="flex justify-start items-center gap-3">
                <Image
                  src="/lycalogo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  priority
                  className="select-none"
                />
                <span className="text-xl font-bold text-gray-900">
                  {checkoutData?.planName ||
                    `Lycamobile ${checkoutData?.price}`}
                </span>
              </div>

              {checkoutData?.type === "topup" && !isManualTopup && (
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <FiMinus className="text-gray-900 text-base cursor-pointer" />
                  </button>
                  <span className="text-base text-gray-900 font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(true)}
                    className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <FiPlus className="text-gray-900 text-base cursor-pointer" />
                  </button>
                </div>
              )}
            </div>

            {checkoutData?.type === "data-package" && (
              <div className="mt-3 flex flex-col gap-1 font-medium text-gray-500">
                <span>
                  {checkoutData.gb} Data / {checkoutData.validityText}
                </span>
                {checkoutData.features && checkoutData.features.length > 0 && (
                  <span>{checkoutData.features[0]}</span>
                )}
              </div>
            )}

            <div className="w-full h-px bg-gray-300 my-5" />
            <div className="flex flex-col gap-4">
              <div className="flex justify-between font-medium text-gray-700">
                <span>
                  {checkoutData?.planName ||
                    `Lycamobile ${checkoutData?.price}`}
                  {checkoutData?.type === "topup" && !isManualTopup ? ` x ${quantity}` : ""}
                </span>
                <span>{getSubtotal()}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-700">
                <span>Service fee</span>
                <span>€1.50</span>
              </div>
              <svg className="w-full h-4" xmlns="http://www.w3.org/2000/svg">
                <line
                  x1="0"
                  y1="2"
                  x2="100%"
                  y2="2"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                  strokeDasharray="8 12"
                />
              </svg>
            </div>
            <div className="flex mb-6 justify-between text-lg font-bold text-gray-700">
              <span>Total</span>
              <span>{calculateTotal()}</span>
            </div>
            <button
              onClick={handlePaymentSubmission}
              className="p-4 w-full bg-primary text-gray-900 font-medium rounded-lg hover:bg-primary/80 transition-opacity"
            >
              Continue to payment
            </button>
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}