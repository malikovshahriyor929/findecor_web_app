"use client";
import { ChatMessageType, ProductType } from "@/types";
import React, { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Heart, Loader2 } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useResponsiveItemsPerPage } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { initializeLikes, toggleLike } from "@/store/likedSlice";
import { RootState } from "@/store";
import { RiHeartFill } from "react-icons/ri";
import { useLikeMutation, useUnlikedMutation } from "@/request/mutation";
import toast from "react-hot-toast";
import Image from "next/image";
import DrawerForViewProduct from "../drawerForViewProduct";

const Product = ({ message }: { message: ChatMessageType }) => {
  const { liked } = useSelector((state: RootState) => state.liked);
  const { mutate } = useLikeMutation();

  const dispatch = useDispatch();
  const [productViewOpen, setProductViewOpen] = useState<boolean>(false);
  const [productView, setProductView] = useState<ProductType>(
    {} as ProductType
  );
  const [selectedImage, setSelectedImage] = useState(
    productView.imageURLsId?.[0]
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = useResponsiveItemsPerPage();
  const totalPages = Math.ceil(
    JSON.parse(message.content)?.length / itemsPerPage
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = JSON.parse(message.content).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const [pagOpen, setPagOpen] = useState<boolean>(false);
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const getPaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      end = maxVisiblePages;
    } else if (currentPage >= totalPages - halfVisible) {
      start = totalPages - maxVisiblePages + 1;
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const Islike = async (value: ProductType) => {
    // const productId = value.id.toString();
    const obj = {
      id: value.id,
      name: value.name,
      mainImage: value.mainImage,
      price: value.price,
      metaData: {
        color: {
          hex: value.metaData.color.hex,
          name: value.metaData.color.name,
        },
        title: value.metaData.title,
        description: value.metaData.description,
        furniture_style: value.metaData.furniture_style,
        furniture_material: value.metaData.furniture_material,
        preferred_room_style: value.metaData.preferred_room_style,
      },
      product_height: value.product_height ? value.product_height : "",
      product_width: value.product_width ? value.product_width : "",
      product_depth: value.product_depth ? value.product_depth : "",
      imageURLsId: value.imageURLsId,
      attrs: value.attrs,
      stores: value.stores,
    };
    mutate(obj, {
      onSuccess(data) {
        dispatch(toggleLike(data.data.id.toString()));
      },
      onError(error) {
        console.error("Like error:", error);
      },
    });
  };
  useEffect(() => {
    const storedLikes = localStorage.getItem("liked");
    if (storedLikes) {
      dispatch(initializeLikes(JSON.parse(storedLikes)));
    }
  }, [dispatch]);
  const { mutate: unliked } = useUnlikedMutation();

  const unLiked = (id: string) => {
    unliked(id, {
      onSuccess() {
        toast.success("disliked");
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage]);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          onClick={ () => {
            setPagOpen(!pagOpen);
          } }
          className="px-2 py-1 cursor-pointer  w-fit border border-gray-400  ml-auto text-sm font-medium rounded-lg mb-4 flex items-center gap-2"
        >
          { pagOpen ? (
            <p>Hide products</p>
          ) : (
            <p onClick={ () => setCurrentPage(2) }>Show more</p>
          ) }
        </div>
      </div>
      <div className="flex justify-between  max-[1230px]:justify-evenly max-[454px]:flex-col gap-2">
        { currentItems.map((value: ProductType, i: number) => {
          return (
            <div key={ i } className="relative w-full ">
              <div
                className={ `flex items-center relative  flex-col bg-white p-3 rounded-lg shadow-[0_1px_2px_-0px_rgba(0,0,0,0.08),inset_0_-0px_0_0_rgba(0,0,0,0.12)] gap-4 ${loading && "blur-sm "
                  }  ` }
              >
                <Image
                  src={
                    "https://storage.googleapis.com" +
                    value.imageURLsId[0].imageUrl
                  }
                  width={ 120 }
                  height={ 120 }
                  alt={ "Asdasd" }
                  className="!rounded-lg !size-30 max-[454px]:!size-60 object-contain max-[387px]:!size-40   "
                />
                <div className="flex items-center gap-2 max-[453px]:gap-4 w-full">
                  <button
                    onClick={ () => {
                      setProductView(value);
                      setProductViewOpen(!productViewOpen);
                      setSelectedImage(value.imageURLsId[0]);
                    } }
                    className="!bg-[#ea580b] cursor-pointer border-[rgba(10,10,10,0.16)] border-[0.5px] text-white font-medium  text-sm rounded-md px-2 py-1  items-center gap-1 text-nowrap shadow-[0_1px_2px_-0px_rgba(0,0,0,0.08),inset_0_-0px_0_0_rgba(0,0,0,0.12)] max-[454px]:!w-full max-[454px]:py-2 max-[454px]:px-18 max-[385px]:px-15 max-[358px]:px-10 w-full flex justify-center"
                  >
                    View <MdArrowOutward />
                  </button>
                  <div className="max-[1330px]:absolute top-2 right-2  max-[1330px]:*:rounded-full max-[1330px]:*:p-1.5 ">
                    { liked.includes(value.id.toString()) ? (
                      <button
                        onClick={ () => unLiked(value.id.toString()) }
                        className="bg-white cursor-pointer border-[rgba(10, 10, 10, 0.16)] border-[0.5px] text-white font-medium  text-xs rounded-md p-1.5 flex items-center gap-2 text-nowrap shadow-[0_1px_2px_-0px_rgba(0,0,0,0.08),inset_0_-0px_0_0_rgba(0,0,0,0.12)]  "
                      >
                        <RiHeartFill size={ 16 } color={ "red" } />
                      </button>
                    ) : (
                      <button
                        onClick={ () => Islike(value) }
                        className="bg-white cursor-pointer border-[rgba(10, 10, 10, 0.16)] border-[0.5px] text-white font-medium  text-xs rounded-md p-1.5 flex items-center gap-2 text-nowrap shadow-[0_1px_2px_-0px_rgba(0,0,0,0.08),inset_0_-0px_0_0_rgba(0,0,0,0.12)] "
                      >
                        <Heart size={ 16 } color={ "rgba(10, 10, 10, 0.45)" } />
                      </button>
                    ) }
                  </div>
                </div>
              </div>
              { loading && (
                <div className="absolute top-0 left-0 flex items-center justify-center size-full    ">
                  <Loader2 className=" animate-spin size-10" />
                </div>
              ) }
            </div>
          );
        }) }
      </div>
      <div className={ `${pagOpen ? "block" : "hidden"} mt-4` }>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <button
                onClick={ (e) => {
                  e.preventDefault();
                  paginate(currentPage - 1);
                } }
                className={ `${currentPage === 1 ? "pointer-events-none  opacity-60 " : ""
                  } my-auto bg-white px-3 py-2 border border-gray-200 rounded-sm mr-2 max-[312px]:px-2 max-[312px]:mr-1` }
              >
                <IoIosArrowBack />
              </button>
            </PaginationItem>
            { getPaginationItems().map((number, i) => (
              <PaginationItem key={ i }>
                <button
                  onClick={ () => paginate(+number) }
                  className={ `px-3 py-1 rounded ${currentPage === number
                    ? "bg-[#ea580b] text-white"
                    : "hover:bg-muted"
                    }` }
                >
                  { number }
                </button>
              </PaginationItem>
            )) }
            <PaginationItem>
              <button
                className={ `${currentPage === totalPages
                  ? "pointer-events-none  opacity-60 "
                  : ""
                  } my-auto bg-white px-3 py-2 border border-gray-200 rounded-sm ml-2 max-[312px]:px-2 max-[312px]:ml-1 ` }
                onClick={ (e) => {
                  e.preventDefault();
                  paginate(currentPage + 1);
                } }
              >
                <IoIosArrowForward />
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {/* <Drawer open={ productViewOpen } onOpenChange={ setProductViewOpen }>
        { productView && (
          <DrawerContent className="sm:max-w-[825px] max-[878px]:!max-w-[550px] max-[595px]:!max-w-[440px]   pb-0 rounded-lg py-5 ">
            <DrawerHeader>
              <DrawerTitle className="truncate w-[500px] max-[595px]:w-fit max-[595px]:max-w-[300px] text-lg ">
                { productView.name }
              </DrawerTitle>
            </DrawerHeader>
            <div>
              <div className="flex max-[878px]:flex-col  max-[878px]:overflow-y-scroll max-[1024px]:h-[calc(100vh-300px)] h-full   gap-3 ">
                <div className="flex flex-col gap-2">
                  <div className="space-y-4 flex items-center max-[878px]:flex-col-reverse  gap-6">
                    <div className="flex flex-col gap-2 overflow-y-auto max-[878px]:overflow-x-auto max-[878px]:max-w-[450px] max-[410px]:max-w-[280px] max-[390px]:!max-w-[250px] max-[878px]:flex-row  h-60 pb-2 max-[878px]:h-fit">
                      { productView.imageURLsId?.map((image) => (
                        <button
                          key={ image?.id }
                          onClick={ () => setSelectedImage(image) }
                          className={ `relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all   ${selectedImage?.id === image?.id
                              ? "border-primary"
                              : "border-transparent"
                            }   ` }
                        >
                          <div className="relative aspect-square w-full rounded- overflow-hidden bg-gray-100">
                            { productView.imageURLsId && (
                              <Image
                                src={ `https://storage.googleapis.com${image.imageUrl}` }
                                alt={ `Thumbnail asdasda` }
                                fill
                                className="object-cover"
                              />
                            ) }
                          </div>
                        </button>
                      )) }
                    </div>
                    <div className="relative  rounded-lg overflow-hidden w-fit h-fit   bg-gray-100">
                      { productView.imageURLsId && (
                        <Image
                          src={ `https://storage.googleapis.com${selectedImage?.imageUrl}` }
                          alt={ "asdasdas" }
                          width={ 240 }
                          height={ 240 }
                          className="object-cover rounded-lg  size-60"
                        />
                      ) }
                    </div>
                  </div>
                  <div className="pb-4 px-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      Available at
                    </h2>
                    <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-50 ">
                      { productView?.stores?.map((store, i) => (
                        <div
                          key={ i }
                          className="*:flex *:items-center *:gap-3 p-2 bg-gray-50 m-2 rounded-lg"
                        >
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={ store.url }
                          >
                            <p className="font-medium ">{ store.name }</p>
                            <div className="flex items-center gap-2 ml-auto">
                              <p>${ store.price }</p>
                              <MdArrowOutward />
                            </div>
                          </a>
                        </div>
                      )) }
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="">
                    <div className="p-4">
                      <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                          { productView.name }
                        </h1>
                        <p className="text-gray-600 mt-1">
                          <strong>
                            Upholstery -{ " " }
                            <span className="text-gray-600">
                              { productView.product_weight && (
                                <span>{ productView.product_weight }</span>
                              ) }
                              P x{ " " }
                              { productView.product_width && (
                                <span>{ productView.product_width }</span>
                              ) }
                              W
                              { productView.product_height && (
                                <span>x { productView.product_height }H</span>
                              ) }
                              <span> inches. </span>
                            </span>
                          </strong>
                        </p>
                      </div>

                      <p className="text-3xl font-semibold text-gray-900 mb-3">
                        $ { productView.price }
                      </p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center">
                          <div
                            className={ ` text-gray-700 flex items-center gap-3 ` }
                          >
                            <div
                              style={ {
                                backgroundColor:
                                  productView.metaData?.color.hex,
                              } }
                              className={ `size-7 border border-gray-300 rounded-full` }
                            ></div>
                            <p> { productView.metaData?.color.name }</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="ml-2 text-gray-700">
                            Style: { productView.metaData?.furniture_style }
                          </label>
                        </div>
                        <p className="text-gray-700">
                          <strong>Material:</strong>{ " " }
                          { productView.metaData?.furniture_material +
                            " and " +
                            productView.metaData?.furniture_frame_material }
                        </p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          Description
                        </h2>
                        <p className="text-gray-600">
                          { productView.name } -{ " " }
                          { productView.product_weight && (
                            <span>{ productView.product_weight }</span>
                          ) }
                          P x{ " " }
                          { productView.product_width && (
                            <span>{ productView.product_width }</span>
                          ) }
                          W
                          { productView.product_height && (
                            <span>x { productView.product_height }H</span>
                          ) }
                          <span> inches. </span>
                          { productView.metaData?.description.length > 200
                            ? productView.metaData?.description.slice(0, 200) +
                            "..."
                            : productView.metaData?.description }
                        </p>
                      </div>

                      <div className="flex justify-  !w-full">
                        <a
                          href={ productView?.stores?.[0].url }
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
          </DrawerContent>
        ) }
      </Drawer> */}
      <DrawerForViewProduct
        productView={ productView }
        productViewOpen={ productViewOpen }
        selectedImage={ selectedImage }
        setProductViewOpen={ setProductViewOpen }
        setSelectedImage={ setSelectedImage }
      />
    </div>
  );
};

export default Product;
