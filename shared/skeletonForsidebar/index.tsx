import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonForSideBar = () => {
  return (
    <div className="flex flex-col gap-6 px-5 mt-5 h-[calc(100dvh-160px)] overflow-y-auto ">
      {Array(10)
        .fill(1)
        .map((_: string, i: number) => (
          <div key={i} className="">
              <Skeleton className=" w-[230px] max-[1000px]:w-[200px] h-5 bg-primary/30" />
          </div>
        ))}
    </div>
  );
};

export default SkeletonForSideBar;
