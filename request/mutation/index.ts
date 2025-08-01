import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Myaxios } from "..";
import Cookies from "js-cookie";
import { loginType, ProductObjType, registerType } from "@/types";
import { notification } from "@/shared/generics/notification";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
const notify = notification();

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: loginType) =>
      Myaxios({
        url: "/auth/login",
        data: data,
        method: "POST",
      }),
    onSuccess(data) {
      Cookies.set("access_token", data.data.access_token, { expires: 1 });
      toast.success("Login successfully");
    },
    onError() {
      toast.error("Something went wrong");
    },
  });
};
export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationKey: ["google-login"],
    mutationFn: (code: string) =>
      Myaxios({
        url: `/auth/google/callback?code=${code}`,
        method: "GET",
      }),
    onSuccess(data) {
      const token = data.data.access_token;
      const user = data.data.user;

      Cookies.set("access_token", token, { expires: 1 });
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome, ${user.name}!`);
    },
    onError() {
      toast.error("Google login failed");
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: registerType) =>
      Myaxios({
        url: "/auth/register",
        data: data,
        method: "POST",
      }),
    onSuccess(data) {
      Cookies.set("access_token", data.data.access_token, { expires: 1 });
      toast.success("Register successfully");
    },
    onError(error) {
      if (isAxiosError(error)&& error.status == 409) {
        toast.error("Email already registered");
        
      }else{

        toast.error("Something went wrong");
      }
    },
  });
};

export const useRegisterOTPMutation = () => {
  return useMutation({
    mutationKey: ["registerOTP"],
    mutationFn: ({
      data,
      path,
    }: {
      path: string;
      data: { code: string; email?: string };
    }) => Myaxios.post(`/auth/${path}`, data),
    onSuccess() {
      toast.success("OTP sent successfully");
    },
    onError() {
      toast.error("Error sending OTP");
    },
  });
};

export const useForgotMutation = () => {
  return useMutation({
    mutationKey: ["request-reset"],
    mutationFn: (data: { email: string }) =>
      Myaxios.post("/auth/password/request-reset", data),
    onSuccess() {
      toast.success("Reset password link sent successfully");
    },
    onError() {
      toast.error("Error sending reset password link");
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: {
      email: string;
      code: string;
      newPassword: string;
      newPasswordCon?: string;
    }) => Myaxios.post("/auth/password/reset", data),
  });
};

export const useUnlikedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["saved"],
    mutationFn: (data: string) => Myaxios.delete(`/product-likes/${data}`),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
};

export const useLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["save"],
    mutationFn: (data: ProductObjType) => Myaxios.post("/product-likes", data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
};
