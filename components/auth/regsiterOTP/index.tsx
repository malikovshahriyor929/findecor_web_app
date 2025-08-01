"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRegisterOTPMutation } from "@/request/mutation";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const RegisterOTPComponent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const path = searchParams.get("path");
  const redirect = searchParams.get("redirect");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { mutate, isPaused } = useRegisterOTPMutation();
  type RegisterOTPQueryParams = {
    email?: string;
    code: string;
  };
  const handleChange = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = () => {
    if (otp?.length !== 6) {
      return;
    }
    if (!path || !redirect) {
      return;
    }
    let data: RegisterOTPQueryParams = { code: otp };
    if (email) {
      data = { ...data, email: email };
    }

    mutate(
      {
        path,
        data,
      },
      {
        onSuccess: () => {
          router.push(redirect);
        },
      }
    );
  };

  return (
    <div className="bg-[#fffef8] h-screen flex items-center justify-center flex-col  ">
      <div className="  max-w-[500px] m-auto shadow-lg rounded-lg p-5 flex flex-col gap-4 items-center">
        <div className="space-y-1">
          <h1 className="font-semibold tracking-tight text-center text-2xl">
            Confirm email
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            We send code your email
          </p>
        </div>
        <InputOTP maxLength={6} value={otp} onChange={handleChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          onClick={() => handleSubmit()}
          className="w-full bg-[#ea430a] hover:bg-[#ea430a]/85 "
        >
          {isPaused ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirm code...
            </>
          ) : (
            "Confirm code"
          )}
        </Button>
      </div>
    </div>
  );
};

export default RegisterOTPComponent;
