// components/WalletSelector.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useWallet } from "@/lib/hooks/useWallet";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/radix/skeleton";
import WalletItem, { Wallet as WalletType } from "./WalletItem";

interface WalletSliderProps {
    onSelectWallet?: (wallet: WalletType) => void;
}

export default function WalletSelector({ onSelectWallet }: WalletSliderProps) {
    const { setCurrentWalletValue, currentWallet } = useWallet();
    const { profile = {} } = useAuth();
    const { purseList = [] } = profile;
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // کنترل حالت لودینگ
    useEffect(() => {
        if (purseList.length > 0 || currentWallet) {
            setIsLoading(false);
        }
    }, [purseList, currentWallet]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // مقداردهی اولیه
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

    const handleSelect = (wallet: WalletType) => {
        setActiveIndex(purseList.findIndex((w) => w.id === wallet.id));
        setCurrentWalletValue(wallet);
        onSelectWallet?.(wallet);
    };

    // نمایش اسکلتون در حالت لودینگ
    if (isLoading) {
        return (
            <div className="flex overflow-x-scroll gap-1">
                <Skeleton className="min-w-[200px] w-full h-[190px] rounded-xl bg-gray-300"/>
                <Skeleton className="min-w-[200px] w-full h-[190px] rounded-xl bg-gray-300"/>
                <Skeleton className="min-w-[200px] w-full h-[190px] rounded-xl bg-gray-300"/>
            </div>
        );
    }

    return (
        <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView="auto"
            centeredSlides
            onSlideChange={(swiper) => {
                const wallet = purseList[swiper.realIndex];
                if (wallet) handleSelect(wallet);
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="w-full max-w-[1200px] py-2"
        >
            {purseList.map((wallet, i) => (
                <SwiperSlide key={wallet.id} className="max-w-[260px] md:max-w-[300px] my-4">
                    <WalletItem
                        wallet={wallet}
                        isActive={activeIndex === i}
                        onClick={() => handleSelect(wallet)}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}