"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { GoogleLogo } from "@/shared/assets/icons/google-logo";
import { formSchema } from "@/utils";
import { useRegisterMutation } from "@/request/mutation";
import { registerType } from "@/types";
import { useRouter } from "next/navigation";

const RegisterComponents = () => {
  const router = useRouter();
  const { mutate, isPending } = useRegisterMutation();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });
  const passwordValue = form.watch("password");
  useEffect(() => {
    const password = passwordValue || "";
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    setPasswordRequirements(requirements);
    const strength = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [passwordValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const takeOffconfirm: registerType = { ...values };
    delete takeOffconfirm.confirm_password;
    mutate(takeOffconfirm, {
      onSuccess() {
        router.push(
          `/registerOTP?email=${encodeURIComponent(
            values.email
          )}&path=${encodeURIComponent(
            "email/verify"
          )}&redirect=${encodeURIComponent("/login")}`
        );
      },
    });
  }
  const handleGoogleSignUp = () => {
    // setIsLoading(true);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_expiry");
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-[#fffef8] ">
        <div className="max-w-[400px] mx-auto w-[90%] bg-white shadow-lg  border border-[#e5e7eb] px-6 pt-3 rounded-lg">
          <div className="space-y-1">
            <h1 className="font-semibold tracking-tight text-center text-2xl">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Sign up to access Findecor AI chatbot
            </p>
          </div>
          <div className=" mx-auto py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="name">Full name</Label>
                          </div>
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            {...field}
                          />
                        </div>
                      </>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                              type="password"
                              id="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </div>
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
                                      passwordRequirements.length
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {passwordRequirements.length && (
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
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="confirm-password">
                              Confirm Password
                            </Label>
                          </div>
                          <Input
                            type="password"
                            id="confirm-password"
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
                  className="w-full bg-[#ea430a] hover:bg-[#ea430a]/85 "
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>
            <div className="flex items-center gap-3 pt-3 ">
              <div className="h-[1px] w-full bg-[#e5e7eb]"></div>
              <p className="flex-shrink text-gray-500">OR</p>
              <div className="h-[1px] w-full bg-[#e5e7eb]"></div>
            </div>
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="mt-3 w-full"
            >
              <GoogleLogo className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>
            <p className="text-sm text-gray-600 text-center mt-5 space-x-2 ">
              <span>Don{"'"}t have an account?</span>
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterComponents;
