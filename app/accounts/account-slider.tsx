"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Eye } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import { diffDate } from "@/lib/utils/utils";
import jMoment from "moment-jalaali";
import { Timer } from "@/components/common";
import AccountCard from "./AccountCard";

export default function AccountSlider({ onChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { profile = {} } = useAuth();
  const { purseList = [] } = profile;

  // جلوگیری از خطای Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSlideChange = (swiper) => {
    const account = purseList[swiper.realIndex];
    setActiveIndex(swiper.realIndex);
    onChange(account);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'O': return 'bg-green-100';
      case 'pending': return 'bg-yellow-100';
      case 'approved': return 'bg-blue-100';
      default: return 'bg-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'O': return 'فعال';
      case 'pending': return 'در دست بررسی';
      case 'approved': return 'تایید شده';
      default: return '';
    }
  };

  // اگر کامپوننت هنوز mount نشده، چیزی نمایش نده
  if (!isMounted) {
    return (
        <div className="w-full max-w-5xl h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a85a7a]"></div>
        </div>
    );
  }

  return (
      <Swiper
          modules={[Navigation]}
          spaceBetween={6}
          slidesPerView="auto"
          centeredSlides
          onSlideChange={handleSlideChange}
          className="w-full max-w-5xl"
      >
        {purseList.map((account, i) => (
            <SwiperSlide key={account.id} className="max-w-[300px]">
              <div
                  className={`px-4 min-w-[260px] max-w-[400px] my-4 overflow-hidden mx-auto 
                        rounded-2xl border-2 border-gray-400 cursor-pointer transition-transform duration-300
                        ${activeIndex === i
                      ? "scale-105 shadow-lg " + getStatusColor(account.status)
                      : "scale-95 opacity-70 bg-white"
                  }`}
              >
                <div className="my-1 flex">
                  <div className="flex flex-1 flex-col justify-around gap-4">
                    <div className="mt-4 ">

                      <h2 className="text-base font-bold">
                        {account.title.substring(0, 20)}
                      </h2>
                      <span className="text-base text-gray-600">
                     شناسه: {account.id}
                    </span>
                      <span className={`text-xs px-2  py-1 rounded-full m-1 inline-block
                          ${account.status === 'active' ? 'bg-green-200 text-green-800' :
                          account.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-blue-200 text-blue-800'}`}>
                          {getStatusText(account.status)}
                    </span>
                    </div>
                    {account.balance && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye className="w-4 h-4"/>
                          <h2 className="text-base font-bold mb-1">{account.balance} گرم طلا</h2>
                        </div>
                    )}

                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={125}
                        height={75}
                        style={{objectFit: "contain"}}
                    />

                  </div>

                  <div className="mt-3 gap-5">
                    <div className="w-[90px] h-[90px] bg-white rounded-full flex items-center justify-center border">
                    <span className="text-green-600 font-bold text-xs">
                      {account.type}
                    </span>
                    </div>
                    <div className={'mt-2'}>
                      <Timer
                          totalTime={diffDate(account.active.usageStart, account.active.usageEnd)}
                          currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), account.active.usageEnd)}
                          size={40}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </SwiperSlide>
        ))}
      </Swiper>
  );
}