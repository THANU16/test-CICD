"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import DataPackageCard from "@/components/DatapackageCard";
import MobileTopupSection from "@/components/MobileTopupCard";
import QuickInternationalTopup from "@/components/landingpage/QuickInternationalTopup";
import PromotionBanner from "@/components/landingpage/PromotionBanner";
import FaqSection from "@/components/common/FaqSection";
import FooterSection from "@/components/common/FooterSection";
import FloatingImage from "@/components/common/FloatingImage";

export default function Home() {
  const router = useRouter();

  const handleExplorePlans = () => {
    router.push("/screens/mobile-top-up/");
  };
  return (
    <main className="min-h-screen  bg-white">
      <Navbar index={0} />
      <div
        className="px-4 lg:px-[120px] pt-[144px] lg:pt-[184px] h-auto max-w-[1800px] mx-auto"
        style={{
          background:
            "radial-gradient(circle at 65% 50%, rgba(0, 250, 167, 0.4) 0%, rgba(0, 250, 167, 0.2) 10%, transparent 50%), white",
        }}
      >
        <div className="flex flex-col lg:flex-row gap-6 w-full ">
          <div className="lg:w-[60%] w-full">
            <p className="font-inter text-gray-900 text-[36px] md:text-6xl tab:text-[48px] smaller:text-3xl font-extrabold w-full text-center lg:text-left mb-5">
              Stay Connected with
              <br />
              Instant <span className="text-primary">Lyca Mobile</span>
              <br />
              Top-ups
            </p>
            <p className="text-gray-600 text-xl text-center lg:text-left w-full lg:w-[80%] mb-5">
              Stay connected with seamless mobile recharge, anytime, anywhere.
              Secure transactions, instant delivery—experience hassle-free
              top-ups today!
            </p>
            <div className="flex justify-center lg:justify-start">
              <button
                onClick={handleExplorePlans}
                className="px-[17px] py-4 rounded-lg bg-primary text-gray-900 text-sm font-semibold font-inter w-full md:w-[35%] hover:bg-primary/80"
              >
                Explore Lyca Mobile Plans
              </button>
            </div>
          </div>
          <div className="lg:w-[40%] w-full h-full  flex justify-center  items-center ">
            <FloatingImage />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full mt-12">
          <div className="p-6 bg-[#1F234C] rounded-lg w-full">
            <Image
              src="/thunderbolt.svg"
              alt="global"
              width={48}
              height={48}
              priority
              className="select-none"
            />
            <h2 className="mt-6 text-lg text-white font-inter font-semibold">
              Instant digital delivery
            </h2>
            <p className="mt-2 text-lg text-gray-400 font-inter">
              Your data and payments are protected with industry-leading
              encryption to ensure peace of mind.
            </p>
          </div>
          <div className="p-6 bg-[#1F234C] rounded-lg w-full">
            <Image
              src="/global.svg"
              alt="global"
              width={48}
              height={48}
              priority
              className="select-none"
            />
            <h2 className="mt-6 text-lg text-white font-inter font-semibold">
              Global Accessibility
            </h2>
            <p className="mt-2 text-lg text-gray-400 font-inter">
              Access our services from anywhere in the world. Designed to fit
              your global needs, anytime, anywhere.
            </p>
          </div>
          <div className="p-6 bg-[#1F234C] rounded-lg w-full">
            <Image
              src="/check.svg"
              alt="global"
              width={48}
              height={48}
              priority
              className="select-none"
            />
            <h2 className="mt-6 text-lg text-white font-inter font-semibold">
              Safe and secure transactions
            </h2>
            <p className="mt-2 text-lg text-gray-400 font-inter">
              Instant digital delivery ensures your credit is ready to use
              within seconds, without any delays.
            </p>
          </div>
        </div>
      </div>
      <div></div>
      <h2 className="text-primary mt-20 font-inter text-center font-semibold uppercase mb-3">
        Explore Top ups & plans
      </h2>
      <div className="flex gap-3 justify-center mb-14">
        <Image
          src="/lycalogo.png"
          alt="LycaLogo"
          width={48}
          height={48}
          priority
          className="select-none"
        />
        <h1 className="heading1">Lyca mobile</h1>
      </div>
      <DataPackageCard />
      <MobileTopupSection />
      <QuickInternationalTopup />
      <PromotionBanner />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
