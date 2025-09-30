// components/accounts/AccountSlider.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWallet } from "@/lib/hooks/useWallet";
import WalletCard from "@/app/accounts/WalletCard";


interface AccountSliderProps {
  onChange: (account: any) => void;
}

export default function AccountSlider({ onChange }: AccountSliderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { profile = {} } = useAuth();
  const { purseList = [] } = profile;
  const { currentWallet, setCurrentWalletValue } = useWallet();

  // جلوگیری از خطای Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // تعیین ایندکس فعلی بر اساس currentWallet
  const activeIndex = currentWallet && purseList.length > 0
      ? purseList.findIndex(account => account.id === currentWallet.id)
      : 0;

  const handleSlideChange = (swiper) => {
    const account = purseList[swiper.realIndex];
    setCurrentWalletValue(account); // تنظیم کیف فعلی
    onChange && onChange(account);
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
          initialSlide={activeIndex >= 0 ? activeIndex : 0}
          className="w-full max-w-5xl"
      >
        {purseList.map((account) => (
            <SwiperSlide key={account.id} className="max-w-[300px] ">
              <WalletCard
                  wallet={account}
                  isActive={currentWallet && account.id === currentWallet.id}
                  onClick={() => {
                    setCurrentWalletValue(account);
                    onChange && onChange(account);
                  }}
              />
            </SwiperSlide>
        ))}
      </Swiper>
  );
}