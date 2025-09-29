// components/common/WalletIcon.jsx
import React from 'react';
import {
    Coins,
    DollarSign,
    Bitcoin,
    Gem,
    CreditCard,
    Landmark,
    Diamond,
    Crown
} from 'lucide-react';

interface WalletIconProps {
    type?: string;      // نوع کیف (مثلاً 'IRI', 'gld')
    currency?: string;   // نوع ارز (مثلاً 'IRR', 'gld4Tst')
    className?: string;
}

export function WalletIcon({ type, currency, className = "w-6 h-6" }: WalletIconProps) {
    // تابع برای دریافت آیکون بر اساس type یا currency
    const getIcon = () => {
        // اگر type داده شده، بر اساس type تصمیم می‌گیریم
        if (type) {
            switch (type) {
                case 'IRI':
                    return <CreditCard className={className} />; // کارت برای کیف نقدی
                case 'gld':
                    return <Diamond className={className} />; // الماس برای کیف گرمی طلا
                case 'egld':
                    return <Crown className={className} />; // تاج برای کیف ارزی
                default:
                    return <Coins className={className} />;
            }
        }

        // اگر currency داده شده، بر اساس currency تصمیم می‌گیریم
        if (currency) {
            switch (currency) {
                case 'IRR':
                    return <DollarSign className={className} />; // علامت دلار برای ریال ایران
                case 'gld4Tst':
                case 'gldZrl':
                    return <Gem className={className} />; // جواهر برای طلا داخلی
                case 'egld4Tst':
                case 'egldZrl':
                    return <Bitcoin className={className} />; // بیت‌کوین برای طلا خارجی
                default:
                    return <Coins className={className} />;
            }
        }

        // اگر هیچ‌کدام داده نشده، آیکون پیش‌فرض
        return <Coins className={className} />;
    };

    // تابع برای دریافت رنگ بر اساس type یا currency
    const getColor = () => {
        // اگر type داده شده، بر اساس type تصمیم می‌گیریم
        if (type) {
            switch (type) {
                case 'IRI':
                    return 'text-blue-600'; // آبی برای کیف نقدی
                case 'gld':
                    return 'text-yellow-600'; // زرد برای کیف گرمی طلا
                case 'egld':
                    return 'text-purple-600'; // بنفش برای کیف ارزی
                default:
                    return 'text-gray-600';
            }
        }

        // اگر currency داده شده، بر اساس currency تصمیم می‌گیریم
        if (currency) {
            switch (currency) {
                case 'IRR':
                    return 'text-blue-600'; // آبی برای ریال ایران
                case 'gld4Tst':
                case 'gldZrl':
                    return 'text-yellow-600'; // زرد برای طلا داخلی
                case 'egld4Tst':
                case 'egldZrl':
                    return 'text-purple-600'; // بنفش برای طلا خارجی
                default:
                    return 'text-gray-600';
            }
        }

        // اگر هیچ‌کدام داده نشده، رنگ پیش‌فرض
        return 'text-gray-600';
    };

    return (
        <div className={`${getColor()}`}>
            {getIcon()}
        </div>
    );
}