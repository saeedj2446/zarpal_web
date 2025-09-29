"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/radix/button";
import { FilterX } from "lucide-react";
import { Dto_filterReqi } from "@/lib/types";

import PriceModal from "./PriceModal";
import PriceFilterButton from "./PriceFilterButton";
import DateFilterButton from "./DateFilterButton";
import MultiSelectModal from "./MultiSelectModal";
import {DateModal} from "@/app/requests/filter-bar/DateModal";
import {useAuth} from "@/lib/hooks/useAuth";

type FilterSortOutput = {
    filter: Dto_filterReqi;
};

type Option = { label: string; value: string };

const statusOptions: Option[] = [
    { label: "منتظر پرداخت", value: "P" },
    { label: "موفق", value: "O" },
    { label: "لغو شده", value: "C" },
    { label: "منقضی شده", value: "E" },
];

const functionOptions: Option[] = [
    { label: "درخواست پرداخت", value: "CIo" },
    { label: "خرید طلا", value: "CI" },
    { label: "برداشت", value: "CO" },
    { label: "انتقال", value: "withdraw" },
];

export default function RequestFilterBarMobile({
                                                   onChange,
                                               }: {
    onChange: (out: FilterSortOutput) => void;
}) {
    const { profile = {} } = useAuth();
    const { purseList = [] } = profile;
    const [filter, setFilter] = useState<Dto_filterReqi>({});
    const filterBarRef = useRef<HTMLDivElement>(null);
    const activeFilterRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const lastActiveFilterRef = useRef<keyof Dto_filterReqi | null>(null);

    // State برای کنترل مودال‌ها
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const targetOptions: Option[] = purseList.map((purse) => ({
        label: purse.title,
        value: purse.id,
    }));

    const updateFilter = (key: keyof Dto_filterReqi, value: any) => {
        const newFilter = { ...filter, [key]: value };
        setFilter(newFilter);
        onChange({ filter: newFilter });

        // اضافه کردن این بخش برای مدیریت صحیح فیلترهای قیمت و تاریخ
        if (key === 'amountFrom' || key === 'amountTo') {
            lastActiveFilterRef.current = 'price';
        } else if (key === 'createdOnFrom' || key === 'createdOnTo') {
            lastActiveFilterRef.current = 'date';
        } else {
            lastActiveFilterRef.current = key;
        }
    };

    const removeFilter = (key: keyof Dto_filterReqi) => {
        const newFilter = { ...filter };
        delete newFilter[key];
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    const clearAllFilters = () => {
        setFilter({});
        onChange({ filter: {} });
        lastActiveFilterRef.current = null;
    };

    const getFilterLabel = (key: keyof Dto_filterReqi, value: any): string => {
        switch (key) {
            case "status":
                if (!Array.isArray(value) || value.length === 0) return "";
                const statusLabels = statusOptions
                    .filter(opt => value.includes(opt.value))
                    .map(opt => opt.label);
                return `وضعیت: ${statusLabels.join(", ")}`;
            case "function":
                if (!Array.isArray(value) || value.length === 0) return "";
                const functionLabels = functionOptions
                    .filter(opt => value.includes(opt.value))
                    .map(opt => opt.label);
                return `عملیات: ${functionLabels.join(", ")}`;
            case "target":
                if (!value) return "";
                const purse = targetOptions.find(opt => opt.value === value);
                return `کیف مقصد: ${purse?.label || value}`;
            case "amountFrom":
                return value ? `مبلغ از: ${value}` : "";
            case "amountTo":
                return value ? `مبلغ تا: ${value}` : "";
            case "createdOnFrom":
                return value ? `تاریخ از: ${value}` : "";
            case "createdOnTo":
                return value ? `تاریخ تا: ${value}` : "";
            default:
                return "";
        }
    };

    const isFilterActive = (key: keyof Dto_filterReqi): boolean => {
        const value = filter[key];
        if (value === undefined || value === null || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
    };

    // اسکرول به فیلتر فعال شده
    useEffect(() => {
        if (lastActiveFilterRef.current && filterBarRef.current) {
            // تنظیم scrollLeft به صفر برای شروع از ابتدا
            filterBarRef.current.scrollLeft = 0;

            // استفاده از setTimeout برای اطمینان از رندر کامل DOM
            setTimeout(() => {
                const activeFilterElement = activeFilterRefs.current[lastActiveFilterRef.current];
                if (activeFilterElement) {
                    activeFilterElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }, 100);
        }
    }, [filter]); // وابستگی به filter که با هر تغییر فیلتر اجرا می‌شود

    // تعریف آرایه فیلترها
    const filterItems = [
        {
            id: 'status',
            component: (
                <MultiSelectModal
                    key="status"
                    label="وضعیت"
                    options={statusOptions}
                    selected={filter.status || []}
                    onSelect={(v) => updateFilter("status", v)}
                    icon={<div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                    filterKey="status"
                    isActive={isFilterActive("status")}
                    activeFilter={getFilterLabel("status", filter.status)}
                    onRemove={removeFilter}
                />
            ),
            isActive: isFilterActive("status")
        },
        {
            id: 'function',
            component: (
                <MultiSelectModal
                    key="function"
                    label="عملیات"
                    options={functionOptions}
                    selected={filter.function || []}
                    onSelect={(v) => updateFilter("function", v)}
                    icon={<div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    filterKey="function"
                    isActive={isFilterActive("function")}
                    activeFilter={getFilterLabel("function", filter.function)}
                    onRemove={removeFilter}
                />
            ),
            isActive: isFilterActive("function")
        },
        {
            id: 'price',
            component: (
                <div key="price" ref={el => activeFilterRefs.current['price'] = el}>
                    <PriceFilterButton
                        isActive={isFilterActive("amountFrom") || isFilterActive("amountTo")}
                        activeFilter={`${getFilterLabel("amountFrom", filter.amountFrom)} ${getFilterLabel("amountTo", filter.amountTo)}`.trim()}
                        onClick={() => setIsPriceModalOpen(true)}
                        onRemove={() => {
                            removeFilter("amountFrom");
                            removeFilter("amountTo");
                        }}
                    />
                </div>
            ),
            isActive: isFilterActive("amountFrom") || isFilterActive("amountTo")
        },
        {
            id: 'date',
            component: (
                <div key="date" ref={el => activeFilterRefs.current['date'] = el}>
                    <DateFilterButton
                        isActive={isFilterActive("createdOnFrom") || isFilterActive("createdOnTo")}
                        activeFilter={`${getFilterLabel("createdOnFrom", filter.createdOnFrom)} ${getFilterLabel("createdOnTo", filter.createdOnTo)}`.trim()}
                        onClick={() => setIsDateModalOpen(true)}
                        onRemove={() => {
                            removeFilter("createdOnFrom");
                            removeFilter("createdOnTo");
                        }}
                    />
                </div>
            ),
            isActive: isFilterActive("createdOnFrom") || isFilterActive("createdOnTo")
        }
    ];

    // مرتب‌سازی فیلترها: ابتدا فعال‌ها، سپس غیرفعال‌ها
    const sortedFilterItems = [...filterItems].sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0;
    });

    // بررسی آیا فیلتر فعالی وجود دارد
    const hasActiveFilters = Object.keys(filter).some(key => isFilterActive(key as keyof Dto_filterReqi));

    return (
        <div className="w-full">
            <div ref={filterBarRef} className="flex gap-1 overflow-x-auto pb-2 px-1 scrollbar-hide">
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                    >
                        <FilterX className="!w-6 !h-6" />
                    </Button>
                )}

                {sortedFilterItems.map(item => item.component)}
            </div>

            {/* مودال قیمت */}
            <PriceModal
                isOpen={isPriceModalOpen}
                onClose={() => setIsPriceModalOpen(false)}
                onApply={(from, to) => {
                    // به‌روزرسانی هر دو فیلتر با هم
                    const newFilter = { ...filter };
                    if (from !== undefined) {
                        newFilter.amountFrom = from;
                    } else {
                        delete newFilter.amountFrom;
                    }
                    if (to !== undefined) {
                        newFilter.amountTo = to;
                    } else {
                        delete newFilter.amountTo;
                    }
                    setFilter(newFilter);
                    onChange({ filter: newFilter });
                    lastActiveFilterRef.current = 'price';
                }}
                onClear={() => {
                    const newFilter = { ...filter };
                    delete newFilter.amountFrom;
                    delete newFilter.amountTo;
                    setFilter(newFilter);
                    onChange({ filter: newFilter });
                }}
                amountFrom={filter.amountFrom}
                amountTo={filter.amountTo}
            />

            {/* مودال تاریخ */}
            <DateModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                onApply={(from, to) => {
                    // به‌روزرسانی هر دو فیلتر با هم
                    const newFilter = { ...filter };
                    if (from) {
                        newFilter.createdOnFrom = from;
                    } else {
                        delete newFilter.createdOnFrom;
                    }
                    if (to) {
                        newFilter.createdOnTo = to;
                    } else {
                        delete newFilter.createdOnTo;
                    }
                    setFilter(newFilter);
                    onChange({ filter: newFilter });
                    lastActiveFilterRef.current = 'date';
                }}
                onClear={() => {
                    const newFilter = { ...filter };
                    delete newFilter.createdOnFrom;
                    delete newFilter.createdOnTo;
                    setFilter(newFilter);
                    onChange({ filter: newFilter });
                }}
                dateFrom={filter.createdOnFrom || ""}
                dateTo={filter.createdOnTo || ""}
            />
        </div>
    );
}