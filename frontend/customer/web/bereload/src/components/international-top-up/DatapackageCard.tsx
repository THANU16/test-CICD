import React, { useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import PlanDetailsModal from "./DataPlanDetails";
import { CheckoutData } from "@/types";
import { ManualTopupContext } from "@/app/screens/international-top-up/planSelection/page";

interface DataPackageCardProps {
  planName: string;
  gb: string;
  price: string;
  dataText: string;
  validityText: string;
  features: string[];
  isPopular?: boolean;
}

const DataPackageCard: React.FC<DataPackageCardProps> = ({
  planName,
  gb,
  price,
  dataText,
  validityText,
  features,
  isPopular = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const phoneNumber = searchParams.get("phone") || "";
  
  const isManualTopup = useContext(ManualTopupContext);

  const handleGetPlan = () => {
    if (isManualTopup) return;

    if (!phoneNumber) {
      router.push("/screens/international-top-up/");
      return;
    }

    const checkoutData: CheckoutData = {
      type: 'data-package',
      price,
      planName,
      gb,
      dataText,
      validityText,
      features,
      quantity: 1,
      phoneNumber,
      isInternational: true
    };
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push("/screens/international-top-up/checkout");
  };

  return (
    <div className={`relative h-auto bg-white shadow-md border-2 ${isManualTopup ? "border-gray-300 opacity-70" : "border-[#05E27E]"} rounded-xl overflow-hidden`}>
      {isPopular && !isManualTopup && (
        <div className="absolute top-0 right-0 bg-[#EF4444] px-3 py-1 rounded-bl-xl rounded-tr">
          <span className="text-xs font-semibold text-white">Most Popular</span>
        </div>
      )}

      <div className={`absolute left-0 top-16 w-1 h-12 ${isManualTopup ? "bg-gray-300" : "bg-[#09DB7C]"} rounded-r`}></div>

      <div className="p-4 h-full flex flex-col">
        <span className="text-sm font-semibold text-gray-500">{planName}</span>

        <div className="mt-8 flex justify-between items-end">
          <span className="text-2xl font-bold text-gray-900">{gb}</span>
          <span className="text-2xl font-bold text-gray-900">{price}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-600">{dataText}</span>
          <span className="text-xs text-gray-600">{validityText}</span>
        </div>

        <div className="my-2 h-px bg-gray-300" />

        <div className="mt-7 mb-5 space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <FaCheck className={`w-5 h-5 ${isManualTopup ? "text-gray-400" : "text-[#05E27E]"}`} />
              <span className="text-base text-gray-600">{feature}</span>
            </div>
          ))}
        </div>

        <div className="my-2 h-px bg-gray-300" />

        <div className="mt-7 flex justify-between items-center">
          <button
            onClick={() => !isManualTopup && setIsModalOpen(true)}
            className={`text-sm font-medium ${isManualTopup ? "text-gray-400 cursor-not-allowed" : "text-gray-500 underline hover:text-gray-800"}`}
          >
            More details
          </button>
          <button
            onClick={handleGetPlan}
            disabled={isManualTopup}
            className={`px-7 py-2.5 ${
              isManualTopup
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-primary text-gray-900 hover:bg-primary/80"
            } font-semibold text-sm rounded-lg transition-opacity`}
          >
            Get this plan
          </button>
        </div>
      </div>

      {!isManualTopup && (
        <PlanDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={planName}
          gb={gb}
          price={price}
          dataText={dataText}
          validityText={validityText}
          features={features}
          isPopular={isPopular}
        />
      )}
    </div>
  );
};

const DataPackagePage: React.FC = () => {
  const plans: DataPackageCardProps[] = [
    {
      planName: "Lycamobile - Plan S",
      gb: "10 GB",
      price: "€10.00",
      dataText: "Data, Call and Texts",
      validityText: "30 days validity",
      features: ["400 minutes & 500 texts", "4GB/EU Roaming", "eSIM available"],
      isPopular: true,
    },
    {
      planName: "Lycamobile - Plan Star",
      gb: "20 GB",
      price: "€15.00",
      dataText: "Data, Call and Texts",
      validityText: "30 days validity",
      features: ["750 minutes & 750 texts", "5GB/EU Roaming", "eSIM available"],
    },
    {
      planName: "Lycamobile - Plan M",
      gb: "40 GB",
      price: "€20.00",
      dataText: "Data, Call and Texts",
      validityText: "30 days validity",
      features: [
        "Unlimited minutes & texts",
        "26GB EU Roaming",
        "eSIM available",
      ],
    },
    {
      planName: "Lycamobile - Plan L",
      gb: "100 GB",
      price: "€30.00",
      dataText: "Data, Call and Texts",
      validityText: "30 days validity",
      features: [
        "Unlimited minutes & texts",
        "39GB EU Roaming",
        "eSIM available",
      ],
    },
    {
      planName: "Lycamobile - Plan XXL",
      gb: "300 GB",
      price: "€39.99",
      dataText: "Data, Call and Texts",
      validityText: "30 days validity",
      features: [
        "Unlimited minutes & texts",
        "51GB EU Roaming",
        "eSIM available",
      ],
    },
  ];

  return (
    <main className="bg-white">
      <div className="px-4 lg:px-28 h-auto max-w-[1800px] mx-auto">
        <h2 className="sm:text-4xl text-3xl font-extrabold text-gray-900 mb-10">
          30 Days - Monthly Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7">
          {plans.map((plan, index) => (
            <DataPackageCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DataPackagePage;
