/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import FooterSection from "@/components/common/FooterSection";
import Navbar from "@/components/common/Navbar";
import { FaCircleCheck } from "react-icons/fa6";

export default function InternationalPaymentStatusPage() {
  const [paymentDetails, setPaymentDetails] = React.useState<any>(null);
  
  React.useEffect(() => {
    const details = sessionStorage.getItem("paymentDetails");
    if (details) {
      setPaymentDetails(JSON.parse(details));
    }
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  
  if (!paymentDetails) return null;
  
  const isManualTopup = paymentDetails.checkoutData.isManual === true;
  
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar index={2} />
      <div className="px-4 lg:px-[120px] pt-[144px] lg:pt-[184px] h-auto max-w-[1800px] mx-auto">
        <div className="flex justify-center mx-auto">
          <div className="sm:w-[50%] w-full mb-[120px] p-6 rounded-lg shadow-lg bg-white">
            <div className="flex flex-col justify-center">
              <div className="mb-6 flex mx-auto justify-center items-center w-[70px] h-[70px] rounded-full border bg-green-100 border-primary">
                <FaCircleCheck className="text-green-700 text-4xl" />
              </div>
              <span className="sm:text-3xl text-2xl text-gray-900 font-bold text-center">
                Payment Successful!
              </span>
              <span className="mt-2 mx-auto w-[90%] text-lg text-gray-500 text-center">
                Thank you for your purchase. The amount has been sent to the{" "}
                {paymentDetails.phoneNumber} you provided.
              </span>
            </div>
            <div className="h-px w-full bg-gray-300 my-6" />
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between">
                <span className="label">Date & Time</span>
                <span className="value">
                  {formatDate(paymentDetails.timestamp)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="label">Reference</span>
                <span className="value">{paymentDetails.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="label">Payment method</span>
                <span className="value">{paymentDetails.selectedPayment}</span>
              </div>
              {paymentDetails.checkoutData.type === "topup" && !isManualTopup && (
                <div className="flex justify-between">
                  <span className="label">Quantity</span>
                  <span className="value">{paymentDetails.quantity}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="label">Purchased</span>
                <span className="value">
                  {paymentDetails.checkoutData.type === "data-package"
                    ? `${paymentDetails.checkoutData.planName} - ${paymentDetails.checkoutData.price}`
                    : paymentDetails.checkoutData.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="label">Phone Number</span>
                <span className="value">{paymentDetails.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}