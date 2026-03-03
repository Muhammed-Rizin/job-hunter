import React from "react";

const Input = React.forwardRef(
  ({ icon: Icon, className = "", containerClass = "", ...props }, ref) => {
    return (
      <div className={`relative ${containerClass}`}>
        {Icon && (
          <Icon size={18} className="absolute left-3.5 top-3 text-gray-400 dark:text-zinc-500" />
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full pl-${Icon ? "11" : "3"} p-3 rounded-xl text-sm font-medium
            outline-none transition-all
            bg-white dark:bg-black
            border border-gray-200 dark:border-zinc-800
            focus:border-black dark:focus:border-red-600
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-zinc-600
            ${className}`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
