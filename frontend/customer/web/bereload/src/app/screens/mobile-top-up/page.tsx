"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import DataPackageCard from "@/components/DatapackageCard";
import MobileTopupSection from "@/components/MobileTopupCard";
import FaqSection from "@/components/common/FaqSection";
import FooterSection from "@/components/common/FooterSection";
import RedeemInstructions from "@/components/common/RedeemInstructions";

export default function Home() {
  return (
    <main className="min-h-screen  bg-white">
      <Navbar index={1} />
      {/* bg-gradient-to-r from-white via-[#05e27e3b] to-[#05e27ee5] */}
      {/* bg-gradient-to-r from-white via-[#05e27e3b] to-[#05e27e77] */}
      <div className=" bg-gray-200 relative sm:h-[280px] h-[200px] max-w-[2000px] mx-auto">
        <div className="bg-gray-200 relative sm:h-[280px] h-[200px] max-w-[1800px] mx-auto">
          <Image
            src="/biglogo.png"
            alt="LycaLogo"
            width={120}
            height={120}
            priority
            className="absolute -bottom-1/4 sm:left-28 left-4 "
          />
        </div>
      </div>

      <div className="pt-[100px] ">
        <div className="px-4 lg:px-28 mx-auto max-w-[1800px]">
          <h1 className="heading1 text-left  mb-3">Lycamobile</h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore the plans and packages from Lycamobile.
          </p>
        </div>
        <DataPackageCard />
        <MobileTopupSection />
        <RedeemInstructions />
        <FaqSection />
        <FooterSection />
      </div>
    </main>
  );
}
