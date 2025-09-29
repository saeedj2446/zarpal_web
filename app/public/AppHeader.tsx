// components/common/AppHeader.jsx
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store/store";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { Currency, CurrencyTitle } from "@/lib/types";
import { Timer } from "@/components/common";
import { generateMyMac, increaseStringSize } from "@/lib/utils/utils";
import jMoment from "moment-jalaali";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Button } from "@/components/radix/button";
import { Skeleton } from "@/components/radix/skeleton";
import { RefreshCw, TrendingUp, TrendingDown, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWallet } from "@/lib/hooks/useWallet";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";

interface AppHeaderProps {
    showMenuButton?: boolean;
    onMenuToggle?: () => void;
    isMenuOpen?: boolean;
}

export default function AppHeader({ showMenuButton = false, onMenuToggle, isMenuOpen = false }: AppHeaderProps) {
    const { profile = {} } = useAuth();
    const { currentWallet } = useWallet();
    const [isScrolled, setIsScrolled] = useState(false);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const { firstName, lastName } = profile;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchRate = async (currency: string) => {
        if (currency === "IRR") return null;
        const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
        const macStr = clientTime + increaseStringSize(currency, 8, " ", false);
        const mac = generateMyMac(macStr);
        const input = { clientTime, mac, currency };
        return await walletApi.getRate(input);
    };

    const {
        data: currentRate,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["currencyRate", currentWallet?.currency],
        queryFn: () => fetchRate(currentWallet!.currency),
        enabled: !!currentWallet?.currency && currentWallet.currency !== "IRR",
        staleTime: 0,
        cacheTime: 0,
    });

    // تایمر و کال دوباره وقتی زمان صفر شد
    useEffect(() => {
        if (!currentRate?.expireOn) return;

        const diffSeconds = Math.floor(
            (new Date(currentRate.expireOn).getTime() - Date.now()) / 1000
        );
        const remaining = diffSeconds > 0 ? diffSeconds : 0;

        setTotalTime(remaining);
        setCurrentTime(remaining);

        const interval = setInterval(() => {
            setCurrentTime(prev => {
                if (prev <= 1) {
                    // وقتی تایمر صفر شد، دوباره fetch را اجرا کن
                    refetch();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentRate, refetch]);

    const currency = currentWallet?.currency;

    // محاسبه درصد تغییر قیمت
    const priceChange = currentRate?.change || 0;
    const isPriceUp = priceChange > 0;

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#a85a7a] text-white ",
            isScrolled ? "py-1 shadow-lg" : "py-1"
        )}>
            <div className=" mx-auto px-4 flex items-center justify-between ">
                {/* Left Side - Logo and Timer */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                width={30}
                                height={30}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-base font-bold text-white hidden md:block">مدیریت سرمایه زرپال</span>
                    </Link>

                    {/* Timer */}
                    {currency && currency !== "IRR" && totalTime > 0 && (
                        <div className="flex items-center gap-2">
                            <Timer
                                totalTime={totalTime}
                                currentTime={currentTime}
                                color="white"
                                textColor="white"
                                size={45}
                            />
                            <div className="md:flex flex-1 flex-col items-center justify-center">
                                {isError ? (
                                    <div className="text-center">
                                        <p className="text-sm">خطا در دریافت نرخ</p>
                                        <button
                                            onClick={() => refetch()}
                                            className="mt-1 text-xs flex items-center justify-center text-white opacity-80 hover:opacity-100"
                                        >
                                            <RefreshCw className="w-3 h-3 mr-1"/>
                                            تلاش مجدد
                                        </button>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Skeleton className="h-6 w-24 bg-white/20 rounded"/>
                                    </div>
                                ) : (
                                    <div className="flex text-center justify-center">
                                        {/* <p className="text-sm opacity-80"> گرم {CurrencyTitle[currency as Currency] || currency}</p>*/}
                                        <div className="flex items-center justify-center ">
                                              <span className="text-lg font-bold">
                                                {currentRate?.weSell ? parseInt(currentRate.weSell).toLocaleString('fa-IR') : '---'}
                                              </span>
                                            <span className="text-xs mr-1">ریال</span>
                                            {priceChange !== 0 && (
                                                <span
                                                    className={`flex items-center ml-2 text-xs ${isPriceUp ? 'text-green-300' : 'text-red-300'}`}>
                      {isPriceUp ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                                                    {Math.abs(priceChange).toLocaleString('fa-IR')}
                    </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Center - Gold Rate */}


                {/* Right Side - User Profile */}
                <div className="flex items-center gap-4">


                    {/* User Profile */}
                    <Link href="/profile" className="flex  items-center gap-2 cursor-pointer">
                        <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src="/placeholder-user.jpg"/>
                            <AvatarFallback className="text-sm bg-white text-[#a85a7a]">
                                {(firstName || "") + (lastName || "")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-right">
                            <div className="text-sm  text-white">
                                {(firstName || "") + (lastName || "")}
                            </div>
                        </div>
                    </Link>

                    {/* Mobile Menu Button */}
                   {/* {showMenuButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-white"
                            onClick={onMenuToggle}
                        >
                            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                        </Button>
                    )}*/}
                </div>
            </div>
        </header>
    );
}