"use client";
import Sidebar from "./sidebar";
import Chat_components from "./chat";
import Filebar from "./filebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggle, toggleForFilebar } from "@/store/menubarSlice";

const Chat_componentsLayout = () => {
  const { open, open2 } = useSelector((state: RootState) => state.toogle);
  const dispatch = useDispatch();
  return (
    <div className="bg-[#fffef8] h-screen ">
      <div className="flex h-full">
        { open && (
          <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
            onClick={ () => {
              dispatch(toggle());
            } }
          />
        ) }
        { open2 && (
          <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
            onClick={ () => dispatch(toggleForFilebar()) }
          />
        ) }
        <div
          className={ `w-[284px] max-[1013px]:w-[254px] top-0 left-0 max-[925px]:bg-[#fffef8] max-[925px]:h-screen z-50 transition-all duration-300 ease-in-out transform max-[925px]:fixed border-r border-[rgba(10,10,10,0.1)] ${open
            ? "max-[925px]:translate-x-0  "
            : "max-[925px]:-translate-x-full"
            } ` }
        >
          <Sidebar />
        </div>
        <div
          className={ `w-[calc(100%-568px)]  max-[1140px]:w-[calc(100%-500px)]  bg-[#fffef8]  ${!open && "max-[925px]:w-[100%]"
            } ${open2 ? "max-[925px]:translate-x-0  " : "max-[925px]:w-[100%]"} ` }
        >
          <Chat_components  /> 
        </div>
        <div
          className={ `w-[284px] max-[1140px]:w-[250px] max-[790px]:w-fi  border-l top-0 right-0 max-[925px]:bg-[#fffef8] max-[925px]:h-screen max-[925px]:shadow-xl z-50 transition-all duration-300 ease-in-out transform max-[925px]:fixed border-[rgba(10,10,10,0.1)] ${open2
            ? "max-[925px]:translate-x-0  "
            : "max-[925px]:translate-x-full"
            }` }
        >
          <Filebar />
        </div>
      </div>
    </div>
  );
};

export default Chat_componentsLayout;
