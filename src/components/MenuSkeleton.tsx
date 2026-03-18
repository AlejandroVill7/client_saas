const SkeletonCard = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="aspect-[4/5] rounded-2xl bg-gradient-to-r from-muted to-muted/60 bg-[length:200%_100%] animate-shimmer" />
    <div className="flex flex-col gap-2 px-1">
      <div className="h-5 w-3/4 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted/60" />
      <div className="h-3 w-2/3 rounded bg-muted/60" />
    </div>
  </div>
);

const MenuSkeleton = () => (
  <div className="px-4">
    <div className="mb-6 flex gap-8 overflow-hidden px-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-4 w-20 rounded bg-muted animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default MenuSkeleton;
