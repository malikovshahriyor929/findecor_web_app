import { Myaxios } from "@/request";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect } from "react";
import ImgCard from "./ImgCard";
import { ImageDetectionResult } from "@/types";
import SkeletonImgCard from "./skeleton";
import { useRouter } from "next/navigation";

const Upload = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["uploads"],
    queryFn: () => Myaxios.get("/detected-items").then((res) => res.data),
  });
  const router = useRouter();
  useEffect(() => {
    refetch();
  }, [router, refetch]);
  return (
    <div>
      {!isLoading && !isError ? (
        !data ? (
          <div className="bg-[#f7f7f7] p-4 rounded-lg mt-4 mx-5 flex flex-col gap-3 items-center   ">
            <Image
              height={24}
              width={24}
              src="/svg/filebarimg.svg"
              alt="menu"
            />
            <p className="text-[rgba(10,10,10,0.45)] text-xs font-medium max-w-[154px] text-center">
              Your uploaded images will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col overflow-y-auto px-4  h-[calc(100vh-80px)] gap-4 w-full mt-4">
            {data?.map((value: ImageDetectionResult, i: number) => (
              <div key={i} className="flex flex-col gap-3  w-full">
                <div className=" w-full flex flex-col items-center ">
                  <ImgCard {...value} />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="mt-4">
          <SkeletonImgCard />
        </div>
      )}
    </div>
  );
};

export default Upload;
