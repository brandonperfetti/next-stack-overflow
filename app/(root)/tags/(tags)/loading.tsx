import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>

      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <Skeleton
            key={item}
            className="flex h-32 flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 "
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
