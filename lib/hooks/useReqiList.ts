import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listApi } from "@/lib/api/list";
import { DtoIn_filterReqi, Dto_ListOrder, DtoOut_listReqi, DtoIn_ShortId } from "@/lib/types";
import { toast } from "@/lib/hooks/use-toast";

export const useReqiList = (
    filter: DtoIn_filterReqi,
    order?: Dto_ListOrder[],
    page?: number,
) => {
    const [listId, setListId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    // ⏺️ کش محلی برای نگه داشتن listId بر اساس ترکیب filter + order
    const listIdCache = useRef<Record<string, number>>({});
    const cacheKey = JSON.stringify({ filter, order });

    // 🔹 Mutation برای بستن لیست قبلی
    const closeListMutation = useMutation({
        mutationFn: (data: DtoIn_ShortId) => {
            return listApi.closeList(data);
        },
        onError: (err) => {
            console.error("❌ closeList error:", err);
        },
    });

    // 🔹 Query برای گرفتن listId جدید، بعد از بستن لیست قبلی
    const filterQuery = useQuery({
        queryKey: ["reqiListReq", filter, order],
        queryFn: async () => {
            // اگر فیلتر وجود ندارد، null برگردان
            if (!filter?.purse) return null;

            const input = {};
            if (filter) input.filter = filter;
            if (order) input.order = order;

            const res = await listApi.reqiListReq(input);
            console.log("📥 filterQuery result", res);
            return res;
        },
        enabled: !!filter?.purse,
        retry: (failureCount, error) => {
            // اگر خطای 13 (عدم وجود رکورد) بود، دوباره تلاش نکن
            if (error?.code === 13) return false;
            return failureCount < 3;
        },
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
            // فقط برای خطاهای غیر از 13 توست نمایش بده
            if (filterQuery.error?.code !== 13) {
                toast(filterQuery.error.getToast?.() ?? "بارگذاری درخواستهای کیف با خطا مواجه شد");
            }
            // در صورت خطا، listId را خالی کن
            setListId(null);
        }
    }, [filterQuery.error]);

    // 🔹 اگر listId قبلاً توی کش باشه، مستقیم ست کن
    useEffect(() => {
        if (listIdCache.current[cacheKey]) {
            setListId(listIdCache.current[cacheKey]);
        }
    }, [cacheKey]);

    // 🔹 Query برای گرفتن لیست درخواست‌ها
    const listQuery = useQuery<DtoOut_listReqi>({
        queryKey: ["reqiListGet", listId, page],
        queryFn: () => {
            console.log("📥 listQuery call with listId:", listId, "page:", page);
            return listApi.reqiListGet({ listId: listId!, page });
        },
        enabled: !!listId && !!filter?.purse,
        keepPreviousData: false,
    });

    // 🔹 با تغییر فیلتر، کوئری‌ها را invalidate کن
    useEffect(() => {
        if (filter?.purse) {
            queryClient.invalidateQueries({ queryKey: ["reqiListReq"] });
            queryClient.invalidateQueries({ queryKey: ["reqiListGet"] });
        }
    }, [filter?.purse, queryClient]);

    return {
        ...listQuery,
        filterQuery,
        isFilterLoading: filterQuery.isPending,
        isFilterError: filterQuery.isError,
    };
};