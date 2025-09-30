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
import {setCurrentWallet} from "@/lib/store/slices/walletSlice";
import {useWallet} from "@/lib/hooks/useWallet";
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
 
    isActive?: boolean;
    onClick?: () => void;

}

export default function WalletHeaderInfo({  isActive = false, onClick,  }: WalletItemProps) {
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

   

    // حالت نمایش کارت در اسلایدر
    return (
        <Card className="bg-white shadow-lg overflow-hidden">
            <CardHeader className="pb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-center">
                        {currentWallet?.title || "حساب جدید"}
                    </CardTitle>
                </div>
                <Badge className={getStatusColor(currentWallet.status)}>
                    {getStatusText(currentWallet.status)}
                </Badge>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* لوگو */}
                    <div className="flex-shrink-0">
                        {currentWallet?.iconId ? (
                            <div
                                className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <ImagePreview
                                    key={currentWallet?.iconId}
                                    fileId={currentWallet?.iconId}
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
                                <span className="text-sm text-gray-500">شناسه: {currentWallet?.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <WalletIcon type={currentWallet.type} className="w-5 h-5 text-gray-500"/>
                                <span className="text-gray-700">
                                        {getWalletTypeName(currentWallet.type)}
                                    </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <WalletIcon currency={currentWallet.currency} className="w-5 h-5 text-gray-500"/>
                                <span className="text-gray-700">
                                        {getCurrencyName(currentWallet.currency)}
                                    </span>
                            </div>

                            <div className="flex items-center gap-2">
                                    <span className="text-gray-700">
                                        {currentWallet?.contact || "شماره همراه"}
                                    </span>
                            </div>

                            <div className="flex items-center gap-2">
                                    <span className="text-gray-700">
                                        {currentWallet?.address || "آدرس"}
                                    </span>
                            </div>
                        </div>
                    </div>
                </div>


            </CardContent>
        </Card>
    );
}