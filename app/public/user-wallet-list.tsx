"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useWallet } from "@/lib/hooks/useWallet";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/radix/skeleton";

export interface Wallet {
    id: string;
    title: string;
    type: string;
    currency: string;
    active: {
        usageStart: string;
        usageEnd: string;
        packageTitle: string;
    };
}

interface WalletSliderProps {
    onSelectWallet?: (wallet: Wallet) => void;
}

export default function UserWalletList({ onSelectWallet }: WalletSliderProps) {
    const { setCurrentWalletValue, currentWallet } = useWallet();
    const { profile = {} } = useAuth();
    const { purseList = [] } = profile;
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);

    // ---------- حالت لودینگ ----------
    if (!currentWallet) {
        return (
            <div className="px-4 min-w-[250px] max-w-[400px] mb-12 mt-10 mx-auto">
                <Skeleton className="w-full h-[130px] rounded-xl" />
            </div>
        );
    }

    // ---------- مقداردهی اولیه ----------
    useEffect(() => {
        if (currentWallet && purseList.length > 0) {
            const index = purseList.findIndex((w) => w.id === currentWallet.id);
            if (index >= 0) {
                setActiveIndex(index);
                if (swiperRef.current) {
                    swiperRef.current.slideTo(index, 0);
                }
            }
        }
    }, [currentWallet, purseList]);

    const handleSelect = (wallet: Wallet) => {
        setActiveIndex(purseList.findIndex((w) => w.id === wallet.id));
        setCurrentWalletValue(wallet);
        onSelectWallet?.(wallet);
    };

    return (
        <Swiper
            modules={[Navigation]}
            spaceBetween={6}
            slidesPerView="auto"
            centeredSlides
            onSlideChange={(swiper) => {
                const wallet = purseList[swiper.realIndex];
                if (wallet) handleSelect(wallet);
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="w-full max-w-5xl"
        >
            {purseList.map((wallet, i) => (
                <SwiperSlide key={wallet.id} className="!w-[280px]">
                    <div
                        className={`px-4 min-w-[260px] max-w-[400px] my-4  overflow-hidden mx-auto 
                                    rounded-2xl border-2 border-gray-400 cursor-pointer transition-transform duration-300
                                    ${activeIndex === i
                            ? "scale-105 shadow-lg bg-green-100"  
                            : "scale-95 opacity-70 bg-white"     
                        }`}
                        onClick={() => handleSelect(wallet)}
                        >
                        <div className="my-1 flex">
                            <div className="flex flex-1 flex-col justify-around gap-4">
                                <h2 className="text-sm font-bold mt-4">
                                    {wallet.title}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Eye className="w-4 h-4"/>
                                    <h2 className="text-base font-bold mb-1">{19.34} گرم طلا</h2>
                                </div>
                                <div className="text-base text-gray-600">
                                    شناسه: {wallet.id}
                                </div>
                            </div>
                            <div className="mt-3 gap-5">
                                <div
                                    className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center border">
                                      <span className="text-green-600 font-bold text-xs">
                                        {wallet.type}
                                      </span>
                                </div>
                                <div className="relative mt-4 h-[40px]">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo"
                                        fill
                                        style={{objectFit: "contain"}}
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
