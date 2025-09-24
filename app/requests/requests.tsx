"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Badge } from "@/components/radix/badge";
import { Button } from "@/components/radix/button";
import { User, Calendar, CreditCard, RefreshCw, AlertCircle, FileText, Inbox } from "lucide-react";
import { useWallet } from "@/lib/hooks/useWallet";
import dayjs from "dayjs";
import { DtoIn_filterReqi, Dto_ListOrder } from "@/lib/types";
import { useReqiList } from "@/lib/hooks/useReqiList";
import { useRouter } from "next/navigation";
import RequestSortBar from "@/app/requests/RequestSortBar";
import RequestFilterBarMobile from "@/app/requests/RequestFilterBarMobile";
import RequestFilterBarDesktop from "@/app/requests/RequestFilterBarDesktop";
import { XFlatList } from "@/components/common";

interface RequestProps {
  showAllTBtn?: boolean;
  showSort?: boolean;
  showFilter?: boolean;
  title?: string;
  maxPages?: number;
}

export default function Requests({ title = "", maxPages, showAllTBtn = false, showSort = true, showFilter = true }: RequestProps) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const { currentWallet } = useWallet();
  const [filter, setFilter] = useState<DtoIn_filterReqi | null>(null);
  const [order, setOrder] = useState<Dto_ListOrder[]>([{ orderBy: "createdOn", direction: "D" }]);
  const [page, setPage] = useState(1);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // به‌روزرسانی فیلتر هنگام تغییر کیف فعلی
  useEffect(() => {
    if (currentWallet?.id) {
      setFilter({ purse: currentWallet.id });
    } else {
      setFilter(null);
    }
    // ریست کردن صفحه هنگام تغییر فیلتر
    setPage(1);
    setAllRequests([]);
    setHasMore(true);
  }, [currentWallet]);

  // بررسی وضعیت کیف فعلی
  const walletStatus = currentWallet?.status;
  const isWalletActive = walletStatus !== 'C';

  // استفاده از هوک کاستوم
  const {
    filterQuery,
    data,
    isLoading,
    isFilterError,
    error,
    refetch,
    isFilterLoading
  } = useReqiList(isWalletActive ? filter : null, order, page);

  // به‌روزرسانی لیست درخواست‌ها هنگام دریافت داده‌های جدید
  useEffect(() => {
    // اگر خطایی در filterQuery وجود دارد، لیست را خالی کن
    if (isFilterError) {
      setAllRequests([]);
      return;
    }

    if (data?.list) {
      if (page === 1) {
        setAllRequests(data.list);
      } else {
        setAllRequests(prev => [...prev, ...data.list]);
      }

      // بررسی وجود داده‌های بیشتر
      setHasMore(data.list.length > 0 && data.list.length >= 10);
    }
  }, [data, page, isFilterError]);

  // توابع کمکی برای رنگ و متن وضعیت
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

  // تابع برای لود بیشتر درخواست‌ها
  const handleLoadMore = () => {
    if (hasMore && !isLoading && !isFilterLoading) {
      setPage(prev => prev + 1);
    }
  };

  // تابع برای استخراج کلید منحصر به فرد برای هر آیتم
  const keyExtractor = (item: any) => item.id;

  // کامپوننت برای نمایش وضعیت خالی
  const ListEmptyComponent = (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Inbox className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">درخواستی ثبت نشده</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            هنوز هیچ درخواست پرداختی برای این کیف ثبت نشده است.
          </p>
          <Button
              className="bg-[#a85a7a] hover:bg-[#96527a] text-white"
              onClick={() => router.push("/request-payment")}
          >
            ایجاد اولین درخواست پرداخت
          </Button>
        </CardContent>
      </Card>
  );

  // کامپوننت برای هدر لیست
  const ListHeaderComponent = showSort && filter ? (
      <RequestSortBar
          onChange={(newOrder) => {
            let nOrder = newOrder.length ? newOrder : [{
              orderBy: "createdOn",
              direction: "D"
            }];
            setOrder(nOrder);
            setPage(1);
            setAllRequests([]);
          }}
      />
  ) : null;

  // کامپوننت برای فوتر لیست
  const ListFooterComponent = showAllTBtn && allRequests.length > 0 ? (
      <div className="mt-4 text-center">
        <Button
            variant="outline"
            onClick={() => router.push("/requests")}
            className="text-[#a85a7a] border-[#a85a7a]"
        >
          مشاهده همه درخواستها
        </Button>
      </div>
  ) : null;

  // نمایش جزئیات تراکنش انتخاب شده
  if (selectedRequest) {
    return (
        <Card className="flex flex-1 bg-white shadow-lg">
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

  // نمایش پیام برای کیف‌های غیرفعال
  if (!isWalletActive && currentWallet) {
    let statusMessage = "";
    let statusDescription = "";
    switch (walletStatus) {
      case "E":
        statusMessage = "این کیف منقضی شده است";
        statusDescription = "لطفا برای استفاده مجدد از خدمات، کیف خود را تمدید کنید.";
        break;
      case "C":
        statusMessage = "این کیف در حال بررسی است";
        statusDescription = "لطفا تا بررسی و تایید کیف صبور باشید.";
        break;
      default:
        statusMessage = "این کیف غیرفعال است";
        statusDescription = "لطفا وضعیت کیف خود را بررسی کنید.";
    }

    return (
        <Card className="bg-white shadow-lg max-w-4xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{statusMessage}</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {statusDescription}
            </p>
            <Button
                variant="outline"
                className="text-[#a85a7a] border-[#a85a7a]"
                onClick={() => router.push("/accounts")}
            >
              مدیریت کیف‌ها
            </Button>
          </CardContent>
        </Card>
    );
  }

  // نمایش لیست تراکنش‌ها
  return (
      <div>
        {title && (
            <div className="px-4 pb-6 mt-12 text-center">
              {title}
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl">

          {/* فیلتر دسکتاپ */}
          {showFilter && filter && (
              <RequestFilterBarDesktop
                  onChange={({ filter: newFilter, order: newOrder }) => {
                    setFilter({
                      ...newFilter,
                      purse: currentWallet?.id,
                    });
                    setOrder(
                        newOrder.length ? newOrder : [{ orderBy: "createdOn", direction: "D" }]
                    );
                    setPage(1);
                    setAllRequests([]);
                  }}
              />
          )}

          {/* فقط موبایل */}
          {showFilter && filter && (
              <div className="md:hidden">
                <RequestFilterBarMobile
                    onChange={({ filter: newFilter, order: newOrder }) => {
                      setFilter({
                        ...newFilter,
                        purse: currentWallet?.id,
                      });
                      setOrder(
                          newOrder.length ? newOrder : [{ orderBy: "createdOn", direction: "D" }]
                      );
                      setPage(1);
                      setAllRequests([]);
                    }}
                />
              </div>
          )}

          {/* لیست تراکنش‌ها */}
          <Card className="flex-1 bg-white shadow-lg">
            <CardContent>
              <XFlatList
                  maxPages={maxPages}
                  data={allRequests}
                  renderItem={(request: any) => (
                      <div
                          onClick={() => setSelectedRequest(request)}
                          className=" hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
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
                            <Calendar className="w-3 h-3" />
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
                  )}
                  keyExtractor={keyExtractor}
                  ListEmptyComponent={ListEmptyComponent}
                  ListHeaderComponent={ListHeaderComponent}
                  ListFooterComponent={ListFooterComponent}
                  loading={isLoading || isFilterLoading}
                  error={isFilterError ? error : null}
                  hasMore={hasMore}
                  onLoadMore={handleLoadMore}
                  infiniteScroll={true}
                  showLoadMoreButton={true}
                  itemClassName="border border-gray-200"
                  loaderClassName="text-blue-500"
                  errorClassName="bg-red-50 border border-red-200 rounded-lg"
                  loadMoreButtonClassName="font-medium"
              />
            </CardContent>
          </Card>
        </div>
      </div>
  );
}