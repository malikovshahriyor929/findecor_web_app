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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForgotMutation } from "@/request/mutation";
import { Myaxios } from "@/request";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});
const Forgot_passwordComponents = () => {
  const router = useRouter();

  const { mutate, isPending } = useForgotMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess() {
        Myaxios.post("/auth/email/request-confirmation", values).then(() =>
          router.push(`/forgot-password/resetpassword?email=${values.email}`)
        );
      },
    });
  }
  return (
    <div className="flex items-center justify-center h-screen bg-[#fffef8] ">
      <div className="max-w-[400px] mx-auto w-[90%] bg-white shadow-lg  border border-[#e5e7eb] px-6 pt-4 rounded-lg">
        <div className="space-y-1">
          <h1 className="font-semibold tracking-tight text-center text-2xl">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>
        <div className=" mx-auto py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-3">
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
              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer bg-[#ea430a] hover:bg-[#ea430a]/85 "
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </Form>
          <div
            onClick={() => router.back()}
            className="font-medium text-xs cursor-pointer pt-4 text-center text-blue-600 hover:text-blue-500"
          >
            Back to login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot_passwordComponents;
