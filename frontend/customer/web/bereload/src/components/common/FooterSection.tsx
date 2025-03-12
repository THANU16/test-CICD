import React from "react";
import Image from "next/image";
import { IoLogoFacebook } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const FooterSection = () => {
  return (
    <div className="bg-gray-900 ">
      <div className="w-full bg-gray-900 flex flex-col lg:px-[120px] mx-auto max-w-[1800px] lg:py-16 px-3 py-12">
        <div className="flex lg:flex-row lg:space-x-16 flex-col lg:space-y-0 space-y-8">
          <div className="lg:w-1/3">
            <div>
              <a href="/screens/landingpage">
                <Image
                  src="/Footerlogo.svg"
                  alt="logo"
                  width={120}
                  height={40}
                  priority
                  className="select-none"
                />
              </a>
            </div>
            <div className="mt-8">
              <p className="text-base text-white max-w-[390px]">
                Making the world a better place through connecting people with
                loved ones.
              </p>
            </div>
            <div className="mt-8">
              <div className="flex flex-row gap-6">
                <a href="" rel="noreferrer" target="_blank">
                  <IoLogoFacebook className="text-gray-300 size-6 hover:text-secondary" />
                </a>
                <a href="" rel="noreferrer" target="_blank">
                  <FaInstagram className="text-gray-300 size-6 hover:text-secondary" />
                </a>
                <a href="" rel="noreferrer" target="_blank">
                  <FaXTwitter className="text-gray-300 size-6 hover:text-secondary" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 flex lg:justify-end">
            <div className="flex lg:flex-row flex-col gap-12 2xl:gap-24 w-full lg:justify-between">
              <div className="lg:w-1/3">
                <h2 className="text-white text-sm font-semibold uppercase mb-6">
                  Links
                </h2>
                <div className="flex flex-col space-y-3">
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    Lyca mobile
                  </a>
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    International top-up
                  </a>
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    SIM swap
                  </a>
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    Find our store
                  </a>
                </div>
              </div>

              <div className="lg:w-1/3">
                <h2 className="text-white text-sm font-semibold uppercase mb-6">
                  COMPANY
                </h2>
                <div className="flex flex-col space-y-3">
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    Contact us
                  </a>
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    Privacy policy
                  </a>
                  <a className="footerlink whitespace-nowrap cursor-pointer">
                    Terms and conditions
                  </a>
                </div>
              </div>

              <div className="lg:w-1/3">
                <h2 className="text-white text-sm font-semibold uppercase mb-6">
                  Language & Currency
                </h2>
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <select
                      className="appearance-none bg-gray-900 border border-white rounded-md py-2 pl-3 pr-8 w-full text-white cursor-pointer"
                      defaultValue="English"
                    >
                      <option value="English">English</option>
                      <option value="Dutch">Dutch</option>
                      <option value="Nederlands">Nederlands</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <select
                      className="appearance-none bg-gray-900 border border-white rounded-md py-2 pl-3 pr-8 w-full text-white cursor-pointer"
                      defaultValue="EUR"
                    >
                      <option value="EUR">EUR</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-12 mb-6" />

        <div className="flex justify-center items-center text-center">
          <p className="text-white">© 2024 Bereload. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
