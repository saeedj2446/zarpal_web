// components/WalletCard.tsx
"use client";

import React from "react";
import { TrendingUp, Eye, Clock } from "lucide-react";
import { ImagePreview, Timer } from "@/components/common";
import jMoment from "moment-jalaali";
import { diffDate } from "@/lib/utils/utils";
import { Badge } from "@/components/radix/badge";
import Link from "next/link";
import {WalletIcon} from "@/app/public/WalletIcon";

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

interface WalletCardProps {
    wallet: Wallet;
    isActive?: boolean;
    onClick?: () => void;
}

export default function WalletCard({ wallet, isActive = false, onClick }: WalletCardProps) {
    // توابع کمکی
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'O': return 'bg-green-100 text-green-800';
            case 'C': return 'bg-yellow-100 text-yellow-800';
            case 'E': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
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

    const getCurrencyUnit = (type: string): string => {
        switch (type) {
            case 'IRI': return 'ریال';
            case 'gld':
            case 'egld':
                return 'گرم';
            default: return '';
        }
    };

    const getWalletBorderColor = (status: string) => {
        switch (status) {
            case 'O': return 'border-green-500';
            case 'C': return 'border-yellow-500';
            case 'E': return 'border-red-500';
            default: return 'border-gray-300';
        }
    };

    const getWalletBgColor = (status: string) => {
        switch (status) {
            case 'O': return 'bg-green-50';
            case 'C': return 'bg-yellow-50';
            case 'E': return 'bg-red-50';
            default: return 'bg-gray-50';
        }
    };

    // فرمت کردن عدد با جداکننده‌های فارسی
    const formatNumber = (num: string) => {
        return new Intl.NumberFormat('fa-IR').format(Number(num) || 0);
    };

    return (
        <div
            className={`relative h-48 m-1 rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 transform
                ${isActive
                ? `${getWalletBgColor(wallet.status)} ${getWalletBorderColor(wallet.status)} border-2 scale-105`
                : 'bg-white border border-gray-200 scale-100 hover:scale-[1.02]'
            }`}
            onClick={onClick}
        >
            <div className="h-full flex flex-col p-5">
                {/* هدر کارت */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <Link href="/accounts">
                            <h2 className="text-lg font-bold text-gray-800 truncate flex items-center gap-1 cursor-pointer hover:text-[#a85a7a] transition-colors">
                                {wallet.title}
                            </h2>
                        </Link>
                        <div className="flex items-center mt-1">
                            <WalletIcon type={wallet.type} className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500 mr-1">
                                {getWalletTypeName(wallet.type)}
                            </span>
                        </div>
                    </div>

                    <Badge className={`${getStatusColor(wallet.status)} text-xs`}>
                        {getStatusText(wallet.status)}
                    </Badge>
                </div>

                {/* محتوای اصلی کارت */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            {wallet.iconId ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <ImagePreview
                                        fileId={wallet.iconId}
                                        width={48}
                                        height={48}
                                        rounded="rounded-full"
                                        showZoomButton={false}
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <WalletIcon type={wallet.type} className="w-6 h-6 text-gray-500" />
                                </div>
                            )}

                            <div>
                                <div className="text-xs text-gray-500">شناسه کیف</div>
                                <div className="text-sm font-medium">{wallet.id}</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                                <TrendingUp className="w-3 h-3 ml-1" />
                                <span>موجودی</span>
                            </div>
                            <div className="text-lg font-bold text-[#a85a7a]">
                                {formatNumber(wallet.balance || '0')} {getCurrencyUnit(wallet.type)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* فوتر کارت */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center">
                        <WalletIcon currency={wallet.currency} className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">
                            {getCurrencyName(wallet.currency)}
                        </span>
                    </div>

                    {/* تایمر فقط برای کیف‌های غیرریالی */}
                    {wallet.type !== 'IRI' && wallet.active && (
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 ml-1" />
                            <Timer
                                color={isActive ? 'green' : 'gray'}
                                totalTime={diffDate(wallet.active.usageStart, wallet.active.usageEnd)}
                                currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), wallet.active.usageEnd)}
                                size={20}
                                showDaysOnly={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* نشانگر فعال بودن */}
            {isActive && (
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            )}
        </div>
    );
}