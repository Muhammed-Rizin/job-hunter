const ListSkeleton = ({ entries = 6 }) => {
  const rows = Array.from({ length: entries });

  return (
    <>
      <div className="md:hidden space-y-4 pb-4">
        {rows.map((_, index) => (
          <div
            key={`mobile-skeleton-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 animate-pulse"
          >
            <div className="h-4 w-40 rounded bg-gray-200 dark:bg-zinc-700" />
            <div className="mt-3 h-3 w-28 rounded bg-gray-200 dark:bg-zinc-700" />
            <div className="mt-4 h-9 w-full rounded-xl bg-gray-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="hidden md:block flex-1 min-h-0 overflow-y-auto overflow-x-auto no-scrollbar">
        <div className="min-w-200 md:min-w-0 space-y-2">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <div className="col-span-4">Company</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          {rows.map((_, index) => (
            <div
              key={`desktop-skeleton-${index}`}
              className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 animate-pulse"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-zinc-700" />
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-gray-200 dark:bg-zinc-700" />
                  <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-zinc-700" />
                </div>
              </div>
              <div className="col-span-2 h-3.5 w-20 rounded bg-gray-200 dark:bg-zinc-700" />
              <div className="col-span-3 h-8 w-36 rounded bg-gray-200 dark:bg-zinc-700" />
              <div className="col-span-2 h-3.5 w-24 rounded bg-gray-200 dark:bg-zinc-700" />
              <div className="col-span-1 flex justify-end">
                <div className="h-7 w-7 rounded-lg bg-gray-200 dark:bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListSkeleton;
