"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();

  const handleEmailSignIn = () => {
    router.push("/auth/signin/email?from=signin");
  };

  const handlePhoneSignIn = () => {
    router.push("/auth/signin/phone?from=signin");
  };

  const handleItsmeSignIn = () => {
    window.location.href = "https://itsme.be/";
  };

  return (
    <div className="min-h-screen max-w-[1800px] mx-auto bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-[450px]">
          <div className="flex justify-center">
            <Image
              src="/Logo.svg"
              width={180}
              height={180}
              alt="Logo"
              priority
              className="select-none"
            />
          </div>

          <h1 className="mt-6 text-center font-inter text-[30px] font-extrabold text-gray-900">
            Sign in to your account
          </h1>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleEmailSignIn}
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-inter font-semibold text-base hover:bg-gray-50 "
            >
              Continue with Email address
            </button>

            <button
              onClick={handlePhoneSignIn}
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-inter font-semibold text-base hover:bg-gray-50"
            >
              Continue with Telephone
            </button>

            <button
              onClick={handleItsmeSignIn}
              className="w-full p-4 rounded-lg bg-[#FF4816] text-white font-inter font-semibold text-base hover:bg-[#e63d0e] flex items-center justify-center gap-2"
            >
              <Image
                src="/itsme.svg"
                alt="itsme"
                width={24}
                height={24}
                className="inline-block select-none"
              />
              Continue with itsme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
