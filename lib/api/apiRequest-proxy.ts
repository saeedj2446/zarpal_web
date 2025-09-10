// lib/api/client.ts
"use client";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "@/lib/api/apiError";
import { store } from "@/lib/store/store";
import { setAccessToken, setSessionId } from "@/lib/store/slices/authSlice";
import { generateRefreshToken } from "@/lib/utils/utils";
import { authApi } from "@/lib/api/auth";

// استفاده از پروکسی
export const API_BASE = "/api/goldpay";

// متغیر توکن سریع
let authToken: string | null = null;
let authSessionId: string | null = null;

// ست کردن توکن و sessionId
export const setAuthToken = (token: string | null) => {
    if (token) {
        authToken = token;
        store.dispatch(setAccessToken({ accessToken: token }));
    }
};

export const setAuthSessionId = (sessionId: string | null) => {
    if (sessionId) {
        authSessionId = sessionId;
        store.dispatch(setSessionId({ sessionId }));
    }
};

// axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// متد عمومی
export const publicApiRequest = async <T = any>(
    url: string,
    options?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await api({ url, ...options });
        const data = response.data;
        if ((data as any).response) {
            const resp = (data as any).response;
            if (resp.responseCode === 0) {
                const { response, ...rest } = data;
                return rest as T;
            }
            throw new ApiError(resp.responseCode, resp.responseText || "خطای ناشناخته", resp.responseData);
        }
        return data;
    } catch (err: any) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(0, err.message || "خطای نامعلوم");
    }
};

// متد با توکن
export const apiRequest = async <T = any>(
    url: string,
    options?: AxiosRequestConfig & { needSessionId?: boolean }
): Promise<T> => {
    try {
        options = options || {};
        options.headers = options.headers || {};
        const needSessionId = options.needSessionId !== false;

        if (!authToken) {
            const persistedToken = store.getState().auth.accessToken;
            if (persistedToken) authToken = persistedToken;
            else {
                const refreshToken = await generateRefreshToken();
                const newToken = await authApi.getToken(refreshToken);
                setAuthToken(newToken.toString());
            }
        }
        if (authToken) options.headers.Authorization = `Bearer ${authToken}`;

        if (needSessionId && authSessionId) {
            options.data = { ...options.data, sessionId: authSessionId };
        }

        let response: AxiosResponse<T>;
        try {
            response = await api({ url, ...options });
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                const refreshToken = await generateRefreshToken();
                const newToken = await authApi.getToken(refreshToken);
                setAuthToken(newToken.toString());
                options.headers.Authorization = `Bearer ${authToken}`;
                response = await api({ url, ...options });
            } else throw err;
        }

        const data = response.data;
        if ((data as any).response) {
            const resp = (data as any).response;
            if (resp.responseCode === 0) {
                const { response, ...rest } = data;
                return rest as T;
            }
            throw new ApiError(resp.responseCode, resp.responseText || "خطای ناشناخته", resp.responseData);
        }
        return data;
    } catch (err: any) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(0, err.message || "خطای نامعلوم");
    }
};

// فقط default export برای api
export default api;
