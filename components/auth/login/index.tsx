// "use client";
// import { useState } from "react";
// import { useParams } from "next/navigation";
// declare global {
//   interface Window {
//     Telegram: {
//       WebApp: {
//         initData: string;
//         initDataUnsafe: {
//           query_id?: string;
//           user?: {
//             id: number;
//             first_name: string;
//             last_name?: string;
//             username?: string;
//             language_code?: string;
//             is_premium?: boolean;
//             photo_url?: string;
//           };
//           auth_date?: string;
//           hash?: string;
//         };
//         ready: () => void;
//         close: () => void;
//         sendData: (data: string) => void;
//         expand: () => void;
//         isExpanded: boolean;
//         themeParams: {
//           bg_color?: string;
//           text_color?: string;
//           hint_color?: string;
//           link_color?: string;
//           button_color?: string;
//           button_text_color?: string;
//         };
//       };
//     };
//   }
// }
// const LoginComponents = () => {
//   const { appId } = useParams()
//   const [init, setinit] = useState("");
//   console.log(appId);
//   if (typeof window !== "undefined" && window.Telegram?.WebApp) {
//     if (window.Telegram && window.Telegram.WebApp) {
//       window.Telegram.WebApp.ready();
//       const actualInitDataFromTelegram = window.Telegram.WebApp.initData;
//       if (!actualInitDataFromTelegram) {
//         window.location.reload()
//         return
//       }
//       fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ initData: actualInitDataFromTelegram, appId })
//       })
//         .then(response => response.json())
//         .then((data) => {
//           alert('Backend javobi: ' + JSON.stringify(data));
//           alert("token: " + data.token)
//           if (data.success) {
//             console.log("Hash muvaffaqiyatli tasdiqlandi!");
//           } else {
//             console.error("Hash tasdiqlanmadi!");
//           }
//         })
//         .catch((error) => {
//           if (error.status == 401) {
//             alert("user malumoti hato yoki initial data hato")
//           } else if (error.status == 404) {
//             alert("app Id hato")
//           } else {
//             alert(error)
//           }

//         });
//     }
//     const tg = window.Telegram.WebApp;
//     tg.ready();

//     setinit(tg.initData)

//   } else {
//     console.error("Telegram WebApp mavjud emas.");
//   }
//   return (
//     <div className="flex items-center justify-center h-screen flex-col gap-3   ">
//       {/* <div className="absolute top-0 left-0 size-full  flex items-center justify-center  ">
//         <Loader2 className="animate-spin" size={ 30 } />
//       </div> */}
//       <pre>{ JSON.stringify(init, null, 2) }</pre>
//       <button className="bg-red-500 " onClick={ () => {
//         window.location.reload()
//       } }>reload</button>
//     </div>
//   );
// };

// export default LoginComponents;


"use client";

import { useState, useEffect } from "react";
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
  const { appId } = useParams();
  const [init, setInit] = useState<string>("");

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
      console.error("Telegram initData bo‘sh, qayta yuklanmoqda...");
      window.location.reload();
      return;
    }

    setInit(actualInitDataFromTelegram);

    // Backendga yuborish
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
