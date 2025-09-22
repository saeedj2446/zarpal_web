"use client";

import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Dto_filterReqi } from "@/lib/types";
import { CheckIcon, Calendar } from "lucide-react";
import DateSelector from "@/components/common/DateSelector";

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
    { label: "انتقال", value: "transfer" },
    { label: "واریز", value: "deposit" },
    { label: "برداشت", value: "withdraw" },
];

const targetOptions: Option[] = [
    { label: "کیف A", value: "1" },
    { label: "کیف B", value: "2" },
];

export default function FilterTransactionBarDesktop({ onChange }: { onChange: (out: FilterSortOutput) => void }) {
    const [filter, setFilter] = useState<Dto_filterReqi>({});

    const toggleFilter = (key: keyof Dto_filterReqi, value: string) => {
        const current = filter[key] || [];
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

    return (
        <div className="hidden md:block bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-purple-100 min-w-[250px] max-w-[300px]">
           {/* <h2 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                فیلتر تراکنش‌ها
            </h2>*/}

            <div className="space-y-4">
                {/* وضعیت */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">وضعیت</h3>
                    <div className="space-y-2">
                        {statusOptions.map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                <Checkbox
                                    checked={(filter.status || []).includes(opt.value)}
                                    onCheckedChange={() => toggleFilter("status", opt.value)}
                                    className="w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                >
                                    {(filter.status || []).includes(opt.value) && <CheckIcon className="w-3 h-3 text-white" />}
                                </Checkbox>
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
                                <Checkbox
                                    checked={(filter.function || []).includes(opt.value)}
                                    onCheckedChange={() => toggleFilter("function", opt.value)}
                                    className="w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                >
                                    {(filter.function || []).includes(opt.value) && <CheckIcon className="w-3 h-3 text-white" />}
                                </Checkbox>
                                <span className="text-gray-700 text-sm group-hover:text-purple-600 transition-colors">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* کیف مقصد */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">کیف مقصد</h3>
                    <div className="space-y-2">
                        {targetOptions.map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                <Checkbox
                                    checked={(filter.target ? [filter.target] : []).includes(opt.value)}
                                    onCheckedChange={() => updateFilterValue("target", filter.target === opt.value ? undefined : opt.value)}
                                    className="w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                >
                                    {filter.target === opt.value && <CheckIcon className="w-3 h-3 text-white" />}
                                </Checkbox>
                                <span className="text-gray-700 text-sm group-hover:text-purple-600 transition-colors">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* مبلغ */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">مبلغ</h3>
                    <div className="space-y-2">
                        <input
                            type="number"
                            placeholder="از"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={filter.amountFrom || ""}
                            onChange={(e) => updateFilterValue("amountFrom", e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <input
                            type="number"
                            placeholder="تا"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={filter.amountTo || ""}
                            onChange={(e) => updateFilterValue("amountTo", e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>
                </div>

                {/* تاریخ ثبت */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-50">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">تاریخ ثبت</h3>
                    <div className="space-y-2">
                        <DateSelector
                            placeholder="از تاریخ"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={filter.createdOnFrom}
                            onChange={(v) => updateFilterValue("createdOnFrom", v)}
                            format="YYYY/MM/DD"
                        />
                        <DateSelector
                            placeholder="تا تاریخ"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                            value={filter.createdOnTo}
                            onChange={(v) => updateFilterValue("createdOnTo", v)}
                            format="YYYY/MM/DD"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}