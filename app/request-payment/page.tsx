"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Input } from "@/components/radix/input";
import { Textarea } from "@/components/radix/textarea";
import { Button } from "@/components/radix/button";
import { Phone, Camera, Image } from "lucide-react";
import { useWallet } from "@/lib/hooks/useWallet";
import { DtoIn_cashInByOther } from "@/lib/types";
import UserWalletList from "@/app/panel/components/user-wallet-list";

export default function RequestPaymentPage() {
  const { cashInByOther, isCashInByOtherLoading, cashInByOtherData } = useWallet();

  // حالت فرم
  const [form, setForm] = useState<DtoIn_cashInByOther>({
    payerPhone: "۰۹۱۳ ۳۶۳ ۹۶۳۷",
    payerTitle: "مرتضی رئیسی فرد",
    amount: 2500000,
    weight: 1374,
    description: "",
    expiry: "۱۴۰۴/۰۶/۱۰ 23:09:09",
    images: [],
  });

  const handleChange = (key: keyof DtoIn_cashInByOther, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const result = await cashInByOther(form);
      alert(`لینک پرداخت: ${result.link}`);
    } catch (err: any) {
      alert(`خطا در درخواست: ${err.message}`);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 font-['iransans-number']">
        {/* Header */}
        <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>ا</AvatarFallback>
            </Avatar>
            <span className="text-lg">ابراهیم اصغری پور نیا</span>
          </div>
          <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-sm font-bold">۱۸</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[800px] mx-auto p-4">
          <UserWalletList/>

          {/* Request Form */}
          <div className="bg-gray-200 rounded-2xl p-4">
            <h2 className="text-center text-lg font-bold mb-6 text-gray-800">
              درخواست واریز با لینک پرداخت
            </h2>

            <div className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  شماره همراه پرداخت کننده
                </label>
                <div className="relative">
                  <Input
                      type="tel"
                      defaultValue={form.payerPhone}
                      onChange={(e) => handleChange("payerPhone", e.target.value)}
                      className="text-right pr-12 bg-white border-0 rounded-lg h-12"
                      dir="rtl"
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Payer Title */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  عنوان پرداخت کننده
                </label>
                <Input
                    type="text"
                    defaultValue={form.payerTitle}
                    onChange={(e) => handleChange("payerTitle", e.target.value)}
                    className="text-right bg-white border-0 rounded-lg h-12"
                    dir="rtl"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  مبلغ به ریال
                </label>
                <Input
                    type="text"
                    defaultValue={form.amount.toLocaleString()}
                    onChange={(e) =>
                        handleChange("amount", Number(e.target.value.replace(/,/g, "")))
                    }
                    className="text-right bg-white border-0 rounded-lg h-12"
                    dir="rtl"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  مقدار به گرم
                </label>
                <Input
                    type="text"
                    defaultValue={form.weight.toLocaleString()}
                    onChange={(e) =>
                        handleChange("weight", Number(e.target.value.replace(/,/g, "")))
                    }
                    className="text-right bg-white border-0 rounded-lg h-12"
                    dir="rtl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <Textarea
                    defaultValue={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="text-right min-h-[80px] bg-white border-0 rounded-lg"
                    dir="rtl"
                    placeholder="توضیحات اضافی..."
                />
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  انقضا
                </label>
                <Input
                    type="text"
                    defaultValue={form.expiry}
                    onChange={(e) => handleChange("expiry", e.target.value)}
                    className="text-right bg-white border-0 rounded-lg h-12"
                    dir="rtl"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  تصاویر
                </label>
                <div className="flex gap-3">
                  <button className="w-20 h-20 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-300">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </button>
                  <button className="w-20 h-20 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-300">
                    <Image className="w-8 h-8 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                  className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-4 text-lg font-medium mt-6 rounded-lg"
                  onClick={handleSubmit}
                  disabled={isCashInByOtherLoading}
              >
                {isCashInByOtherLoading ? "در حال ارسال..." : "ارسال"}
              </Button>

              {/* نمایش لینک پرداخت بعد از موفقیت */}
              {cashInByOtherData?.link && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
                    لینک پرداخت شما:{" "}
                    <a href={cashInByOtherData.link} target="_blank" className="underline">
                      {cashInByOtherData.link}
                    </a>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
