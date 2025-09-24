"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import {
    Edit2,
    MapPin,
    Phone,
    Building2,
    FileText,
    Package,
    CreditCard,
    TrendingUp,
    Calendar,
    Clock,
    Plus,
    Star,
    Edit,
    AlertCircle,
    Hourglass,
    XCircle
} from "lucide-react";
import { ImagePreview, Timer } from "@/components/common";
import { diffDate } from "@/lib/utils/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/radix/dialog";
import PackageSlider from "@/app/accounts/package-slider";
import AccountLimits from "./AccountLimits";
import jMoment from "moment-jalaali";

const AccountView = ({ account, onEdit, onPackagePurchase }) => {
    // تابع کمکی برای فرمت کردن تاریخ
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    };

    // تابع کمکی برای بررسی انقضای بسته
    const isPackageExpired = (pkg) => {
        if (!pkg) return true;
        const endDate = new Date(pkg.usageEnd);
        return endDate < new Date();
    };

    // بررسی وضعیت کیف
    const walletStatus = account?.status;
    const isWalletActive = walletStatus === 'O'; // کیف‌های فعال
    const isWalletPending = walletStatus === 'C'; // کیف‌های در حال بررسی
    const isWalletExpired = walletStatus === 'E'; // کیف‌های منقضی شده (بسته منقضی شده)

    // بررسی وضعیت بسته فعال
    const hasActivePackage = account?.active && !isPackageExpired(account.active);
    const activePackage = account?.active;
    const isFreePackage = activePackage?.paymentType === 'F';
    const isExpired = account?.active && isPackageExpired(account.active);

    // تابع کمکی برای نمایش وضعیت کیف
    const renderWalletStatus = () => {
        switch (walletStatus) {
            case 'O':
                return (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        فعال
                    </div>
                );
            case 'C':
                return (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <Hourglass className="w-3 h-3" />
                        در حال بررسی
                    </div>
                );
            case 'E':
                return (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        <XCircle className="w-3 h-3" />
                        منقضی شده
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="bg-white shadow-lg overflow-hidden">
            <CardHeader className="pb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-center">
                        {account?.title || "حساب جدید"}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="p-2 hover:bg-gray-100"
                    >
                        <Edit
                            style={{ width: "24px", height: "24px" }}
                            className="text-gray-600"
                        />
                    </Button>
                </div>
                {renderWalletStatus()}
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* لوگو */}
                    <div className="flex-shrink-0">
                        {account?.iconId ? (
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <ImagePreview
                                    key={account?.iconId}
                                    fileId={account?.iconId}
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                                {/* <ImageIcon className="w-12 h-12 text-gray-400" />*/}
                            </div>
                        )}
                    </div>

                    {/* اطلاعات حساب */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    account?.status === 'O' ? 'bg-green-100 text-green-800' :
                                        account?.status === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                            account?.status === 'E' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                }`}>
                                    {account?.status === 'O' ? 'فعال' :
                                        account?.status === 'C' ? 'در حال بررسی' :
                                            account?.status === 'E' ? 'منقضی شده' :
                                                'تایید شده'}
                                </span>
                                <span className="text-sm text-gray-500">شناسه: {account?.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">
                                    {account?.currencyLabel || "ریال ایران"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">
                                    {account?.contact || "شماره همراه"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">
                                    {account?.provinceLabel && account?.cityLabel ? `${account.provinceLabel} ، ${account.cityLabel}` : "مکان"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">
                                    {account?.address || "آدرس"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* بخش‌های اضافی */}
                <div className="mt-8 space-y-6">
                    {/* بخش بسته‌های کیف */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#a85a7a]" />
                                بسته‌های کیف
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* کادر وضعیت کیف برای کیف‌های در حال بررسی */}
                            {isWalletPending && (
                                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
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
                                </div>
                            )}

                            {/* بخش بسته‌ها برای کیف‌های فعال و منقضی شده */}
                            {(isWalletActive || isWalletExpired) && (
                                <>
                                    {isWalletExpired && (
                                        // پیام منقضی شدن بسته برای کیف‌های با وضعیت E
                                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                                    <Clock className="w-6 h-6 text-red-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-700 mb-2">زمان بسته شما به پایان رسیده است</h4>
                                                <p className="text-sm text-gray-500 text-center mb-4">
                                                    برای ادامه استفاده از خدمات، لطفاً بسته جدیدی خریداری کنید
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isExpired && !isWalletExpired ? (
                                        // بسته فعال منقضی شده (برای کیف‌های فعال)
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                                    <Clock className="w-6 h-6 text-red-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-700 mb-2">زمان بسته رایگان شما پایان یافته</h4>
                                                <p className="text-sm text-gray-500 text-center mb-4">
                                                    برای ادامه استفاده از خدمات، لطفاً بسته جدیدی خریداری کنید
                                                </p>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                                                            خرید بسته جدید
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>انتخاب بسته جدید</DialogTitle>
                                                            <DialogDescription>
                                                                بسته مورد نظر خود را انتخاب کنید
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <PackageSlider onPackageSelect={onPackagePurchase} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ) : hasActivePackage ? (
                                        // بسته فعال معتبر
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                                        <span className="text-white text-sm font-bold">فعال</span>
                                                    </div>
                                                    <h4 className="font-bold text-lg">{activePackage.packageTitle}</h4>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                    {activePackage.paymentType === 'F' ? 'رایگان' : 'پرداخت شده'}
                                                </span>
                                            </div>
                                            <Timer
                                                color={'green'}
                                                totalTime={diffDate(activePackage.usageStart, activePackage.usageEnd)}
                                                currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), activePackage.usageEnd)}
                                                size={40}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-gray-700">شروع: {formatDate(activePackage.usageStart)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-gray-700">پایان: {formatDate(activePackage.usageEnd)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-gray-700">تاریخ خرید: {formatDate(activePackage.createdOn)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // بدون بسته فعال
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                                    <Plus className="w-6 h-6 text-green-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-700 mb-2">بسته فعال ندارید</h4>
                                                <p className="text-sm text-gray-500 text-center mb-4">
                                                    برای استفاده از خدمات، ابتدا باید یک بسته فعال خریداری کنید
                                                </p>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                                                            خرید بسته فعال
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>انتخاب بسته فعال</DialogTitle>
                                                            <DialogDescription>
                                                                بسته مورد نظر خود را انتخاب کنید
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <PackageSlider onPackageSelect={onPackagePurchase} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    )}

                                    {/* کادر بسته رزرو یا خرید بسته جدید (برای بسته‌های رایگان) */}
                                    {hasActivePackage && (
                                        isFreePackage ? (
                                            // نمایش کادر خرید بسته جدید برای بسته‌های رایگان
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex flex-col items-center justify-center py-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                                        <Star className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <h4 className="font-medium text-gray-700 mb-2">امکانات بیشتر با خرید بسته</h4>
                                                    <p className="text-sm text-gray-500 text-center mb-4">
                                                        با خرید بسته‌های پولی، از امکانات ویژه و سقفهای پرداخت بالاتر بهره‌مند شوید
                                                    </p>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                                خرید بسته جدید
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>انتخاب بسته جدید</DialogTitle>
                                                                <DialogDescription>
                                                                    بسته مورد نظر خود را انتخاب کنید
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <PackageSlider onPackageSelect={onPackagePurchase} />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        ) : (
                                            // نمایش کادر بسته رزرو برای بسته‌های پولی
                                            account?.reserve ? (
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                                <span className="text-white text-sm font-bold">رزرو</span>
                                                            </div>
                                                            <h4 className="font-bold text-lg">{account.reserve.packageTitle}</h4>
                                                        </div>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                            {account.reserve.paymentType === 'F' ? 'رایگان' : 'پرداخت شده'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-600" />
                                                            <span className="text-sm text-gray-700">شروع: {formatDate(account.reserve.usageStart)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-600" />
                                                            <span className="text-sm text-gray-700">پایان: {formatDate(account.reserve.usageEnd)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-blue-600" />
                                                            <span className="text-sm text-gray-700">تاریخ خرید: {formatDate(account.reserve.createdOn)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                                                    <div className="flex flex-col items-center justify-center py-4">
                                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                                            <Plus className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <h4 className="font-medium text-gray-700 mb-2">بسته رزرو ندارید</h4>
                                                        <p className="text-sm text-gray-500 text-center mb-4">
                                                            با خرید بسته رزرو، می‌توانید بسته بعدی خود را از همین حالا رزرو کنید
                                                        </p>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                                    خرید بسته رزرو
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>انتخاب بسته رزرو</DialogTitle>
                                                                    <DialogDescription>
                                                                        بسته مورد نظر خود را برای رزرو انتخاب کنید
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <PackageSlider onPackageSelect={onPackagePurchase} />
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* بخش مشخصات کیف */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#a85a7a]" />
                                مشخصات کیف
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">شناسه کیف</p>
                                    <p className="font-medium">{account?.id || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">تاریخ ایجاد</p>
                                    <p className="font-medium">{account?.createdOn ? formatDate(account.createdOn) : "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">وضعیت</p>
                                    <p className={`font-medium ${
                                        account?.status === 'O' ? 'text-green-600' :
                                            account?.status === 'C' ? 'text-yellow-600' :
                                                account?.status === 'E' ? 'text-red-600' :
                                                    'text-blue-600'
                                    }`}>
                                        {account?.status === 'O' ? 'فعال' :
                                            account?.status === 'C' ? 'در حال بررسی' :
                                                account?.status === 'E' ? 'منقضی شده' :
                                                    'تایید شده'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">سطح کیف</p>
                                    <p className="font-medium">{account?.level?.title || "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* بخش گزارش کلی تراکنش‌ها */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#a85a7a]" />
                                گزارش کلی تراکنش‌ها
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-blue-700">مجموع تراکنش‌ها</p>
                                    <p className="text-xl font-bold text-blue-900">{account?.totalRequests || "0"}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-green-700">تراکنش‌های موفق</p>
                                    <p className="text-xl font-bold text-green-900">{account?.successfulRequests || "0"}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-red-700">تراکنش‌های ناموفق</p>
                                    <p className="text-xl font-bold text-red-900">{account?.failedRequests || "0"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* بخش محدودیت‌ها */}
                    <AccountLimits level={account?.level} />
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountView;