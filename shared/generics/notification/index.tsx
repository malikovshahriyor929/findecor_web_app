import { toast } from "sonner";

type notificationType = "login" | "register";

export const notification = () => {
  const notify = (text: notificationType) => {
    switch (text) {
      case "login":
        return toast.success("User logined successfully");
      case "register":
        return toast.success("User registered successfully");
    }
  };
  return notify;
};
