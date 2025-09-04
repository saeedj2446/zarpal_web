"use client"

import { useMutation } from "@tanstack/react-query"
import type { RegisterUserReq, DtoIn_Otp, DtoIn_Password } from "../types"
import { toast } from "./use-toast"
import {authApi} from "@/lib/api/auth";
import {router} from "next/client";

export const useAuth = () => {
  // Step 1: Register user request (send mobile)
  const registerUserReqMutation = useMutation({
    mutationFn: (data: RegisterUserReq) => authApi.registerUserReq(data),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "user info submitted successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit mobile number.",
        variant: "destructive",
      })
    },
  })

  // Step 2: Verify OTP
  const registerUserAutMutation = useMutation({
    mutationFn: (data: DtoIn_Otp) => authApi.registerUserAut(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "OTP verified successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid OTP code. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Step 3: Set password
  const registerUserPasMutation = useMutation({
    mutationFn: (data: DtoIn_Password) => authApi.registerUserPas(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password set successfully. Please log in.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set password.",
        variant: "destructive",
      })
    },
  })

  return {
    // mutations
    registerUserReq: registerUserReqMutation.mutateAsync,
    registerUserAut: registerUserAutMutation.mutateAsync,
    registerUserPas: registerUserPasMutation.mutateAsync,

    // loading states
    isPending:registerUserReqMutation.isPending || registerUserReqMutation.isPending || registerUserPasMutation.isPending,
    isRegistering: registerUserReqMutation.isPending,
    isVerifying: registerUserAutMutation.isPending,
    isSettingPassword: registerUserPasMutation.isPending,
  }
}
