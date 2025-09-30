// components/accounts/PackageBox.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import {
    Calendar,
    Clock,
    Package,
    CreditCard,
    Plus,
    Star,
    AlertCircle,
    Hourglass,
    XCircle,
    MoreVertical,
    RefreshCw,
    X
} from "lucide-react";
import { Timer } from "@/components/common";
import { diffDate } from "@/lib/utils/utils";
import jMoment from "moment-jalaali";
import { useWallet } from "@/lib/hooks/useWallet";
import { toast } from "@/lib/hooks/use-toast";
import PackageSelector from "@/app/buy-pack/PackageSelector";

const PackageBox = ({  }) => {
    const {
        currentWallet,
        isAddingPermission,
        addPermissionAsync,
        getWaitPermission,
        isGettingWaitPermission,
        revokePermission,
        isRevokingPermission,
        refreshProfile,
        isRefreshingProfile,
        denyLandingPage,
        isDenyingLandingPage
    } = useWallet();

    // State برای مدیریت وضعیت خرید بسته
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [selectedPackageType, setSelectedPackageType] = useState(null); // 'active' یا 'reserve'
    const [hasPendingPayment, setHasPendingPayment] = useState(false); // وضعیت پرداخت معوقه
    const [pendingPaymentType, setPendingPaymentType] = useState(null); // 'landing', 'payment', 'expired', 'canceled', 'completed'
    const [pendingPaymentShortId, setPendingPaymentShortId] = useState(null); // شناسه پرداخت معلق
    const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false); // برای دیالوگ تأیید ابطال
    const [isProcessing, setIsProcessing] = useState(false); // برای مدیریت وضعیت پردازش
    const isMounted = useRef(true); // برای بررسی mount بودن کامپوننت
    const revokeDialogRef = useRef(null); // برای ارجاع به دیالوگ

    // تابع کمکی برای فرمت کردن تاریخ
    const formatDate = useCallback((dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    }, []);

    // تابع کمکی برای بررسی انقضای بسته
    const isPackageExpired = useCallback((pkg) => {
        if (!pkg || !pkg.usageEnd) return true;
        const endDate = new Date(pkg.usageEnd);
        // اضافه کردن یک روز به تاریخ پایان برای در نظر گرفتن کل روز آخر
        endDate.setDate(endDate.getDate() + 1);
        return endDate < new Date();
    }, []);

    // تابع برای بررسی پرداخت‌های معوقه
    const checkPendingPayment = useCallback(async () => {
        if (!currentWallet || !currentWallet.id) return;

        try {
            const result = await getWaitPermission({ purse: currentWallet.id });
            // اگر هیچ پرداختی در انتظار نباشد، خطای Item Not Found دریافت می‌کنیم (که در catch مدیریت می‌شود)

            // اگر مجوز رایگان باشد (reference خالی باشد)، نیازی به نمایش نیست
            if (!result.reference) {
                setHasPendingPayment(false);
                setPendingPaymentShortId(null);
                return;
            }

            // ذخیره شناسه پرداخت برای استفاده در انصراف
            setPendingPaymentShortId(result.shortId);

            // بررسی وضعیت درخواست پرداخت
            if (result.status === 'E' || result.status === 'C' || result.status === 'O') {
                // وضعیت منقضی شده، کنسل شده یا موفق - نمایش پیام تماس با پشتیبانی
                setHasPendingPayment(true);
                setPendingPaymentType(result.status === 'E' ? 'expired' : result.status === 'C' ? 'canceled' : result.status === 'F'?'failed':'completed');
            } else if (result.shortId) {
                // درخواست در مرحله لندینگ پیج - نمایش دکمه لندینگ پیج
                setHasPendingPayment(true);
                setPendingPaymentType('landing');
            } else if (result.paymentLink) {
                // درخواست در مرحله پرداخت - نمایش دکمه پرداخت
                setHasPendingPayment(true);
                setPendingPaymentType('payment');
            } else {
                // سایر حالات (خطا و ...) - نمایش پیام تماس با پشتیبانی
                setHasPendingPayment(true);
                setPendingPaymentType('error');
            }
        } catch (error) {
            // اگر خطا "Item Not Found" باشد، یعنی هیچ پرداختی در انتظار نیست
            if (error.code === 13 && error.data === "permission") {
                setHasPendingPayment(false);
                setPendingPaymentShortId(null);
            }
        }
    }, [currentWallet, getWaitPermission]);

    // تابع برای هندل کردن خرید بسته
    const handlePackagePurchase = useCallback(async (pkg) => {
        if (!currentWallet || !currentWallet.id) {
            toast({
                title: "خطا",
                description: "کیف انتخاب شده معتبر نیست.",
                variant: "destructive"
            });
            return;
        }

        try {
            const result = await addPermissionAsync({
                purseId: currentWallet.id,
                packageId: pkg.id,
            });

            setIsPackageModalOpen(false);

            // اگر بسته پولی است، وضعیت پرداخت معوقه را تنظیم می‌کنیم
            if (result.shortId) {
                setHasPendingPayment(true);
                setPendingPaymentShortId(result.shortId);
            }
        } catch (error) {
            throw error
        }
    }, [currentWallet, addPermissionAsync]);

    // تابع برای باز کردن مودال خرید بسته فعال
    const openActivePackageModal = useCallback(() => {
        setSelectedPackageType('active');
        setIsPackageModalOpen(true);
    }, []);

    // تابع برای باز کردن مودال خرید بسته رزرو
    const openReservePackageModal = useCallback(() => {
        setSelectedPackageType('reserve');
        setIsPackageModalOpen(true);
    }, []);

    // تابع برای هندل کردن ابطال بسته
    const handleRevokePackage = useCallback(async () => {
        if (!currentWallet || !currentWallet.id) {
            toast({
                title: "خطا",
                description: "کیف انتخاب شده معتبر نیست.",
                variant: "destructive"
            });
            setIsRevokeDialogOpen(false);
            return;
        }

        setIsProcessing(true);

        try {
            await revokePermission({
                purse: currentWallet.id
            });

            // نمایش پیام موفقیت
            if (isMounted.current) {
                toast({
                    title: "موفقیت",
                    description: "بسته با موفقیت ابطال شد.",
                    variant: "default"
                });
            }
        } catch (error) {
            console.error("Error in revoke package:", error);

            // نمایش پیام خطا
            if (isMounted.current) {
                throw error
            }
        } finally {
            if (isMounted.current) {
                setIsProcessing(false);
                setIsRevokeDialogOpen(false);
            }
        }
    }, [currentWallet, revokePermission]);

    // تابع برای ادامه پرداخت بسته‌های در انتظار
    const handleContinuePayment = useCallback(async () => {
        if (!currentWallet || !currentWallet.id) {
            toast({
                title: "خطا",
                description: "کیف انتخاب شده معتبر نیست.",
                variant: "destructive"
            });
            return;
        }

        try {
            const result = await getWaitPermission({ purse: currentWallet.id });

            // اگر مجوز رایگان باشد (reference خالی باشد)، نیازی به ادامه نیست
            if (!result.reference) {
                setHasPendingPayment(false);
                setPendingPaymentShortId(null);
                return;
            }

            // بررسی وضعیت درخواست پرداخت
            if (result.status === 'E' || result.status === 'C' || result.status === 'O') {
                // وضعیت منقضی شده، کنسل شده یا موفق - نمایش پیام تماس با پشتیبانی
                setPendingPaymentType(result.status === 'E' ? 'expired' : result.status === 'C' ? 'canceled' :result.status === 'failed' ? 'canceled': 'completed');
                return;
            }

            // اولویت با paymentLink (لینک مستقیم به درگاه پرداخت)
            if (result.paymentLink) {
                window.location.href = result.paymentLink;
            }
            // در غیر این صورت اگر shortId وجود داشته باشد، به لندینگ پیج هدایت می‌کنیم
            else if (result.shortId) {
                window.location.href = `/${result.shortId}`;
            }
            // در غیر این صورت، وضعیت پرداخت نامشخص است
            else {
                setPendingPaymentType('error');
            }
        } catch (error) {
            console.error("Error in continue payment:", error);

            // اگر خطا "Item Not Found" باشد، یعنی هیچ پرداختی در انتظار نیست
            if (error.code === 404 && error.message === "Item Not Found") {
                setHasPendingPayment(false);
                setPendingPaymentShortId(null);
            } else {
                setPendingPaymentType('error');
            }
        }
    }, [currentWallet, getWaitPermission]);

    // تابع برای انصراف از پرداخت
    const handleCancelPayment = useCallback(async () => {
        if (!pendingPaymentShortId) {
            toast({
                title: "خطا",
                description: "شناسه پرداخت یافت نشد.",
                variant: "destructive"
            });
            return;
        }

        try {
            await denyLandingPage({ shortId: pendingPaymentShortId });

            // نمایش پیام موفقیت
            toast({
                title: "موفقیت",
                description: "درخواست پرداخت با موفقیت لغو شد.",
                variant: "default"
            });

            // بروزرسانی وضعیت پرداخت‌های معلق
            await checkPendingPayment();
        } catch (error) {
            console.error("Error in cancel payment:", error);
            // خطا قبلاً در mutation مدیریت شده است
        }
    }, [pendingPaymentShortId, denyLandingPage, checkPendingPayment]);

    // useEffect برای بررسی پرداخت‌های معوقه هنگام ورود به صفحه
    useEffect(() => {
        checkPendingPayment();
    }, [checkPendingPayment]);

    // useEffect برای بررسی mount/unmount
    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    // useEffect برای مدیریت دیالوگ ابطال
    useEffect(() => {
        if (!isRevokeDialogOpen && revokeDialogRef.current) {
            // اطمینان از حذف هرگونه event listener یا state باقی‌مانده
            revokeDialogRef.current = null;
        }
    }, [isRevokeDialogOpen]);

    // بررسی وضعیت کیف
    const walletStatus = currentWallet?.status;
    const isWalletPending = walletStatus === 'C'; // کیف‌های در حال بررسی
    const isWalletExpired = walletStatus === 'E'; // کیف‌های منقضی شده (بسته منقضی شده)
    const isWalletActive = walletStatus === 'O'; // کیف‌های فعال

    // بررسی وضعیت بسته فعال
    const activePackage = currentWallet?.active;
    const hasActivePackage = activePackage && !isPackageExpired(activePackage);

    // بررسی بسته رزرو
    const reservePackage = currentWallet?.reserved;
    const hasReservePackage = !!reservePackage;

    // کامپوننت دیالوگ ابطال سفارشی
    const RevokeDialog = () => {
        if (!isRevokeDialogOpen) return null;

        const handleBackdropClick = (e) => {
            if (e.target === e.currentTarget) {
                setIsRevokeDialogOpen(false);
            }
        };

        return createPortal(
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={handleBackdropClick}
            >
                <div
                    ref={revokeDialogRef}
                    className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-red-600 mb-4">ابطال بسته فعال</h3>
                        <div className="text-sm text-gray-600 mb-6">
                            آیا از ابطال بسته فعال خود اطمینان دارید؟ با این کار:
                            <ul className="list-disc pr-5 mt-4">
                                <li className="pb-3">بسته فعال شما حذف خواهد شد.</li>
                                <li className="pb-3"> بسته رزرو جایگزین بسته فعلی می‌شود.</li>
                                <li className="font-bold pb-3">مبلغ پرداخت شده برای بسته عودت داده نخواهد شد.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                        <button
                            onClick={() => setIsRevokeDialogOpen(false)}
                            disabled={isProcessing}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            انصراف
                        </button>
                        <button
                            onClick={handleRevokePackage}
                            disabled={isProcessing || isRevokingPermission}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {isProcessing || isRevokingPermission ? "در حال ابطال..." : "ابطال بسته"}
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    // اگر کیف در حال بررسی یا منقضی شده است، کادر مربوطه را نمایش می‌دهیم
    if (isWalletPending) {
        return (
            <Card className="border border-gray-200">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                            <Hourglass className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">کیف شما در انتظار تایید است</h3>
                        <p className="text-gray-600 text-center max-w-md mb-6">
                            کیف شما در حال بررسی توسط تیم پشتیبانی است. پس از تایید، می‌توانید از کیف خود استفاده کنید.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded-full">
                            <AlertCircle className="w-4 h-4" />
                            این فرآیند ممکن است تا ۲۴ ساعت زمان ببرد
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isWalletExpired) {
        return (
            <Card className="border border-gray-200">
                <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h4 className="font-medium text-gray-700 mb-2">زمان بسته شما به پایان رسیده است</h4>
                        <p className="text-sm text-gray-500 text-center mb-4">
                            برای ادامه استفاده از خدمات، لطفاً بسته جدیدی خریداری کنید
                        </p>
                        <Button
                            onClick={openActivePackageModal}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            خرید بسته جدید
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // اگر کیف فعال است، بسته‌ها را نمایش می‌دهیم
    return (
        <>
            <Card className="border border-gray-200">
                <CardHeader className="pb-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-md font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#a85a7a]" />
                            بسته‌های کیف
                        </CardTitle>

                        {/* دکمه رفرش */}
                        <button
                            onClick={refreshProfile}
                            disabled={isRefreshingProfile}
                            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <RefreshCw className={`h-5 w-5 ${isRefreshingProfile ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* کادر بسته فعال */}
                    {hasActivePackage ? (
                        <div className="bg-white rounded-sm shadow-md overflow-hidden border border-green-100">
                            {/* هدر جدید با طراحی مدرن */}
                            <div
                                className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-1.5 rounded-lg">
                                        <Package className="h-5 w-5 text-white"/>
                                    </div>
                                    <h3 className="font-bold text-white text-lg">بسته فعال</h3>
                                </div>

                                {/* دکمه منوی کشویی با طراحی بهتر */}
                                {hasActivePackage && (
                                    <button
                                        onClick={() => setIsRevokeDialogOpen(true)}
                                        className="bg-white/20 hover:bg-white/30 transition-colors p-1.5 rounded-lg"
                                    >
                                        <MoreVertical className="h-5 w-5 text-white"/>
                                    </button>
                                )}
                            </div>

                            {/* محتوای کارت */}
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h4 className="font-bold text-base py-2 text-gray-800">{activePackage.packageTitle}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                activePackage.paymentType === 'F'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {activePackage.paymentType === 'F' ? (
                                                    <>
                                                        <Star className="w-3 h-3 mr-1"/>
                                                        رایگان
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-3 h-3 mr-1"/>
                                                        پرداخت شده
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* تایمر با طراحی بهتر */}
                                    <div className="bg-green-50 rounded-lg p-2 flex items-center justify-center">
                                        <Timer
                                            color="green"
                                            totalTime={diffDate(activePackage.usageStart, activePackage.usageEnd)}
                                            currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), activePackage.usageEnd)}
                                            size={40}
                                        />
                                    </div>
                                </div>

                                {/* اطلاعات بسته با کارت‌های کوچک */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Calendar className="w-5 h-5 text-green-600"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">تاریخ شروع</p>
                                            <p className="text-sm font-medium text-gray-800">{formatDate(activePackage.usageStart)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-red-100 p-2 rounded-lg">
                                            <Calendar className="w-5 h-5 text-red-600"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">تاریخ پایان</p>
                                            <p className="text-sm font-medium text-gray-800">{formatDate(activePackage.usageEnd)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Clock className="w-5 h-5 text-blue-600"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">تاریخ خرید</p>
                                            <p className="text-sm font-medium text-gray-800">{formatDate(activePackage.createdOn)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                            <div className="flex flex-col items-center justify-center py-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                    <Plus className="w-6 h-6 text-green-600"/>
                                </div>
                                <h4 className="font-medium text-gray-700 mb-2">بسته فعال ندارید</h4>
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    برای استفاده از خدمات، ابتدا باید یک بسته فعال خریداری کنید
                                </p>
                                <Button
                                    onClick={openActivePackageModal}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    خرید بسته فعال
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* کادر بسته رزرو */}
                    {hasReservePackage && (
                        <div className="bg-white rounded-sm shadow-md overflow-hidden border border-blue-100">
                            {/* هدر جدید با رنگ آبی */}
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-1.5 rounded-lg">
                                        <Package className="h-5 w-5 text-white"/>
                                    </div>
                                    <h3 className="font-bold text-white text-lg">بسته رزرو</h3>
                                </div>
                            </div>

                            {/* محتوای کارت */}
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h4 className="font-bold text-base py-2 text-gray-800">{reservePackage.packageTitle}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                reservePackage.paymentType === 'F'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-indigo-100 text-indigo-800'
                                            }`}>
                                                {reservePackage.paymentType === 'F' ? (
                                                    <>
                                                        <Star className="w-3 h-3 mr-1"/>
                                                        رایگان
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-3 h-3 mr-1"/>
                                                        پولی
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* آیکون وضعیت رزرو */}
                                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-center">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <Clock className="h-6 w-6 text-blue-600"/>
                                        </div>
                                    </div>
                                </div>

                                {/* اطلاعات بسته با کارت‌های کوچک */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Calendar className="w-5 h-5 text-blue-600"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">تاریخ خرید</p>
                                            <p className="text-sm font-medium text-gray-800">{formatDate(reservePackage.createdOn)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-indigo-600"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">نوع پرداخت</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {reservePackage.paymentType === 'F' ? 'رایگان' : 'پولی'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Package className="w-5 h-5 text-purple-600"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">شناسه بسته</p>
                                            <p className="text-sm font-medium text-gray-800">{reservePackage.packageId}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* کادر پرداخت در انتظار یا کادر خرید بسته جدید */}
                    {hasPendingPayment && !['expired', 'canceled', 'completed','failed'].includes(pendingPaymentType) ? (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex flex-col items-center justify-center py-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                                    <AlertCircle className="w-6 h-6 text-yellow-600"/>
                                </div>
                                <h4 className="font-medium text-gray-700 mb-2">شما پرداخت در انتظاری دارید</h4>
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    یک درخواست پرداخت برای شما ثبت شده که هنوز تکمیل نشده است.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                                    <Button
                                        onClick={handleContinuePayment}
                                        disabled={isGettingWaitPermission}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 flex-1"
                                    >
                                        <CreditCard className="w-4 h-4"/>
                                        {isGettingWaitPermission ? "در حال بررسی..." : "ادامه پرداخت"}
                                    </Button>

                                    <Button
                                        onClick={handleCancelPayment}
                                        disabled={isDenyingLandingPage}
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-1 flex-1"
                                    >
                                        {isDenyingLandingPage ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                در حال انصراف...
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-4 h-4" />
                                                انصراف از پرداخت
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* کادر خرید بسته جدید - فقط وقتی بسته فعال نداریم */}
                            {!hasActivePackage && (
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <div
                                            className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                                            <Star className="w-6 h-6 text-purple-600"/>
                                        </div>
                                        <h4 className="font-medium text-gray-700 mb-2">خرید بسته جدید</h4>
                                        <p className="text-sm text-gray-500 text-center mb-4">
                                            برای استفاده از خدمات، ابتدا باید یک بسته فعال خریداری کنید
                                        </p>
                                        <Button
                                            onClick={openActivePackageModal}
                                            className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            خرید بسته جدید
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* کادر خرید بسته رزرو - فقط وقتی بسته رزرو نداریم و بسته فعال داریم */}
                            {hasActivePackage && !hasReservePackage && (
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <div
                                            className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                            <Plus className="w-6 h-6 text-indigo-600"/>
                                        </div>
                                        <h4 className="font-medium text-gray-700 mb-2">بسته رزرو ندارید</h4>
                                        <p className="text-sm text-gray-500 text-center mb-4">
                                            با خرید بسته رزرو، می‌توانید بسته بعدی خود را از همین حالا رزرو کنید
                                        </p>
                                        <Button
                                            onClick={openReservePackageModal}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            خرید بسته رزرو
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* مودال انتخاب بسته */}
                    {isPackageModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold">
                                        {selectedPackageType === 'active' ? 'انتخاب بسته فعال' : 'انتخاب بسته رزرو'}
                                    </h2>
                                    <p className="text-gray-600">
                                        بسته مورد نظر خود را انتخاب کنید
                                    </p>
                                </div>
                                <PackageSelector
                                    purseId={currentWallet?.id}
                                    onPackageSelect={handlePackagePurchase}
                                    isLoading={isAddingPermission}
                                />
                                <button
                                    onClick={() => setIsPackageModalOpen(false)}
                                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    بستن
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* دیالوگ ابطال بسته سفارشی */}
            <RevokeDialog />
        </>
    );
};

export default PackageBox;