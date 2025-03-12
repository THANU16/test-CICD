import React, { useState } from "react";
import Image from "next/image";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { CheckoutData } from "@/types";

interface MobileTopupCardProps {
  price: string;
}

const MobileTopupCard: React.FC<MobileTopupCardProps> = ({ price }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = () => {
    const checkoutData: CheckoutData = {
      type: "topup",
      price,
      quantity,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    router.push("/screens/mobile-top-up/checkout");
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="relative h-auto bg-white shadow-md border-2 border-[#05E27E] rounded-xl overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-start gap-2 items-end">
          <Image
            src="/lycalogo.png"
            alt="LycaLogo"
            width={28}
            height={28}
            priority
            className="select-none"
          />
          <span className="text-sm font-semibold text-gray-500">
            Lycamobile
          </span>
        </div>
        <div className="mt-3 mb-5 flex justify-start gap-2 items-end">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-base text-gray-600">Top up</span>
        </div>
        <div className="my-2 h-px bg-gray-300" />
        <div className="mt-7 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs medium text-gray-600">Quantity</span>
            <div className="flex gap-3">
              <button
                onClick={handleDecrement}
                className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <FiMinus className="text-gray-900 text-base cursor-pointer" />
              </button>
              <span className="text-base text-gray-900 font-semibold">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <FiPlus className="text-gray-900 text-base cursor-pointer" />
              </button>
            </div>
          </div>
          <button
            onClick={handleBuyNow}
            className="px-7 py-2.5 bg-primary text-gray-900 font-semibold text-sm rounded-lg hover:bg-primary/80"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileTopupSection: React.FC = () => {
  const plans: MobileTopupCardProps[] = [
    { price: "€10.00" },
    { price: "€15.00" },
    { price: "€20.00" },
    { price: "€30.00" },
  ];

  return (
    <main className="bg-white">
      <div className="px-4 lg:px-28 pt-20 pb-20 h-auto max-w-[1800px] mx-auto">
        <h2 className="sm:text-4xl text-3xl font-extrabold text-gray-900 mb-10">
          Mobile Top-ups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-7">
          {plans.map((plan, index) => (
            <MobileTopupCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MobileTopupSection;
