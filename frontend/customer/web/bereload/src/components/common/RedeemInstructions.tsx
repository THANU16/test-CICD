import { FaCheck } from "react-icons/fa";

const RedeemInstructions = () => {
  return (
    <div className="px-4 lg:px-28  h-auto max-w-[1800px] mx-auto flex flex-col items-start justify-center ">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Redeem Instruction
      </h2>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex gap-3">
            <span className="text-primary text-xl">
              <FaCheck />
            </span>
            <span className="text-gray-700 font-medium">Purchase a Plan</span>
          </div>
          <span className="ml-8 mt-1 text-gray-500">
            Choose your desired plan from the available options and complete the
            purchase.
          </span>
        </div>
        <div>
          <div className="flex gap-3">
            <span className="text-primary text-xl">
              <FaCheck />
            </span>
            <span className="text-gray-700 font-medium">
              Receive your Redeem Code
            </span>
          </div>
          <span className="ml-8 mt-1 text-gray-500">
            Check your email for the unique redemption code provided after your
            purchase.
          </span>
        </div>
        <div>
          <div className="flex gap-3">
            <span className="text-primary text-xl">
              <FaCheck />
            </span>
            <span className="text-gray-700 font-medium">
              Receive your Redeem Code
            </span>
          </div>
          <span className="ml-8 mt-1 text-gray-500">
            Once the code is validated, your plan will be activated instantly.
            You’ll receive a confirmation message via email or SMS
          </span>
        </div>
      </div>
      <span className="mt-4 text-gray-500">
        For assistance, contact our customer support team anytime.
      </span>
      <div className="bg-gray-300 w-full h-px mt-4 mb-8" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Terms and conditions{" "}
      </h2>
      <p className="mt-4 mb-4 text-gray-500">
        Lyca Mobile has established itself as a go-to choice for affordable
        mobile services in Belgium, offering flexible prepaid options that cater
        to diverse communication needs. Whether you&apos;re looking to
        recharge Lyca Mobile Belgium for yourself or send a Lyca recharge to
        loved ones, the process is simple and convenient.
      </p>
      <p className="mt-4 text-gray-500">
        For residents, a Lyca Mobile top-up provides an easy way to stay
        connected locally and internationally without long-term commitments.
        Students, expatriates, and frequent travelers particularly appreciate
        the ability to control spending while enjoying reliable coverage.
      </p>
      <div className="bg-gray-300 w-full h-px mt-4 mb-8" />
      <p className=" text-gray-500">
        By using this service, you consent to the terms and conditions of
        Lycamobile. To view these, please visit{" "}
        <span className="text-blue-600 cursor-pointer">
          https://www.lycamobile.be/en/termscondition/.
        </span>
         
      </p>
    </div>
  );
};

export default RedeemInstructions;
