"use client";

import { useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Dto_filterReqi } from "@/lib/types";
import { CheckIcon, Calendar, Check } from "lucide-react";
import DateSelector from "@/components/common/DateSelector";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/radix/button";

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

export default function RequestFilterBarDesktop({ onChange }: { onChange: (out: FilterSortOutput) => void }) {
    const [filter, setFilter] = useState<Dto_filterReqi>({});
    const { profile = {}, setCurrentPurse } = useAuth();
    const { purseList = [] } = profile;

    // State های موقت برای فیلترهای قیمت و تاریخ
    const [tempAmountFrom, setTempAmountFrom] = useState<number | undefined>(filter.amountFrom);
    const [tempAmountTo, setTempAmountTo] = useState<number | undefined>(filter.amountTo);
    const [tempDateFrom, setTempDateFrom] = useState<string | undefined>(filter.createdOnFrom);
    const [tempDateTo, setTempDateTo] = useState<string | undefined>(filter.createdOnTo);

    const toggleFilter = (key: keyof Dto_filterReqi, value: string) => {
        const current = filter[key] as string[] || [];
        let updated: string[];
        if (current.includes(value)) {
            updated = current.filter((v: string) => v !== value);
        } else {
            updated = [...current, value];
        }
        const newFilter = { ...filter, [key]: updated };
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    const updateFilterValue = (key: keyof Dto_filterReqi, value: any) => {
        const newFilter = { ...filter, [key]: value };
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    // اعمال فیلتر قیمت
    const applyPriceFilter = () => {
        const newFilter = { ...filter };
        if (tempAmountFrom !== undefined) {
            newFilter.amountFrom = tempAmountFrom;
        } else {
            delete newFilter.amountFrom;
        }
        if (tempAmountTo !== undefined) {
            newFilter.amountTo = tempAmountTo;
        } else {
            delete newFilter.amountTo;
        }
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    // پاک کردن فیلتر قیمت
    const clearPriceFilter = () => {
        setTempAmountFrom(undefined);
        setTempAmountTo(undefined);
        const newFilter = { ...filter };
        delete newFilter.amountFrom;
        delete newFilter.amountTo;
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    // اعمال فیلتر تاریخ
    const applyDateFilter = () => {
        const newFilter = { ...filter };
        if (tempDateFrom) {
            newFilter.createdOnFrom = tempDateFrom;
        } else {
            delete newFilter.createdOnFrom;
        }
        if (tempDateTo) {
            newFilter.createdOnTo = tempDateTo;
        } else {
            delete newFilter.createdOnTo;
        }
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    // پاک کردن فیلتر تاریخ
    const clearDateFilter = () => {
        setTempDateFrom(undefined);
        setTempDateTo(undefined);
        const newFilter = { ...filter };
        delete newFilter.createdOnFrom;
        delete newFilter.createdOnTo;
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    // انتخاب کیف جاری (تک انتخابی)
    const selectTargetPurse = (purseId: string) => {
        const newFilter = { ...filter, purse: purseId };
        setFilter(newFilter);
        onChange({ filter: newFilter });

        // تغییر کیف فعلی
        if (setCurrentPurse) {
            setCurrentPurse(purseId);
        }
    };

    return (
        <div className="hidden md:block bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-purple-100 min-w-[250px] max-w-[300px]">
            <div className="space-y-4">
                {/* وضعیت */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">وضعیت</h3>
                    <div className="space-y-2">
                        {statusOptions.map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                <Checkbox.Root
                                    checked={(filter.status || []).includes(opt.value)}
                                    onCheckedChange={() => toggleFilter("status", opt.value)}
                                    className="w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                >
                                    <Checkbox.Indicator className="flex items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-white" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <span className="text-gray-700 text-sm group-hover:text-purple-600 transition-colors">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* عملیات */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">عملیات</h3>
                    <div className="space-y-2">
                        {functionOptions.map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                <Checkbox.Root
                                    checked={(filter.function || []).includes(opt.value)}
                                    onCheckedChange={() => toggleFilter("function", opt.value)}
                                    className="w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                >
                                    <Checkbox.Indicator className="flex items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-white" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <span className="text-gray-700 text-sm group-hover:text-purple-600 transition-colors">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* مبلغ - با دکمه تایید */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">مبلغ</h3>
                    <div className="space-y-2">
                        <input
                            type="number"
                            placeholder="از"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={tempAmountFrom || ""}
                            onChange={(e) => setTempAmountFrom(e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <input
                            type="number"
                            placeholder="تا"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={tempAmountTo || ""}
                            onChange={(e) => setTempAmountTo(e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={clearPriceFilter}
                            >
                                پاک کردن
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                                onClick={applyPriceFilter}
                            >
                                اعمال فیلتر
                            </Button>
                        </div>
                    </div>
                </div>

                {/* تاریخ ثبت - با دکمه تایید */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">تاریخ ثبت</h3>
                    <div className="space-y-2">
                        <DateSelector
                            placeholder="از تاریخ"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={tempDateFrom}
                            onChange={(v) => setTempDateFrom(v)}
                            format="YYYY-MM-DD"
                        />
                        <DateSelector
                            placeholder="تا تاریخ"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={tempDateTo}
                            onChange={(v) => setTempDateTo(v)}
                            format="YYYY-MM-DD"
                        />
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={clearDateFilter}
                            >
                                پاک کردن
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                                onClick={applyDateFilter}
                            >
                                اعمال فیلتر
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}