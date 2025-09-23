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
import {Skeleton} from "@/components/radix/skeleton";

export default function GoldRateBoard() {
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

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
                    return 0; // یا می‌توانید تایمر را مجدداً بر اساس expireOn جدید ریست کنید
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentRate, refetch]);


    const currency = currentWallet.currency;

    if (!currentRate) return <div></div>;

    return (
        <div className="mb-4 bg-black text-white p-1 flex items-center justify-between ">
            {/* تایمر سمت چپ */}
            <div className="rounded-full w-12 h-12 flex items-center justify-center">
                {totalTime > 0 && (
                    <Timer
                        totalTime={totalTime}
                        currentTime={currentTime}
                        color="#F59E0B"
                        textColor="white"
                        size={50}
                    />
                )}
            </div>
            {isError?(<>
                <div>خطا در دریافت نرخ {currency}</div>
            </>) : (<>
                {isLoading ? (
                    <div>در حال دریافت نرخ...</div>
                ):(
                    <div className="flex-1 flex justify-center items-center gap-2">
                        <p className="text-white">نرخ هر گرم</p>
                        <p className="text-xl">{currentRate.weSell}</p>
                    </div>
                )}
            </>)}





            <div className="w-12 h-12"></div>
        </div>
    );
}
