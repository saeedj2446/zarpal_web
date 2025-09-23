"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Button } from "@/components/radix/button";
import { Card, CardContent } from "@/components/radix/card";
import { Check, Star, CreditCard } from "lucide-react";

interface PackageSliderProps {
  onPackageSelect?: (packageId: string) => void;
  onClose?: () => void;
}

export default function PackageSlider({ onPackageSelect, onClose }: PackageSliderProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const packages = [
    {
      id: "basic",
      name: "بسته پایه",
      price: "۵۰,۰۰۰",
      duration: "۱ ماه",
      features: [
        "تا ۱۰۰ تراکنش",
        "پشتیبانی ایمیل",
        "گزارش پایه",
        "۱ حساب کاربری"
      ],
      color: "bg-blue-500",
      popular: false
    },
    {
      id: "premium",
      name: "بسته طلایی",
      price: "۱۵۰,۰۰۰",
      duration: "۳ ماه",
      features: [
        "تراکنش نامحدود",
        "پشتیبانی ۲۴/۷",
        "گزارش پیشرفته",
        "۵ حساب کاربری",
        "API دسترسی"
      ],
      color: "bg-yellow-500",
      popular: true
    },
    {
      id: "enterprise",
      name: "بسته سازمانی",
      price: "۳۰۰,۰۰۰",
      duration: "۶ ماه",
      features: [
        "تراکنش نامحدود",
        "مدیر اختصاصی",
        "گزارش تحلیلی",
        "حساب نامحدود",
        "API کامل",
        "سفارشی سازی"
      ],
      color: "bg-purple-500",
      popular: false
    }
  ];

  const handlePurchase = async (packageId: string) => {
    setIsProcessing(true);
    setSelectedPackage(packageId);

    try {
      // شبیه‌سازی ارسال درخواست به سرور
      await new Promise(resolve => setTimeout(resolve, 1000));

      // فراخوانی تابع والد برای اطلاع از انتخاب بسته
      if (onPackageSelect) {
        onPackageSelect(packageId);
      }

      // در اینجا می‌توانید کاربر را به درگاه بانکی هدایت کنید
      console.log(`هدایت به درگاه بانکی برای بسته ${packageId}`);

    } catch (error) {
      console.error("خطا در پردازش خرید:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">انتخاب بسته</h3>
          {onClose && (
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
          )}
        </div>

        <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView="auto"
            centeredSlides
            className="w-full max-w-5xl pb-4"
        >
          {packages.map((pkg) => (
              <SwiperSlide key={pkg.id} className="!w-[280px]">
                <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
                    selectedPackage === pkg.id ? 'border-[#a85a7a] shadow-lg' : 'border-gray-200'
                }`}>
                  {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-[#a85a7a] text-white px-3 py-1 text-xs rounded-bl-lg">
                        <Star className="w-3 h-3 inline mr-1" />
                        محبوب
                      </div>
                  )}

                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className={`${pkg.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-2xl font-bold">
                      {pkg.name.charAt(0)}
                    </span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{pkg.name}</h4>
                      <div className="text-2xl font-bold text-[#a85a7a] mb-1">
                        {pkg.price} تومان
                      </div>
                      <div className="text-sm text-gray-600">{pkg.duration}</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                      ))}
                    </div>

                    <Button
                        onClick={() => handlePurchase(pkg.id)}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center ${
                            selectedPackage === pkg.id
                                ? 'bg-[#a85a7a] hover:bg-[#96527a] text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                      {isProcessing && selectedPackage === pkg.id ? (
                          <>
                            <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin ml-2"></div>
                            در حال پردازش...
                          </>
                      ) : selectedPackage === pkg.id ? (
                          <>
                            <Check className="w-4 h-4 ml-2" />
                            انتخاب شده
                          </>
                      ) : (
                          <>
                            <CreditCard className="w-4 h-4 ml-2" />
                            خرید بسته
                          </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>پس از انتخاب بسته، به درگاه بانکی هدایت خواهید شد</p>
        </div>
      </div>
  );
}