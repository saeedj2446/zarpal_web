// components/WalletItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
    TrendingUp,
    Settings,
    Eye,
    WalletIcon,
    XCircle,
    CheckCircle,
    FileText,
    BarChart3,
    Star,
    Circle, Calendar, Hash,
} from "lucide-react";
import { ImagePreview, Timer } from "@/components/common";
import jMoment from "moment-jalaali";
import { diffDate } from "@/lib/utils/utils";
import { Badge } from "@/components/radix/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/radix/card";
import {useWallet} from "@/lib/hooks/useWallet";

export default function WalletInfoItem() {
    const {currentWallet}=useWallet()
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'O': return 'bg-green-100 text-green-800 border-green-200';
            case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'E': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'O': return 'فعال';
            case 'C': return 'در حال بررسی';
            case 'E': return 'منقضی شده';
            default: return 'نامشخص';
        }
    };

    const getWalletTypeName = (type: string): string => {
        switch (type) {
            case 'IRI': return 'کیف نقدی';
            case 'gld': return 'کیف طلای داخلی';
            case 'egld': return 'کیف طلای خارجی';
            default: return 'نامشخص';
        }
    };

    const getCurrencyName = (currency: string): string => {
        switch (currency) {
            case 'IRR': return 'ریال ایران';
            case 'egld4Tst': return 'طلا – خارجی – محیط تست';
            case 'gld4Tst': return 'طلا – داخلی – محیط تست';
            case 'gldZrl': return 'طلا – داخلی – زریال';
            case 'egldZrl': return 'طلا – خارجی - زریال';
            default: return 'نامشخص';
        }
    };

    const getWalletBgColor = (status: string) => {
        switch (status) {
            case 'O': return 'from-green-50 to-green-100 border-green-200';
            case 'C': return 'from-yellow-50 to-yellow-100 border-yellow-200';
            case 'E': return 'from-gray-50 to-gray-100 border-gray-200';
            default: return 'from-gray-50 to-gray-100 border-gray-200';
        }
    };

    const getCurrencyUnit = (type: string): string => {
        switch (type) {
            case 'IRI': return 'ریال';
            case 'gld':
            case 'egld':
                return 'گرم';
            default: return '';
        }
    };

    // فرمت کردن تاریخ
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    };

    return (

                <div className="mt-8 space-y-6">
                    {/* بخش مشخصات کیف */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <WalletIcon className="h-5 w-5 text-blue-500"/>
                                مشخصات کیف
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                {/* شناسه کیف */}
                                <div className="flex items-center justify-between py-3 md:px-4">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-gray-500"/>
                                        <span className="text-sm text-gray-600">شناسه کیف</span>
                                    </div>
                                    <span className="font-medium">{currentWallet?.id || "-"}</span>
                                </div>

                                {/* تاریخ ایجاد */}
                                <div className="flex items-center justify-between py-3 md:px-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500"/>
                                        <span className="text-sm text-gray-600">تاریخ ایجاد</span>
                                    </div>
                                    <span
                                        className="font-medium">{currentWallet?.createdOn ? formatDate(currentWallet.createdOn) : "-"}</span>
                                </div>

                                {/* وضعیت */}
                                <div className="flex items-center justify-between py-3 md:px-4">
                                    <div className="flex items-center gap-2">
                                        <Circle className={`h-4 w-4 ${
                                            currentWallet?.status === 'O' ? 'text-green-500' :
                                                currentWallet?.status === 'C' ? 'text-yellow-500' :
                                                    currentWallet?.status === 'E' ? 'text-red-500' : 'text-blue-500'
                                        }`}/>
                                        <span className="text-sm text-gray-600">وضعیت</span>
                                    </div>
                                    <span className={`font-medium ${
                                        currentWallet?.status === 'O' ? 'text-green-600' :
                                            currentWallet?.status === 'C' ? 'text-yellow-600' :
                                                currentWallet?.status === 'E' ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                        {getStatusText(currentWallet.status)}
                    </span>
                                </div>

                                {/* سطح کیف */}
                                <div className="flex items-center justify-between py-3 md:px-4">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-gray-500"/>
                                        <span className="text-sm text-gray-600">سطح کیف</span>
                                    </div>
                                    <span
                                        className="font-medium">{currentWallet?.levelId ? `سطح ${currentWallet.levelId}` : "-"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* بخش گزارش کلی درخواست‌ها */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-500"/>
                                گزارش کلی درخواست‌ها
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <FileText className="h-6 w-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700">مجموع درخواست‌ها</p>
                                        <p className="text-xl font-bold text-blue-900">{currentWallet?.totalRequests || "0"}</p>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700">درخواست‌های موفق</p>
                                        <p className="text-xl font-bold text-green-900">{currentWallet?.successfulRequests || "0"}</p>
                                    </div>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <XCircle className="h-6 w-6 text-red-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-red-700">درخواست‌های ناموفق</p>
                                        <p className="text-xl font-bold text-red-900">{currentWallet?.failedRequests || "0"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

    );
}