// components/TransactionDetail.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Badge } from "@/components/radix/badge";
import { Button } from "@/components/radix/button";
import {
    User,
    Calendar,
    CreditCard,
    X,
    ArrowLeft,
    Clock,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Hourglass
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils/utils";

interface TransactionDetailProps {
    transaction: any;
    onClose: () => void;
    onBack?: () => void;
}

export default function RequestDetail({
                                          transaction,
                                          onClose,
                                          onBack
                                      }: TransactionDetailProps) {
    // توابع کمکی برای رنگ و متن وضعیت
    const getStatusColor = (status: string) => {
        switch (status) {
            case "P": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "O": return "bg-green-100 text-green-800 border-green-200"
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "P": return <Hourglass className="w-4 h-4 text-yellow-500" />;
            case "O": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "C": return <XCircle className="w-4 h-4 text-red-500" />;
            case "E": return <AlertCircle className="w-4 h-4 text-gray-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    // فرمت‌بندی مبلغ
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("fa-IR").format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0">
            <div className=" w-full h-full max-w-none md:max-w-2xl md:h-[95vh] md:max-h-[95vh] bg-gray-100 shadow-xl rounded-none md:rounded-xl overflow-hidden flex flex-col">
                {/* هدر چسبیده به سقف بدون پدینگ */}
                <div className="bg-white border-b flex-shrink-0">
                    <div className="flex items-center justify-between p-3">
                        <h2 className="text-lg font-semibold text-gray-800">جزئیات درخواست</h2>
                        <div className="flex gap-1">
                            {onBack && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onBack}
                                    className="text-gray-500 hover:bg-gray-100 h-8 w-8"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-gray-500 hover:bg-gray-100 h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* محتوای اصلی */}
                <div className="flex-grow overflow-y-auto">
                    <div className="p-4 space-y-5">
                        {/* کارت اصلی اطلاعات درخواست */}
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-[#a85a7a]" />
                                        <span className="text-base font-medium text-gray-700">
                                            شناسه: {transaction.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(transaction.status)}
                                        <Badge className={cn("text-xs font-medium py-1 px-2", getStatusColor(transaction.status))}>
                                            {getStatusText(transaction.status)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex justify-center py-2">
                                    <div className="text-2xl font-bold text-[#a85a7a]">
                                        {formatAmount(transaction.amount)} ریال
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* اطلاعات پرداخت کننده - چیدمان افقی */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-[#a85a7a]" />
                                        <h3 className="text-sm font-medium text-gray-700">اطلاعات پرداخت کننده</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500">نام</p>
                                            <p className="text-sm font-medium text-gray-800">{transaction.payerTitle}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">شماره تماس</p>
                                            <p className="text-sm font-medium text-gray-800">{transaction.payerContact}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* تاریخ‌ها - چیدمان افقی */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-[#a85a7a]" />
                                        <h3 className="text-sm font-medium text-gray-700">تاریخ‌ها</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500">تاریخ ثبت</p>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-800">
                                                    {dayjs(transaction.createdOn).format("YYYY/MM/DD HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                        {transaction.expiredOn && (
                                            <div>
                                                <p className="text-xs text-gray-500">تاریخ انقضا</p>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {dayjs(transaction.expiredOn).format("YYYY/MM/DD HH:mm")}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* توضیحات */}
                        {transaction.desc && (
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-[#a85a7a]" />
                                        <h3 className="text-sm font-medium text-gray-700">توضیحات</h3>
                                    </div>
                                    <p className="text-sm text-gray-800">{transaction.desc}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* فوتر چسبیده به پایین بدون پدینگ */}
                <div className="bg-white border-t flex-shrink-0">
                    <div className="flex justify-end p-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-[#a85a7a] text-[#a85a7a] hover:bg-[#a85a7a] hover:text-white text-sm h-9"
                        >
                            بستن
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}