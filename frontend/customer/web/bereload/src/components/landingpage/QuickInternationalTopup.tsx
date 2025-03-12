import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";

const QuickInternationalTopup = () => {
  const router = useRouter();

  const handleTopUpNow = () => {
    router.push("/screens/international-top-up/planSelection");
  };
  return (
    <main className="relative min-h-[640px] max-w-[2000px] mx-auto">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/world.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div className="relative z-10 px-4 lg:px-[100px] py-5 lg:py-24 h-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 w-full mt-16 items-center justify-center">
          <div className="lg:w-[60%] w-full h-full">
            <p className="font-inter text-gray-900 text-[36px] md:text-6xl tab:text-[48px] smaller:text-3xl font-extrabold w-full text-center lg:text-left mb-5">
              The fastest way to
              <br />
              send <span className="text-primary">mobile top-up</span>
              <br />
              <span className="text-primary">worldwide</span>
            </p>
            <p className="text-gray-600 text-xl text-center lg:text-left w-full lg:w-[80%] mb-5">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
              fugiat aliqua ad ad non deserunt sunt.
            </p>
          </div>
          <div className="lg:w-[40%] w-full h-full pb-10 sm:pb-0">
            <div className="bg-white shadow-lg px-10 py-8">
              <h2 className="text-2xl text-gray-900 font-bold mb-6">
                Worldwide mobile recharge: send credit and data to any phone
              </h2>
              <div className="relative space-y-[0.5px] mb-6">
                <PhoneInput
                  country="be"
                  inputProps={{
                    name: "mobile",
                    required: true,
                    className:
                      "mt-[-0.5px] w-full pl-[50px] pr-[12px] py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 mt-1",
                  }}
                  containerClass="!static"
                  buttonClass="!absolute !top-1/2 !-translate-y-1/2 !left-2 !z-10 !border-none !bg-transparent !size-8"
                  dropdownClass="!absolute !top-full !left-0 !mt-1"
                />
              </div>
              <button
                onClick={handleTopUpNow}
                className="w-full px-7 py-4 bg-primary text-gray-900 font-medium text-sm rounded-lg hover:bg-primary/80"
              >
                Top-up now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuickInternationalTopup;
