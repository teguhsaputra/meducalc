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
import { Eye, EyeOff } from "lucide-react";
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
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
        {/* LEFT SIDE */}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 opacity-90" />
          <div className="absolute inset-0 z-0 bg-noise opacity-[0.1]" />
          <div className="relative z-20 flex items-center text-2xl font-semibold">
            Meducalc
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex h-full items-center justify-center relative z-10 bg-white">
          <Card className="w-[400px] mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl border-none">
            <CardHeader className="flex items-center justify-center mt-[20px]">
              <CardTitle className="text-xl">Meducalc</CardTitle>
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
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            {...field}
                            className=" text-white placeholder:text-white/70 border-white/20"
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
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Your password"
                              className=" text-white placeholder:text-white/70 border-white/20"
                              icon={
                                showPassword ? (
                                  <Eye className="w-5 h-5 text-white" />
                                ) : (
                                  <EyeOff className="w-5 h-5 text-white" />
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
                    className="w-full bg-white/20 hover:bg-white/30 transition-colors text-white"
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
