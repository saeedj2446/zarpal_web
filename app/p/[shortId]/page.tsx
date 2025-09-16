"use client";

import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// import { useWallet } from "@/lib/hooks/useWallet"; // وقتی سرویس آماده شد فعال کن

export default function PaymentPage() {
  const params = useParams();
  const shortId = params?.shortId as string;

  // --- دیتا ---
  const [data, setData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<any>(null);

  /* ---------------------- ری‌اکت کوئری (فعلا کامنت) ----------------------
  const {
    useLandingPageQuery,
    acceptLandingPage,
    denyLandingPage,
    isAcceptingLandingPage,
    isDenyingLandingPage
  } = useWallet();

  const { data, isLoading, error } = useLandingPageQuery({ shortId });
  ------------------------------------------------------------------------- */

  // دیتا تستی (وقتی سرویس آماده شد حذف میشه)
  useEffect(() => {
    setData({
      businessTitle: "Delvan",
      businessName: "کلینیک زیبایی دلوان",
      businessDesc: "زیبایی را با دلوان تجربه کنید",
      description: "بابت ویزیت دکتر محمود احمدی‌نژاد",
      amount: 2500000,
      payerName: "مرتضی رئیسی فرد",
      payerPhone: "۰۹۱۳۳۶۳۹۶۳۷",
      expireAt: "2025-09-20T23:59:59",
    });
  }, [shortId]);

  // تایمر (بر اساس expireAt)
  useEffect(() => {
    if (!data?.expireAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expire = new Date(data.expireAt).getTime();
      const diff = expire - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.expireAt]);

  const handleAccept = async () => {
    try {
      /* ------------------- وقتی بک‌اند آماده شد فعال کن -------------------
      const res = await acceptLandingPage({ shortId });
      if (res?.paymentLink) {
        window.location.href = res.paymentLink; // انتقال به درگاه
      }
      --------------------------------------------------------------------- */
      alert("پرداخت پذیرفته شد (فعلا تستی)");
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleDeny = async () => {
    try {
      /* ------------------- وقتی بک‌اند آماده شد فعال کن -------------------
      await denyLandingPage({ shortId });
      --------------------------------------------------------------------- */
      alert("پرداخت رد شد (فعلا تستی)");
    } catch (err) {
      console.error("Deny failed:", err);
    }
  };

  if (!data) {
    return (
        <div className="text-center p-10 text-gray-500">در حال بارگذاری...</div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 font-['iransans-number']">
        {/* Header */}
        <div className="bg-[#a85a7a] text-white p-4 text-center relative">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm transform -skew-x-12"></div>
            </div>
            <span className="text-lg font-medium">
            سامانه مدیریت سرمایه و پرداخت زیربال
          </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1000px] mx-auto p-4">
          {/* Business Info Card */}
          <Card className="mb-6 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
                <span className="text-green-600 font-bold text-sm">
                  {data.businessTitle}
                </span>
                </div>
                <div className="flex-1 text-right">
                  <h2 className="text-xl font-bold mb-2">{data.businessName}</h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {data.businessDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium">تلفن :</span>
                  <span>۰۲۱-۳۷۳۳۵۴۴</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium">تلگرام :</span>
                  <span>@Delvinbiuty</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium">اینستاگرام :</span>
                  <span>@DelVinSalon</span>
                </div>
                <div className="flex justify-between items-start py-1">
                  <span className="font-medium">آدرس :</span>
                  <span className="text-right max-w-[200px]">
                  تهران - انتهای خیابان ولیعصر - پلاک ۷۴ واحد ۱۸
                </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <div className="bg-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-center font-medium text-gray-700 mb-4">
              توضیحات : {data.description}
            </h3>

            {/* Image Placeholders */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
              <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
              <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
            </div>

            {/* Payment Button */}
            <Button
                onClick={handleAccept}
                /* disabled={isAcceptingLandingPage} */ // وقتی سرویس آماده شد
                className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-6 text-xl font-bold mb-4 rounded-lg  h-[100px]"
            >
              <div className="text-cente ">
                <div className="text-2xl mb-1">
                  پرداخت {data.amount.toLocaleString()} ریال
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal">از طریق</span>
                  <Image
                      src="/images/logo.png"
                      alt="Logo"
                      width={80}   // 👈 عرض دلخواه
                      height={0}    // 👈 ارتفاع رو خود Next.js متناسب محاسبه می‌کنه
                      style={{ height: "auto" }}
                  />

                </div>

              </div>
            </Button>

            {/* Timer */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-center text-gray-600 mb-3 font-medium">
                قابل پرداخت تا
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-100 rounded-lg p-2">
                  <div className="text-2xl font-bold text-gray-800">
                    {timeLeft?.days ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">روز</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <div className="text-2xl font-bold text-gray-800">
                    {timeLeft?.hours ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">ساعت</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <div className="text-2xl font-bold text-gray-800">
                    {timeLeft?.minutes ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">دقیقه</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <div className="text-2xl font-bold text-gray-800">
                    {timeLeft?.seconds ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">ثانیه</div>
                </div>
              </div>
            </div>

            {/* Payer Info */}
            <div className="bg-gray-300 rounded-lg p-4">
              <div className="text-center text-sm text-gray-700 mb-3 font-medium">
                پرداخت کننده محترم : {data.payerName} {data.payerPhone}
              </div>
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                از طریق لمس این لینک میتوانید کلیه فاکتورها و پرداخت های انجام شده
                در پلتفرم زیربال را مشاهده و مدیریت فرمایید.
              </p>
            </div>

            {/* Cancel Button */}
            <button
                onClick={handleDeny}
                /* disabled={isDenyingLandingPage} */ // وقتی سرویس آماده شد
                className="block mx-auto text-sm text-gray-500 hover:text-red-600 underline"
            >
              انصراف از پرداخت
            </button>
          </div>
        </div>
      </div>
  );
}
