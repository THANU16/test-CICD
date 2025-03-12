"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendar } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScreenIndicator from "@/components/common/ScreenIndicator";

const DateOfBirth = () => {
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [totalScreens, setTotalScreens] = useState(3);
  const isFirstMount = useRef(true);

  useEffect(() => {
    console.log(
      "Current isPhoneFlow value:",
      sessionStorage.getItem("isPhoneFlow")
    );
    const isPhoneFlow = sessionStorage.getItem("isPhoneFlow") === "true";
    setTotalScreens(isPhoneFlow ? 5 : 3);
    return () => {
      if (!isFirstMount.current) {
        sessionStorage.removeItem("isPhoneFlow");
      }
      isFirstMount.current = false;
    };
  }, []);

  const handleContinue = () => {
    if (!dateOfBirth) {
      toast.error("Please select your date of birth", {});
      return;
    }
    sessionStorage.removeItem("isPhoneFlow");
    router.push("/screens/landingpage");
  };

  const handleSkip = () => {
    sessionStorage.removeItem("isPhoneFlow");
    router.push("/screens/landingpage");
  };

  return (
    <div className="min-h-screen max-w-[1800px] mx-auto bg-white">
      <ScreenIndicator
        totalScreens={totalScreens}
        currentScreen={totalScreens - 1}
      />
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
            Date of Birth
          </h1>
          <div className="mt-8 w-full">
            <div className="relative w-full">
              <div className="absolute left-[2px] top-1/2 border-r-2 border-r-gray-300 transform -translate-y-1/2 text-gray-500 bg-gray-50 p-[18px] rounded-bl-lg rounded-tl-lg z-10">
                <FaRegCalendar className="w-5 h-5" />
              </div>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date) => setDateOfBirth(date)}
                dateFormat="MM/dd/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="Select your date of birth"
                maxDate={new Date()}
                className="w-full pl-20 pr-4 py-4 border-2 border-gray-300 rounded-lg font-inter font-semibold text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                calendarClassName="border border-gray-200 shadow-lg rounded-lg"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="mt-8 w-full p-4 rounded-lg bg-primary text-gray-900 font-inter font-medium text-base hover:bg-primary/90"
          >
            Continue
          </button>
          <button
            onClick={handleSkip}
            className="mt-4 w-full text-center font-inter text-base font-semibold text-gray-900 hover:text-gray-500"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateOfBirth;
