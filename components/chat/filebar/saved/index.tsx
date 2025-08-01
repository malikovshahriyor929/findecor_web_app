import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Myaxios } from "@/request";
import { useUnlikedMutation } from "@/request/mutation";
import { initializeLikes } from "@/store/likedSlice";
import { ProductObjType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdArrowOutward } from "react-icons/md";
import { RiHeartFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
const Saved = () => {
  const dispatch = useDispatch();
  const [productViewOpen, setProductViewOpen] = useState<boolean>(false);
  const [productView, setProductView] = useState<ProductObjType>(
    {} as ProductObjType
  );
  const [selectedImage, setSelectedImage] = useState(
    productView.imageURLsId?.[0]
  );
  const { mutate } = useUnlikedMutation();
  const { data, isLoading, refetch } = useQuery<ProductObjType[]>({
    queryKey: ["saved"],
    queryFn: () => Myaxios.get("/product-likes").then((res) => res.data),
  });
  useEffect(() => {
    if (data && data.length > 0) {
      const allIds = data.map((product) => product.id.toString());
      dispatch(initializeLikes(allIds));
      refetch();
    }
  }, [data, dispatch, refetch]);
  const unLiked = (id: string) => {
    mutate(id, {
      onSuccess() {
        toast.success("disliked");
        refetch();
      },
    });
  };
  useEffect(() => {
    const storedLikes = localStorage.getItem("liked");
    if (storedLikes) {
      dispatch(initializeLikes(JSON.parse(storedLikes)));
    }
  }, [dispatch]);

  return (
    <div>
      {!isLoading ? (
        data ? (
          <div
            className={`grid grid-cols-2  overflow-hidden overflow-y-auto h-[calc(100vh-80px)] items-start gap-3 w-full mt-4 px-5 ${
              data?.length < 7 && "!h-fit"
            } `}
          >
            {data.map((value: ProductObjType, i: number) => {
              return (
                <div
                  key={i}
                  className="bg-white rounded-lg h-fit border justify-between   border-gray-200 flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square p-2 max-h-[100px] flex items-center justify-center relative">
                    <Image
                      src={"https://storage.googleapis.com" + value.mainImage}
                      className="max-h-full max-w-full object-contain rounded-lg"
                      width={78}
                      height={79}
                      alt={"liked"}
                    />
                    <button
                      onClick={() => unLiked(value.id.toString())}
                      className="absolute top-1 right-1 size-6 rounded-full z-50 text-red-500"
                    >
                      <RiHeartFill />
                    </button>
                    <div className="absolute top-1 right-2  animate-ping size-6 bg-rose-200 rounded-full  "></div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium line-clamp-1">
                      {value.metaData.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      ${value.price}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setProductView(value);
                      setSelectedImage(value.imageURLsId?.[0]);
                      setProductViewOpen(!productViewOpen);
                    }}
                    className=" m-2 rounded-md bg-[#ea580b] hover:bg-[#ea590bf0] text-white text-sm py-[4px] h-auto"
                  >
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#f7f7f7] p-4 rounded-lg mt-4 mx-5 flex flex-col gap-3 items-center   ">
            <Image
              height={24}
              width={24}
              src="/svg/filebarimg.svg"
              alt="menu"
            />
            <p className="text-[rgba(10,10,10,0.45)] text-xs font-medium max-w-[154px] text-center">
              Saved images will appear here.
            </p>
          </div>
        )
      ) : (
        <div>
          <div className="grid grid-cols-2 overflow-hidden overflow-y-auto h-[calc(100vh-80px)] gap-3 w-full mt-4 px-5 ">
            {Array(10)
              .fill(1)
              .map((_, i: number) => {
                return (
                  <div
                    key={i}
                    className="bg-white rounded-lg  border justify-between   border-gray-200 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square p-2 flex items-center justify-center relative">
                      <Skeleton className="max-h-[150px] h-full w-full max-w-[150px] bg-black/30" />
                      <button className="absolute top-1 right-1 size-6 rounded-full z-50 text-red-500">
                        <RiHeartFill />
                      </button>
                      <div className="absolute top-1 right-2  animate-ping size-6 bg-rose-200 rounded-full  "></div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-medium line-clamp-1">
                        <Skeleton className="max-w-[130px] h-3 mb-1 bg-black/30" />
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-2">
                        ${" "}
                        <Skeleton className="max-w-[50px] w-full h-3 bg-black/30" />
                      </div>
                    </div>
                    <Skeleton className="w-full" />
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <Dialog open={productViewOpen} onOpenChange={setProductViewOpen}>
        {productView && (
          <DialogContent className="sm:max-w-[825px] max-[878px]:!max-w-[550px] max-[595px]:!max-w-[440px] max-[500px]:!max-w-[390px] max-[410px]:!max-w-[350px] max-[390px]:!max-w-[300px] pb-0 pr-0 rounded-lg py-5 ">
            <DialogHeader>
              <DialogTitle className="truncate w-[500px] max-[595px]:w-fit max-[595px]:max-w-[230px] ">
                {productView.name}
              </DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex max-[878px]:flex-col max-[878px]:overflow-y-scroll max-[878px]:max-h-[calc(100vh-10rem)]   gap-3 max-[410px]:max-w-[300px] max-[390px]:!max-w-[260px]">
                <div className="flex flex-col gap-2">
                  <div className="space-y-4 flex items-center max-[878px]:flex-col-reverse  gap-6">
                    <div className="flex flex-col gap-2 overflow-y-auto max-[878px]:overflow-x-auto max-[878px]:max-w-[450px] max-[410px]:max-w-[280px] max-[390px]:!max-w-[250px] max-[878px]:flex-row  h-60 pb-2 max-[878px]:!h-fit">
                      {productView.imageURLsId?.map((image) => (
                        <button
                          key={image?.id}
                          onClick={() => setSelectedImage(image)}
                          className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all   ${
                            selectedImage?.id === image?.id
                              ? "border-primary"
                              : "border-transparent"
                          }   `}
                        >
                          <div className="relative aspect-square w-full rounded- overflow-hidden bg-gray-100">
                            {productView.imageURLsId && (
                              <Image
                                src={`https://storage.googleapis.com${image.imageUrl}`}
                                alt={`Thumbnail ${image?.id}`}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="relative  rounded-lg overflow-hidden w-fit h-fit   bg-gray-100">
                      {productView.imageURLsId && (
                        <Image
                          src={`https://storage.googleapis.com${selectedImage?.imageUrl}`}
                          alt={"product"}
                          width={240}
                          height={240}
                          className="object-cover rounded-lg  size-60"
                        />
                      )}
                    </div>
                  </div>
                  <div className="pb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      Available at
                    </h2>
                    <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-50 ">
                      {productView?.stores?.map((store, i) => (
                        <div
                          key={i}
                          className="*:flex *:items-center *:gap-3 p-2 bg-gray-50 m-2 rounded-lg"
                        >
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={store.url}
                          >
                            <p className="font-medium ">{store.name}</p>
                            <div className="flex items-center gap-2 ml-auto">
                              <p>${store.price}</p>
                              <MdArrowOutward />
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="">
                    <div className="p-4">
                      <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                          {productView.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                          <strong>
                            Upholstery -{" "}
                            <span className="text-gray-600">
                              {productView.product_width && (
                                <span>{productView.product_width}</span>
                              )}
                              W
                              {productView.product_height && (
                                <span>x {productView.product_height}H</span>
                              )}
                              <span> inches. </span>
                            </span>
                          </strong>
                        </p>
                      </div>

                      <p className="text-3xl font-semibold text-gray-900 mb-3">
                        $ {productView.price}
                      </p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center">
                          <div
                            className={` text-gray-700 flex items-center gap-3 `}
                          >
                            <div
                              style={{
                                backgroundColor:
                                  productView.metaData?.color.hex,
                              }}
                              className={`size-7 border border-gray-300 rounded-full`}
                            ></div>
                            <p> {productView.metaData?.color.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="ml-2 text-gray-700">
                            Style: {productView.metaData?.furniture_style}
                          </label>
                        </div>
                        <p className="text-gray-700">
                          <strong>Material:</strong>{" "}
                          {productView.metaData?.furniture_material +
                            " and " +
                            productView.metaData?.furniture_material}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          Description
                        </h2>
                        <p className="text-gray-600">
                          {productView.name} -{" "}
                          {productView.product_width && (
                            <span>{productView.product_width}</span>
                          )}
                          W
                          {productView.product_height && (
                            <span>x {productView.product_height}H</span>
                          )}
                          <span> inches. </span>
                          {productView.metaData?.description.length > 200
                            ? productView.metaData?.description.slice(0, 200) +
                              "..."
                            : productView.metaData?.description}
                        </p>
                      </div>

                      <div className="flex justify-  !w-full">
                        <a
                          href={productView?.stores?.[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="!w-full"
                        >
                          <Button className="bg-[#ea580b] max-[425px]: !w-full  hover:bg-[#ea580b]/90">
                            Visit Store <MdArrowOutward />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Saved;
