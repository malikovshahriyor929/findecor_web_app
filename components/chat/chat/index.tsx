"use client";
import { Myaxios } from "@/request";
import { ArrowUp, ImageOff, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import ChatsDynamic_component from "./chatDynamic";
import { useDispatch } from "react-redux";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";
import { toggle, toggleForFilebar } from "@/store/menubarSlice";
import { setFilebarSearchImage, setMessage } from "@/store/chatmessageSlice";
import { Socket } from "socket.io-client";
import { ChatMessageType, ColorOption } from "@/types";
import toast from "react-hot-toast";
import { getSocket } from "@/provider/socket";
import MediaUploadDrawer from "./uploadDrawer";
import useIsMobile from "@/utils/isMobile";

const Chat_components = () => {
  // const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgDetactSugetion, setImgDetactSugetion] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [uploadImg, setUploadImg] = useState<string>("");
  const [fileOpen, setFileOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const searchparams = useSearchParams();
  const router = useRouter();
  const [loadingOfImgLast, setloadingOfImgLast] = useState(false);
  const [hiddenOfAfterImg, sethiddenOfAfterImg] = useState(false);
  const isMobile = useIsMobile();
  const id = searchparams.get("chatId") || null;
  // message push bottom
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  // connect to socket
  useEffect(() => {
    const newSocket = getSocket();
    const onMyMessage = (message: ChatMessageType) => {
      setMessages((prev) => [...prev, message]);
      setLoading(false);
      setloadingOfImgLast(false);
      sethiddenOfAfterImg(false);
      setImgDetactSugetion(false);
      dispatch(setFilebarSearchImage(false));
    };

    const onNewMessage = (message: ChatMessageType) => {
      setMessages((prev) => [...prev, message]);
      setLoading(false);
      setloadingOfImgLast(false);
      sethiddenOfAfterImg(false);
      setImgDetactSugetion(false);
      dispatch(setFilebarSearchImage(false));
    };

    newSocket.on("connected", () => {
      setSocket(newSocket);
    });

    newSocket.on("myMessage", onMyMessage);
    newSocket.on("newMessage", onNewMessage);
    newSocket.on("aiError", (err) => {
      console.log(err);
    });

    return () => {
      newSocket.off("myMessage", onMyMessage);
      newSocket.off("newMessage", onNewMessage);
      newSocket.disconnect();
    };
  }, [dispatch]);
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // if (messages[messages?.length - 1]?.sender.name != "ai") return;
    setLoading(true);
    if (!id) {
      try {
        const res = await Myaxios.post("/chats", { name: "new chat" });
        const newChatId = res.data.uid;
        setMessages([]);
        localStorage.setItem("message", newMessage);
        router.push(`/?chatId=${newChatId}`);
        dispatch(setMessage(newChatId));
        setNewMessage("");
      } catch (err) {
        toast.error("Chat yaratishda xatolik");
        setLoading(false);
        console.log(err);
      }
    } else {
      if (id && socket) {
        socket.emit("sendMessage", {
          content: newMessage,
          type: "text",
        });
      }
      setNewMessage("");
    }
  };
  const handleSendOptions = async () => {
    if (selectedOption?.length == 0) return;
    setLoading(true);
    if (id && socket) {
      socket.emit("sendMessage", {
        content: selectedOption.join(", "),
        type: "text",
      });
      setSelectedOption([]);
    }
  };
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingImg(true);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      setLoadingImg(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await Myaxios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = response?.data?.url;
      setUploadImg(imageUrl);
      if (!id) {
        const res = await Myaxios.post("/chats", { name: "new chat" });
        const newChatId = res.data.uid;
        localStorage.setItem("message", newMessage);
        router.push(`/?chatId=${newChatId}`);
        dispatch(setMessage(newChatId));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
      setUploadImg("");
    } finally {
      setLoadingImg(false);
    }
  };
  const handleUploadFinish = () => {
    if (id && socket) {
      socket.emit("sendMessage", {
        content: uploadImg.slice(30),
        type: "image",
      });
    }
    setFileOpen(false);
    setUploadImg("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="relative h-full">
      <div className="flex chat flex-col justify-end  h-screen  max-[1140px]:w-[90%] mx-auto">
        <div className="">
          <div
            onClick={() => dispatch(toggle())}
            className="absolute top-4 left-3 hidden
        max-[925px]:flex "
          >
            <RiMenuUnfold4Line
              size={25}
              className="text-[rgba(10,10,10,0.45)]"
            />
          </div>
          <div
            onClick={() => dispatch(toggleForFilebar())}
            className="absolute   top-4 right-4 hidden
          max-[925px]:flex "
          >
            <RiMenuFold4Line size={25} className="text-[rgba(10,10,10,0.45)]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col-reverse px-23 max-[1300px]:px-20 max-[1268px]:px-15 max-[1230px]:px-20 max-[1110px]:px-10 max-[1000px]:px-2 max-[925px]:px-20 max-[780px]:px-15 max-[735px]:px-10 max-[690px]:px-5  my-3 py-3 transition-all duration-500 ease-in-out transform">
          <div
            ref={messagesEndRef}
            className="duration-500 transition-all ease-in-out"
          />
          <div className="flex flex-col gap-3 duration-500 transition-all ease-in-out">
            {id && (
              <ChatsDynamic_component
                id={id}
                socket={socket}
                setMessages={setMessages}
                messages={messages}
                loading={loading}
                loadingOfImgLast={loadingOfImgLast}
                setloadingOfImgLast={setloadingOfImgLast}
                hiddenOfAfterImg={hiddenOfAfterImg}
                sethiddenOfAfterImg={sethiddenOfAfterImg}
                setImgDetactSugetion={setImgDetactSugetion}
                imgDetactSugetion={imgDetactSugetion}
              />
            )}
          </div>
        </div>
        <>
          <div
            className={` max-h-fit hidden  fle mx-23 max-[1300px]:mx-20 max-[1268px]:mx-15 max-[1230px]:mx-20 max-[1110px]:mx-10 max-[1000px]:mx-2 max-[925px]:mx-20 max-[780px]:mx-15 max-[735px]:mx-10 max-[690px]:mx-5  rounded-[12px]   items-center gap-3 py-2 overflow-hidden  ${
              messages[messages?.length - 1]?.options?.length > 0
                ? "flex"
                : "hidden"
            } `}
          >
            {messages.map((value: ChatMessageType, i: number) => {
              const isLast = i === messages?.length - 1;

              return (
                <div
                  key={i}
                  className={`${!isLast && "hidden"} ${
                    newMessage && "hidden"
                  } ${!id && "hidden"} flex relative w-full  h-full  gap-3`}
                >
                  <div className=" overflow-x-auto w-12/12  flex gap-3  ">
                  {value?.sender?.name !== "user" &&
                      isLast &&
                      value.options?.length > 0 &&
                      value.options.map((item: ColorOption, t: number) => {
                        const isSelected = selectedOption.includes(item.name);

                        return (
                          <div
                            key={t + i}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer border transition-all duration-200 min-h-[50px] min-w-[120px]  ${
                              isSelected
                                ? "border-[#ea580b] bg-orange-100 "
                                : "border-gray-300 hover:border-gray-500"
                            }`}
                          >
                            {item.hexCode?.trim() !== "" && item.hexCode ? (
                              <div
                                onClick={() => {
                                  if (selectedOption.includes(item.name)) {
                                    setSelectedOption(
                                      selectedOption.filter(
                                        (value) => value !== item.name
                                      )
                                    );
                                  } else {
                                    setSelectedOption([
                                      ...selectedOption,
                                      item.name,
                                    ]);
                                  }
                                }}
                                className="flex items-center gap-3 w-full  "
                              >
                                <div
                                  className="size-7 rounded-full border"
                                  style={{ backgroundColor: item.hexCode }}
                                />
                                <p className="text-sm font-medium">
                                  {item.name}
                                </p>
                              </div>
                            ) : item.url ? (
                              <div
                                onClick={() => {
                                  if (selectedOption.includes(item.name)) {
                                    setSelectedOption(
                                      selectedOption.filter(
                                        (value) => value !== item.name
                                      )
                                    );
                                  } else {
                                    setSelectedOption([
                                      ...selectedOption,
                                      item.name,
                                    ]);
                                  }
                                }}
                                className="flex items-center gap-3  w-full "
                              >
                                <Image
                                  src={
                                    "https://storage.googleapis.com" + item.url
                                  }
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                  className="rounded-lg"
                                  loading="eager"
                                />
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                              </div>
                            ) : (
                              <span
                                onClick={() => setSelectedOption([item.name])}
                                className="text-sm font-medium"
                              >
                                {item.name}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative  mb-4  max-h-[150px] mx-23 max-[1300px]:mx-20 max-[1268px]:mx-15 max-[1230px]:mx-20 max-[1110px]:mx-10 max-[1000px]:mx-2 max-[925px]:mx-20 max-[780px]:mx-15 max-[735px]:mx-10 max-[690px]:mx-5   border-4  rounded-[12px]   border-[rgba(48,48,48,0.1)] text-wrap ">
            <form
              onSubmit={handleSend}
              className="flex items-center justify-between"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask anything ..."
                className="flex-wrap  items-start resize-none max-h-[140px] text-wrap w-full py-2   outline-none mx-3 placeholder:font-medium placeholder:text-[rgba(10,10,10,0.45)] "
                // rows={1}
              />
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setFileOpen(!fileOpen)}
                  className=" !h-5 w-5 flex gap-5 relative"
                >
                  <Image src="/svg/bookmark.svg" fill alt="bookmark" />
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    if (selectedOption) {
                      handleSendOptions();
                    } else {
                      handleSend(e);
                    }
                  }}
                  className="p-2  relative "
                >
                  <ArrowUp color="rgba(10,10,10,0.45)" />
                  {selectedOption?.length > 0 && (
                    <div className="absolute top-2.5 left-1/4   size-5 bg-black/30 animate-ping rounded-full " />
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      </div>
      {!isMobile && (
        <Dialog
          open={fileOpen}
          onOpenChange={(open) => {
            setFileOpen(open);
            if (!open) {
              setUploadImg("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px] max-[450px]:hidden ">
            <DialogHeader>
              <DialogTitle className="text-black">Upload media</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="w-full min-h-[200px] h-full flex items-center justify-center flex-col p-5 gap-3 rounded-lg border-dashed border-3 border-[#9ca3af] ">
                {uploadImg ? (
                  <div>
                    {uploadImg ? (
                      <div className=" relative w-full h-full flex items-center justify-center">
                        <div>
                          <Image
                            src={uploadImg}
                            alt={uploadImg}
                            width={250}
                            height={250}
                            className={`object-cover  object-center rounded-lg `}
                          />
                          <div
                            className="absolute z-50 top-2 text-white  right-2 "
                            onClick={() => {
                              setUploadImg("");
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <X />
                          </div>
                          <div className="absolute top-2 right-2  animate-ping size-6 bg-black/30 rounded-full  "></div>
                        </div>
                        {loadingImg && (
                          <div className="absolute top-0 left-0 flex items-center justify-center size-full ">
                            <Loader2 className="size-10 animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          triggerFileInput();
                        }}
                        className="flex flex-col items-center z-88 gap-3 "
                      >
                        <ImageOff size={50} className="text-[#9ca3af]" />
                        <p className="text-blue-500 hover:text-blue-600 font-medium px-4 py-2 text-sm  rounded-md touch-manipulation">
                          click to upload again
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="flex flex-col items-center gap-2 "
                  >
                    <Upload size={30} color="#9ca3af" />
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600">
                        Drop your files here, or
                      </p>
                      <p className="text-blue-500 hover:text-blue-600 font-medium px-4 py-2 text-sm  rounded-md touch-manipulation">
                        click to browse
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 max-w-[300px] text-center">
                      Supported formats: JPG, PNG, HEIC, HEIF, GIF, WEBP, and
                      more
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <p>Select single image</p>
                <p>Upload up to 5MB image</p>
              </div>
              {loadingImg && (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin  " />
                  {/* <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div> */}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setFileOpen(false);
                  handleUploadFinish();
                }}
                type="submit"
                className="!bg-[#EA580B]"
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isMobile && (
        <div className="max-[450px]:flex !hidden">
          <MediaUploadDrawer
            fileOpen={fileOpen}
            setFileOpen={setFileOpen}
            uploadImg={uploadImg}
            setUploadImg={setUploadImg}
            loadingImg={loadingImg}
            handleUploadImage={handleUploadImage}
            handleUploadFinish={handleUploadFinish}
          />
        </div>
      )}
    </div>
  );
};

export default Chat_components;
