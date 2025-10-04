"use client";
import { useSearchParams } from "next/navigation";
import {useEffect} from "react";

export function ParamDetector({ onDetect,param="method" }) {
    const searchParams = useSearchParams();
    const method = searchParams.get(param);

    useEffect(() => {
        if (method) onDetect(method);
    }, [method]);

    return null;
}
