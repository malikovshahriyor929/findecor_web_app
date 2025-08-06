"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
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

const LoginComponents = () => {
  const router = useRouter()
  const searchParams = useSearchParams(); // URL query params (e.g., "?id=123")
  const appId = searchParams.get("appId")
  useEffect(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) {
      console.error("Telegram WebApp mavjud emas.");
      return;
    }
    const tg = window.Telegram.WebApp;
    tg.ready();
    const actualInitDataFromTelegram = tg.initData;
    if (!actualInitDataFromTelegram) {
      toast.error("Telegram initData bo‘sh, qayta yuklanmoqda...");
    }
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: actualInitDataFromTelegram, appId }),
    })
      .then((res) => res.json())
      .then((data) => {
        Cookies.set("access_token", data.token)
        router.push(`?appId=${appId}`)
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

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={ () => window.location.reload() }
      >
        reload
      </button>
    </div>
  );
};

export default LoginComponents;
