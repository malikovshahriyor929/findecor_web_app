import Chat_componentsLayout from "@/components/chat";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

const Home = async () => {
  return (
    <div className="h-full">
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin " />
          </div>
        }
      >
        <Chat_componentsLayout />
      </Suspense>
      <Toaster />
    </div>
  );
};

export default Home;
