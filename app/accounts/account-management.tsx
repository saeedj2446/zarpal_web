"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import AccountSlider from "./account-slider";
import AccountForm from "./account-form";
import PackageSlider from "./package-slider";
import { setCurrentWallet } from "@/lib/store/slices/walletSlice";
import { useWallet } from "@/lib/hooks/useWallet";

export default function AccountManagementComponent() {
    const { currentWallet } = useWallet();
    const [selectedAccount, setSelectedAccount] = useState(currentWallet);
    const [isNewAccount, setIsNewAccount] = useState(false);

    const handleAccountSelect = (account) => {
        setIsNewAccount(false);
        setSelectedAccount(account);
    };

    const handleCreateNewAccount = () => {
        setIsNewAccount(true);
        setSelectedAccount(null);
    };

    const handleCancelNewAccount = () => {
        // بازگشت به حساب قبلی
        setIsNewAccount(false);
        setSelectedAccount(currentWallet);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between mb-6">
                <Link href="/profile" className="text-white">
                    <ArrowRight className="w-6 h-6" />
                </Link>
                <span className="text-lg font-medium">مدیریت حساب</span>
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
                    <AccountSlider onChange={handleAccountSelect} />
                </div>
            )}

            {/* Account Form */}
            <div className="max-w-[700px] mx-auto px-4">
                <AccountForm
                    selectedAccount={selectedAccount}
                    isNewAccount={isNewAccount}
                    onCancelNewAccount={handleCancelNewAccount}
                />
            </div>
        </div>
    );
}