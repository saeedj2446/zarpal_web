import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { listApi } from "@/lib/api/list";
import { DtoIn_filterReqi, Dto_ListOrder, DtoOut_listReqi, DtoIn_ShortId } from "@/lib/types";
import { toast } from "@/lib/hooks/use-toast";

export const useReqiList = (
    filter: DtoIn_filterReqi,
    order?: Dto_ListOrder[],
    page? ,
) => {

    const [listId, setListId] = useState<number | null>(null);

    // ⏺️ کش محلی برای نگه داشتن listId بر اساس ترکیب filter + order
    const listIdCache = useRef<Record<string, number>>({});
    const cacheKey = JSON.stringify({ filter, order });

    // 🔹 Mutation برای بستن لیست قبلی
    const closeListMutation = useMutation({
        mutationFn: (data: DtoIn_ShortId ) => {
            return listApi.closeList(data);
        },

        onError: (err) => {
            console.error("❌ closeList error:", err);
            /*toast({
                title: "خطا",
                description: "بستن لیست قبلی با مشکل مواجه شد",
                variant: "destructive",
            });*/
        },
    });

    // 🔹 Query برای گرفتن listId جدید، بعد از بستن لیست قبلی
    const filterQuery = useQuery({
        queryKey: ["reqiListReq", filter, order],
        queryFn: async () => {
            // اگر listId قبلی داریم، ابتدا سرویس closeList رو کال کنیم
            if (listIdCache.current[cacheKey]) {
                await closeListMutation.mutateAsync({ id: listIdCache.current[cacheKey] });
            }
            const input={};
            if(filter) input.filter=filter;
            if(order) input.order=order;

            const res = await listApi.reqiListReq(input);
            console.log("📥 filterQuery result", res);
            return res;
        },
        enabled: !!filter?.purse,
    });

    // ✅ وقتی جواب اومد، listId رو کش و state کنیم
    useEffect(() => {
        if (filterQuery.data) {
            const newListId = filterQuery.data.listId;
            listIdCache.current[cacheKey] = newListId;
            setListId(newListId);
        }
    }, [filterQuery.data, cacheKey]);

    // ❌ هندل خطا
    useEffect(() => {
        if (filterQuery.error) {
            console.error("❌ filterQuery error:", filterQuery.error);
            toast({
                title: "خطا",
                description: "بارگذاری فیلتر با مشکل مواجه شد",
                variant: "destructive",
            });
        }
    }, [filterQuery.error]);

    // 🔹 اگر listId قبلاً توی کش باشه، مستقیم ست کن
    useEffect(() => {
        if (listIdCache.current[cacheKey]) {
            setListId(listIdCache.current[cacheKey]);
        }
    }, [cacheKey]);

    // 🔹 Query برای گرفتن لیست تراکنش‌ها
    const listQuery = useQuery<DtoOut_listReqi>({
        queryKey: ["reqiListGet", listId, page],
        queryFn: () => {
            console.log("📥 listQuery call with listId:", listId, "page:", page);
            return listApi.reqiListGet({ listId: listId!, page });
        },
        enabled: !!listId,
        keepPreviousData: true,
    });

    return {
        ...listQuery,
        isFilterLoading: filterQuery.isLoading,
        isFilterError: filterQuery.isError,
    };
};
