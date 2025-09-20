// lib/api/client.ts
"use client";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "@/lib/api/apiError";
import { store } from "@/lib/store/store";
import {setAccessToken, setSessionExpired, setSessionId} from "@/lib/store/slices/authSlice";
import { generateRefreshToken } from "@/lib/utils/utils";

import { authApi } from "@/lib/api/auth";

export const API_BASE = "https://staging.cytechnology.ir/GoldPay/V0100101";

// متغیر توکن سریع
let authToken: string | null = null;
let authSessionId: string | null = null;
// ست کردن توکن در متغیر و redux persist
export const setAuthToken = (token: string | null) => {
    if (token) {
        authToken = token;
        store.dispatch(setAccessToken({ accessToken: token }));
    }
};
export const setAuthSessionId = (sessionId: string | null) => {
    if (sessionId) {
        authSessionId = sessionId;
        store.dispatch(setSessionId({ sessionId: sessionId }));
    }
};

export const getAuthToken = (token: string | null) => {
    authToken=authToken ||  store.getState().auth.accessToken
    return authToken;
};

export const getAuthSessionId = () => {
    authSessionId=authSessionId ||  store.getState().auth.sessionId;
    if(!authSessionId) {
        window.location.href = "/login";
    }
    return authSessionId;
};

// axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// متد عمومی برای درخواست‌های بدون نیاز به توکن و بررسی خطا
export const publicApiRequest = async <T = any>(
    url: string,
    options?: AxiosRequestConfig
): Promise<T> => {
    console.log( API_BASE+url);
    try {
        const response: AxiosResponse<T> = await api({ url, ...options });
        const data = response.data;
        console.log(data);
        if ((data as any).response) {
            const resp = (data as any).response;
            if (resp.responseCode === 0) {
                const { response, ...rest } = data;
                return rest as T;
            }else if (resp.responseCode === 1) {
                store.dispatch(setSessionExpired(true));
            }
            else throw new ApiError(resp.responseCode, resp.responseText || "خطای ناشناخته", resp.responseData);
        }

        return data;
    } catch (err: any) {
        console.error("Public API Error:", err);
        // اگر قبلاً ApiError باشه
        if (err instanceof ApiError) throw err;

        // خطاهای سطح کلاینت (Axios / Browser string codes)
        if (typeof err.code === "string") {
            switch (err.code) {
                case "ERR_NETWORK":
                    throw new ApiError(0, "خطای شبکه یا عدم پاسخ از سرور");
                case "ECONNABORTED":
                    throw new ApiError(0, "مهلت درخواست تمام شد (Timeout)");
                case "ERR_BAD_REQUEST":
                    throw new ApiError(0, "درخواست غیرمعتبر (Bad Request)");
                case "ERR_BAD_RESPONSE":
                    throw new ApiError(0, "پاسخ نامعتبر از سرور");
                case "ERR_CANCELED":
                    throw new ApiError(0, "درخواست توسط کاربر یا کد لغو شد");
                case "ERR_FR_TOO_MANY_REDIRECTS":
                    throw new ApiError(0, "تعداد ریدایرکت‌ها بیش از حد مجاز");
                default:
                    throw new ApiError(0, `خطای کلاینت: ${err.code}`);
            }
        }

        // اگر سرور پاسخ داده (HTTP status)
        if (err.response) {
            const backendCode = err.response.data?.responseCode;
            if (backendCode !== undefined) {
                throw new ApiError(
                    backendCode,
                    err.response.data?.responseText || "خطای API",
                    err.response.data?.responseData
                );
            }
            // استفاده از HTTP status اگر responseCode نبود
            throw new ApiError(err.response.status, err.message, err.response.data);
        }

        // خطای ناشناخته
        throw new ApiError(0, err.message || "خطای نامعلوم");
    }
};

// متد اصلی برای درخواست‌ها با توکن و مدیریت 401 و 403
export const apiRequest = async <T = any>(
    url: string,
    options?: AxiosRequestConfig & { needSessionId?: boolean }
): Promise<T> => {
    try {
        console.log( API_BASE+url);
        options = options || {};
        options.headers = options.headers || {};
        const needSessionId = options.needSessionId !== false; // پیشفرض true
        let token =getAuthToken();
        if (!token) {
            const refreshToken = await generateRefreshToken();
            const token = await authApi.getToken(refreshToken);
            setAuthToken(token.toString());
        }
        options.headers.Authorization = `Bearer ${token}`;


        // اضافه کردن sessionId به بادی یا پارامترها
        if (needSessionId!==false ) {
            const sessionId=getAuthSessionId();
            if (options.data) {
                options.data = { ...options.data, sessionId };
            } else {
                options.data = { sessionId};
            }
        }


        let response: AxiosResponse<T>;
        try {
            response = await api({ url, ...options });
            console.log(response?.data);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                const refreshToken = await generateRefreshToken();
                const newToken = await authApi.getToken(refreshToken);
                setAuthToken(newToken.toString());

                options.headers.Authorization = `Bearer ${authToken}`;
                response = await api({ url, ...options });
            } else {
                throw new ApiError(status || 0, err.message || "خطای نامعلوم");
            }
        }

        const data = response.data;

        if ((data as any).response) {
            const resp = (data as any).response;
            if (resp.responseCode === 0){
                const {response, ...rest } = data;
                return rest as T;
            }else if (resp.responseCode === 1) {
                store.dispatch(setSessionExpired(true));
            }
            throw new ApiError(resp.responseCode, resp.responseText || "خطای ناشناخته", resp.responseData);
        }

        return data;
    } catch (err: any) {
        console.error("API Error:", err);
        // اگر قبلاً ApiError باشه
        if (err instanceof ApiError) {
            throw err
        };

        // خطاهای سطح کلاینت (Axios / Browser string codes)
        if (typeof err.code === "string") {
            switch (err.code) {
                case "ERR_NETWORK":
                    throw new ApiError(0, "خطای شبکه یا عدم پاسخ از سرور");
                case "ECONNABORTED":
                    throw new ApiError(0, "مهلت درخواست تمام شد (Timeout)");
                case "ERR_BAD_REQUEST":
                    throw new ApiError(0, "درخواست غیرمعتبر (Bad Request)");
                case "ERR_BAD_RESPONSE":
                    throw new ApiError(0, "پاسخ نامعتبر از سرور");
                case "ERR_CANCELED":
                    throw new ApiError(0, "درخواست توسط کاربر یا کد لغو شد");
                case "ERR_FR_TOO_MANY_REDIRECTS":
                    throw new ApiError(0, "تعداد ریدایرکت‌ها بیش از حد مجاز");
                default:
                    throw new ApiError(0, `خطای کلاینت: ${err.code}`);
            }
        }

        // اگر سرور پاسخ داده (HTTP status)
        if (err.response) {
            const backendCode = err.response.data?.responseCode;
            if (backendCode !== undefined) {
                throw new ApiError(
                    backendCode,
                    err.response.data?.responseText || "خطای API",
                    err.response.data?.responseData
                );
            }
            // استفاده از HTTP status اگر responseCode نبود
            throw new ApiError(err.response.status, err.message, err.response.data);
        }

        // خطای ناشناخته
        throw new ApiError(0, err.message || "خطای نامعلوم");
    }
};


export default api;
