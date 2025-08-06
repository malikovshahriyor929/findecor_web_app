"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
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
  const { appId } = useParams()
  const [init, setinit] = useState("");
  console.log(appId);
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const actualInitDataFromTelegram = window.Telegram.WebApp.initData;
      if (!actualInitDataFromTelegram) {
        window.location.reload()
        return
      }
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: "user=%7B%22id%22%3A1910930481%2C%22first_name%22%3A%22Shahriyor%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Malikov_Shahriyor%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fu1yyIL-OgzVaLepKDPzqLB1QEUI8weRpEP3pkHze5f0.svg%22%7D&chat_instance=5994368464737266795&chat_type=private&auth_date=1754465671&signature=rtDnqd1p-o9Kfzct1cFVk3FAoItdxRNOj6igXcjgEEIL10O0PQS8QY1gl2-H02IEWjL3jNp_E3iqGEBCq8N3Aw&hash=1efe547f8e96c83aa688e9f1cd68a0d0de8947c15c70bed12a9e25e08f3adb61", appId })
      })
        .then(response => response.json())
        .then((data) => {
          alert('Backend javobi: ' + JSON.stringify(data));
          alert("token: " + data.token)
          if (data.success) {
            console.log("Hash muvaffaqiyatli tasdiqlandi!");
          } else {
            console.error("Hash tasdiqlanmadi!");
          }
        })
        .catch((error) => {
          if (error.status == 401) {
            alert("user malumoti hato yoki initial data hato")
          } else if (error.status == 404) {
            alert("app Id hato")
          } else {
            alert(error)
          }

        });
    }
    const tg = window.Telegram.WebApp;
    tg.ready();

    setinit(tg.initData)

  } else {
    console.error("Telegram WebApp mavjud emas.");
  }
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-3   ">
      {/* <div className="absolute top-0 left-0 size-full  flex items-center justify-center  ">
        <Loader2 className="animate-spin" size={ 30 } />
      </div> */}
      <pre>{ JSON.stringify(init, null, 2) }</pre>
      <button className="bg-red-500 " onClick={ () => {
        window.location.reload()
      } }>reload</button>
    </div>
  );
};

export default LoginComponents;
