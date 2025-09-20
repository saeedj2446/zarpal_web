import {
  Dto_Response, DtoIn_cashInByOther,
  DtoIn_currencyRate, DtoIn_landingPage, DtoIn_PurseInfo, DtoIn_ShortId,
  DtoOut_currencyRate, DtoOut_FinReq, DtoOut_landingPage, DtoOut_PaymentLink, DtoOut_Response,
} from "../types"

import {apiRequest, publicApiRequest} from "@/lib/api/apiRequest"

export const walletApi = {
  getRate: async (data: DtoIn_currencyRate): Promise<DtoOut_currencyRate> => {
    return apiRequest("/currencyRate", {
      method: "POST",
      data,
    });
  },
  getLandingPage: async (data: DtoIn_landingPage): Promise<DtoOut_landingPage> => {
    return apiRequest("/landingPage", {
      method: "POST",
      data,
      needSessionId: false,
    });
  },
  acceptLandingPage: async (data: DtoIn_landingPage): Promise<DtoOut_PaymentLink> => {
    return apiRequest("/acceptCIo", {
      method: "POST",
      data,
      needSessionId: false,
    });
  },

  denyLandingPage: async (data: DtoIn_landingPage): Promise<Dto_Response> => {
    return apiRequest("/denyCIo", {
      method: "POST",
      data,
      needSessionId: false,
    });
  },
  cashInByOther: async (data: DtoIn_cashInByOther): Promise<DtoOut_FinReq> => {
    return apiRequest("/cashInByOther", {
      method: "POST",
      data,
    });
  },
  editPurse: async (data: DtoIn_PurseInfo): Promise<DtoOut_Response> => {
    return apiRequest("/editPurse", {
      method: "POST",
      data,
    });
  },
  closeList: async (data: DtoIn_ShortId): Promise<DtoOut_Response> => {
    return apiRequest("/closeList", {
      method: "POST",
      data,
    });
  },

}
