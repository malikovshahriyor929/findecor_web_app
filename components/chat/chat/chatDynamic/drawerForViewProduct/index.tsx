"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ProductImage, ProductType } from '@/types';
import Image from 'next/image';
import { MdArrowOutward } from 'react-icons/md';
interface props {
  productViewOpen: boolean,
  setProductViewOpen: React.Dispatch<React.SetStateAction<boolean>>,
  productView: ProductType,
  setSelectedImage: React.Dispatch<React.SetStateAction<ProductImage>>,
  selectedImage: ProductImage
}
const DrawerForViewProduct = ({ productViewOpen, setProductViewOpen, productView, setSelectedImage, selectedImage }: props) => {
  return (
    <Drawer open={ productViewOpen } onOpenChange={ setProductViewOpen }>
      { productView && (
        <DrawerContent className="sm:max-w-[825px] max-[878px]:!max-w-[550px] max-[595px]:!max-w-[440px]   pb-5 rounded-lg  data-[vaul-drawer-direction=bottom]:max-h-[90vh] h-full ">
          <DrawerHeader>
            <DrawerTitle className="truncate w-[500px] max-[595px]:w-fit max-[595px]:max-w-[300px] text-lg ">
              { productView.name }
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex max-[878px]:flex-col  max-[878px]:overflow-y-scroll max-[1024px]:max-h-[calc(100vh-0px)] h-full   gap-3 ">
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
        </DrawerContent>
      ) }
    </Drawer>
  )
}

export default DrawerForViewProduct