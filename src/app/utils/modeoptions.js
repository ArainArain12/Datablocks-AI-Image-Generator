import React from "react";

const ModeOptions = ({ data, heading, selectedOption, setSelectedOption }) => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold mb-2">{heading}</p>
      <div className="flex flex-row gap-4 mb-4 bg-customBG">
        {data.map((option, index) => (
          <div
            key={index}
            className={`w-20 h-8 flex items-center justify-center rounded-full text-center p-1 cursor-pointer ${
              selectedOption === option.name
                ? "bg-gray-400 text-white"
                : "bg-zinc-200 text-black"
            }`}
            onClick={() => setSelectedOption(option.name)}
          >
            <img
              src={option.icon}
              alt={option.text}
              className="max-w-full max-h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeOptions;
