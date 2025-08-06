"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Myaxios } from "@/request";
import { RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import SkeletonForSideBar from "@/shared/skeletonForsidebar";
import { ChatSelectType, UserType } from "@/types";
import {
  Check,
  EllipsisVertical,
  LogOut,
  MessageSquare,
  Pen,
  Trash2,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { setMessage } from "@/store/chatmessageSlice";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const Sidebar = () => {
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");
  console.log(searchParams.getAll("appId")[0]);

  const searchParam = useSearchParams();
  const router = useRouter();
  const id = searchParam.get("chatId");
  const [user, setUser] = useState<UserType>();
  const { chatId } = useSelector((state: RootState) => state.chatmessage);
  const [editOpen, setEditOpen] = useState<{
    bool: boolean;
    id: number | string;
    name: string;
  }>({
    bool: false,
    id: 0,
    name: "",
  });
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { counter } = useSelector((state: RootState) => state.toogle);
  const { data, isLoading, isError, refetch } = useQuery<ChatSelectType[]>({
    queryKey: ["chatselect"],
    queryFn: () =>
      Myaxios.get("/chats", { params: { sort: "desc" } }).then(
        (res) => res.data
      ),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (counter >= 8 && counter <= 10) {
      refetch();
    }
  }, [counter, refetch]);

  const handle = () => {
    router.push(`/?appId=${appId}`);
    localStorage.removeItem("message");
    dispatch(setMessage(""));
    refetch();
  };
  const onclickedChat = (id: string) => {
    router.push(`/?chatId=${id}&appId=${appId}`);
  };
  useEffect(() => {
    refetch();
  }, [id, chatId, refetch]);

  useEffect(() => {
    Myaxios.get("/users/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        Cookies.remove("access_token");
        router.push(`/login?appId=${appId}`);
      });
  }, [router]);
  const editFn = () => {
    Myaxios.patch(`/chats/uid/${editOpen.id}`, { name: editOpen.name }).then(
      (res) => {
        setEditOpen({ bool: false, id: "", name: "" });
        refetch();
        toast.success("You changed " + res.data.name + " successfully");
      }
    );
  };
  const deleteFn = async (id: string) => {
    await Myaxios.delete(`/chats/uid/${id}`).then((res) => {
      refetch();
      handle();
      toast.success(res.data.message);
    });
  };

  return (
    <div className="h-full flex flex-col justify-between ">
      <div>
        <div className="flex justify-between items-center px-6  py-5">
          <div>
            <Link href={ `/appId=${appId}` }>
              <Image
                src="/svg/findecor-logo-full-color-rgb 1.svg"
                height={ 22 }
                width={ 100 }
                alt="logo"
                priority
              />
            </Link>
          </div>
          <div onClick={ () => handle() } className="cursor-pointer ">
            <Image
              height={ 20 }
              width={ 20 }
              src="/svg/plus.svg"
              alt=""
              className="max-[1000px]:hidde"
            />
          </div>
        </div>
        <p
          className="text-xs font-medium text-[rgba(10,10,10,0.45)] px-6 py-1.5 
        "
        >
          History
        </p>
        <div className="overflow-hidden ">
          { !isLoading && !isError && data ? (
            data?.length ? (
              <div
                className={ `py-1 px-4 rounded-lg mt-2 mx-2 flex flex-col gap-3 items-cente h-[calc(100dvh-160px)] overflow-y-auto ` }
              >
                { data.map((value: ChatSelectType, i: number) => (
                  <div
                    className={ `flex items-center gap-1 cursor-pointer hover:bg-[#f7f7f7] w-full ${id
                      ? id == value.uid
                        ? "group flex items-cente justify-between rounded bg-orange-100 hover:bg-orange-200"
                        : "group flex items-cente justify-between rounded  hover:bg-[#f7f7f7]"
                      : value.uid == chatId
                        ? "group flex items-cente justify-between rounded bg-orange-100 hover:bg-orange-200"
                        : "group flex items-cente justify-between rounded  hover:bg-[#f7f7f7]"
                      }` }
                    key={ i }
                  >
                    <div
                      onClick={ () => onclickedChat(value.uid) }
                      className={ `flex  items-center  gap-2 flex-1 text-left px- py-1 text-sm font-medium truncate  w-[11rem] max-[1100px]:w-[9rem]  max-[1000px]:w-[8.5rem] line-clamp-1   ${id
                        ? id == value.uid
                          ? " text-orange-800"
                          : "text-gray-700"
                        : value.uid == chatId
                          ? " text-orange-800"
                          : "text-gray-700"
                        } ` }
                    >
                      { editOpen.bool && editOpen.id == value.uid ? (
                        <div className="flex items-center gap-3 ">
                          <Input
                            value={ editOpen.name }
                            onChange={ (e) =>
                              setEditOpen({ ...editOpen, name: e.target.value })
                            }
                            className="focus:border-none h-7 w-[100%] "
                          />
                          <div className="flex items-center gap-2">
                            <Check
                              size={ 20 }
                              onClick={ () => editFn() }
                              className="text-green-500"
                            />
                            <X
                              size={ 20 }
                              onClick={ () =>
                                setEditOpen({ bool: false, id: "", name: "" })
                              }
                              className="text-red-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mx-2 ">
                          <MessageSquare size={ 16 } />
                          <p className="">{ value.name }</p>
                        </div>
                      ) }
                    </div>
                    <Menubar className="bg-transparent border-none shadow-none p-0 m-0 hover:bg-transparent focus:!bg-transparent ">
                      <MenubarMenu>
                        <MenubarTrigger
                          onClick={ () => setOpen((prev) => !prev) }
                          className="focus:bg-transparent z-[887]  focus:text-accent-foreground data-[state=open]:bg-transparent  data-[state=open]:text-transparent flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none "
                        >
                          <div className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100  max-[450px]:opacity-100 ">
                            <EllipsisVertical size={ 16 } />
                          </div>
                        </MenubarTrigger>
                        {/* <MenubarContent>
                          <div className="flex flex-col gap-2 p-2 ">
                            <div
                              onClick={() =>
                                setEditOpen({
                                  bool: true,
                                  id: value.uid,
                                  name: value.name,
                                })
                              }
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <Pen size={16} />
                              rename
                            </div>
                            <div
                              onClick={() => deleteFn(value.uid)}
                              className="flex items-center gap-2 text-sm text-red-500 cursor-pointer"
                            >
                              <Trash2 size={16} />
                              delete
                            </div>
                          </div>
                        </MenubarContent> */}
                        { open && (
                          <MenubarContent
                            onInteractOutside={ () => setOpen(false) } // close when clicking outside
                            className="z-50"
                          >
                            <div className="flex flex-col gap-2 p-2">
                              <div
                                onClick={ () => {
                                  setEditOpen({
                                    bool: true,
                                    id: value.uid,
                                    name: value.name,
                                  });
                                  setOpen(false);
                                } }
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                <Pen size={ 16 } />
                                Rename
                              </div>
                              <div
                                onClick={ () => {
                                  deleteFn(value.uid);
                                  setOpen(false);
                                } }
                                className="flex items-center gap-2 text-sm text-red-500 cursor-pointer"
                              >
                                <Trash2 size={ 16 } />
                                Delete
                              </div>
                            </div>
                          </MenubarContent>
                        ) }
                      </MenubarMenu>
                    </Menubar>
                  </div>
                )) }
              </div>
            ) : (
              <div className="bg-[#f7f7f7] p-5 rounded-lg mt-2 mx-2 flex flex-col gap-3 items-center   ">
                <Image
                  height={ 24 }
                  width={ 24 }
                  src="/svg/list-unordered.svg"
                  alt="menu"
                />
                <p className="text-[rgba(10,10,10,0.45)] text-xs font-medium">
                  Your chat history will appear here.
                </p>
              </div>
            )
          ) : (
            <SkeletonForSideBar />
          ) }
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3  cursor-pointer ">
        { user?.image ? (
          <div className="bg-[#fde68a] rounded-lg flex items-center justify-center size-8 ">
            <Image
              src={ user.image }
              alt="profile"
              height={ 40 }
              width={ 40 }
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="bg-[#fde68a]  rounded-lg flex items-center justify-center size-8 ">
            <p className=" text-[#ea580b] text-sm font-medium">
              { user?.name[0] }
            </p>
          </div>
        ) }
        <p className="text-[#1d1d1d] font-medium">{ user?.name }</p>

        <Menubar className="bg-transparent border-none shadow-none p-0 m-0 hover:bg-transparent focus:!bg-transparent ">
          <MenubarMenu>
            <MenubarTrigger
              // onClick={() => setOpen((prev) => !prev)}
              className="focus:bg-transparent  focus:text-accent-foreground data-[state=open]:bg-transparent  data-[state=open]:text-transparent flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none"
            >
              <div className="relative z- ">
                <Image
                  height={ 14 }
                  width={ 14 }
                  src="/svg/arrowSideBarBottom.svg"
                  alt="btn"
                />
              </div>
            </MenubarTrigger>
            <MenubarContent className="z-50">
              <div className="flex flex-col gap-2 p-2">
                <div
                  onClick={ () => {
                    Cookies.remove("access_token");
                    localStorage.removeItem("message");
                    router.push(`/login?appId=${appId}`);
                    dispatch(setMessage(""));
                  } }
                  className="flex items-center text-red-500 gap-2 text-sm cursor-pointer"
                >
                  <LogOut size={ 16 } />
                  Log out
                </div>
              </div>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Sidebar;
