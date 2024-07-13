import { useState } from 'react';

export default function Slider({ label, initialValue = 0.5, min = 0, max = 1, step = 0.1, onChange }) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold">{label}</label>
        <span className="text-sm bg-gray-200 py-1 px-2 rounded-lg">{value}</span>
      </div>
      <input
        type="range"
        className="w-full"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
    </div>
  );
}
