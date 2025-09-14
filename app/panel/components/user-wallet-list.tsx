"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useWallet } from "@/lib/hooks/useWallet";
import GoldRateBoard from "@/app/panel/components/gold-rate-board";

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
    wallets: Wallet[];
    onSelectWallet?: (wallet: Wallet) => void;
}

export default function UserWalletList({ wallets, onSelectWallet }: WalletSliderProps) {
    const { setCurrentWalletValue, currentWallet } = useWallet();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const swiperRef = useRef<any>(null);

    // ---------- مقداردهی اولیه روی persisted wallet ----------
    useEffect(() => {
        if (currentWallet) {
            setSelectedId(currentWallet.id);
            // پیدا کردن ایندکس کیف در لیست
            const index = wallets.findIndex(w => w.id === currentWallet.id);
            if (index >= 0 && swiperRef.current) {
                swiperRef.current.slideTo(index, 0); // بلافاصله اسلاید می‌کنه
            }
        }
    }, [currentWallet, wallets]);

    const handleSelect = (wallet: Wallet) => {
        setSelectedId(wallet.id);
        setCurrentWalletValue(wallet);
        onSelectWallet?.(wallet);
    };

    return (
        <div className="max-w-sm mb-4 overflow-hidden mx-auto bg-white rounded-xl shadow-md cursor-pointer transition-transform">
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={20}
                pagination={{ clickable: true }}
                className="w-full max-w-md"
                onSlideChange={(swiper) => {
                    const activeIndex = swiper.activeIndex;
                    const activeSlide = wallets[activeIndex];
                    handleSelect(activeSlide);
                }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {wallets.map((wallet) => (
                    <SwiperSlide key={wallet.id}>
                        <>
                            <GoldRateBoard />
                            <div className="p-1">
                                <div
                                    className={`px-4 ${
                                        selectedId === wallet.id ? "border-0 border-purple-500 scale-105" : ""
                                    }`}
                                >
                                    <div className="my-1 flex">
                                        <div className="flex flex-1 flex-col justify-around gap-4">
                                            <h2 className="text-base font-bold mt-4">
                                                {wallet.title.substring(0, 20)}
                                            </h2>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Eye className="w-4 h-4" />
                                                <h2 className="text-base font-bold mb-1">{19.34} گرم طلا</h2>
                                            </div>
                                            <div className="text-base text-gray-600">شناسه: {wallet.id}</div>
                                        </div>
                                        <div className="mt-3 gap-5">
                                            <div className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center border">
                                                <span className="text-green-600 font-bold text-xs">{wallet.type}</span>
                                            </div>
                                            <div className="relative mt-4 h-[40px]">
                                                <Image
                                                    src="/images/logo.png"
                                                    alt="Logo"
                                                    fill
                                                    style={{ objectFit: "contain" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
