import React from "react";

const Input = React.forwardRef(
  ({ icon: Icon, className = "", containerClass = "", ...props }, ref) => {
    return (
      <div className={`relative ${containerClass}`}>
        {Icon && (
          <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full pl-${Icon ? "10" : "3"} p-3 rounded-lg text-sm font-medium
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
