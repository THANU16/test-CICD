const ScreenIndicator = ({
    totalScreens,
    currentScreen,
  }: {
    totalScreens: number;
    currentScreen: number;
  }) => {
    return (
      <div className="absolute left-0 right-0 bottom-8 flex justify-center">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalScreens }, (_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? "w-[18px] bg-gray-900"
                  : "w-2 bg-primary"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default ScreenIndicator;