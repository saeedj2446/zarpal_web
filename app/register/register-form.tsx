"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/radix/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/radix/select";
import {
  registerStepOneSchema,
  registerStepTwoSchema,
  registerStepThreeSchema,
  type RegisterStepOneData,
  type RegisterStepTwoData,
  type RegisterStepThreeData,
} from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useTodos} from "@/lib/hooks/useTodos";
import {useAuth} from "@/lib/hooks/useAuth";
import Image from "next/image";
import DateSelector from "@/components/common/DateSelector";
import {generateMyMac, generateRefreshToken, increaseStringSize, normalizePhoneNumber} from "@/lib/utils/utils";
import jMoment from "moment-jalaali";
import {generateMac} from "@/lib/utils/jwt/HashPass";
import type {DtoIn_Password, RegisterUserReq} from "@/lib/types";
import {Timer} from "@/components/common";

type RegisterStep = 1 | 2 | 3;

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerUserReq, registerUserAut,registerUserPas,isPending,otpSeconds,resendRegisterToken, isResendingToken } = useAuth()
  const [registrationData, setRegistrationData] = useState<
      Partial<RegisterStepOneData & RegisterStepTwoData & RegisterStepThreeData>
  >({});

  const router = useRouter();

  const stepOneForm = useForm<RegisterStepOneData>({
    resolver: zodResolver(registerStepOneSchema),
    defaultValues: {
      natId: "",
      contact: "",
      birthDate: "",
      hostId: "",
    },
  });

  const stepTwoForm = useForm<RegisterStepTwoData>({
    resolver: zodResolver(registerStepTwoSchema),
    defaultValues: {
      otp: "",
    },
  });

  const stepThreeForm = useForm<RegisterStepThreeData>({
    resolver: zodResolver(registerStepThreeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onStepOneSubmit = async (data: RegisterUserReq) => {
    try {
      await registerUserReq(data);
      setRegistrationData((prev: any) => ({ ...prev, ...data }));
      setCurrentStep(2);
    } catch (error) {
      console.error("Step 1 error:", error);
    }
  };

  const onStepTwoSubmit = async (data: RegisterStepTwoData) => {
    try {
      await registerUserAut({otp: data.otp});
      setCurrentStep(3);
    } catch (error) {
      console.error("Step 2 error:", error);
    }
  };

  const onStepThreeSubmit = async (data: DtoIn_Password) => {
    try {
      data.username=registrationData.contact;
      await registerUserPas(data);
      router.replace("/login");
    } catch (error) {
      console.error("Step 3 error:", error);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegisterStep);
    }
  };

  const renderStepIndicator = () => (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        step <= currentStep
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step}
                </div>
                {step < 3 && (
                    <div
                        className={`w-12 h-2 mx-3 rounded-full ${
                            step < currentStep
                                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                : "bg-gray-200"
                        }`}
                    />
                )}
              </div>
          ))}
        </div>
      </div>
  );

  return (
      <div className="min-h-screen flex items-center justify-center py-10">
        <Card className="border-0 shadow-lg rounded-xl w-full max-w-md">
          <CardHeader className="relative w-full h-40 mb-6">
            <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
            />
          </CardHeader>

          <CardHeader className="text-center pb-0 pt-0">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStep === 1 && "ثبت نام"}
              {currentStep === 2 && "تایید شماره موبایل"}
              {currentStep === 3 && "تنظیم رمز عبور"}
            </CardTitle>
          </CardHeader>

          <CardContent className="bg-white py-10 px-6 rounded-xl ">
            {renderStepIndicator()}

            {/* === Step 1 === */}
            {currentStep === 1 && (
                <Form {...stepOneForm}>
                  <form
                      onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)}
                      className="space-y-4"
                  >
                    <FormField
                        control={stepOneForm.control}
                        name="contact"
                        render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                    {...field}
                                    type="tel"
                                    maxLength={11}
                                    placeholder="شماره همراه"
                                    className="w-full h-12 rounded-md text-right bg-white border border-gray-300"
                                    dir="rtl"
                                />
                              </FormControl>
                              <FormMessage className="text-right text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={stepOneForm.control}
                        name="natId"
                        render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                    {...field}
                                    placeholder="کد ملی"
                                    className="w-full h-12 rounded-md text-right bg-white border border-gray-300"
                                    dir="rtl"
                                    type="text"
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, "");
                                      field.onChange(value);
                                    }}
                                />
                              </FormControl>
                              <FormMessage className="text-right text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={stepOneForm.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <DateSelector
                                    {...field}
                                    placeholder="تاریخ تولد"
                                    className="w-full h-12 rounded-md text-right bg-white border border-gray-300"
                                    onChange={field.onChange}
                                    value={field.value}
                                    format="YYYY/MM/DD"
                                />
                              </FormControl>
                              <FormMessage className="text-right text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={stepOneForm.control}
                        name="hostId"
                        render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger
                                      dir="rtl"
                                      className="w-full h-12 rounded-md bg-white border border-gray-300 text-right py-6"
                                  >
                                    <SelectValue value={"null"} placeholder="پلتفرم مرجع" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">تست پال</SelectItem>
                                    <SelectItem value="1">زریال</SelectItem>
                                    <SelectItem disabled value="2">طلاسی</SelectItem>
                                    <SelectItem disabled value="3">گلدیکا</SelectItem>
                                    <SelectItem disabled value="4">طلاین</SelectItem>
                                    <SelectItem disabled value="5">ملی گلد</SelectItem>
                                    <SelectItem disabled value="6">وال گلد</SelectItem>
                                    <SelectItem disabled value="7">توکنیکو</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-right text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={stepOneForm.control}
                        name="refCode"
                        render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                    {...field}
                                    placeholder="کد معرف (اختیاری)"
                                    className="w-full h-12 rounded-md text-right bg-white border border-gray-300"
                                    dir="rtl"
                                />
                              </FormControl>
                              <FormMessage className="text-right text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#A45C70] text-white font-bold h-12 rounded-md"
                    >
                      {isPending ? "در حال ارسال..." : "ثبت"}
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                  </form>
                </Form>
            )}

            {/* === Step 2 === */}
            {currentStep === 2 && (
                <Form {...stepTwoForm}>
                  <form
                      onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)}
                      className="space-y-8"
                  >
                    <div className="text-center">
                      <p className="text-gray-600 mb-6 text-base">
                        کد تایید به {registrationData.contact} ارسال شد
                      </p>
                    </div>
                    <FormField
                        control={stepTwoForm.control}
                        name="otp"
                        render={({field}) => (
                            <FormItem>
                              <FormControl>
                                <div dir={'ltr'} className="flex justify-center">
                                  <InputOTP
                                      maxLength={4}
                                      value={field.value}
                                      onChange={field.onChange}
                                      className="gap-4"
                                  >
                                    <InputOTPGroup className="gap-3">
                                      <InputOTPSlot index={0} className="w-16 h-16 text-2xl border-1 bg-white border-gray-300 rounded-xl"/>
                                      <InputOTPSlot index={1} className="w-16 h-16 text-2xl border-1 bg-white border-gray-300 rounded-xl"/>
                                      <InputOTPSlot index={2} className="w-16 h-16 text-2xl border-1 bg-white border-gray-300 rounded-xl"/>
                                      <InputOTPSlot index={3} className="w-16 h-16 text-2xl border-1 bg-white border-gray-300 rounded-xl"/>
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                              </FormControl>
                              <FormMessage className="text-center"/>
                            </FormItem>
                        )}
                    />
                    <div className="text-center">
                      {otpSeconds === 0 ? (
                          <button
                              type="button"
                              disabled={otpSeconds > 0 || isResendingToken}
                              onClick={() => resendRegisterToken()}
                              className={`text-lg ${
                                  otpSeconds > 0 || isResendingToken
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-purple-600 hover:text-purple-800"
                              }`}
                          >
                            {isResendingToken ? "در حال ارسال..." : "ارسال مجدد کد"}
                          </button>
                      ) : (<Timer currentTime={otpSeconds} size={55}/>)}
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-full max-w-[400px] flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={otpSeconds < 1 || stepTwoForm.watch("otp")?.length < 4 || isPending}
                            className="w-full bg-[rgb(169,86,116)] hover:bg-[rgb(149,76,106)] text-white font-bold h-16 text-lg rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          {isPending ? "در حال تایید..." : "تایید"}
                        </Button>
                        <Button
                            type="button"
                            variant="link"
                            onClick={goBack}
                            className="w-full text-[rgb(169,86,116)] hover:underline text-center text-base font-medium"
                        >
                          ویرایش شماره
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
            )}

            {/* === Step 3 === */}
            {currentStep === 3 && (
                <Form {...stepThreeForm}>
                  <form
                      onSubmit={stepThreeForm.handleSubmit(onStepThreeSubmit)}
                      className="space-y-8"
                  >
                    <FormField
                        control={stepThreeForm.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                              <FormLabel className="text-right block text-gray-700 text-lg font-medium mb-3">
                                رمز عبور
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                                  <Input
                                      {...field}
                                      type={showPassword ? "text" : "password"}
                                      placeholder="رمز عبور خود را وارد کنید"
                                      className="pr-14 pl-14 text-right bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-14 text-lg rounded-xl"
                                      dir="rtl"
                                  />
                                  <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPassword ? <EyeOff className="h-6 w-6"/> : <Eye className="h-6 w-6"/>}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-right" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={stepThreeForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-right block text-gray-700 text-lg font-medium mb-3">
                                تکرار رمز عبور
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                                  <Input
                                      {...field}
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder="رمز عبور خود را مجدد وارد کنید"
                                      className="pr-14 pl-14 text-right bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-14 text-lg rounded-xl"
                                      dir="rtl"
                                  />
                                  <button
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-6 w-6"/> : <Eye className="h-6 w-6"/>}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-right" />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4">
                      <Button
                          type="submit"
                          disabled={isPending}
                          className="flex-1 bg-[rgb(169,86,116)] hover:from-purple-700 hover:to-pink-700 text-white font-bold h-14 text-lg rounded-xl shadow-lg hover:shadow-xl"
                      >
                        {isPending ? "در حال تکمیل..." : "تکمیل ثبت نام"}
                      </Button>
                    </div>
                  </form>
                </Form>
            )}

            {currentStep === 1 && (
                <div className="text-center mt-8">
                  <span className="text-gray-600 text-lg">حساب کاربری دارید؟ </span>
                  <Link
                      href="/login"
                      className="text-purple-600 hover:text-purple-800 font-bold text-lg"
                  >
                    ورود
                  </Link>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
