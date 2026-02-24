const PlanningSkeleton = ({ entries = 6 }) => {
  const rows = Array.from({ length: entries });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rows.map((_, index) => (
        <div
          key={`planning-skeleton-${index}`}
          className="rounded-2xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-zinc-700" />
            <div className="h-5 w-20 rounded-lg bg-gray-200 dark:bg-zinc-700" />
          </div>
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-zinc-700 mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-3 w-32 rounded bg-gray-200 dark:bg-zinc-700" />
            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-zinc-700" />
            <div className="h-3 w-36 rounded bg-gray-200 dark:bg-zinc-700" />
          </div>
          <div className="h-16 w-full rounded-xl bg-gray-200 dark:bg-zinc-800 mb-4" />
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-zinc-700" />
              <div className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-zinc-700" />
            </div>
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanningSkeleton;
