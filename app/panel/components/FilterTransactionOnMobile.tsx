"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogOverlay } from "@radix-ui/react-dialog";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Dto_filterReqi } from "@/lib/types";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon, X, Calendar, Filter } from "lucide-react";
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

export default function FilterTransactionOnMobile({
                                                      onChange,
                                                  }: {
    onChange: (out: FilterSortOutput) => void;
}) {
    const [filter, setFilter] = useState<Dto_filterReqi>({});

    const updateFilter = (key: keyof Dto_filterReqi, value: any) => {
        const newFilter = { ...filter, [key]: value };
        setFilter(newFilter);
        onChange({ filter: newFilter });
    };

    const removeFilter = (key: keyof Dto_filterReqi) => {
        const newFilter = { ...filter };
        delete newFilter[key];
        setFilter(newFilter);
        onChange({ filter: newFilter });
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
                const target = targetOptions.find(opt => opt.value === value);
                return `کیف مقصد: ${target?.label || value}`;

            case "amountFrom":
            case "amountTo":
                const from = filter.amountFrom || "";
                const to = filter.amountTo || "";
                if (from || to) {
                    return `مبلغ: ${from ? `از ${from}` : ""}${from && to ? " " : ""}${to ? `تا ${to}` : ""}`;
                }
                return "";

            case "createdOnFrom":
            case "createdOnTo":
                const dateFrom = filter.createdOnFrom || "";
                const dateTo = filter.createdOnTo || "";
                if (dateFrom || dateTo) {
                    return `تاریخ: ${dateFrom ? `از ${dateFrom}` : ""}${dateFrom && dateTo ? " " : ""}${dateTo ? `تا ${dateTo}` : ""}`;
                }
                return "";

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

    const MultiSelectModal = ({
                                  label,
                                  options,
                                  selected,
                                  onSelect,
                                  icon,
                                  filterKey,
                              }: {
        label: string;
        options: Option[];
        selected: string[];
        onSelect: (v: string[]) => void;
        icon?: React.ReactNode;
        filterKey: keyof Dto_filterReqi;
    }) => {
        const [open, setOpen] = useState(false);
        const [tempSelected, setTempSelected] = useState<string[]>([...selected]);

        const toggle = (value: string) => {
            if (tempSelected.includes(value)) {
                setTempSelected(tempSelected.filter((s) => s !== value));
            } else {
                setTempSelected([...tempSelected, value]);
            }
        };

        const confirmSelection = () => {
            onSelect(tempSelected);
            setOpen(false);
        };

        const clearSelection = () => {
            setTempSelected([]);
        };

        // اگر این فیلتر فعال باشد، آن را به صورت تگ نمایش می‌دهیم
        const isActive = isFilterActive(filterKey);
        const activeFilter = isActive ? getFilterLabel(filterKey, filter[filterKey]) : "";

        if (isActive && activeFilter) {
            return (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-300 flex-shrink-0 h-12">
                    {icon}
                    <span className="text-sm truncate max-w-[150px]">{activeFilter}</span>
                    <button
                        onClick={() => removeFilter(filterKey)}
                        className="text-purple-500 hover:text-purple-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setOpen(true)}
                        className="text-purple-500 hover:text-purple-700"
                    >
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (val) setTempSelected([...selected]);
            }}>
                <DialogTrigger asChild>
                    <button className={clsx(
                        "flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-200 flex-shrink-0 h-12",
                        "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 text-sm",
                        selected.length > 0 && "bg-purple-50 text-purple-700 border-purple-300"
                    )}>
                        {icon}
                        <span className="truncate">{label}</span>
                        {selected.length > 0 && (
                            <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5">
                                {selected.length}
                            </span>
                        )}
                        <ChevronDownIcon className="w-4 h-4 ml-auto" />
                    </button>
                </DialogTrigger>

                <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

                <DialogContent
                    className={clsx(
                        "bg-white p-4 rounded-t-2xl shadow-xl z-50",
                        "fixed left-0 bottom-0 w-full max-h-[80vh] overflow-auto",
                        "sm:max-w-md sm:mx-auto sm:rounded-2xl sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[70vh]",
                        "transition-all duration-300"
                    )}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-base">{label}</h3>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex justify-between mb-3">
                        <button
                            onClick={clearSelection}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            پاک کردن همه
                        </button>
                        <span className="text-xs text-gray-500">
                            {tempSelected.length} مورد انتخاب شده
                        </span>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-auto">
                        {options.map((opt) => (
                            <label
                                key={opt.value}
                                className={clsx(
                                    "flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors",
                                    tempSelected.includes(opt.value)
                                        ? "bg-purple-50 border border-purple-200"
                                        : "hover:bg-gray-50"
                                )}
                            >
                                <Checkbox
                                    checked={tempSelected.includes(opt.value)}
                                    onCheckedChange={() => toggle(opt.value)}
                                    className="w-4 h-4 border rounded flex items-center justify-center"
                                >
                                    {tempSelected.includes(opt.value) && (
                                        <CheckIcon className="w-3 h-3 text-purple-600" />
                                    )}
                                </Checkbox>
                                <span className="flex-1 text-sm">{opt.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm"
                        >
                            انصراف
                        </button>
                        <button
                            className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors"
                            onClick={confirmSelection}
                        >
                            اعمال فیلتر
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    const RangeInput = ({
                            fromValue,
                            toValue,
                            onFromChange,
                            onToChange,
                            placeholderFrom,
                            placeholderTo,
                            icon,
                            filterKey,
                        }: {
        fromValue: number | undefined;
        toValue: number | undefined;
        onFromChange: (v: number | undefined) => void;
        onToChange: (v: number | undefined) => void;
        placeholderFrom: string;
        placeholderTo: string;
        icon: React.ReactNode;
        filterKey: keyof Dto_filterReqi;
    }) => {
        // اگر این فیلتر فعال باشد، آن را به صورت تگ نمایش می‌دهیم
        const isActive = isFilterActive(filterKey);
        const activeFilter = isActive ? getFilterLabel(filterKey, filter[filterKey]) : "";

        if (isActive && activeFilter) {
            return (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-300 flex-shrink-0 h-12">
                    {icon}
                    <span className="text-sm truncate max-w-[150px]">{activeFilter}</span>
                    <button
                        onClick={() => {
                            removeFilter("amountFrom");
                            removeFilter("amountTo");
                        }}
                        className="text-purple-500 hover:text-purple-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex flex-col flex-shrink-0 w-55">
                <div className="flex items-center gap-1 bg-white rounded-full border border-gray-300 px-3 py-3 h-12">
                    <input
                        type="number"
                        placeholder={placeholderFrom}
                        className="w-24 bg-transparent outline-none text-sm placeholder:text-gray-400"
                        value={fromValue || ""}
                        onChange={(e) =>
                            onFromChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                    />
                    <span className="text-gray-400 text-sm">-</span>
                    <input
                        type="number"
                        placeholder={placeholderTo}
                        className="w-24 bg-transparent outline-none text-sm placeholder:text-gray-400"
                        value={toValue || ""}
                        onChange={(e) =>
                            onToChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                    />
                </div>

            </div>
        );
    };

    const DateRangeInput = () => {
        // اگر این فیلتر فعال باشد، آن را به صورت تگ نمایش می‌دهیم
        const isActive = isFilterActive("createdOnFrom") || isFilterActive("createdOnTo");
        const activeFilter = isActive ? getFilterLabel("createdOnFrom", filter.createdOnFrom) : "";

        if (isActive && activeFilter) {
            return (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-300 flex-shrink-0 h-12">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm truncate max-w-[150px]">{activeFilter}</span>
                    <button
                        onClick={() => {
                            removeFilter("createdOnFrom");
                            removeFilter("createdOnTo");
                        }}
                        className="text-purple-500 hover:text-purple-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex flex-col flex-shrink-0 w-80">
                <div className="flex items-center gap-1 bg-white rounded-full border border-gray-300 px-3 py-3 h-12">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <DateSelector
                        placeholder="از تاریخ"
                        className="w-30 h-8 bg-transparent outline-none text-sm placeholder:text-gray-400"
                        value={filter.createdOnFrom}
                        clearable={true}
                        onChange={(v) => updateFilter("createdOnFrom", v)}
                        format="YYYY/MM/DD"
                    />
                    <span className="text-gray-400 text-sm">-</span>
                    <DateSelector
                        placeholder="تا تاریخ"
                        className="w-30 h-8 bg-transparent outline-none text-sm placeholder:text-gray-400"
                        value={filter.createdOnTo}
                        clearable={true}
                        onChange={(v) => updateFilter("createdOnTo", v)}
                        format="YYYY/MM/DD"
                    />
                </div>

            </div>
        );
    };

    // تعریف آرایه فیلترها با ترتیب دلخواه
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
                />
            ),
            isActive: isFilterActive("function")
        },
        {
            id: 'target',
            component: (
                <MultiSelectModal
                    key="target"
                    label="کیف مقصد"
                    options={targetOptions}
                    selected={filter.target ? [filter.target] : []}
                    onSelect={(v) => updateFilter("target", v[0] || undefined)}
                    icon={<div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                    filterKey="target"
                />
            ),
            isActive: isFilterActive("target")
        },
        {
            id: 'amount',
            component: (
                <RangeInput
                    key="amount"
                    fromValue={filter.amountFrom}
                    toValue={filter.amountTo}
                    onFromChange={(v) => updateFilter("amountFrom", v)}
                    onToChange={(v) => updateFilter("amountTo", v)}
                    placeholderFrom="مبلغ از "
                    placeholderTo="تا"
                    icon={<div className="h-4 text-gray-500">₿</div>}
                    filterKey="amountFrom"
                />
            ),
            isActive: isFilterActive("amountFrom") || isFilterActive("amountTo")
        },
        {
            id: 'date',
            component: <DateRangeInput key="date" />,
            isActive: isFilterActive("createdOnFrom") || isFilterActive("createdOnTo")
        }
    ];

    // مرتب‌سازی فیلترها: ابتدا فعال‌ها، سپس غیرفعال‌ها
    const sortedFilterItems = [...filterItems].sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0;
    });

    return (
        <div className="w-full">
           {/* <div className="flex items-center gap-1 mb-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <h2 className="font-medium text-gray-700 text-sm">فیلتر</h2>
            </div>*/}

            <div className="flex gap-1 overflow-x-auto pb-4 px-1 scrollbar-hide">
                {sortedFilterItems.map(item => item.component)}
            </div>
        </div>
    );
}