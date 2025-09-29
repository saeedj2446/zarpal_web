"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Request from "@/app/requests/requests";
import { ArrowLeft, CreditCard, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWallet } from "@/lib/hooks/useWallet";

export default function Requestpage() {
    const { currentWallet = {}, setCurrentWalletValue } = useWallet(); // افزودن setCurrentWallet
    const { profile = {} } = useAuth();
    const { purseList = [] } = profile;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleWalletChange = (wallet: any) => {
        setCurrentWalletValue(wallet); // تغییر کیف فعلی
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex flex-1 flex-col bg-gray-100 font-['iransans-number'] ">
            <div className="bg-[#a85a7a] text-white  flex items-center justify-between p-3">
                <div className="flex items-center px-2 gap-3">
                    <CreditCard className="w-8 h-8" />
                </div>

                {/* دراپ‌دان انتخاب کیف پول */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex flex-1 items-center gap-2  hover:bg-white/20  py-2 rounded-lg transition-colors px-2"
                    >
                        <span className="flex-1 text-base max-w-[200px] px-2">
                            {currentWallet?.title || "انتخاب کیف پول"}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2  bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                            {purseList.length > 0 ? (
                                purseList.map((wallet: any) => (
                                    <button
                                        key={wallet.id}
                                        onClick={() => handleWalletChange(wallet)}
                                        className={`w-full text-right  py-3 hover:bg-gray-100 transition-colors px-4 ${
                                            currentWallet.id === wallet.id ? 'bg-[#a85a7a]/10 text-[#a85a7a]' : 'text-gray-700'
                                        }`}
                                    >
                                        {wallet.title}
                                    </button>
                                ))
                            ) : (
                                <div className=" py-3 text-gray-500 text-center">
                                    کیف پولی یافت نشد
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Link href="/" className="px-2 rounded-full hover:bg-white/20 flex items-center justify-center">

                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>
            <div className="flex flex-1 flex-col">
                <Request />
            </div>
        </div>
    );
}