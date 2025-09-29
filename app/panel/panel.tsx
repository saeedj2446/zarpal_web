// components/PanelForm.jsx
"use client";

import React, {useEffect, useRef, useState} from "react";
import { Button } from "@/components/radix/button";
import {Receipt, CreditCard, List, FileText, LogOut, ArrowLeft, Inbox} from "lucide-react";
import Link from "next/link";
import Request from "../requests/requests";
import { persistor } from "@/lib/store/store";
import { useAuth } from "@/lib/hooks/useAuth";
import WalletSelector from "@/app/public/WalletSelector";
import GoldRateBoard from "@/app/public/gold-rate-board";
import { cn } from "@/lib/utils/utils";
import AppHeader from "@/app/public/AppHeader";
import {useRouter} from "next/navigation";
import {useWallet} from "@/lib/hooks/useWallet";
import {Card, CardContent} from "@/components/radix/card";


export default function PanelForm() {
    const router = useRouter();
    const { sessionId, logout, profile = {} } = useAuth();
    const { currentWallet } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestHeight, setRequestHeight] = useState(0);
    const requestContainerRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        if (!sessionId) {
            router.replace("/login");
        }
    }, [sessionId, router]);

    // ذخیره ارتفاع فعلی لیست درخواست‌ها
    useEffect(() => {
        if (requestContainerRef.current && requestHeight === 0) {
            setRequestHeight(requestContainerRef.current.clientHeight);
        }
    }, [requestHeight]);



    // تابعی برای مدیریت وضعیت لودینگ
    const handleLoadingChange = (loading: boolean) => {
        setIsLoading(loading);
        // اگر در حال لودینگ هستیم و ارتفاع قبلی داریم، آن را حفظ می‌کنیم
        if (loading && requestContainerRef.current && requestHeight > 0) {
            requestContainerRef.current.style.minHeight = `${requestHeight}px`;
        }
    };

    const menuItems = [
        {
            title: "درخواست واریز",
            icon: <Receipt className="w-12 h-12 md:w-16 md:h-16" />,
            href: "/request-payment?method=link",
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            title: "واریز با بارکد",
            icon: <CreditCard className="w-12 h-12 md:w-16 md:h-16" />,
            href: "/request-payment?method=qr",
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            title: "واریز مستقیم",
            icon: <List className="w-12 h-12 md:w-16 md:h-16" />,
            href: "/request-payment?method=self",
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            title: "فرم پرداخت",
            icon: <FileText className="w-12 h-12 md:w-16 md:h-16" />,
            href: "/invoice",
            color: "bg-orange-500 hover:bg-orange-600",
        },
        {
            title: "درخواست ها",
            icon: <FileText className="w-12 h-12 md:w-16 md:h-16" />,
            href: "/requests",
            color: "bg-teal-500 hover:bg-teal-600",
        },
        {
            title: "انتقال طلا",
            icon: <FileText className="w-12 h-12 md:w-16 md:h-16" />,
            href: "/gold-delivery",
            color: "bg-yellow-500 hover:bg-yellow-600 text-white font-bold",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-['iransans-number']">
            {/* App Header */}
            <AppHeader
                showMenuButton={true}
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                isMenuOpen={isMenuOpen}
            />

            {/* Main Content */}
            <main className="pt-16 md:pt-16 pb-12">
                <div className="max-w-[1200px] mx-auto ">
                    {/* Wallet Section */}
                    <div className="h-[190px] mb-8">
                        <WalletSelector />
                    </div>

                    {/* Gold Rate Board (for mobile only) */}
                    {/*<div className="md:hidden mb-8">
                        <GoldRateBoard />
                    </div>*/}

                    {/* Quick Actions */}
                    <div className="flex flex-wrap justify-center gap-4 p-4 mb-8">
                        {menuItems.map((item, index) => (
                            <Link key={index} href={item.href}>
                                <Button
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2",
                                        `w-[90px] h-[90px] md:w-[98px] md:h-[98px] ${item.color} text-white 
                    rounded-xl shadow-lg transition-all duration-200
                    hover:shadow-xl hover:scale-105`
                                    )}
                                >
                                    {React.cloneElement(item.icon, {className: "w-12 h-12 md:w-16 md:h-16"})}
                                    <span className="text-xs font-medium text-center">{item.title}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Requests */}
                    <div className="flex flex-col flex-1 px-4 pb-6">
                        <div
                            ref={requestContainerRef}
                            className="min-h-[500px]"
                            style={{ minHeight: requestHeight > 0 ? `${requestHeight}px` : '500px' }}
                        >
                            <Request
                                showAllTBtn={true}
                                title={<div className="flex items-center justify-center ">
                                    <h2 className="text-sm font-bold text-gray-800">آخرین درخواست‌ها {currentWallet?.title}</h2>
                                </div>}
                                showSort={true}
                                showFilter={false}
                                maxPages={2}
                                onLoadingChange={handleLoadingChange}
                                ListEmptyComponent={
                                    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                                <Inbox className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">درخواستی ثبت نشده</h3>
                                            <p className="text-gray-600 text-center max-w-md mb-6">
                                                هنوز هیچ درخواست پرداختی برای این کیف ثبت نشده است.
                                            </p>
                                            <Button
                                                className="bg-[#a85a7a] hover:bg-[#96527a] text-white"
                                                onClick={() => router.push("/request-payment")}
                                            >
                                                ایجاد اولین درخواست پرداخت
                                            </Button>
                                        </CardContent>
                                    </Card>
                                }
                            />

                            {/* نمایش اسکلتون در حین لودینگ */}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}