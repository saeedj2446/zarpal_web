// components/WalletItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import { TrendingUp, Settings, Eye } from "lucide-react";
import { ImagePreview, Timer } from "@/components/common";
import { WalletIcon } from "./WalletIcon";
import jMoment from "moment-jalaali";
import { diffDate } from "@/lib/utils/utils";
import { Badge } from "@/components/radix/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/radix/card";

export interface Wallet {
    id: string;
    title: string;
    type: string;
    currency: string;
    status: string; // 'O', 'C', 'E'
    active?: {
        usageStart: string;
        usageEnd: string;
        packageTitle: string;
    };
    balance?: string;
    iconId?: string;
    levelId?: number;
    contact?: string;
    provinceId?: number;
    city?: string;
    address?: string;
    createdOn?: string;
    totalRequests?: number;
    successfulRequests?: number;
    failedRequests?: number;
}

interface WalletItemProps {
    wallet: Wallet;
    isActive?: boolean;
    onClick?: () => void;
    showDetails?: boolean;
}

export default function WalletInfoItem({ wallet, isActive = false, onClick, showDetails = false }: WalletItemProps) {
    // توابع کمکی
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

    if (showDetails) {
        // حالت نمایش کامل اطلاعات در AccountView
        return (
            <Card className="bg-white shadow-lg overflow-hidden">
                <CardHeader className="pb-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold text-center">
                            {wallet?.title || "حساب جدید"}
                        </CardTitle>
                    </div>
                    <Badge className={getStatusColor(wallet.status)}>
                        {getStatusText(wallet.status)}
                    </Badge>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* لوگو */}
                        <div className="flex-shrink-0">
                            {wallet?.iconId ? (
                                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <ImagePreview
                                        key={wallet?.iconId}
                                        fileId={wallet?.iconId}
                                        zoomable={true}
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                                    {/* <ImageIcon className="w-12 h-12 text-gray-400" />*/}
                                </div>
                            )}
                        </div>

                        {/* اطلاعات حساب */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500">شناسه: {wallet?.id}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <WalletIcon type={wallet.type} className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">
                                        {getWalletTypeName(wallet.type)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <WalletIcon currency={wallet.currency} className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">
                                        {getCurrencyName(wallet.currency)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700">
                                        {wallet?.contact || "شماره همراه"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700">
                                        {wallet?.address || "آدرس"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* بخش‌های اضافی */}
                    <div className="mt-8 space-y-6">
                        {/* بخش مشخصات کیف */}
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-md font-bold flex items-center gap-2">
                                    مشخصات کیف
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">شناسه کیف</p>
                                        <p className="font-medium">{wallet?.id || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">تاریخ ایجاد</p>
                                        <p className="font-medium">{wallet?.createdOn ? formatDate(wallet.createdOn) : "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">وضعیت</p>
                                        <p className={`font-medium ${
                                            wallet?.status === 'O' ? 'text-green-600' :
                                                wallet?.status === 'C' ? 'text-yellow-600' :
                                                    wallet?.status === 'E' ? 'text-red-600' :
                                                        'text-blue-600'
                                        }`}>
                                            {getStatusText(wallet.status)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">سطح کیف</p>
                                        <p className="font-medium">{wallet?.levelId ? `سطح ${wallet.levelId}` : "-"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* بخش گزارش کلی درخواست‌ها */}
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-md font-bold flex items-center gap-2">
                                    گزارش کلی درخواست‌ها
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-700">مجموع درخواست‌ها</p>
                                        <p className="text-xl font-bold text-blue-900">{wallet?.totalRequests || "0"}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-green-700">درخواست‌های موفق</p>
                                        <p className="text-xl font-bold text-green-900">{wallet?.successfulRequests || "0"}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-700">درخواست‌های ناموفق</p>
                                        <p className="text-xl font-bold text-red-900">{wallet?.failedRequests || "0"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // حالت نمایش کارت در اسلایدر
    return (
        <div
            className={`h-[190px] ring-1 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 transform
                        ${isActive
                ? "scale-105  ring-green-700 bg-gradient-to-br " + getWalletBgColor(wallet.status)
                : "scale-95 opacity-80 bg-white border ring-gray-400"
            }`}
            onClick={onClick}
        >
            <div className="h-full flex flex-col p-5">
                {/* هدر کارت */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Link href="/accounts">
                            <h2 className="text-sm font-bold text-gray-800 truncate  flex items-center gap-1 cursor-pointer hover:text-[#a85a7a] transition-colors">
                                <Eye className="w-4 h-4" />
                                {wallet.title.substring(0, 25)}
                            </h2>
                        </Link>
                        <div className="flex items-center mt-2 ">
                            <WalletIcon type={wallet.type} className="w-4 h-4 " />
                            <span className="text-xs text-gray-500">
                                {getWalletTypeName(wallet.type)}
                            </span>
                        </div>
                    </div>

                    {/* تایمر فقط برای کیف‌های غیرریالی */}
                    {wallet.type !== 'IRI' && wallet.active && (
                        <div className="flex flex-col items-center">
                            <Timer
                                color={isActive ? 'green' : 'gray'}
                                totalTime={diffDate(wallet.active.usageStart, wallet.active.usageEnd)}
                                currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), wallet.active.usageEnd)}
                                size={35}
                                showDaysOnly={true}
                            />
                        </div>
                    )}
                </div>

                {/* محتوای اصلی کارت */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-1">
                            <div className="rounded-full  flex items-center justify-center overflow-hidden ">
                                {wallet.iconId && (
                                    <ImagePreview
                                        fileId={wallet.iconId}
                                        width={55}
                                        height={55}
                                        rounded="rounded-full"
                                        showZoomButton={false}
                                    />
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="text-xs text-gray-500">شناسه کیف</div>
                                <div className="text-sm font-medium">{wallet.id}</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                                <TrendingUp className="w-3 h-3 ml-1" />
                                <span className="text-xs">موجودی</span>
                            </div>
                            <div className="text-base font-bold text-[#a85a7a]">
                                {wallet.balance || '0'} {getCurrencyUnit(wallet.type)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* نوع ارز در پایین کارت */}
                <div className="flex items-center   border-t border-gray-200 relative top-2 pt-2  ">
                    <WalletIcon currency={wallet.currency} className="w-4 h-4 mr-1" />
                    <span className="flex flex-1 text-xs text-gray-500">
                        {getCurrencyName(wallet.currency)}
                    </span>
                    <Badge className={`${getStatusColor(wallet.status)}`}>
                        {getStatusText(wallet.status)}
                    </Badge>
                </div>
            </div>
        </div>
    );
}