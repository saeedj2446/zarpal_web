// app/accounts/account-management.tsx

"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import AccountSlider from "./account-slider";
import AccountForm from "./account-form";
import PackageSlider from "./package-slider";
import { useWallet } from "@/lib/hooks/useWallet";

export default function AccountManagementComponent() {
    const { currentWallet } = useWallet();
    const [isNewAccount, setIsNewAccount] = useState(false);
    const [newAccountId, setNewAccountId] = useState<string | null>(null);

    const handleCreateNewAccount = () => {
        setIsNewAccount(true);
        setNewAccountId(null);
    };

    const handleCancelNewAccount = () => {
        setIsNewAccount(false);
        setNewAccountId(null);
    };

    // پس از ایجاد حساب جدید، شناسه آن را تنظیم کن
    const handleAccountCreated = (accountId: string) => {
        setNewAccountId(accountId);
        setIsNewAccount(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between mb-6">
                <Link href="/profile" className="text-white">
                    <ArrowRight className="w-6 h-6" />
                </Link>
                <span className="text-lg font-medium">حسابهای من </span>
                <button
                    onClick={handleCreateNewAccount}
                    className="bg-white text-[#a85a7a] rounded-full p-2 hover:bg-gray-100 transition-colors"
                    aria-label="ایجاد حساب جدید"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Account Slider - فقط در حالت غیر از ایجاد حساب جدید نمایش داده می‌شود */}
            {!isNewAccount && (
                <div className="py-8">
                    <AccountSlider />
                </div>
            )}

            {/* Account Form */}
            <div className="max-w-[700px] mx-auto px-4">
                <AccountForm
                    isNewAccount={isNewAccount}
                    onCancelNewAccount={handleCancelNewAccount}
                    onAccountCreated={handleAccountCreated}
                />
            </div>
        </div>
    );
}