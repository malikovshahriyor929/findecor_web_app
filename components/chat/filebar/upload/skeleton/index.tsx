import { Skeleton } from "@/components/ui/skeleton";

const SkeletonImgCard = () => {
  return (
    <div className="flex flex-col gap-3 px-4 w-full overflow-hidden overflow-y-scroll h-[calc(100vh-80px)] ">
      {Array(3)
        .fill(1)
        .map((_, i: number) => (
          <div key={i} className=" flex flex-col gap-3 ">
            <div className=" object-cover object-center rounded-lg overflow-hidden   max-h-[184px]">
              <Skeleton className="h-[184px] w-full !duration-200 bg-black/20" />
            </div>
            <div>
              <div className="grid grid-cols-4 gap-3 cursor-pointer">
                {Array(3)
                  .fill(1)
                  .map((_, index: number) => (
                    <div
                      key={index}
                      className="border flex items-center justify-center object-cover border-[rgba(10,10,10,0.1)]  rounded-lg p-1  bg-[#f7f7f7]"
                    >
                      <Skeleton className=" bg-black/20 h-[40px] w-[55px] " />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SkeletonImgCard;
