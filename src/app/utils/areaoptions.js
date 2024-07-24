import React from "react";

const AreaOptions = ({
  data,
  heading,
  selectedOption,
  setSelectedOption,
  setShapeHeight,
  setShapeWidth,
}) => {
  const handleOptionClick = (option) => {
    setSelectedOption(option.text);

    if (option.width !== undefined && option.height !== undefined) {
      setShapeWidth(option.width);
      setShapeHeight(option.height);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold mb-2">{heading}</p>
      <div className="flex flex-row gap-4 mb-4">
        {data.map((option, index) => (
          <div
            key={index}
            className={`w-24 h-8 rounded-full text-center p-1 cursor-pointer ${
              selectedOption === option.text
                ? "bg-black text-white"
                : "bg-stone-300 text-black"
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaOptions;
