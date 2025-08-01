import RegisterOTPComponent from "@/components/auth/regsiterOTP";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const RegisterOTP = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin " />
          </div>
        }
      >
        <RegisterOTPComponent />
      </Suspense>
    </>
  );
};

export default RegisterOTP;
