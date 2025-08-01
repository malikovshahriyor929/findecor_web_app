import { DetectedItem, ImageDetectionResult } from "@/types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Loader2 } from "lucide-react";
import { getSocket } from "@/provider/socket";
import { setFilebarSearchImage } from "@/store/chatmessageSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

const ImgCard = (props: ImageDetectionResult) => {
  const { filebarSearchImage: loading } = useSelector(
    (state: RootState) => state.chatmessage
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    const newSocket = getSocket();
    newSocket.on("connected", () => {
      setSocket(newSocket);
    });
  }, []);
  const searchObjectFn = (imgUrl: string) => {
    dispatch(setFilebarSearchImage(true));
    if (socket && socket.connected) {
      socket.emit("searchProductsByImage", {
        imageUrls: ["https://storage.googleapis.com" + imgUrl],
      });
    } else {
      console.warn("Socket ulanmagan");
      dispatch(setFilebarSearchImage(false));
    }
  };

  return (
    <div className=" flex flex-col gap-3 ">
      <div className=" relative object-cover object-center rounded-lg overflow-hidden f5f5f5 max-h-[184px] ">
        <Image
          src={`https://storage.googleapis.com${props.imageUrl}`}
          alt=""
          width={250}
          height={200}
          className="rounded-lg cursor-pointer  "
        />
      </div>
      <div>
        <div className="flex items-center gap-3 cursor-pointer overflow-x-scroll  w-[250px] pb-2 max-[1140px]:w-[200px]">
          {props.items.map((child: DetectedItem, index: number) => (
            <div key={index} className="relative ">
              <div
                onClick={() => {
                  if (!loading) {
                    searchObjectFn(child.croppedImageUrl);
                    setSelected(child.croppedImageUrl);
                  }
                }}
                className={`border flex-shrink-0 flex items-center justify-center object-cover border-[rgba(10,10,10,0.1)] max-[1140px]:size-[45px] size-[52px] rounded-lg  bg-[#f7f7f7] ${
                  loading && child.croppedImageUrl == selected && "opacity-50"
                } `}
              >
                <Image
                  src={`https://storage.googleapis.com${child.croppedImageUrl}`}
                  alt=""
                  width={52}
                  height={53}
                  className="object-contain  rounded-lg p-1 max-[1140px]:size-[45px] size-[52px]   "
                />
              </div>
              {loading && child.croppedImageUrl == selected && (
                <div className="absolute top-0 left-0 flex items-center justify-center size-full  ">
                  <Loader2 className="animate-spin size-5  " />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImgCard;
