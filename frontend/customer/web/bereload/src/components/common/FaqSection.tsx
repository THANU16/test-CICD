import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface Faq {
  question: string;
  answer: string;
  isEmail?: boolean;
}

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: Faq[] = [
    {
      question: "How do I top up online?",
      answer:
        "It's easy to top up online on Bereload.com. All you need is your email address or phone number. We offer call credit for all the biggest providers. So look for you provider on our call credit page. Select how much call credit you need and pay with your prefered payment method. Your call credit will be send to your phone in seconds. Ready for you to call your friends and family.",
    },
    {
      question: "How do I top up someone else's phone?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in, accusamus quisquam.",
    },
    {
      question: "How do I top up internationally?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in, accusamus quisquam.",
    },
    {
      question: "How to buy credits?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in, accusamus quisquam.",
    },
    {
      question: "Why can’t you hear a pterodactyl go to the bathroom?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in, accusamus quisquam.",
    },
    {
      question: "Why did the invisible man turn down the job offer?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in, accusamus quisquam.",
    },
  ];

  return (
    <div className="my-20 px-4 lg:px-28  h-auto max-w-[1800px] mx-auto flex flex-col items-center justify-center ">
      <h2 className="heading1 mb-4">Frequently asked qusestions</h2>
      <p className="text-gray-600 text-xl sm:w-2/3 w-full  text-center mb-16">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam
        voluptatum cupiditate veritatis in, accusamus quisquam.
      </p>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`p-5 py-5 w-full  border-t-[1px] border-gray-200`}
        >
          <button
            onClick={() => handleFaqClick(index)}
            className="flex justify-between w-full"
          >
            <span className="text-black text-lg font-medium text-left pr-2 sm:pr-0">
              {faq.question}
            </span>
            {openIndex === index ? (
              <span>
                <FaChevronUp className="size-4 sm:size-6 text-gray-400" />
              </span>
            ) : (
              <span>
                <FaChevronDown className="size-4 sm:size-6 text-gray-400" />
              </span>
            )}
          </button>
          <div
            className={`grid overflow-hidden transition-all duration-300 ease-in-out 
                    ${
                      openIndex === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
          >
            <div className="text-left overflow-hidden">
              <p className=" text-gray-500 mt-4">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqSection;
