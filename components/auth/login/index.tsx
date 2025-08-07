"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { Loader2 } from "lucide-react";
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

const LoginComponents = () => {
  const router = useRouter()
  const searchParams = useSearchParams(); // URL query params (e.g., "?id=123")
  const appId = searchParams.get("appId");
  useEffect(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) {
      console.error("Telegram WebApp mavjud emas.");
      return;
    }
    const tg = window.Telegram.WebApp;
    tg.ready();
    const actualInitDataFromTelegram =
      tg.initData;
    // "user=%7B%22id%22%3A1910930481%2C%22first_name%22%3A%22Shahriyor%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Malikov_Shahriyor%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fu1yyIL-OgzVaLepKDPzqLB1QEUI8weRpEP3pkHze5f0.svg%22%7D&chat_instance=5994368464737266795&chat_type=private&auth_date=1754465671&signature=rtDnqd1p-o9Kfzct1cFVk3FAoItdxRNOj6igXcjgEEIL10O0PQS8QY1gl2-H02IEWjL3jNp_E3iqGEBCq8N3Aw&hash=1efe547f8e96c83aa688e9f1cd68a0d0de8947c15c70bed12a9e25e08f3adb61"
    if (!actualInitDataFromTelegram) {
      toast.error("Telegram initData bo‘sh, qayta yuklanmoqda...");
    }
    axios(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { initData: actualInitDataFromTelegram, appId },
    })
      .then((data) => {
        // Cookies.set("access_token", data.data.token)
        // router.push(`/?appId=${appId}`)
      })
      .catch((error) => {
        console.error("Xatolik:", error);
        if (error.status == 401) {
          console.log("User ma'lumoti yoki initData xato");
        } else if (error.status == 404) {
          console.log("App ID xato");
        } else {
          console.log(error);
        }
      });
  }, [router, appId]);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-3">
      {/* changed */}
      <pre>{ JSON.stringify(appId, null, 4) }</pre> 
      {/*  */}
      <div className="absolute top-0 left-0 size-full flex items-center justify-center  ">
        <Loader2 className=" animate-spin " size={ 30 } />
      </div>
    </div>
  );
};

export default LoginComponents;
