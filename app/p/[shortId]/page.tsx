"use client";

import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { Badge } from "@/components/radix/badge";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useWallet } from "@/lib/hooks/useWallet";
import jMoment from "moment-jalaali";
import {formatNumber} from "@/lib/utils/utils";

export default function PaymentPage() {
    const [paymentData, setPaymentData] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const { useLandingPageQuery, acceptLandingPage } = useWallet();
    const params = useParams();
    const urlShortId = params?.shortId as string;
    const shortId = decodeURIComponent(urlShortId);

    const { data, isLoading, error } = useLandingPageQuery({ shortId });
    const {forceFetchLandingPage}=useWallet();
    // Map وضعیت پرداخت به UI
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'W':
                return {
                    icon: <Clock className="w-8 h-8 text-yellow-500" />,
                    text: "در انتظار پرداخت",
                    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                    bgColor: "bg-yellow-50"
                };
            case 'P':
                return {
                    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
                    text: "پرداخت موفق",
                    color: "bg-green-100 text-green-800 border-green-200",
                    bgColor: "bg-green-50"
                };
            case 'I':
                return {
                    icon: <XCircle className="w-8 h-8 text-red-500" />,
                    text: "پرداخت توسط دریافت کننده لغو شده",
                    color: "bg-red-100 text-red-800 border-red-200",
                    bgColor: "bg-red-50"
                };
            case 'C':
                return {
                    icon: <XCircle className="w-8 h-8 text-red-500" />,
                    text: "پرداخت توسط پرداخت کننده لغو شده",
                    color: "bg-red-100 text-red-800 border-red-200",
                    bgColor: "bg-red-50"
                };
            case 'E':
                return {
                    icon: <AlertCircle className="w-8 h-8 text-gray-500" />,
                    text: "پرداخت منقضی شده",
                    color: "bg-gray-100 text-gray-800 border-gray-200",
                    bgColor: "bg-gray-50"
                };
            case 'F':
                return {
                    icon: <AlertCircle className="w-8 h-8 text-gray-500" />,
                    text: "پرداخت با خطا مواجه شده",
                    color: "bg-gray-100 text-gray-800 border-gray-200",
                    bgColor: "bg-gray-50"
                };
            default:
                return {
                    icon: <Clock className="w-8 h-8 text-yellow-500" />,
                    text: "در انتظار پرداخت",
                    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                    bgColor: "bg-yellow-50"
                };
        }
    };

    // جایگزین کردن داده واقعی
    useEffect(() => {
        if (data) {
            setPaymentData({
                id: shortId,
                businessName: data.purse.title,
                businessPhone: "۰۲۱-۳۷۳۳۵۴۴",
                businessTelegram: "@Delvinbiuty",
                businessInstagram: "@DelVinSalon",
                businessAddress: "تهران - انتهای خیابان ولیعصر - پلاک ۷۴ واحد ۱۸",
                amount: data.amount.toLocaleString(),
                description: data.desc,
                customerName: data.payerTitle,
                customerPhone: data.payerContact,
                ...data,
            });
        }
    }, [data]);

    // تایمر براساس expiredOn
    useEffect(() => {
        if (!paymentData?.expiredOn || paymentData.status !== "W") return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expire = new Date(paymentData.expiredOn).getTime();
            const diff = expire - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [paymentData]);

    const handleAccept = async () => {
        try {
            const res = await acceptLandingPage({ shortId });
            if (res?.paymentLink) window.location.href = res.paymentLink;
        } catch (err) {
            console.error("Accept failed:", err);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-red-500 gap-4">
                <div>خطا در بارگیری اطلاعات</div>
                <Button
                    onClick={() => forceFetchLandingPage({ shortId })}
                    className="bg-[#a85a7a] hover:bg-[#96527a] text-white"
                >
                </Button>
            </div>
        );
    }


    if (isLoading || !paymentData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                در حال بارگذاری...
            </div>
        );
    }

    const statusInfo = getStatusInfo(paymentData.status);

    return (
        <div className="min-h-screen bg-gray-100 ">
            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 text-center relative">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                        <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm transform -skew-x-12"></div>
                    </div>
                    <span className="text-lg font-medium">
                         مدیریت سرمایه و پرداخت زرپال
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1000px] mx-auto p-4">
                {/* Status Badge */}
                <div className={`${statusInfo.bgColor} rounded-lg p-4 mb-6 text-center`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        {statusInfo.icon}
                        <Badge className={`${statusInfo.color} text-lg px-4 py-2`}>
                            {statusInfo.text}
                        </Badge>
                    </div>
                </div>

                {/* Business Info Card */}
                <Card className="mb-6 bg-white shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
                                <span className="text-green-600 font-bold text-sm">Delvan</span>
                            </div>
                            <div className="flex-1 text-right">
                                <h2 className="text-base font-bold mb-2">{paymentData.businessName}</h2>
                                {/*<p className="text-gray-600 text-sm mb-3">
                                    زیبایی را با ما تجربه کنید
                                </p>*/}
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex justify-between items-center py-1">
                                <span className="font-medium">تلفن :</span>
                                <span>{paymentData.businessPhone}</span>
                            </div>
                           {/* <div className="flex justify-between items-center py-1">
                                <span className="font-medium">تلگرام :</span>
                                <span>{paymentData.businessTelegram}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="font-medium">اینستاگرام :</span>
                                <span>{paymentData.businessInstagram}</span>
                            </div>*/}
                            <div className="flex justify-between items-start py-1">
                                <span className="font-medium">آدرس :</span>
                                <span className="text-right max-w-[200px]">{paymentData.businessAddress}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Details */}
                <div className="bg-gray-200 rounded-lg p-4 space-y-4">

                    <div className="flex text-sm gap-2">
                        <div className="text-sm font-normal">تاریخ:</div>
                        {new Date(paymentData.createdOn).toLocaleDateString("fa-IR")}
                        {" "}{" "}
                        {new Date(paymentData.createdOn).toLocaleTimeString("fa-IR")}
                    </div>
                    <h3 className="text-sm pb-4">
                        شماره پیگیری : {paymentData.reqiId}
                    </h3>
                    <h3 className="font-medium text-lg font-bold text-gray-700 pb-1">
                        بابت : {paymentData.description}
                    </h3>


                    {/* Image Placeholders */}
                    {/* <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
                        <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
                        <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
                    </div>*/}

                    {/* Payment Button or Status */}
                    {paymentData.status === "W" ? (
                        <Button
                            onClick={handleAccept}
                            className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-6 text-xl font-bold mb-4 rounded-lg h-[100px]"
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-1">
                                    پرداخت {formatNumber(paymentData.amount)} ریال
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-normal">از طریق</span>
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo"
                                        width={80}
                                        height={0}
                                        style={{height: "auto"}}
                                    />
                                </div>
                            </div>
                        </Button>
                    ) : (
                        <div
                            className="w-full bg-gray-300 text-gray-600 py-6 text-xl font-bold mb-4 rounded-lg text-center">
                            <div className="text-2xl mb-1">{formatNumber(paymentData.amount)} ریال</div>
                            <div className="text-sm font-normal">{statusInfo.text}</div>
                        </div>
                    )}

                    {/* Timer - only for waiting payments */}
                    {paymentData.status === "W" && (
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="text-center text-gray-600 mb-3 font-medium">قابل پرداخت تا</div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-gray-100 rounded-lg p-2">
                                    <div className="text-2xl font-bold text-gray-800">{timeLeft.days}</div>
                                    <div className="text-xs text-gray-600">روز</div>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-2">
                                    <div className="text-2xl font-bold text-gray-800">{timeLeft.hours}</div>
                                    <div className="text-xs text-gray-600">ساعت</div>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-2">
                                    <div className="text-2xl font-bold text-gray-800">{timeLeft.minutes}</div>
                                    <div className="text-xs text-gray-600">دقیقه</div>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-2">
                                    <div className="text-2xl font-bold text-gray-800">{timeLeft.seconds}</div>
                                    <div className="text-xs text-gray-600">ثانیه</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payer Info */}
                    <div className="bg-gray-300 rounded-lg p-4">
                        <div className="text-center text-sm text-gray-700 mb-3 font-medium">
                            پرداخت کننده محترم : {paymentData.customerName} {paymentData.customerPhone}
                        </div>
                        <p className="text-xs text-gray-600 text-center leading-relaxed">
                            از طریق لمس این لینک میتوانید کلیه فاکتورها و پرداخت های انجام شده
                            در پلتفرم زرپال را مشاهده و مدیریت فرمایید.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
