import { useEffect, useState } from "react";
import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(3, {
      message: "Full name must be at least 3 characters long.",
    }),
    email: z.string().email({
      message: "Enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter.",
      })
      .regex(/\d/, {
        message: "Password must include at least one number.",
      }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter.",
      })
      .regex(/\d/, {
        message: "Password must include at least one number.",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export const useResponsiveItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1230) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
      if (window.innerWidth <= 925) {
        setItemsPerPage(3);
      }
      if (window.innerWidth <= 650) {
        setItemsPerPage(2);
      }
      if (window.innerWidth <= 453) {
        setItemsPerPage(3);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return itemsPerPage;
};


