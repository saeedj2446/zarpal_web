"use client"

import { useMutation } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import {RootState, store} from "@/lib/store/store"
import {
  setAccessToken,
  setSessionId,
  setOtpSeconds,
  startOtpTimer,
  logout,
  setProfile,
} from "@/lib/store/slices/authSlice"
import { toast } from "./use-toast"
import { authApi } from "@/lib/api/auth"
import jMoment from "moment-jalaali"
import {
  generateMyMac,
  generateRefreshToken, hexToBytes,
  increaseStringSize,
  normalizePhoneNumber,
} from "@/lib/utils/utils"
import { setAuthSessionId, setAuthToken } from "@/lib/api/apiRequest"
import type {RegisterUserReq, DtoIn_Otp, DtoIn_Password, ChangePasswordReq} from "../types"
import {generateTerminalPassword} from "@/lib/utils/sequrity/HashPass";
import {router} from "next/client";
import {clearCurrentWallet, setCurrentWallet} from "@/lib/store/slices/walletSlice";

export const useAuth = () => {
  const dispatch = useDispatch()


  // ⬅️ گرفتن کل استیت از Redux
  const { accessToken, sessionId, otpSeconds, profile } = useSelector(
      (state: RootState) => state.auth
  )



  // ⬅️ setter ها (wrap روی dispatch)
  const setAccessTokenValue = (token: string) =>
      dispatch(setAccessToken({ accessToken: token }))

  const setSessionIdValue = (id: string | null) =>
      dispatch(setSessionId({ sessionId: id }))

  const setOtpSecondsValue = (seconds: number) =>
      dispatch(setOtpSeconds({ otpSeconds: seconds }))

  const startOtp = (seconds: number) => dispatch(startOtpTimer(seconds))

  const setProfileValue = (u: typeof profile) => {
   return  dispatch(setProfile(u))
  }


  const logoutState = useMutation({
    mutationFn: async () => authApi.logout(),
  });

  const handleLogout = () => {
    dispatch(logout());      // اول سمت کلاینت خارجش می‌کنی
    logoutState.mutate();    // بعدش درخواست سمت سرور رو می‌زنی
  };



  // ✅ گرفتن توکن
  const getToken = useMutation({
    mutationFn: async (data: RegisterUserReq) => {
      const refreshToken = await generateRefreshToken()
      return authApi.getToken(refreshToken)
    },
    onSuccess: (data) => {
      setAuthToken(data)
      setAccessTokenValue(data) // ⬅️ ست در استیت
    },
    onError: (error: any) => {
      toast(error.getToast())
    },
  })

  // ✅ Step 1: Register user request
  const registerUserReqMutation = useMutation({
    mutationFn: (data: RegisterUserReq) => {
      const clientTime = jMoment().format("YYYY-MM-DD HH:mm:ss")
      const natId = data.natId
      const hostId = data.hostId
      const str =
          clientTime +
          increaseStringSize(natId, 10, " ", false) +
          increaseStringSize(hostId, 3, " ", false)
      const mac = generateMyMac(str)
      const input = {
        natId: Number(natId),
        contact: normalizePhoneNumber(data.contact),
        birthDate: data.birthDate,
        hostId: Number(hostId),
        recommender: data.recommender,
        clientTime,
        mac,
      }
      return authApi.registerUserReq(input)
    },
    onSuccess: (data) => {
      setAuthSessionId(data.sessionId)
      startOtp(120)
      toast({
        title: "موفق",
        description:
            "لطفا کد پیامک شده را وارد کنید.",
      })
    },
    onError: (error: any) => {
      toast(error.getToast());
    },
  })

  // ✅ Resend Register Token
  const resendRegisterTokenMutation = useMutation({
    mutationFn: () => authApi.resendRegisterToken(),
    onSuccess: (data) => {
      setAuthSessionId(data.sessionId)
      setAuthToken(data.sessionId);
      startOtp(120) // شروع تایمر OTP
      toast({
        title: "موفق",
        description: "کد جدید به شماره شماره شما ارسال شد. لطفا کد را وارد کنید.",
      })
    },
    onError: (error: any) => {
      toast(error.getToast())
    },
  })


  // ✅ Step 2: Verify OTP
  const registerUserAutMutation = useMutation({
    mutationFn: (data: DtoIn_Otp) => authApi.registerUserAut(data),
    onSuccess: () => {
      toast({
        title: "موفق",
        description: "با موفقیت تایید شدید. اکنون یک رمز عبور برای خود انتخاب کنید.",
      })
    },
    onError: (error: any) => {
      toast(error.getToast())

    },
  })

  // ✅ Step 3: Set password
  const registerUserPasMutation = useMutation({
    mutationFn: (data: DtoIn_Password) => {
      const terminalKey=hexToBytes(process.env.NEXT_PUBLIC_TERMINAL_KEY);
      const encPassword = generateTerminalPassword(normalizePhoneNumber(data.username), data.password, new Date(),terminalKey);
      const input = {
        encPassword,
        clientTime: jMoment().format("YYYY-MM-DD HH:mm:ss"),
      }
      return authApi.registerUserPas(input)
    },
    onSuccess: () => {
      toast({
        title: "",
        description: "شما با موفقیت ثبت نام شدید. لطفا لاگین کنید.",
      })
    },
    onError: (error: any) => {
      toast(error.getToast())
    },
  })

  // ✅ Login
  const loginMutation = useMutation({
    mutationFn: (data: { username: string; password: string }) => {
      // ---------- قبل از لاگین، پاک کردن persisted wallet و state ----------
      dispatch(clearCurrentWallet()); // پاک کردن currentWallet از Redux
      localStorage.removeItem("currentWallet"); // پاک کردن persisted wallet از localStorage

      // ---------- آماده سازی ورودی لاگین ----------
      const terminalKey = hexToBytes(process.env.NEXT_PUBLIC_TERMINAL_KEY);
      const clientTime = jMoment().format('YYYY-MM-DD HH:mm:ss');
      const encPassword = generateTerminalPassword(data.username, data.password, new Date(), terminalKey);
      const macStr = clientTime + increaseStringSize(data.username, 128, ' ', false);
      const mac = generateMyMac(macStr);

      const input = {
        userName: data.username,
        encPassword,
        clientTime,
        mac
      }

      return authApi.login(input)
    },
    onSuccess: (data) => {
      if (data.sessionId) {
        setSessionIdValue(data.sessionId);
        setAuthSessionId(data.sessionId);
      }

      if (data.passChange) {
        /*toast({
          title: "تغییر رمز لازم است",
          description:
              "لطفاً رمز عبور خود را تغییر دهید تا دسترسی کامل فعال شود.",
        });*/
      }

      if (data.userProfile) {
        setProfileValue(data.userProfile);
      }

      // ---------- مدیریت کیف پول ----------
      let walletToSet = data.userProfile.purseList[0]; // پیش‌فرض اولین کیف
      const persistedWallet = store.getState().wallet.currentWallet; // persisted redux state


      if (persistedWallet) {
        const parsedWallet = JSON.parse(persistedWallet);
        // اگر کیف persisted هنوز در لیست کیف‌ها هست، اون رو ست کن
        const found = data.userProfile.purseList.find(w => w.id === parsedWallet.id);
        if (found) {
          walletToSet = found;
        }
      }

      dispatch(setCurrentWallet({ currentWallet: walletToSet }));
      // ذخیره کیف انتخاب شده در localStorage برای persist
      localStorage.setItem("currentWallet", JSON.stringify(walletToSet));

      toast({
        title: "ورود موفق",
        description: "به زرپال خوش آمدید.",
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast(error.getToast());
    },
  });


// ✅ Forget Password
  const forgetPasswordMutation = useMutation({
    mutationFn: (data: { phone: string; nationalId: string; birthDate: string }) =>
        authApi.forgetPassword(data),
    onSuccess: () => {
      toast({
        title: "موفق",
        description: "درخواست بازیابی رمز عبور با موفقیت ثبت شد. لطفاً پیامک را بررسی کنید.",
      });
    },
    onError: (error: any) => {
      toast(error.getToast());
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordReq) => authApi.changePassword(data),
    onSuccess: () => {
      toast({
        title: "موفق",
        description: "رمز عبور شما با موفقیت تغییر یافت.",
      });
    },
    onError: (error: any) => {
      toast(error.getToast());
    },
  });

  return {
    // state
    accessToken,
    sessionId,
    otpSeconds,
    profile,

    // setters
    setAccessToken: setAccessTokenValue,
    setSessionId: setSessionIdValue,
    setOtpSeconds: setOtpSecondsValue,
    startOtp,
    setProfile: setProfileValue,
    logout: handleLogout,
    // mutations

    // loading states
    isPending:
        registerUserReqMutation.isPending ||
        registerUserAutMutation.isPending ||
        registerUserPasMutation.isPending ||
        getToken.isPending,

    registerUserReq: registerUserReqMutation.mutateAsync,
    isRegistering: registerUserReqMutation.isPending,

    registerUserAut: registerUserAutMutation.mutateAsync,
    isVerifying: registerUserAutMutation.isPending,

    registerUserPas: registerUserPasMutation.mutateAsync,
    isSettingPassword: registerUserPasMutation.isPending,

    refreshToken: getToken.mutateAsync,
    isRefreshingToken: getToken.mutateAsync,

    resendRegisterToken: resendRegisterTokenMutation.mutateAsync,
    isResendingToken: resendRegisterTokenMutation.isPending,

    login: loginMutation.mutateAsync,
    isLoggingIn:loginMutation.isPending,

    forgetPassword: forgetPasswordMutation.mutateAsync,
    isForgettingPassword: forgetPasswordMutation.isPending,

    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,

  }
}
