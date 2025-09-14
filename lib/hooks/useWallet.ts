"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store/store";
import { setCurrentWallet } from "@/lib/store/slices/walletSlice";
import { walletApi } from "@/lib/api/wallet";
import { DtoIn_landingPage, DtoOut_landingPage } from "@/lib/types";
import jMoment from "moment-jalaali";
import { generateMyMac, increaseStringSize } from "@/lib/utils/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useWallet = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { currentWallet } = useSelector((state: RootState) => state.wallet);

  // ----- Redux: فقط برای currentWallet -----
  const setCurrentWalletValue = (wallet: any) => {
    dispatch(setCurrentWallet({ currentWallet: wallet }));
  };

  // ----- Landing Page fetch function -----
  const fetchLandingPage = (data: DtoIn_landingPage) => {
    const shortId = data.shortId;
    const reason = "S";
    const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
    const macStr = clientTime + reason + increaseStringSize(shortId, 12, " ", false);
    const mac = generateMyMac(macStr);
    const input = { clientTime, shortId, reason, mac };
    return walletApi.getLandingPage(input);
  };

  // ----- useQuery: fetch اتوماتیک و cache -----
  const useLandingPageQuery = (data: DtoIn_landingPage) => {
    return useQuery<DtoOut_landingPage, any>({
      queryKey: ["landingPage", data.shortId],
      queryFn: () => fetchLandingPage(data),
      enabled: !!data.shortId,
      staleTime: 60 * 60 * 1000, // 1 ساعت
    });
  };

  // ----- useMutation: force fetch دستی -----
  const landingPageMutation = useMutation({
    mutationFn: fetchLandingPage,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["landingPage", variables.shortId], data); // بروزرسانی cache query
    },
  });

  // Accept
  const acceptLandingPageMutation = useMutation({
    mutationFn: (data: { shortId: string }) => {
      const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
      const macStr = clientTime + "A" + increaseStringSize(data.shortId, 12, " ", false);
      const mac = generateMyMac(macStr);
      const input: DtoIn_AcceptDenyLandingPage = {
        shortId: data.shortId,
        reason: "A",
        clientTime,
        mac,
      };
      return walletApi.acceptLandingPage(input);
    },
  });

  // Deny
  const denyLandingPageMutation = useMutation({
    mutationFn: (data: { shortId: string }) => {
      const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss");
      const macStr = clientTime + "D" + increaseStringSize(data.shortId, 12, " ", false);
      const mac = generateMyMac(macStr);
      const input: DtoIn_AcceptDenyLandingPage = {
        shortId: data.shortId,
        reason: "D",
        clientTime,
        mac,
      };
      return walletApi.denyLandingPage(input);
    },
  });

  return {
    // Landing Page
    useLandingPageQuery,


    // Accept / Deny
    acceptLandingPage: acceptLandingPageMutation.mutateAsync,
    isAcceptingLandingPage: acceptLandingPageMutation.isLoading,

    denyLandingPage: denyLandingPageMutation.mutateAsync,
    isDenyingLandingPage: denyLandingPageMutation.isLoading,

    forceFetchLandingPage: landingPageMutation.mutate,  // fetch دستی و بروزرسانی cache
    forceFetchLandingPageAsync: landingPageMutation.mutateAsync,
    isLoadingLandingPage: landingPageMutation.isLoading,
    isErrorLandingPage: landingPageMutation.isError,
    errorLandingPage: landingPageMutation.error,
    isSuccessLandingPage: landingPageMutation.isSuccess,
  };
};


