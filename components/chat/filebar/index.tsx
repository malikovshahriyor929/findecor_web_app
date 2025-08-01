"use client";
import React, { useState } from "react";
import ToggleTabs from "./fileBarChanger";
import Upload from "./upload";
import Saved from "./saved";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleForFilebar } from "@/store/menubarSlice";

const Filebar = () => {
  const [activeTab, setActiveTab] = useState("uploads");
  const dispatch = useDispatch();
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["saved"],
  //   queryFn: () => Myaxios.get("/product-likes").then((res) => res.data),
  // });
  // const dehydratedState = dehydrate(queryClient);
  return (
    <div className="mt-4">
      <div className="max-[320px]:flex items-center gap-0">
        <ToggleTabs setActiveTab={setActiveTab} activeTab={activeTab} />
        <div
          onClick={() => dispatch(toggleForFilebar())}
          className="max-[320px]:flex hidden max-[320px]:mr-2"
        >
          <X />
        </div>
      </div>
      {activeTab == "uploads" ? <Upload /> : <Saved />}
    </div>
  );
};

export default Filebar;
