const PlanningSkeleton = ({ entries = 6 }) => {
  const rows = Array.from({ length: entries });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rows.map((_, index) => (
        <div
          key={`planning-skeleton-${index}`}
          className="rounded-[32px] border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 animate-pulse shadow-sm"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800" />
            <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" />
          </div>
          <div className="h-6 w-3/4 rounded-lg bg-gray-100 dark:bg-zinc-800 mb-4" />
          <div className="space-y-3 mb-6">
            <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-zinc-800" />
            <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-zinc-800" />
          </div>
          <div className="h-20 w-full rounded-[20px] bg-gray-50 dark:bg-zinc-800/50 mb-6" />
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-zinc-800" />
              <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-zinc-800" />
            </div>
            <div className="h-4 w-16 rounded bg-gray-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanningSkeleton;
