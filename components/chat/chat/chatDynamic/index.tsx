"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ChatMessageType,
  DetectedItem,
  detectedTy,
  JoinChatResponseType,
} from "@/types";
import { Socket } from "socket.io-client";
import { motion } from "framer-motion";
import Product from "./productAi";
import { Card, CardContent } from "@/components/ui/card";
import SearchProduct from "./searchedAiProduct";
import ProductRoom from "./productRoom_analysis";
import { useDispatch } from "react-redux";
import { sidebarCounter } from "@/store/menubarSlice";
import { useRefetchUploads } from "@/utils/refetchForFileUp";
import AnimatedText from "@/components/animation/animated_text";
import DotLoading from "@/components/animation/dotLoading";
import Image from "next/image";

const ChatsDynamic_component = ({
  id,
  socket,
  setMessages,
  messages,
  loadingOfImgLast,
  setloadingOfImgLast,
  hiddenOfAfterImg,
  sethiddenOfAfterImg,
  setImgDetactSugetion,
  imgDetactSugetion,
}: {
  id: string;
  socket: Socket | null;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  messages: ChatMessageType[];
  loading: boolean;
  loadingOfImgLast: boolean;
  setloadingOfImgLast: React.Dispatch<React.SetStateAction<boolean>>;
  hiddenOfAfterImg: boolean;
  sethiddenOfAfterImg: React.Dispatch<React.SetStateAction<boolean>>;
  setImgDetactSugetion: React.Dispatch<React.SetStateAction<boolean>>;
  imgDetactSugetion: boolean;
}) => {
  const [lastFetchedId, setLastFetchedId] = useState<number | null>(null);
  const refetchForFileBar = useRefetchUploads();
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket && id) {
      socket.emit("joinChat", { chatUid: id });
    }
  }, [socket, id]);
  useEffect(() => {
    if (!socket) return;
    const handleJoinedChat = (data: JoinChatResponseType) => {
      setMessages(data.messages);
    };
    socket.on("joinedChat", handleJoinedChat);
  }, [socket, id, setMessages]);
  useEffect(() => {
    if (!socket || !id) return;
    const handleJoinedChat = (data: JoinChatResponseType) => {
      setMessages(data.messages);
      const savedMessage = localStorage.getItem("message");
      if (savedMessage) {
        socket.emit("sendMessage", {
          content: savedMessage,
          type: "text",
        });
        localStorage.removeItem("message");
      }
    };
    socket.emit("joinChat", { chatUid: id });
    socket.on("joinedChat", handleJoinedChat);

    return () => {
      socket.off("joinedChat", handleJoinedChat);
    };
  }, [socket, id, setMessages]);

  const memoizedMessages = useMemo(() => messages, [messages]);
  const detectObject = () => {
    setloadingOfImgLast(true);
    sethiddenOfAfterImg(true);
    if (socket) {
      socket.emit("detectObjects", {
        imageUrl:
          "https://storage.googleapis.com" +
          memoizedMessages[memoizedMessages?.length - 2].content,
      });
      setImgDetactSugetion(false);
    }
  };
  const searchObjectFn = (imgUrl: string) => {
    setloadingOfImgLast(true);
    sethiddenOfAfterImg(true);
    if (socket) {
      socket.emit("searchProductsByImage", {
        imageUrls: ["https://storage.googleapis.com" + imgUrl],
      });
    }
  };
  const showProduct = () => {
    if (socket) {
      socket.emit("detectProductsByRoom", {
        imageUrl:
          "https://storage.googleapis.com" +
          memoizedMessages[memoizedMessages?.length - 2].content,
      });
      setImgDetactSugetion(false);
    }
  };
  useEffect(() => {
    if (memoizedMessages?.length >= 8 && memoizedMessages?.length <= 10) {
      dispatch(sidebarCounter(memoizedMessages?.length));
    }
  }, [memoizedMessages?.length, dispatch]);
  useEffect(() => {
    setTimeout(() => {
      setImgDetactSugetion(false);
    }, 600);
  }, [messages, setImgDetactSugetion]);

  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage?.type === "items" && lastMessage.id !== lastFetchedId) {
      refetchForFileBar();
      setLastFetchedId(lastMessage.id);
    }
  }, [messages, refetchForFileBar, lastFetchedId]);
  return (
    <div>
      <div className="flex flex-col gap-3">
        {memoizedMessages.map((message: ChatMessageType, i) => {
          const isLast = i === memoizedMessages?.length - 1;
          return (
            <div key={i}>
              {message.sender.name === "user" ? (
                <div>
                  {message.type == "image" ? (
                    <div className=" p-2 bg-[#fef2c3] w-fit ml-auto rounded-lg">
                      <Image
                        loading="lazy"
                        src={`https://storage.googleapis.com${message.content}`}
                        alt={"asdasd"}
                        height={200}
                        width={245}
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#fef2c3] w-fit ml-auto  p-2.5 rounded-lg ">
                      <p className="text-[#1d1d1d] text-sm">
                        {message.content}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-[]:flex flex-col items-start justify-start w-[87%] overflow-">
                  {message.type == "products" ? (
                    <div className="shadow-none  bg-[#f5f5f5] borde border-[#e4e4e7] rounded-lg p-3">
                      <Product message={message} />
                    </div>
                  ) : message.type == "items" ? (
                    <div>
                      <Card>
                        <CardContent>
                          <div className="flex flex-col gap-2">
                            <div>
                              <h2 className="font-medium text-base mb-2">
                                Detected Items (
                                {JSON.parse(message.content).items.length})
                              </h2>
                              <p className="text-xs text-gray-500 mb-2">
                                Click on an item to search for similar products
                              </p>
                            </div>
                            <div className="">
                              <div className="flex items-center gap-4 overflow-hidden  overflow-x-scroll  ">
                                {JSON.parse(message.content).items.map(
                                  (value: DetectedItem, i: number) => {
                                    return (
                                      <div
                                        key={i}
                                        onClick={() =>
                                          searchObjectFn(value.croppedImageUrl)
                                        }
                                        className=" flex flex-col  gap-3 min-w-max border border-[rgba(10,10,10,0.21)] rounded-lg p-4 mb-2"
                                      >
                                        <div className="relative ">
                                          <Image
                                            src={`https://storage.googleapis.com${value.croppedImageUrl}`}
                                            alt={"asdasderty"}
                                            width={160}
                                            height={160}
                                            className="size-40 object-contain rounded-lg"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-medium text-xs text-gray-800 truncate">
                                            {value.label}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {value.confidence * 100}%
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : message.type == "SearchedProductsByImage" ? (
                    <div className="shadow-none  bg-[#f5f5f5] borde border-[#e4e4e7] rounded-lg p-3 max-[1280px]:p-2">
                      <SearchProduct message={message} />
                    </div>
                  ) : message.type == "room_analysis" ? (
                    <div className="shadow-none  bg-white border border-[#e4e4e7] rounded-lg p-3">
                      <p className="truncate  flex-wrap line-clamp-2 w-[90%]  ">
                        {/* {
                          JSON.parse(messages?.at(-1)?.content || "{}")
                            ?.description
                        } */}
                      </p>
                      <div className="flex flex-col gap-5">
                        {JSON.parse(message.content).data.map(
                          (value: detectedTy, i: number) => (
                            <div
                              key={i}
                              className="bg-[#f5f5f5] p-4 rounded-lg h-fit"
                            >
                              <ProductRoom {...value} />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {message?.content?.trim() ==
                          "I can help you find the perfect furniture for your home. Would you like to upload a photo of your room or an inspired furniture photo to get started?" &&
                        isLast ? (
                          <div className="flex flex-col gap-3">
                            {/* <div className=" p-2 bg-[#f5f5f5] w-fit ml-auto rounded-lg">
                              <p className="text-[#1d1d1d] text-sm">
                                <AnimatedText text={message.content} />
                                {message.content}
                              </p>
                            </div> */}
                            <>
                              {message.content &&
                              isLast &&
                              message.sender.name !== "user" ? (
                                <AnimatedText
                                  className="bg-[#f5f5f5] w-fit h-fit  mr-auto  p-2.5 rounded-lg "
                                  text={message.content}
                                  delay={0.015}
                                />
                              ) : (
                                <div className="bg-[#f5f5f5] w-fit  mr-auto  p-2.5 rounded-lg ">
                                  <p className="text-[#1d1d1d] text-sm">
                                    {message.content}
                                  </p>
                                </div>
                              )}
                            </>
                            <div
                              className={`cursor-pointer   flex items-center justify-evenly border border-[rgba(10,10,10,0.1)] rounded-lg  ${
                                imgDetactSugetion && "hidden"
                              } `}
                            >
                              <button
                                onClick={() => {
                                  detectObject();
                                  // setImgDetactSugetion(true);
                                }}
                                disabled={hiddenOfAfterImg}
                                className={` cursor-pointer   py-2 px-2 w-full flex items-center justify-center text-sm font-medium text-[rgba(10,10,10,0.7)] ${
                                  hiddenOfAfterImg && "!cursor-not-allowed  "
                                } `}
                              >
                                I need furniture from this room.
                              </button>
                              <div className="h-9 w-[1px] bg-[rgba(10,10,10,0.1)]"></div>
                              <button
                                disabled={hiddenOfAfterImg}
                                onClick={() => {
                                  showProduct();
                                  setImgDetactSugetion(true);
                                }}
                                className={`w-full flex items-center cursor-pointer justify-center text-sm font-medium text-[rgba(10,10,10,0.7)]  py-2   ${
                                  hiddenOfAfterImg && "!cursor-not-allowed  "
                                } `}
                              >
                                Show me suitable furniture.
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message.content &&
                            isLast &&
                            message.sender.name !== "user" ? (
                              <AnimatedText
                                className="bg-[#f5f5f5] w-fit  mr-auto  p-2.5 rounded-lg "
                                text={message.content}
                                delay={0.015}
                              />
                            ) : (
                              <div className="bg-[#f5f5f5] w-fit  mr-auto  p-2.5 rounded-lg ">
                                <p className="text-[#1d1d1d] text-sm">
                                  {message.content}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
              {/* {loading && isLast && (
                <div className="mt-3 flex justify-start items-center">
                  <Loader2 className="animate-spin text-[rgba(48,48,48,0.45)]" />
                </div>
              )} */}
              {loadingOfImgLast && isLast && (
                <div className="mt-3">
                  <DotLoading />
                </div>
              )}
              {message.sender.name == "user" && isLast && <DotLoading />}
            </div>
          );
        })}
        {imgDetactSugetion && <DotLoading />}
      </div>
    </div>
  );
};

export default ChatsDynamic_component;
