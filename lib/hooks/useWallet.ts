"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store/store";
import { setCurrentWallet } from "@/lib/store/slices/walletSlice";
import { walletApi } from "@/lib/api/wallet";
import {
  DtoIn_cashInByOther,
  DtoIn_landingPage, DtoIn_PurseInfo, DtoIn_ShortId,
  DtoOut_landingPage, DtoOut_PurseInfo, DtoOut_Response,
} from "@/lib/types";
import jMoment from "moment-jalaali";
import { generateMyMac, increaseStringSize } from "@/lib/utils/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/hooks/use-toast";
import {useAuth} from "@/lib/hooks/useAuth";
import {navigate, replace} from "@/lib/utils/router";

export const useWallet = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { currentWallet,} = useSelector((state: RootState) => state.wallet);

  // ----- Redux: فقط برای currentWallet -----
  const setCurrentWalletValue = (wallet: any) => {
    dispatch(setCurrentWallet({ currentWallet: wallet }));
  };

  const { profile, setProfile } = useAuth();

  // lib/hooks/useWallet.ts

// افزودن mutation برای ایجاد کیف جدید با مدیریت بهتر موفقیت و خطا
  const addPurseMutation = useMutation<
      DtoOut_PurseInfo,
      Error,
      DtoIn_PurseInfo
  >({
    mutationFn: walletApi.addPurse,
    onSuccess: (response: DtoOut_PurseInfo, variables) => {
      const { purseList = [], ...rest } = profile ?? {};

      // دریافت کیف جدید از پاسخ
      const newPurse = response.purse;

      // افزودن کیف جدید به لیست کیف‌ها
      const updatedPurseList = [...purseList, newPurse];

      // به‌روزرسانی پروفایل کاربر
      setProfile({
        ...rest,
        purseList: updatedPurseList,
      });

      // تنظیم کیف جدید به عنوان کیف فعلی
      setCurrentWalletValue(newPurse);

      // نمایش پیام موفقیت
      toast({
        title: "موفقیت",
        description: "حساب جدید با موفقیت ایجاد شد.",
      });
    },
    onError: (error: any) => {
      if(error.code===33 && error.data==="purse"){

        return toast({title:"خطا در ایجاد حساب جدید",description:"در حال حاضر شما دارای این نوع کیف می باشید. کیف از نوع دیگری ثبت کنید",variant: "destructive"});
      }
      toast(error.getToast?.() ?? "خطا در ایجاد حساب");
    },
  });

  const editPurseMutation = useMutation<
      DtoOut_Response,
      Error,
      DtoIn_PurseInfo
  >({
    mutationFn: walletApi.editPurse,
    onSuccess: (response, variables) => {
      const { purseList = [], ...rest } = profile ?? {};

      // purse جدید رو جایگزین می‌کنیم
      const updatedPurseList = purseList.map((purse) =>{
            return   purse.id === variables.purse.id ? { ...purse, ...variables.purse } : purse
          }

      );

      // کیف ویرایش شده رو پیدا می‌کنیم
      const updatedPurse = updatedPurseList.find(
          (p) => p.id === variables.purse.id
      );

      // پروفایل آپدیت بشه
      setProfile({
        ...rest,
        purseList: updatedPurseList,
      });

      // کارنت والت ست بشه
      if (updatedPurse) {
        setCurrentWalletValue(updatedPurse);
      }
      toast({description:"تغییرات با موفقیت ذخیره شد.",});
    },
  });


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
      const input: DtoIn_landingPage = {
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

  const closeList = useMutation({
    mutationFn: (listId) => walletApi.closeList({id:listId}),
  });




    // تابع شبیه‌سازی برای به‌روزرسانی وضعیت CIo
    const updateCioStatus = async ({ shortId, status }) => {
      console.log(`[TEST] Updating CIO ${shortId} to status ${status}`);
      return Promise.resolve({ success: true });
    };

    // استفاده از mutation موجود برای خرید بسته
  const addPermissionMutation = useMutation({
    mutationFn: walletApi.addPermission,
    onSuccess: (data, variables) => {
      debugger
      const newPackage = data.permission;
      const { purseList = [], ...rest } = profile ?? {};

      // پیدا کردن کیف مورد نظر
      const purseIndex = purseList.findIndex(p => p.id === variables.purseId);
      if (purseIndex === -1) {
        toast({
          title: "خطا",
          description: "کیف مورد نظر یافت نشد.",
          variant: "destructive"
        });
        return;
      }

      const currentPurse = purseList[purseIndex];
      const updatedPurseList = [...purseList];
debugger
      // اگر بسته رایگان است
      if (!newPackage.shortId) {
        // بررسی وضعیت بسته فعال فعلی
        const currentActivePackage = currentPurse.active;
        let isActiveExpired = false;

        if (currentActivePackage) {
          const endDate = new Date(currentActivePackage.usageEnd);
          // اضافه کردن یک روز به تاریخ پایان برای در نظر گرفتن کل روز آخر
          endDate.setDate(endDate.getDate() + 1);
          isActiveExpired = endDate < new Date();
        }
debugger
        // اگر بسته فعال نداریم یا بسته فعلی منقضی شده
        if (!currentActivePackage || isActiveExpired) {
          // بسته جدید را به عنوان بسته فعال تنظیم می‌کنیم
          updatedPurseList[purseIndex] = {
            ...currentPurse,
            active: newPackage,
          };
        } else {
          debugger
          // بسته جدید را به عنوان بسته رزرو تنظیم می‌کنیم
          updatedPurseList[purseIndex] = {
            ...currentPurse,
            reserved: newPackage,
          };
        }
debugger
        // به‌روزرسانی پروفایل
        setProfile({
          ...rest,
          purseList: updatedPurseList,
        });

        // اگر کیف فعلی همان کیفی است که بسته برای آن خریداری شده، آن را به‌روزرسانی کن
        if (currentWallet?.id === variables.purseId) {
          setCurrentWalletValue(updatedPurseList[purseIndex]);
        }

        // نمایش پیام موفقیت برای بسته رایگان
        toast({
          title: "موفقیت",
          description: "بسته رایگان با موفقیت فعال شد.",
        });
      } else {
        // برای بسته‌های پولی، فقط پیام موفقیت نمایش می‌دهیم
        // به‌روزرسانی کیف بعد از پرداخت موفق انجام خواهد شد
        toast({
          title: "موفقیت",
          description: "درخواست پرداخت با موفقیت ایجاد شد. لطفاً پرداخت را انجام دهید.",
        });
        replace(`/${newPackage.shortId}`);
      }
    },
    onError: (error: any) => {
      toast(error.getToast?.() ?? "خطا در خرید بسته");
    },
  });




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


    // افزودن متدهای جدید برای ایجاد کیف
    addPurseMutation,
    addPurse: addPurseMutation.mutateAsync,
    isAddingPurse: addPurseMutation.isPending,

    editPurseMutation, // خود میوتیشن برای دسترسی کامل
    editPurse: editPurseMutation.mutateAsync, // شورتکات برای async استفاده
    isEditingPurse: editPurseMutation.isPending,
    editPurseError: editPurseMutation.error,
    editPurseData: editPurseMutation.data,

    acceptLandingPage: acceptLandingPageMutation.mutateAsync,
    isAcceptingLandingPage: acceptLandingPageMutation.isPending,

    denyLandingPage: denyLandingPageMutation.mutateAsync,
    isDenyingLandingPage: denyLandingPageMutation.isPending,

    // Cash In By Other
    cashInByOther: cashInByOtherMutation.mutateAsync,
    isCashInByOtherLoading: cashInByOtherMutation.isPending,
    cashInByOtherError: cashInByOtherMutation.error,
    cashInByOtherData: cashInByOtherMutation.data,



    //landingPage
    forceFetchLandingPage: landingPageMutation.mutate,  // fetch دستی و بروزرسانی cache
    forceFetchLandingPageAsync: landingPageMutation.mutateAsync,
    isLoadingLandingPage: landingPageMutation.isPending,
    isErrorLandingPage: landingPageMutation.isError,
    errorLandingPage: landingPageMutation.error,
    isSuccessLandingPage: landingPageMutation.isSuccess,

    addPermission: addPermissionMutation.mutate,
    addPermissionAsync: addPermissionMutation.mutateAsync,
    isAddingPermission: addPermissionMutation.isPending,
    updateCioStatus,

    //list
    closeList,
  };
};
