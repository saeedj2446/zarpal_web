"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store/store";
import { setCurrentWallet } from "@/lib/store/slices/walletSlice";
import { walletApi } from "@/lib/api/wallet";
import {
  DtoIn_cashInByOther,
  DtoIn_landingPage,
  DtoOut_landingPage,
} from "@/lib/types";
import jMoment from "moment-jalaali";
import { generateMyMac, increaseStringSize } from "@/lib/utils/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/hooks/use-toast";

export const useWallet = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { currentWallet } = useSelector((state: RootState) => state.wallet);

  // ----- Redux: فقط برای currentWallet -----
  const setCurrentWalletValue = (wallet: any) => {
    dispatch(setCurrentWallet({ currentWallet: wallet }));
  };
  const cashInByOtherMutation = useMutation({
    mutationFn: (data: DtoIn_cashInByOther) => walletApi.cashInByOther(data),
    onSuccess: (data) => {
      console.log("CashInByOther success:", data);
    },
    onError: (error: any) => {
      if(error.code===12 && error.data==='expiredOn'){
        toast({ title: "خطای تاریخ انقضا", description:  "تاریخ انتقضا نمی تواند همین الان یا در گذشته باشد.", variant: "destructive" });
        return
      }
      toast(error.getToast?.() ?? "خطا در ایجاد درخواست");
    },
  });
  // ----- Landing Page fetch function -----
  const fetchLandingPage = (data: DtoIn_landingPage) => {
    const shortId = data.shortId;
    const reason = "S";
    const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
    const macStr =
        clientTime + reason + increaseStringSize(shortId, 12, " ", false);
    const mac = generateMyMac(macStr);
    const input = { clientTime, shortId, reason, mac };
    return walletApi.getLandingPage(input);
  };

  // ----- useQuery: fetch اتوماتیک و cache -----
  const useLandingPageQuery = (data: DtoIn_landingPage) =>
      useQuery<DtoOut_landingPage, any>({
        queryKey: ["landingPage", data.shortId],
        queryFn: () => fetchLandingPage(data),
        enabled: !!data.shortId,
        staleTime: 60 * 60 * 1000, // 1 ساعت
      });

  // ----- useMutation: force fetch دستی -----
  const landingPageMutation = useMutation({
    mutationFn: fetchLandingPage,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["landingPage", variables.shortId], data);
    },
    onError: (error: any) => {

      toast(error.getToast?.() ?? "خطا در بارگیری اطلاعات");
    },
  });

  // Accept
  const acceptLandingPageMutation = useMutation({
    mutationFn: (data: { shortId: string }) => {
      const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
      const macStr =
          clientTime + "A" + increaseStringSize(data.shortId, 12, " ", false);
      const mac = generateMyMac(macStr);
      const input: DtoIn_AcceptDenyLandingPage = {
        shortId: data.shortId,
        reason: "A",
        clientTime,
        mac,
      };
      return walletApi.acceptLandingPage(input);
    },
    onError: (error: any) => {
      toast(error.getToast?.() ?? "خطا در تایید درخواست");
    },
  });

  // Deny
  const denyLandingPageMutation = useMutation({
    mutationFn: (data: { shortId: string }) => {
      const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
      const macStr =
          clientTime + "D" + increaseStringSize(data.shortId, 12, " ", false);
      const mac = generateMyMac(macStr);
      const input: DtoIn_AcceptDenyLandingPage = {
        shortId: data.shortId,
        reason: "D",
        clientTime,
        mac,
      };
      return walletApi.denyLandingPage(input);
    },
    onError: (error: any) => {
      toast(error.getToast?.() ?? "خطا در رد درخواست");
    },
  });

  // Cash In By Other


  return {
    currentWallet,
    setCurrentWalletValue,

    // LandingPage
    useLandingPageQuery,
    landingPageMutation,

    // Accept / Deny
    acceptLandingPageMutation,
    denyLandingPageMutation,

    // Cash In By Other
    cashInByOtherMutation,

    acceptLandingPage: acceptLandingPageMutation.mutateAsync,
    isAcceptingLandingPage: acceptLandingPageMutation.isLoading,

    denyLandingPage: denyLandingPageMutation.mutateAsync,
    isDenyingLandingPage: denyLandingPageMutation.isLoading,

    // Cash In By Other
    cashInByOther: cashInByOtherMutation.mutateAsync,
    isCashInByOtherLoading: cashInByOtherMutation.isLoading,
    cashInByOtherError: cashInByOtherMutation.error,
    cashInByOtherData: cashInByOtherMutation.data,

    //landingPage
    forceFetchLandingPage: landingPageMutation.mutate,  // fetch دستی و بروزرسانی cache
    forceFetchLandingPageAsync: landingPageMutation.mutateAsync,
    isLoadingLandingPage: landingPageMutation.isLoading,
    isErrorLandingPage: landingPageMutation.isError,
    errorLandingPage: landingPageMutation.error,
    isSuccessLandingPage: landingPageMutation.isSuccess,
  };
};
