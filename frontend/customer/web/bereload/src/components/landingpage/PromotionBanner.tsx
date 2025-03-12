import Image from "next/image";

const PromotionBanner = () => {
  return (
    <main className="relative lg:min-h-auto max-w-[2000px] mx-auto  overflow-hidden">
      <div
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          backgroundImage: `url('/greenbg.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div className="relative z-10 w-full flex flex-col h-full">
        <div className="px-4 lg:px-24 mt-20 flex flex-col items-center justify-center">
          <h2 className="heading1 mb-4">Download our App</h2>
          <p className="text-gray-600 text-xl sm:w-2/3 w-full text-center mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            magnam voluptatum cupiditate veritatis in, accusamus quisquam.
          </p>
          <div className="flex gap-6 mb-16">
            <Image
              src="/appstore.png"
              alt="appstore"
              width={120}
              height={40}
              priority
              className="select-none"
            />
            <Image
              src="/playstore.png"
              alt="playstore"
              width={120}
              height={40}
              priority
              className="select-none"
            />
          </div>
        </div>
        <div className="flex-1 flex items-end justify-center">
          <Image
            src="/preview.png"
            alt="preview"
            width={1400}
            height={900}
            priority
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </main>
  );
};

export default PromotionBanner;
