// components/accounts/AccountLimits.jsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Check, X } from "lucide-react";

const AccountLimits = ({ level }) => {
    if (!level || !level.limitList) {
        return null;
    }

    // تابع برای تبدیل کد عملیات به عنوان
    const getFunctionTitle = (func) => {
        const functionMap = {
            'CI': 'شارژ',
            'CIo': 'شارژ توسط دیگران',
            'CO': 'برداشت',
            'T': 'انتقال'
        };
        return functionMap[func] || func;
    };

    // تابع برای تبدیل کد دوره به عنوان
    const getPeriodTitle = (period) => {
        const periodMap = {
            'Forb': 'غیرمجاز',
            'Trnx': 'به ازای هر تراکنش',
            'Daily': 'روزانه'
        };
        return periodMap[period] || period;
    };

    return (
        <Card className="border border-gray-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-md font-bold flex items-center gap-2">
                    محدودیت‌های سطح کیف
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {level.limitList.map((limit, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-800">{getFunctionTitle(limit.function)}</h4>
                                <div className="flex items-center">
                                    {limit.period === 'Forb' ? (
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                            <X className="w-4 h-4 text-red-600" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {limit.period === 'Forb' ? (
                                    <span className="text-red-600 font-medium">غیرمجاز</span>
                                ) : (
                                    <span>
                                        {limit.value} {getPeriodTitle(limit.period)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {level.feeList && level.feeList.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-3">کارمزدها:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {level.feeList.map((fee, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{getFunctionTitle(fee.function)}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            fee.side === 'C' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {fee.side === 'C' ? 'بدهکار' : 'بستانکار'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{fee.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AccountLimits;