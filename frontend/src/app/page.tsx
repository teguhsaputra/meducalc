"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/services/api/auth";
import LoadingSpinner from "@/components/loading-spinner";

const formSchema = z.object({
  username: z.string().nonempty({
    message: "Masukkan username",
  }),
  password: z.string().nonempty({
    message: "Masukkan password",
  }),
});

export default function Home() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setLoginForm, mutate, isPending } = useLogin();
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmitLogin = React.useCallback(
    (username: string, password: string) => {
      mutate({ username, password });
    },
    [mutate]
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginForm({
      username: values.username,
      password: values.password,
    });

    handleSubmitLogin(values.username, values.password);
  }

  return (
    <>
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2  bg-white p-5">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex rounded-[30px] overflow-hidden">
          <div className="absolute inset-0 bg-[#2262C6] opacity-90 rounded-lg" />
          <div className="absolute inset-0 z-0 bg-noise opacity-[0.1] rounded-lg" />
          <div className="relative text-center flex flex-col items-center justify-center gap-4 h-screen">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-blue-200 mb-3">
              <ArrowRight className="text-[#2262C6] h-6 w-6" />
            </div>
            <span className=" text-3xl font-semibold tracking-tighter">Meducalc</span>
            <span className="text-sm max-w-md mx-auto">
              Masuk untuk mengakses dashboard manajemen pendidikan dan kelola
              proses belajar dengan mudah.
            </span>
          </div>
        </div>

        <div className="flex h-full items-center justify-center relative z-10 ">
          <Card className="w-[400px] mx-auto border-none shadow-none">
            <CardHeader className="flex items-center justify-center mt-[20px]">
              <CardTitle className="flex flex-col text-center gap-3">
                <span className="text-4xl font-semibold tracking-tighter md:hidden block md:mb-0 mb-5" >Meducalc</span>
                <span className="text-2xl">Selamat Datang Kembali</span>
                <span className="text-sm font-normal">
                  Masukkan username dan password anda untuk mengakses akun Anda.
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            {...field}
                            className="border-white/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Your password"
                              className="border-white/20"
                              icon={
                                showPassword ? (
                                  <Eye className="w-5 h-5" />
                                ) : (
                                  <EyeOff className="w-5 h-5" />
                                )
                              }
                              onIconClick={() =>
                                setShowPassword((prev) => !prev)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full "
                    variant={"blue"}
                    size="lg"
                    type="submit"
                    disabled={isPending}
                  >
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoadingSpinner isLoading={isPending} />
    </>
  );
}
