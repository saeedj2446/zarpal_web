"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store/store";
import { logout, setSessionExpired } from "@/lib/store/slices/authSlice";

interface SessionProviderProps {
    children: React.ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
    const sessionExpired = useSelector((state: RootState) => state.auth.sessionExpired);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (sessionExpired) {
            dispatch(logout());
            dispatch(setSessionExpired(false));
            router.push("/login");
        }
    }, [sessionExpired, dispatch, router]);

    return <>{children}</>;
}
