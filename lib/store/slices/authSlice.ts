// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "@/lib/store/store";
import {Dto_UserProfile} from "@/lib/types";

interface AuthState {
    accessToken: string | null;
    sessionId: string | null;
    otpSeconds: number;
    user?: Dto_UserProfile;
}

const initialState: AuthState = {
    accessToken: null,
    sessionId: null,
    otpSeconds: 0,
    user: undefined,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.accessToken = action.payload.accessToken;
        },
        setSessionId: (state, action: PayloadAction<{ sessionId: string | null }>) => {
            state.sessionId = action.payload.sessionId;
        },
        setOtpSeconds: (state, action: PayloadAction<{ otpSeconds: number }>) => {
            state.otpSeconds = action.payload.otpSeconds;
        },
        tickOtpSeconds: (state) => {
            if (state.otpSeconds > 0) {
                state.otpSeconds -= 1;
            }
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.sessionId = null;
            state.user = undefined;
            state.otpSeconds = 0;
        },
        setUser: (state, action: PayloadAction<AuthState["user"]>) => {
            state.user = action.payload;
        },
    },
});

export const {
    setAccessToken,
    setSessionId,
    setOtpSeconds,
    tickOtpSeconds,
    clearAuth,
    setUser,
} = authSlice.actions;

export default authSlice.reducer;

// ✅ thunk برای مدیریت تایمر
let otpTimer: NodeJS.Timeout | null = null;

export const startOtpTimer = (seconds: number) => (dispatch: AppDispatch) => {
    dispatch(setOtpSeconds({ otpSeconds: seconds }));

    if (otpTimer) clearInterval(otpTimer);

    otpTimer = setInterval(() => {
        dispatch(tickOtpSeconds());
    }, 1000);
};
