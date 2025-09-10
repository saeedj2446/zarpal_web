"use client";
import React from "react";
import DatePicker, { DatePickerProps, DateObject } from "react-multi-date-picker";

// calendars & locales
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";

interface DateSelectorProps
    extends Omit<DatePickerProps, "calendar" | "locale" | "value" | "onChange"> {
    lang?: "fa" | "en" | "ar";
    className?: string;
    value?: string; // میلادی ISO مثل "2025-09-07"
    onChange?: (val: string | null) => void; // خروجی میلادی ISO
}

const DateSelector: React.FC<DateSelectorProps> = ({
                                                       lang = "fa",
                                                       className = "",
                                                       value,
                                                       onChange,
                                                       ...props
                                                   }) => {
    const getCalendarConfig = () => {
        switch (lang) {
            case "fa":
                return { calendar: persian, locale: persian_fa };
            case "ar":
                return { calendar: arabic, locale: arabic_ar };
            default:
                return { calendar: gregorian, locale: gregorian_en };
        }
    };

    const { calendar, locale } = getCalendarConfig();

    // تابع برای تبدیل تاریخ ISO به DateObject با در نظر گرفتن زمان محلی
    const parseISODate = (isoDate: string) => {
        // اضافه کردن زمان به عنوان نیمه‌شب در زمان محلی
        const localDate = new Date(isoDate + 'T00:00:00');
        return new DateObject({
            year: localDate.getFullYear(),
            month: localDate.getMonth() + 1,
            day: localDate.getDate(),
            calendar: gregorian,
            locale: gregorian_en
        });
    };

    // تابع برای تبدیل DateObject به تاریخ ISO
    const convertToISO = (dateObj: DateObject) => {
        const gregorianDate = dateObj.convert(gregorian);
        const date = new Date(
            gregorianDate.year,
            gregorianDate.month - 1,
            gregorianDate.day
        );

        // فرمت کردن تاریخ به صورت YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    return (
        <DatePicker
            {...props}
            calendar={calendar}
            locale={locale}
            inputClass={`w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
            containerClassName="w-full"
            calendarPosition="bottom-right"
            // نمایش مقدار اولیه با در نظر گرفتن زمان محلی
            value={
                value
                    ? parseISODate(value).convert(calendar)
                    : null
            }
            // خروجی: همیشه میلادی ISO با در نظر گرفتن زمان محلی
            onChange={(dateObj) => {
                if (!dateObj) {
                    onChange?.(null);
                    return;
                }

                const isoDate = convertToISO(dateObj as DateObject);
                onChange?.(isoDate);
            }}
        />
    );
};

export default DateSelector;