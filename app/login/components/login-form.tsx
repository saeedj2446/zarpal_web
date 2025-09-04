"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { Button } from "@/components/radix/button";
import { Input } from "@/components/radix/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/radix/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/radix/form";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Login data:", data);
      // Redirect to home page after successful login
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Card className="bg-white border-0 rounded-none shadow-none max-w-md mx-auto mt-1 p-1">
        <CardHeader className="relative w-full h-60 mb-1">
          <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
          />
        </CardHeader>


          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 bg-gray-100 py-10 px-6 rounded-[12px]">
              {/* شماره همراه */}
              <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6"/>
                            <Input
                                {...field}
                                type="tel"
                                placeholder="شماره همراه"
                                className="pr-14 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-lg text-right bg-gray-50"
                                dir="rtl"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                  )}
              />

              {/* رمز عبور */}
              <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6"/>
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="کلمه عبور"
                                className="pr-14 pl-14 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-lg text-right bg-gray-50"
                                dir="rtl"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-6 w-6"/> : <Eye className="h-6 w-6"/>}
                            </button>
                          </div>
                        </FormControl>
                      </FormItem>
                  )}
              />


              <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#A45C70] text-white font-bold py-7 text-lg rounded-xl"
              >
                {isLoading ? "در حال ورود..." : "ورود"}
              </Button>
              <div className="flex justify-between text-lg pt-6">
                <Link href="/forgot-password" className="text-gray-600 hover:text-gray-800">
                  بازیابی کلمه عبور
                </Link>
                <Link href="/register" className="text-gray-600 hover:text-gray-800">
                  ثبت نام
                </Link>
              </div>
            </form>
          </Form>


      </Card>
    </div>
  );
}
