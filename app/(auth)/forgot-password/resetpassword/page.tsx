import Reset_password_Component from "@/components/auth/forgot-password/resetpassword";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const Reset_password = () => {
  return (
    <div>
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">
        <Loader2 size={30} className="animate-spin " />
      </div>}>
        <Reset_password_Component />
      </Suspense>
    </div>
  );
};

export default Reset_password;
