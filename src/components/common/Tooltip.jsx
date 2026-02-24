const POSITION_STYLES = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const Tooltip = ({
  content,
  children,
  position = "top",
  className = "",
  fullWidth = false,
  disabled = false,
}) => {
  if (!content || disabled) return children;

  const positionClass = POSITION_STYLES[position] || POSITION_STYLES.top;

  return (
    <div className={`relative group ${fullWidth ? "flex w-full" : "inline-flex"} ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide opacity-0 transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-100 dark:text-black dark:border-zinc-300 ${positionClass}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
