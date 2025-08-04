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
import Link from "next/link";
import { GoogleLogo } from "@/shared/assets/icons/google-logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLoginMutation } from "@/request/mutation";
import { Myaxios } from "@/request";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
          auth_date?: string;
          hash?: string;
        };
        ready: () => void;
        close: () => void;
        sendData: (data: string) => void;
        expand: () => void;
        isExpanded: boolean;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." }),
});
interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

interface TelegramInitDataUnsafe {
  query_id?: string;
  user?: TelegramWebAppUser;
  auth_date?: number;
  hash?: string;
  receiver?: {
    id: number;
    type: string;
  };
}

const LoginComponents = () => {
  const router = useRouter();
  const { mutate, isPending } = useLoginMutation();
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromProtected = searchParams.get("fromProtected");

    if (fromProtected) {
      const token = localStorage.getItem("auth_token");
      const tokenExpiry = localStorage.getItem("auth_token_expiry");
      if (token && tokenExpiry && Number(tokenExpiry) > Date.now()) {
        router.push("/chat");
      }
    }
  }, [router]);
  const handleGoogleSignUp = () => {
    window.location.href =
      "https://backend.findecor.io/auth/google?callbackUrl=https://app.findecor.io/login";
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        Cookies.set("access_token", token);
        router.replace("/");
      }
    }
  }, [router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess() {
        router.push("/");
      },
      onError: (err) => {
        console.log(err);

        if (isAxiosError(err) && err.response?.status === 403) {
          Myaxios.post("/auth/email/request-confirmation", {
            email: values.email,
          });
          router.push(
            `/registerOTP?email=${encodeURIComponent(
              values.email
            )}&path=${encodeURIComponent(
              "email/verify"
            )}&redirect=${encodeURIComponent("/login")}`
          );
        }
      },
    });
  }

  // Telegram Web App skripti yuklanganiga ishonch hosil qiling
  // <script src="https://telegram.org/js/telegram-web-app.js"></script>



  const [user, setUser] = useState<TelegramInitDataUnsafe | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      // if (window.Telegram && window.Telegram.WebApp) {
      //   window.Telegram.WebApp.ready();
      //   const actualInitDataFromTelegram = window.Telegram.WebApp.initData;

      //   // Bu `actualInitDataFromTelegram` stringini backend'ingizga yuboring
      //   // Masalan, fetch/axios yordamida POST so'rovi orqali
      //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-data`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ initData: actualInitDataFromTelegram })
      //   })
      //     .then(response => response.json())
      //     .then(data => {
      //       alert('Backend javobi: ' + JSON.stringify(data));
      //       if (data.success) {
      //         console.log("Hash muvaffaqiyatli tasdiqlandi!");
      //       } else {
      //         console.error("Hash tasdiqlanmadi!");
      //       }
      //     })
      //     .catch(error => console.error("Xato yuz berdi:", error));
      // }
      const tg = window.Telegram.WebApp;
      tg.ready();
      const rawUser = tg.initDataUnsafe;
      if (rawUser) {
        // Convert auth_date to number if present and is a string
        const fixedUser: TelegramInitDataUnsafe = {
          ...rawUser,
          auth_date: rawUser.auth_date
            ? Number(rawUser.auth_date)
            : undefined,
        };
        setUser(fixedUser);
        console.log("Telegram foydalanuvchi:", fixedUser);
      } else {
        console.warn("Foydalanuvchi topilmadi.");
      }
    } else {
      console.error("Telegram WebApp mavjud emas.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#fffef8] ">
      <div className="max-w-[400px] mx-auto w-[90%] bg-white shadow-lg  border border-[#e5e7eb] px-6 pt-4 rounded-lg">
        { user ? (
          <pre>{ JSON.stringify(user, null, 2) }</pre>
        ) : (
          <p>User not found. Are you inside Telegram?</p>
        ) }
        <div className="space-y-1">
          <h1 className="font-semibold tracking-tight text-center text-2xl">
            Sign In
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to access Findecor AI chatbot
          </p>
        </div>
        <div className=" mx-auto py-5">
          <Form { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-5">
              <FormField
                control={ form.control }
                name="email"
                render={ ({ field }) => (
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
                          { ...field }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="password"
                render={ ({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-blue-500 hover:text-blue-600"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          type="password"
                          id="password"
                          placeholder="••••••••"
                          { ...field }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <Button
                type="submit"
                disabled={ isPending }
                className="w-full bg-[#ea430a] hover:bg-[#ea430a]/85 "
              >
                { isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                ) }
              </Button>
            </form>
          </Form>
          <div className="flex items-center gap-3 pt-4 ">
            <div className="h-[1px] w-full bg-[#e5e7eb]"></div>
            <p className="flex-shrink text-gray-500">OR</p>
            <div className="h-[1px] w-full bg-[#e5e7eb]"></div>
          </div>

          <Button
            onClick={ handleGoogleSignUp }
            variant="outline"
            className="mt-4 w-full"
          >
            <GoogleLogo className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>

          <p className="text-sm text-gray-600 text-center mt-5 space-x-1">
            <span>Don{ "'" }t have an account?</span>
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponents;
