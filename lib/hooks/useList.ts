// src/lib/hooks/usePackages.ts

import { useQuery } from "@tanstack/react-query";
import {DtoOut_PackList} from "@/lib/types";
import {listApi} from "@/lib/api/list";


export const usePackages = (purseId: string | null) => {
    return useQuery<DtoOut_PackList, Error>({
        queryKey: ["packages", purseId],
        queryFn: () => {
            if (!purseId) {
                throw new Error("Purse ID is required");
            }
            return listApi.getProperPackList({
                purse: purseId,
            });
        },
        enabled: !!purseId, // فقط اگر purseId وجود داشته باشد، درخواست ارسال شود
        staleTime: 60 * 60 * 1000, // کش 1 ساعت
        gcTime: 60 * 60 * 1000, // 1 ساعت
    });
};