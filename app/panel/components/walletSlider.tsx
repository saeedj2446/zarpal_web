"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

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

export default function WalletSlider({ wallets, onSelectWallet }: WalletSliderProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const handleSelect = (wallet: Wallet) => {
        setSelectedId(wallet.id);
        onSelectWallet?.(wallet);
    };

    return (
        <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1} // ✅ فقط یک کارت در هر اسلاید
            spaceBetween={20}
            //navigation
            pagination={{ clickable: true }}
            className="w-full max-w-md"
            onSlideChange={(swiper) => {
                const activeIndex = swiper.activeIndex;
                const activeSlide = wallets[activeIndex];
                handleSelect?.(activeSlide);
            }}



        >
            {wallets.map((wallet) => (
                <SwiperSlide key={wallet.id}>
                    <div
                        className={`px-4  ${
                            selectedId === wallet.id ? "border-0 border-purple-500 scale-105" : ""
                        }`}

                    >
                        <div className="my-1 flex">
                            <div className="flex flex-1 items-center gap-4">
                                <div className="flex-1 text-right">
                                    <h2 className="text-base font-bold mb-1">{wallet.title.substring(0,20)}</h2>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Eye className="w-4 h-4"/>
                                        <h2 className="text-base font-bold mb-1">{19.34} گرم طلا</h2>
                                    </div>
                                    <div className="text-base text-gray-600 mt-5">شناسه: {wallet.id}</div>
                                </div>
                            </div>
                            <div className="mt-3 gap-5">
                                <div
                                    className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center border">
                                    <span className="text-green-600 font-bold text-xs">{wallet.type}</span>
                                </div>
                                <div className={"relative mt-4  h-[40px]"} >
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
