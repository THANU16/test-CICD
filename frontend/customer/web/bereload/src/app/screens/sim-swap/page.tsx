"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import FooterSection from "@/components/common/FooterSection";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimSwapService, { formatCurrentDate } from "@/services/sim-swap-service";
import SimRequestCard from "@/components/SimSwapRequestCard";

export default function SimSwapPage() {
  const [activeTab, setActiveTab] = useState("newRequest");
  const [selectedReason, setSelectedReason] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const [oldNumber, setOldNumber] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [simSerialNumber, setSimSerialNumber] = useState("");
  const [frequentDialingNumber, setFrequentDialingNumber] = useState("");
  
  const [requests, setRequests] = useState(SimSwapService.requests);

  useEffect(() => {
    const isValid =
      oldNumber.length > 5 &&
      newNumber.length > 5 &&
      simSerialNumber.length > 0 &&
      frequentDialingNumber.length > 5 &&
      selectedReason !== "" &&
      termsAccepted;

    setFormValid(isValid);
  }, [
    oldNumber,
    newNumber,
    simSerialNumber,
    frequentDialingNumber,
    selectedReason,
    termsAccepted,
  ]);

  const reasonOptions = ["SIM damaged", "SIM lost", "Network issue", "Other"];

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleOldNumberChange = (value: string) => {
    setOldNumber(value);
  };

  const handleNewNumberChange = (value: string) => {
    setNewNumber(value);
  };

  const handleFrequentNumberChange = (value: string) => {
    setFrequentDialingNumber(value);
  };

  const handleSubmit = () => {
    let hasErrors = false;

    if (!oldNumber || oldNumber.length <= 5) {
      toast.error("Please enter your old number");
      hasErrors = true;
    }

    if (!newNumber || newNumber.length <= 5) {
      toast.error("Please enter your new SIM number");
      hasErrors = true;
    }

    if (!simSerialNumber) {
      toast.error("Please enter your SIM serial number");
      hasErrors = true;
    }

    if (!frequentDialingNumber || frequentDialingNumber.length <= 5) {
      toast.error("Please enter a frequent dialing number");
      hasErrors = true;
    }

    if (!selectedReason) {
      toast.error("Please select a reason for SIM swap");
      hasErrors = true;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      hasErrors = true;
    }

    if (!hasErrors) {
      // Add the new request to the service
      SimSwapService.addRequest({
        date: formatCurrentDate(),
        status: "Pending",
        oldNumber: oldNumber,
        newNumber: newNumber,
        reason: selectedReason
      });
      
      // Update the local state
      setRequests([...SimSwapService.requests]);
      
      toast.success("Request submitted successfully");
      
      // Reset form
      setOldNumber("");
      setNewNumber("");
      setSimSerialNumber("");
      setFrequentDialingNumber("");
      setSelectedReason("");
      setTermsAccepted(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar index={3} />
      <div className="bg-gray-200 h-[300px] max-w-[2000px] mx-auto">
        <div className="sm:pt-[160px] pt-[110px] px-4 lg:px-28 py-8 mx-auto max-w-[1800px]">
          <h1 className="heading1 text-left mb-3">SIM Swap</h1>
          <p className="text-lg text-gray-600 mb-8 sm:w-[65%] w-full">
            Provide the necessary details to process your SIM swap request and
            activate the new SIM.{" "}
          </p>
        </div>
      </div>
      <div className="px-4 mt-8 lg:px-28 mx-auto max-w-[1800px]">
        <div className="flex flex-row gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab("newRequest")}
            className={`${
              activeTab === "newRequest" ? "text-gray-900" : "text-gray-500"
            } relative pb-4`}
          >
            New request
            {activeTab === "newRequest" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`${
              activeTab === "all" ? "text-gray-900" : "text-gray-500"
            } relative pb-4`}
          >
            All requests
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
        <div className="h-px bg-gray-300 w-full" />

        <div className="mt-10">
          {activeTab === "newRequest" ? (
            <div>
              <div className="flex sm:flex-row flex-col gap-2 sm:gap-6">
                <div className="w-full">
                  <span className="font-medium text-gray-600">
                    Old number <span className="text-red-500">*</span>
                  </span>

                  <div className="relative space-y-[0.5px] mt-2 mb-6 w-full">
                    <PhoneInput
                      country="be"
                      value={oldNumber}
                      onChange={handleOldNumberChange}
                      inputProps={{
                        name: "oldNumber",
                        id: "oldNumber",
                        required: true,
                        autoComplete: "tel",
                        className:
                          "mt-[-0.5px] w-full pl-[50px] pr-[12px] py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 mt-1",
                      }}
                      containerClass="!static"
                      buttonClass="!absolute !top-1/2 !-translate-y-1/2 !left-2 !z-10 !border-none !bg-transparent !size-8"
                      dropdownClass="!absolute !top-full !left-0 !mt-1"
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Search countries"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <span className="font-medium text-gray-600">
                    New SIM number <span className="text-red-500">*</span>
                  </span>
                  <div className="relative space-y-[0.5px] mt-2 mb-6 w-full">
                    <PhoneInput
                      country="be"
                      value={newNumber}
                      onChange={handleNewNumberChange}
                      inputProps={{
                        name: "newNumber",
                        id: "newNumber",
                        required: true,
                        autoComplete: "tel-national",
                        className:
                          "mt-[-0.5px] w-full pl-[50px] pr-[12px] py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 mt-1",
                      }}
                      containerClass="!static"
                      buttonClass="!absolute !top-1/2 !-translate-y-1/2 !left-2 !z-10 !border-none !bg-transparent !size-8"
                      dropdownClass="!absolute !top-full !left-0 !mt-1"
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Search countries"
                    />
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-2 sm:gap-6">
                <div className="w-full">
                  <span className="font-medium text-gray-600">
                    New SIM serial number{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <div className="flex mt-2 mb-6">
                    <div className="bg-gray-50 flex items-center px-3 py-[14px] border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                      89320600
                    </div>
                    <input
                      type="text"
                      value={simSerialNumber}
                      onChange={(e) => setSimSerialNumber(e.target.value)}
                      className="flex-1 pl-3 pr-[12px] py-[14px] border border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                      placeholder="Enter remaining digits"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <span className="font-medium text-gray-600">
                    Frequent dialing number{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <div className="relative space-y-[0.5px] mt-2 mb-6 w-full">
                    <PhoneInput
                      country="be"
                      value={frequentDialingNumber}
                      onChange={handleFrequentNumberChange}
                      inputProps={{
                        name: "frequentDialingNumber",
                        id: "frequentDialingNumber",
                        required: true,
                        autoComplete: "tel",
                        className:
                          "mt-[-0.5px] w-full pl-[50px] pr-[12px] py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 mt-1",
                      }}
                      containerClass="!static"
                      buttonClass="!absolute !top-1/2 !-translate-y-1/2 !left-2 !z-10 !border-none !bg-transparent !size-8"
                      dropdownClass="!absolute !top-full !left-0 !mt-1"
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Search countries"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <span className="font-medium text-gray-600">
                  Reason for SIM swap <span className="text-red-500">*</span>
                </span>
                <div className="mt-2 space-y-2 sm:w-[49%]">
                  {reasonOptions.map((reason) => (
                    <div
                      key={reason}
                      className={`border ${
                        selectedReason === reason
                          ? "border-primary border-2"
                          : "border-gray-300"
                      } rounded-lg p-3 cursor-pointer`}
                      onClick={() => handleReasonSelect(reason)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            selectedReason === reason
                              ? "border-primary bg-primary"
                              : "border-gray-400"
                          } flex items-center justify-center mr-3`}
                        >
                          {selectedReason === reason && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">
                          {reason}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="relative">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="w-5 h-5 opacity-0 absolute cursor-pointer"
                    />
                    <div
                      className={`w-5 h-5 border ${
                        termsAccepted
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      } rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200`}
                    >
                      {termsAccepted && (
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
                    htmlFor="terms"
                    className="ml-3 text-gray-600 font-medium"
                  >
                    I agree to the{" "}
                    <span className="underline cursor-pointer">
                      Terms and conditions
                    </span>
                    . <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className={`sm:w-[30%] w-full py-4 rounded-lg text-center font-semibold ${
                  formValid
                    ? "bg-primary text-black hover:opacity-90"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Send Request
              </button>
            </div>
          ) : (
            <div className="py-6">
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xl font-bold text-gray-500">
                    It looks like you haven&apos;t submitted any SIM swap requests yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <SimRequestCard
                      key={index}
                      date={request.date}
                      status={request.status}
                      oldNumber={request.oldNumber}
                      newNumber={request.newNumber}
                      reason={request.reason}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="pt-[100px]">
        <FooterSection />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}