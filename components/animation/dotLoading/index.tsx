import React from "react";

const DotLoading = () => {
  return (
    <div className="flex items-center gap-1.5 bg-[#f5f5f5] w-fit  mr-auto  p-2.5 rounded-lg ">
      {[1, 2, 3].map((_, i: number) => (
        <div
          key={i}
          className="size-2 animate-pulse bg-[#b3b3b3] rounded-full "
        />
      ))}
    </div>
  );
};

export default DotLoading;
