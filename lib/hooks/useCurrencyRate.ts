"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { DtoOut_currencyRate } from "../types";
import { walletApi } from "@/lib/api/wallet";
import { generateMyMac, increaseStringSize } from "@/lib/utils/utils";
import jMoment from "moment-jalaali";

const fetchRate = async (currency: string): Promise<DtoOut_currencyRate | null> => {
    if (currency === "IRR") return null;

    const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
    const macStr = clientTime + increaseStringSize(currency, 8, " ", false);
    const mac = generateMyMac(macStr);
    const input = { clientTime, mac, currency };

    return walletApi.getRate(input);
};

export const useCurrencyRate = (currency?: string) => {
    const { currentWallet } = useSelector((state: RootState) => state.wallet);
    const finalCurrency = currency ?? currentWallet?.currency;

    const query = useQuery({
        queryKey: ["currencyRate", finalCurrency],
        queryFn: () => fetchRate(finalCurrency!),
        enabled: !!finalCurrency && finalCurrency !== "IRR",
        staleTime: 0,
        cacheTime: 0,
    });

    return {
        rate: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        error: query.error,
    };
};
