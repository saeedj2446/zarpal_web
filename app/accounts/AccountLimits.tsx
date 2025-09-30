// components/accounts/AccountLimits.jsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Check, X } from "lucide-react";
import {WalletLevel} from "@/lib/local-data/wallet-level";


const AccountLimits = ({ levelId }) => {

    // پیدا کردن سطح کیف با استفاده از levelId
    const level = WalletLevel.find(l => l.id === levelId);

    if (!level || !level.limitList) {
        return null;
    }

    return (
        <Card className="border border-gray-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-md font-bold flex items-center gap-2">
                    محدودیت‌های سطح کیف: {level.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {level.limitList.map((limit, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-800">{limit.functionLabel}</h4>
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
                                    <span className="text-red-600 font-medium">{limit.periodLabel}</span>
                                ) : (
                                    <span>
                                        {limit.value.toLocaleString('fa-IR')} {limit.periodLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountLimits;