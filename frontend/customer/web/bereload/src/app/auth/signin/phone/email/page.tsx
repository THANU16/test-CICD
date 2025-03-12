"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ScreenIndicator from "@/components/common/ScreenIndicator";

const EmailInput = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleVerify = () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    sessionStorage.setItem("userEmail", email);

    router.push("/auth/signin/phone/email/verify");
  };

  return (
    <div className="min-h-screen max-w-[1800px] mx-auto bg-white">
      <ScreenIndicator totalScreens={5} currentScreen={2} />
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
            Sign in to your account
          </h1>

          <div className="mt-8 space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full p-4 border-2 ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg font-inter text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                aria-label="Email address"
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              {error && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-red-600 font-inter"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleVerify}
              className="w-full p-4 rounded-lg bg-primary text-gray-900 font-inter font-medium text-base hover:bg-primary/90"
            >
              Verify
            </button>

            <p className="text-center font-inter text-sm text-gray-700">
              By clicking on Sign in, I accept all the{" "}
              <button
                onClick={() => {}}
                className="underline hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                terms and conditions
              </button>{" "}
              of Berelord.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailInput;
