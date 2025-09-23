"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Badge } from "@/components/radix/badge";
import { Button } from "@/components/radix/button";
import { User, Calendar, CreditCard } from "lucide-react";
import { useWallet } from "@/lib/hooks/useWallet";
import dayjs from "dayjs";
import { DtoIn_filterReqi, Dto_ListOrder } from "@/lib/types";
import { useReqiList } from "@/lib/hooks/useReqiList";
import {useRouter} from "next/navigation";
import RequestSortBar from "@/app/requests/RequestSortBar";
import RequestFilterBarMobile from "@/app/requests/RequestFilterBarMobile";
import RequestFilterBarDesktop from "@/app/requests/RequestFilterBarDesktop";



interface RequestProps {
  showAllTBtn?: boolean; // پراپس بولین، اختیاری
  showSort?: boolean;
  showFilter?: boolean;
}
export default function Requests({ showAllTBtn = false,showSort=true,showFilter=true }: RequestProps) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("ALL"); // تب فعال
  const { currentWallet } = useWallet();
  const [filter, setFilter] = useState<DtoIn_filterReqi | null>({ purse: currentWallet.id});
  const [order, setOrder] = useState<Dto_ListOrder[]>([{ orderBy: "createdOn", direction: "D" }]);
  const page = 1;
  const router = useRouter();

  // 🔹 استفاده از هوک کاستوم که خودش سرویس اول و دوم را مدیریت می‌کند
  const { data, isLoading, isError } = useReqiList(filter,order,page, );
  const requests = data?.list ?? [];

  // 🔹 توابع کمکی برای رنگ و متن وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case "P": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "O": return "bg-green-100 text-green-800 border-green-200";
      case "C": return "bg-red-100 text-red-800 border-red-200";
      case "E": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "P": return "منتظر پرداخت";
      case "O": return "موفق";
      case "C": return "لغو شده";
      case "E": return "منقضی شده";
      default: return "نامشخص";
    }
  };

  // 🔹 نمایش جزئیات تراکنش انتخاب شده
  if (selectedRequest) {
    return (
        <Card className="bg-white shadow-lg max-w-2xl ">
          <CardHeader className="pb-4 flex items-center justify-between">
            <CardTitle className="text-lg">جزئیات تراکنش</CardTitle>
            <Button
                variant="ghost"
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500"
            >
              بازگشت
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">شناسه تراکنش</label>
                <p className="font-medium">{selectedRequest.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">مبلغ</label>
                <p className="font-medium text-lg">{selectedRequest.amount} ریال</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">نام پرداخت کننده</label>
                <p className="font-medium">{selectedRequest.payerTitle}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">شماره تماس</label>
                <p className="font-medium">{selectedRequest.payerContact}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">توضیحات</label>
              <p className="font-medium">{selectedRequest.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">تاریخ ثبت</label>
                <p className="font-medium">
                  {dayjs(selectedRequest.createdOn).format("YYYY/MM/DD HH:mm")}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">تاریخ انقضا</label>
                <p className="font-medium">
                  {selectedRequest.expiredOn
                      ? dayjs(selectedRequest.expiredOn).format("YYYY/MM/DD HH:mm")
                      : "-"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">وضعیت</label>
              <Badge className={`${getStatusColor(selectedRequest.status)} mt-1`}>
                {getStatusText(selectedRequest.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
    );
  }

  // 🔹 نمایش لیست تراکنش‌ها
  return (
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
        {/* 🔹 فیلتر دسکتاپ */}
        {showFilter &&(
            <RequestFilterBarDesktop
                onChange={({filter: newFilter, order: newOrder}) => {
                  setFilter({
                    ...newFilter,
                    purse: currentWallet?.id,
                  });
                  setOrder(
                      newOrder.length ? newOrder : [{orderBy: "createdOn", direction: "D"}]
                  );
                }}
            />
        )}

        {/* 🔹 فقط موبایل */}
        {showFilter && (
            <div className="md:hidden">
              <RequestFilterBarMobile
                  onChange={({filter: newFilter, order: newOrder}) => {
                    setFilter({
                      ...newFilter,
                      purse: currentWallet?.id,
                    });
                    setOrder(
                        newOrder.length ? newOrder : [{orderBy: "createdOn", direction: "D"}]
                    );
                  }}
              />
            </div>
        )}

        {/* 🔹 لیست تراکنش‌ها */}
        <Card className="flex-1 bg-white shadow-lg">
          <CardContent>
            {showSort && (
                <RequestSortBar
                    onChange={(newOrder) => {
                      let nOrder=newOrder.length ? newOrder : [{
                        orderBy: "createdOn",
                        direction: "D"
                      }]

                      setOrder(nOrder)
                    }}
                />
            )}


            {isLoading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}
            {isError && <p className="text-center text-red-500">خطا در بارگذاری تراکنش‌ها</p>}

            <div className="space-y-3">
              {requests.map((request: any) => (
                  <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500"/>
                        <span className="font-medium">{request.payerTitle}</span>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{request.desc}</span>
                      <span className="font-medium text-lg text-[#a85a7a]">
                  {request.amount} ریال
                </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3"/>
                        <span>
                    {dayjs(request.createdOn).format("YYYY/MM/DD HH:mm")} -{" "}
                          {request.expiredOn
                              ? dayjs(request.expiredOn).format("YYYY/MM/DD HH:mm")
                              : "-"}
                  </span>
                      </div>
                      <span>{request.id}</span>
                    </div>
                  </div>
              ))}
            </div>

            {showAllTBtn && (
                <div className="mt-4 text-center">
                  <Button
                      variant="outline"
                      onClick={() => router.push("/requests")}
                      className="text-[#a85a7a] border-[#a85a7a]"
                  >
                    مشاهده همه درخواستها
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>


      </div>
  );


}
