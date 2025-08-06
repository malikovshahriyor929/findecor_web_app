"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

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
  const { appId } = useParams();
  const [init, setInit] = useState<string>("");
  toast.success(appId as string)
  console.log("params:", useParams())
  useEffect(() => {
    // Faqat client tarafda va Telegram WebApp mavjud bo‘lsa ishga tushadi
    if (typeof window === "undefined" || !window.Telegram?.WebApp) {
      console.error("Telegram WebApp mavjud emas.");
      return;
    }

    const tg = window.Telegram.WebApp;
    tg.ready();

    const actualInitDataFromTelegram = tg.initData;

    if (!actualInitDataFromTelegram) {
      toast.error("Telegram initData bo‘sh, qayta yuklanmoqda...");
      // return window.location.reload();
    }

    setInit(actualInitDataFromTelegram);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: actualInitDataFromTelegram, appId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Backend javobi: " + JSON.stringify(data));
        if (data.token) alert("token: " + data.token);

        if (data.success) {
          console.log("Hash muvaffaqiyatli tasdiqlandi!");
        } else {
          console.error("Hash tasdiqlanmadi!");
        }
      })
      .catch((error) => {
        console.error("Xatolik:", error);
        if (error.status == 401) {
          alert("User ma'lumoti yoki initData xato");
        } else if (error.status == 404) {
          alert("App ID xato");
        } else {
          alert(error);
        }
      });
  }, [appId]);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-3">
      <pre>{ JSON.stringify(init, null, 2) }</pre>
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
