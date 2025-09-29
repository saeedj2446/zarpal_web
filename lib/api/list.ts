import {apiRequest} from "@/lib/api/apiRequest";
import {
    DtoIn_filterReqi,
    DtoIn_ListGet, DtoIn_Purse,
    DtoIn_ShortId,
    DtoOut_listReqi,
    DtoOut_ListRequest, DtoOut_PackList,
    DtoOut_Response
} from "@/lib/types";

export const listApi = {
    closeList: async (data: DtoIn_ShortId): Promise<DtoOut_Response> => {
        return apiRequest("/closeList", {
            method: "POST",
            data,
        });
    },
    // سرویس اول: ست کردن فیلترها و آماده‌سازی لیست
    reqiListReq: async (data: DtoIn_filterReqi): Promise<DtoOut_ListRequest> => {
        return apiRequest("/reqiListReq", {
            method: "POST",
            data,
        });
    },

    // سرویس دوم: گرفتن درخواست‌ها
    reqiListGet: async (data: DtoIn_ListGet): Promise<DtoOut_listReqi> => {
        return apiRequest("/reqiListGet", {
            method: "POST",
            data,
        });
    },
    getProperPackList: async (data: DtoIn_Purse): Promise<DtoOut_PackList> => {
        return apiRequest("/getProperPackList", {
            method: "POST",
            data,
        });
    },
};
