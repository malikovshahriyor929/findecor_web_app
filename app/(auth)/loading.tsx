import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 size={30} className="animate-spin " />
    </div>
  );
};

export default Loading;
