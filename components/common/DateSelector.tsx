"use client";
import React from "react";
import DatePicker, { DatePickerProps, DateObject } from "react-multi-date-picker";
import { X } from "lucide-react";

// calendars & locales
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import jMoment from "moment-jalaali";

interface DateSelectorProps
    extends Omit<DatePickerProps, "calendar" | "locale" | "value" | "onChange"> {
    lang?: "fa" | "en" | "ar";
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (val: string | null) => void;
    clearable?: boolean;
    format?: string; // ⬅️ فرمت خروجی از بیرون
}

const DateSelector: React.FC<DateSelectorProps> = ({
                                                       lang = "fa",
                                                       className = "",
                                                       placeholder = "",
                                                       value,
                                                       onChange,
                                                       clearable = true,
                                                       format = "YYYY-MM-DD", // ⬅️ مقدار پیش‌فرض
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

    // مقدار اولیه
    const parseISODate = (isoDate: string) => {
        const localDate = new Date(isoDate);
        return new DateObject({
            year: localDate.getFullYear(),
            month: localDate.getMonth() + 1,
            day: localDate.getDate(),
            hour: localDate.getHours(),
            minute: localDate.getMinutes(),
            second: localDate.getSeconds(),
            calendar: gregorian,
            locale: gregorian_en,
        });
    };

    // تابع تبدیل خروجی بر اساس format
    const convertToFormatted = (dateObj: DateObject) => {
        const gregorianDate = dateObj.convert(gregorian);
        const date = new Date(
            gregorianDate.year,
            gregorianDate.month - 1,
            gregorianDate.day,
            gregorianDate.hour || 0,
            gregorianDate.minute || 0,
            gregorianDate.second || 0
        );
        return jMoment(date).format(format); // ⬅️ فرمت داینامیک
    };

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange?.(null);
    };

    return (
        <div className="relative w-full">
            <DatePicker
                {...props}
                calendar={calendar}
                locale={locale}
                placeholder={placeholder}
                inputClass={`w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
                containerClassName="w-full z-[99999]"
                calendarPosition="bottom-right"
                value={value ? parseISODate(value).convert(calendar) : null}
                onChange={(dateObj) => {
                    if (!dateObj) {
                        onChange?.(null);
                        return;
                    }
                    const formatted = convertToFormatted(dateObj as DateObject);

                    onChange?.(formatted);
                }}
            />
            {value && clearable && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default DateSelector;
