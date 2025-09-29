// components/accounts/bank-simulation/BankSimulation.jsx

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/radix/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useWallet } from "@/lib/hooks/useWallet";

const BankSimulation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const { addPermissionAsync, updateCioStatus } = useWallet();

    // دریافت پارامترهای از URL
    const purseId = searchParams.get("purseId");
    const packageId = searchParams.get("packageId");
    const sessionId = searchParams.get("sessionId");
    const reference = searchParams.get("reference");
    const shortId = searchParams.get("shortId");

    const handlePaymentSuccess = async () => {
        setIsProcessing(true);
        try {
            // شبیه‌سازی تغییر وضعیت CIo به پرداخت شده
            if (shortId) {
                await updateCioStatus({ shortId, status: 'P' }); // 'P' برای پرداخت شده
            }

            // در محیط تست، مستقیماً مجوز را اعمال می‌کنیم
            if (process.env.NODE_ENV === 'development') {
                await addPermissionAsync({
                    purseId,
                    packageId: parseInt(packageId),
                    sessionId,
                });
            }

            // هدایت به صفحه accounts با پارامتر موفقیت
            router.push(`/accounts?status=success&purseId=${purseId}&packageId=${packageId}&sessionId=${sessionId}&reference=${reference}&shortId=${shortId}`);
        } catch (error) {
            console.error("Error in payment process:", error);
            // حتی در صورت خطا هم کاربر را به صفحه نتیجه هدایت می‌کنیم
            router.push(`/accounts?status=failure&purseId=${purseId}&packageId=${packageId}&sessionId=${sessionId}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentFailure = () => {
        router.push(`/accounts?status=failure&purseId=${purseId}&packageId=${packageId}&sessionId=${sessionId}`);
    };

    const handleCancel = () => {
        router.push(`/accounts?status=cancel&purseId=${purseId}&packageId=${packageId}&sessionId=${sessionId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">شبیه‌سازی درگاه بانکی</CardTitle>
                    <p className="text-gray-600">
                        لطفاً وضعیت پرداخت را انتخاب کنید
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">اطلاعات پرداخت:</p>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">شناسه کیف:</span> {purseId}</p>
                            <p><span className="font-medium">شناسه بسته:</span> {packageId}</p>
                            <p><span className="font-medium">شناسه جلسه:</span> {sessionId}</p>
                            {reference && <p><span className="font-medium">کد پیگیری:</span> {reference}</p>}
                            {shortId && <p><span className="font-medium">کد کوتاه:</span> {shortId}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handlePaymentSuccess}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    در حال پردازش...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    پرداخت موفق
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handlePaymentFailure}
                            disabled={isProcessing}
                            className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-5 h-5" />
                            شکست در پرداخت
                        </Button>

                        <Button
                            onClick={handleCancel}
                            disabled={isProcessing}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            انصراف از پرداخت
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BankSimulation;