import React from "react";

const LabeledInput = ({
  label,
  className = "",
  inputClassName = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <label className={`block ${containerClassName}`}>
      {label ? (
        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
          {label}
        </span>
      ) : null}
      <input
        {...props}
        className={`w-full p-3 rounded-lg text-sm font-medium outline-none transition-all ${inputClassName} ${className}`}
      />
    </label>
  );
};

export default LabeledInput;
