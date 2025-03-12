"use client";

import React from "react";
import Navbar from "@/components/common/Navbar";
import FooterSection from "@/components/common/FooterSection";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";

export default function FindOurStorePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar index={4} />
      <div className="bg-gray-200 h-[350px] max-w-[2000px] mx-auto">
        <div className="sm:pt-[160px] pt-[110px] px-4 lg:px-28 py-8 mx-auto max-w-[1800px]">
          <h1 className="heading1 text-left mb-3">Find our store</h1>
          <p className="text-lg text-gray-600 mb-8 sm:w-[65%] w-full">
            Locate the nearest Lycamobile authorized seller with ease. Enter
            your postal code to find a store for top-ups, SIM purchases, and
            support services.
          </p>
        </div>
      </div>
      <div className="px-4 mt-8 lg:px-28 mx-auto max-w-[1800px]"></div>

      <div className="pt-[100px] ">
        <FooterSection />
      </div>
    </main>
  );
}
