// components/common/PersianDate.tsx

import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface PersianDateProps {
    value?: string; // تاریخ ورودی به میلادی با فرمت YYYY-MM-DD
    onChange?: (date: string | undefined) => void; // خروجی به میلادی با فرمت YYYY-MM-DD
    minDate?: string; // حداقل تاریخ به میلادی با فرمت YYYY-MM-DD
    maxDate?: string; // حداکثر تاریخ به میلادی با فرمت YYYY-MM-DD
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const PersianDate: React.FC<PersianDateProps> = ({
                                                     value,
                                                     onChange,
                                                     minDate,
                                                     maxDate,
                                                     placeholder = "تاریخ را انتخاب کنید",
                                                     disabled = false,
                                                     className
                                                 }) => {
    const [year, setYear] = useState<number | null>(null);
    const [month, setMonth] = useState<number | null>(null);
    const [day, setDay] = useState<number | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showPlaceholders, setShowPlaceholders] = useState(true);

    const yearRef = useRef<HTMLSelectElement>(null);
    const monthRef = useRef<HTMLSelectElement>(null);
    const dayRef = useRef<HTMLSelectElement>(null);

    // نام‌های ماه‌های شمسی
    const persianMonths = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];

    // تبدیل تاریخ میلادی به شمسی
    const gregorianToPersian = (dateStr: string): { year: number; month: number; day: number } | null => {
        if (!dateStr) return null;

        try {
            const [gy, gm, gd] = dateStr.split('-').map(Number);
            const gDate = new Date(gy, gm - 1, gd);

            // محاسبه سال شمسی
            let gy2 = gDate.getFullYear();
            let gy3 = gy2 + 1;
            let gDayOfYear = Math.floor((gDate.getTime() - new Date(gy2, 0, 1).getTime()) / (24 * 60 * 60 * 1000));

            let jy = gy2 - 621;
            let leap = jy % 4 === 3 && jy % 100 !== 99 && jy % 400 !== 399;
            let jDayOfYear = leap ? gDayOfYear + 80 : gDayOfYear + 79;

            if (jDayOfYear > leap ? 366 : 365) {
                jy++;
                jDayOfYear -= leap ? 366 : 365;
            }

            // محاسبه ماه و روز شمسی
            let jm = 1;
            let jd = jDayOfYear;

            while (jd > (jm <= 6 ? 31 : (jm <= 11 ? 30 : (leap ? 30 : 29)))) {
                jd -= jm <= 6 ? 31 : (jm <= 11 ? 30 : (leap ? 30 : 29));
                jm++;
            }

            return { year: jy, month: jm, day: jd };
        } catch (error) {
            console.error("Error converting date:", error);
            return null;
        }
    };

    // تبدیل تاریخ شمسی به میلادی
    const persianToGregorian = (jy: number, jm: number, jd: number): string | null => {
        try {
            // محاسبه سال کبیسه
            const leap = jy % 4 === 3 && jy % 100 !== 99 && jy % 400 !== 399;

            // محاسبه روز سال
            let jDayOfYear = 0;
            for (let m = 1; m < jm; m++) {
                jDayOfYear += m <= 6 ? 31 : (m <= 11 ? 30 : (leap ? 30 : 29));
            }
            jDayOfYear += jd;

            // محاسبه سال میلادی
            let gy = jy + 621;
            let gDayOfYear = leap ? jDayOfYear - 80 : jDayOfYear - 79;

            if (gDayOfYear > (leap ? 366 : 365)) {
                gy++;
                gDayOfYear -= leap ? 366 : 365;
            }

            // محاسبه تاریخ میلادی
            const gDate = new Date(gy, 0, 1);
            gDate.setDate(gDate.getDate() + gDayOfYear - 1);

            const year = gDate.getFullYear();
            const month = gDate.getMonth() + 1;
            const day = gDate.getDate();

            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error("Error converting date:", error);
            return null;
        }
    };

    // دریافت تعداد روزهای یک ماه شمسی
    const getDaysInMonth = (jy: number, jm: number): number => {
        // 6 ماه اول سال (فروردین تا شهریور) هر کدام 31 روز دارند
        if (jm <= 6) return 31;

        // 5 ماه بعدی (مهر تا بهمن) هر کدام 30 روز دارند
        if (jm <= 11) return 30;

        // ماه اسفند (ماه 12) - 29 روز در سال عادی و 30 روز در سال کبیسه
        const leap = jy % 4 === 3 && jy % 100 !== 99 && jy % 400 !== 399;
        return leap ? 30 : 29;
    };

    // محدوده سال‌ها
    const getYearRange = (): number[] => {
        const currentYear = new Date().getFullYear();
        let minYear = currentYear - 100;
        let maxYear = currentYear;

        // اگر minDate وجود داشته باشد و معتبر باشد
        if (minDate && typeof minDate === 'string' && minDate.includes('-')) {
            const minYearFromMinDate = parseInt(minDate.split('-')[0]);
            if (!isNaN(minYearFromMinDate)) {
                minYear = minYearFromMinDate;
            }
        }

        // اگر maxDate وجود داشته باشد و معتبر باشد
        if (maxDate && typeof maxDate === 'string' && maxDate.includes('-')) {
            const maxYearFromMaxDate = parseInt(maxDate.split('-')[0]);
            if (!isNaN(maxYearFromMaxDate)) {
                maxYear = maxYearFromMaxDate;
            }
        }

        // تبدیل به سال شمسی
        const minPersianYear = gregorianToPersian(`${minYear}-01-01`)?.year || 1300;
        const maxPersianYear = gregorianToPersian(`${maxYear}-12-31`)?.year || 1402;

        const years = [];
        for (let y = minPersianYear; y <= maxPersianYear; y++) {
            years.push(y);
        }

        return years.sort((a, b) => b - a); // مرتب‌سازی نزولی
    };

    // تابع کمکی برای اعتبارسنجی و تنظیم تاریخ
    const validateAndSetDate = (newDate: string | null) => {
        if (!newDate) return;

        // بررسی محدوده minDate
        if (minDate && newDate < minDate) {
            const minPersianDate = gregorianToPersian(minDate);
            if (minPersianDate) {
                setYear(minPersianDate.year);
                setMonth(minPersianDate.month);
                setDay(minPersianDate.day);
                onChange?.(minDate);
                return;
            }
        }

        // بررسی محدوده maxDate
        if (maxDate && newDate > maxDate) {
            const maxPersianDate = gregorianToPersian(maxDate);
            if (maxPersianDate) {
                setYear(maxPersianDate.year);
                setMonth(maxPersianDate.month);
                setDay(maxPersianDate.day);
                onChange?.(maxDate);
                return;
            }
        }

        // اگر تاریخ در محدوده مجاز بود
        onChange?.(newDate);
    };

    // به‌روزرسانی state‌ها با تغییر value
    useEffect(() => {
        if (value) {
            const persianDate = gregorianToPersian(value);
            if (persianDate) {
                setYear(persianDate.year);
                setMonth(persianDate.month);
                setDay(persianDate.day);
                setShowPlaceholders(false);
            }
        } else {
            setYear(null);
            setMonth(null);
            setDay(null);
            setShowPlaceholders(true);
        }
    }, [value]);

    // مدیریت تغییر سال
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value);
        setYear(newYear);
        setShowPlaceholders(false);

        if (month && day) {
            const newDate = persianToGregorian(newYear, month, day);
            validateAndSetDate(newDate);
        }
    };

    // مدیریت تغییر ماه
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(e.target.value);
        setMonth(newMonth);
        setShowPlaceholders(false);

        if (year && day) {
            // بررسی اینکه روز انتخابی در ماه جدید معتبر باشد
            const maxDay = getDaysInMonth(year, newMonth);
            const validDay = Math.min(day, maxDay);
            setDay(validDay);

            const newDate = persianToGregorian(year, newMonth, validDay);
            validateAndSetDate(newDate);
        }
    };

    // مدیریت تغییر روز
    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDay = parseInt(e.target.value);
        setDay(newDay);
        setShowPlaceholders(false);

        if (year && month) {
            const newDate = persianToGregorian(year, month, newDay);
            validateAndSetDate(newDate);
        }
    };

    // مدیریت فوکوس کامپوننت
    const handleFocus = () => {
        setIsFocused(true);
        if (showPlaceholders) {
            setShowPlaceholders(false);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!year && !month && !day) {
            setShowPlaceholders(true);
        }
    };

    // مدیریت کلیک روی کامپوننت
    const handleContainerClick = () => {
        if (showPlaceholders) {
            setShowPlaceholders(false);
            // فوکوس به اولین دراپ‌داون فعال
            if (!disabled && yearRef.current) {
                yearRef.current.focus();
            } else if (!disabled && monthRef.current) {
                monthRef.current.focus();
            } else if (!disabled && dayRef.current) {
                dayRef.current.focus();
            }
        }
    };

    const years = getYearRange();
    const days = year && month ? Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1) : [];

    return (
        <div
            dir={"ltr"}
            className={cn(
                "relative flex items-center w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            onClick={handleContainerClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={disabled ? -1 : 0}
        >
            <div className="flex w-full h-full pl-10">
                <div className="flex-1">
                    <select
                        ref={yearRef}
                        value={year || ""}
                        onChange={handleYearChange}
                        disabled={disabled}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            "w-full h-full border-0 bg-transparent text-center focus:ring-0 disabled:opacity-50 appearance-none",
                            showPlaceholders && "invisible"
                        )}
                    >
                        <option value="" disabled>سال</option>
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
/
                <div className="flex-1">
                    <select
                        ref={monthRef}
                        value={month || ""}
                        onChange={handleMonthChange}
                        disabled={disabled || !year}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            "w-full h-full border-0 bg-transparent text-center focus:ring-0 disabled:opacity-50 appearance-none",
                            showPlaceholders && "invisible"
                        )}
                    >
                        <option value="" disabled>ماه</option>
                        {persianMonths.map((name, index) => (
                            <option key={index + 1} value={index + 1}>{name}</option>
                        ))}
                    </select>
                </div>
/
                <div className="flex-1">
                    <select
                        ref={dayRef}
                        value={day || ""}
                        onChange={handleDayChange}
                        disabled={disabled || !year || !month}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            "w-full h-full border-0 bg-transparent text-center focus:ring-0 disabled:opacity-50 appearance-none",
                            showPlaceholders && "invisible"
                        )}
                    >
                        <option value="" disabled>روز</option>
                        {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {showPlaceholders && (
                <div className="absolute inset-0 flex items-center text-sm  pointer-events-none px-2 text-gray-500 truncate">
                    {placeholder}
                </div>
            )}

            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
            </div>
        </div>
    );
};

export default PersianDate;