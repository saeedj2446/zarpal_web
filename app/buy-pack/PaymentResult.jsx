// components/accounts/buy-package/PaymentResult.jsx

"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentResult = ({ status, purseId, packageId, sessionId, reference, shortId }) => {
    const router = useRouter();

    // در محیط تست، نیازی به فراخوانی مجدد addPermission نداریم
    // چون در BankSimulation قبلاً فراخوانی شده است
    useEffect(() => {
        // فقط در محیط واقعی و اگر وضعیت موفقیت‌آمیز است، خرید بسته را انجام می‌دهیم
        if (status === "success" && purseId && packageId && sessionId && process.env.NODE_ENV !== 'development') {
            // در محیط واقعی، اینجا باید addPermission فراخوانی شود
            // اما در محیط تست، این مرحله قبلاً در BankSimulation انجام شده است
            console.log("Real environment: Permission should be applied by scheduler");
        }
    }, [status, purseId, packageId, sessionId]);

    const handleBackToAccounts = () => {
        router.push("/accounts");
    };

    const renderContent = () => {
        switch (status) {
            case "success":
                return (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">پرداخت موفقیت‌آمیز بود</h3>
                        <p className="text-gray-600 mb-4">
                            بسته شما با موفقیت فعال شد. می‌توانید به صفحه کیف‌های خود بازگردانید.
                        </p>
                        {reference && (
                            <p className="text-sm text-gray-500 mb-4">
                                کد پیگیری: {reference}
                            </p>
                        )}
                        {process.env.NODE_ENV === 'development' && shortId && (
                            <p className="text-sm text-blue-500 mb-4">
                                کد کوتاه CIo: {shortId}
                            </p>
                        )}
                        <Button onClick={handleBackToAccounts} className="bg-green-600 hover:bg-green-700">
                            بازگشت به کیف‌ها
                        </Button>
                    </div>
                );

            case "failure":
                return (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">پرداخت ناموفق بود</h3>
                        <p className="text-gray-600 mb-4">
                            متاسفانه پرداخت شما با خطا مواجه شد. لطفاً دوباره تلاش کنید.
                        </p>
                        <Button onClick={handleBackToAccounts} className="bg-red-600 hover:bg-red-700">
                            بازگشت به کیف‌ها
                        </Button>
                    </div>
                );

            case "cancel":
                return (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">پرداخت لغو شد</h3>
                        <p className="text-gray-600 mb-4">
                            شما پرداخت را لغو کردید. می‌توانید دوباره برای خرید بسته اقدام کنید.
                        </p>
                        <Button onClick={handleBackToAccounts} className="bg-yellow-600 hover:bg-yellow-700">
                            بازگشت به کیف‌ها
                        </Button>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">وضعیت نامشخص</h3>
                        <p className="text-gray-600 mb-4">
                            وضعیت پرداخت مشخص نیست. لطفاً با پشتیبانی تماس بگیرید.
                        </p>
                        <Button onClick={handleBackToAccounts} className="bg-gray-600 hover:bg-gray-700">
                            بازگشت به کیف‌ها
                        </Button>
                    </div>
                );
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mb-4">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">نتیجه پرداخت</CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default PaymentResult;