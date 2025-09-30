// components/accounts/AccountView.jsx
"use client";

import React from "react";
import { ImagePreview } from "@/components/common";
import AccountLimits from "./AccountLimits";
import { useSearchParams } from "next/navigation";
import PaymentResult from "@/app/buy-pack/PaymentResult";
import PackageBox from "./PackageBox";
import { useWallet } from "@/lib/hooks/useWallet";
import WalletInfoItem from "@/app/accounts/WalletInfoItem";
import WalletHeaderInfo from "@/app/accounts/WalletHeaderInfo";


const AccountView = ({ onEdit }) => {
    const {
        currentWallet,
    } = useWallet();

    const searchParams = useSearchParams();

    // بررسی وضعیت بازگشت از بانک
    const status = searchParams.get("status");
    const purseId = searchParams.get("purseId");
    const packageId = searchParams.get("packageId");
    const sessionId = searchParams.get("sessionId");
    const reference = searchParams.get("reference");
    const shortId = searchParams.get("shortId");

    // اگر وضعیت بازگشت از بانک وجود دارد، کامپوننت PaymentResult را نمایش بده
    if (status) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <PaymentResult
                    status={status}
                    purseId={purseId}
                    packageId={packageId}
                    sessionId={sessionId}
                    reference={reference}
                    shortId={shortId}
                />
            </div>
        );
    }

    // تابع کمکی برای فرمت کردن تاریخ
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    };

    return (
        <div className="space-y-6 pb-16">
             <WalletHeaderInfo/>
            <PackageBox />
            <WalletInfoItem />
            {currentWallet?.levelId && (
                <AccountLimits levelId={currentWallet.levelId} />
            )}
        </div>
    );
};

export default AccountView;