// components/WalletItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import { TrendingUp, Settings } from "lucide-react";
import { ImagePreview, Timer } from "@/components/common";
import { WalletIcon } from "./WalletIcon";
import jMoment from "moment-jalaali";
import { diffDate } from "@/lib/utils/utils";
import { Badge } from "@/components/radix/badge";
import Link from "next/link";

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
}

interface WalletItemProps {
    wallet: Wallet;
    isActive: boolean;
    onClick: () => void;
}

export default function WalletItem({ wallet, isActive, onClick }: WalletItemProps) {
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
                            <h2 className="text-lg font-bold text-gray-800 truncate max-w-[180px] flex items-center gap-1 cursor-pointer hover:text-[#a85a7a] transition-colors">
                                {wallet.title}
                                <Settings className="w-4 h-4" />
                            </h2>
                        </Link>
                        <div className="flex items-center mt-2">
                            <WalletIcon type={wallet.type} className="w-4 h-4 mr-1" />
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
                            <div className="rounded-full bg-white flex items-center justify-center overflow-hidden border-2 shadow-sm">
                                {wallet.iconId ? (
                                    <ImagePreview
                                        fileId={wallet.iconId}
                                        width={55}
                                        height={55}
                                        rounded="rounded-full"
                                        showZoomButton={false}
                                    />
                                ) : (
                                    <WalletIcon type={wallet.type} className="w-6 h-6" />
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
                                {wallet.balance || '0'} {wallet.type === "IRI" ? "ریال" : "گرم"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* نوع ارز در پایین کارت */}
                <div className="flex items-center justify-center mt-3 pt-1 border-t border-gray-200">
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