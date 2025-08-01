"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useResetPasswordMutation } from "@/request/mutation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { deleteValuesType } from "@/types";

const formSchema = z
  .object({
    code: z.string().max(6).min(6),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    newPasswordCon: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .refine((data) => data.newPassword === data.newPasswordCon, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

const Reset_password_Component = () => {
  const router = useRouter();

  const { mutate, isPending } = useResetPasswordMutation();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      newPasswordCon: "",
    },
  });
  const passwordValue = form.watch("newPassword");
  useEffect(() => {
    const password = passwordValue || "";
    const requirements = {
      length: password?.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    setPasswordRequirements(requirements);
    const strength = Object.values(requirements)?.filter(Boolean)?.length;
    setPasswordStrength(strength);
  }, [passwordValue]);
  function onSubmit(values: z.infer<typeof formSchema>) {
    const deletedValues: deleteValuesType = { ...values, email: userEmail };
    delete deletedValues.newPasswordCon;
    mutate(deletedValues, {
      onSuccess() {
        router.push("/login");
      },
    });
  }
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-[#fffef8] ">
        <div className="max-w-[400px] mx-auto w-[90%] bg-white shadow-lg  border border-[#e5e7eb] px-6 pt-4 rounded-lg">
          <div className="space-y-1">
            <h1 className="font-semibold tracking-tight text-center text-2xl">
              Reset password
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Enter your email address and we send you a link to reset your
              password
            </p>
          </div>
          <div className=" mx-auto py-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="code">Confirm code</Label>
                          </div>
                          <InputOTP
                            id="code"
                            {...field}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            maxLength={6}
                            className="w-full"
                          >
                            <InputOTPGroup className="*:w-full w-full">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="newPassword">New password</Label>
                          </div>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                          {passwordValue && (
                            <div className="mt-2 space-y-2">
                              <div className="flex gap-1">
                                {Array.from({ length: 4 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full ${
                                      i < passwordStrength
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>

                              <ul className="space-y-1 text-xs">
                                <li className="flex items-center gap-1">
                                  <span
                                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                      passwordRequirements?.length
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {passwordRequirements?.length && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                  At least 8 characters
                                </li>
                                <li className="flex items-center gap-1">
                                  <span
                                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                      passwordRequirements.uppercase
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {passwordRequirements.uppercase && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                  At least one uppercase letter
                                </li>
                                <li className="flex items-center gap-1">
                                  <span
                                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                      passwordRequirements.lowercase
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {passwordRequirements.lowercase && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                  At least one lowercase letter
                                </li>
                                <li className="flex items-center gap-1">
                                  <span
                                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                      passwordRequirements.number
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {passwordRequirements.number && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                  At least one number
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPasswordCon"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="newPasswordCon">
                              Confirm new password
                            </Label>
                          </div>
                          <Input
                            id="newPasswordCon"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full cursor-pointer bg-[#ea430a] hover:bg-[#ea430a]/85 "
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </form>
            </Form>
            <div
              onClick={() => router.back()}
              className="font-medium text-xs cursor-pointer pt-4 text-center text-blue-600 hover:text-blue-500"
            >
              Back to login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset_password_Component;
