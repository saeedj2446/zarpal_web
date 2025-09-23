"use client";

import { useState } from "react";
import { Button } from "@/components/radix/button";
import { X, GripVertical } from "lucide-react";

type SortOption = {
    label: string;
    value: string;
    type: "numeric" | "text" | "datetime" | "location";
};

type SortItem = { orderBy: string; direction?: "A" | "D" };

// فیلدها
const sortOptions: SortOption[] = [
    { label: "وضعیت", value: "status", type: "text" },
    { label: "مبلغ", value: "amount", type: "numeric" },
    { label: "زمان ثبت", value: "createdOn", type: "datetime" },
    { label: "عملیات", value: "function", type: "text" },
    { label: "شماره همراه", value: "payerContact", type: "text" },
    { label: "شناسه", value: "id", type: "numeric" },
    { label: "کیف های من", value: "purse", type: "text" },
    { label: "کیف های مقصد", value: "target", type: "text" },


    /* { label: "شرح درخواست", value: "desc", type: "text" },
     { label: "کارمزد بستانکار", value: "debitFee", type: "numeric" },
     { label: "کارمزد بدهکار", value: "creditFee", type: "numeric" },
     { label: "عنوان پرداخت کننده", value: "payerTitle", type: "text" },
     { label: "زمان انقضای درخواست", value: "expiredOn", type: "datetime" },
     { label: "محل وقوع درخواست X", value: "locX", type: "location" },
     { label: "محل وقوع درخواست Y", value: "locY", type: "location" },*/
];

// هوک برای جابجایی آیتم‌ها در آرایه
function useArrayReorder<T>(items: T[], setItems: (items: T[]) => void) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newItems = [...items];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);

        setItems(newItems);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return {
        draggedIndex,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}

export default function RequestSortBar({
                                           onChange,
                                       }: {
    onChange: (value: SortItem[]) => void;
}) {
    const [activeSorts, setActiveSorts] = useState<SortItem[]>([]);

    // استفاده از هوک برای جابجایی آیتم‌ها
    const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } = useArrayReorder(
        activeSorts,
        (newSorts) => {
            setActiveSorts(newSorts);
            onChange(newSorts);
        }
    );

    const handleSelect = (option: SortOption, direction?: "A" | "D") => {
        const dir = direction || "A";

        // اگه قبلا انتخاب شده بود دوباره اضافه نکن
        if (
            activeSorts.find(
                (s) => s.orderBy === option.value && s.direction === dir
            )
        )
            return;

        const newSorts = [...activeSorts, { orderBy: option.value, direction: dir }];
        setActiveSorts(newSorts);
        onChange(newSorts);
    };

    const handleClear = (option: SortOption, direction?: "A" | "D") => {
        const dir = direction || "A";
        const newSorts = activeSorts.filter(
            (s) => !(s.orderBy === option.value && s.direction === dir)
        );
        setActiveSorts(newSorts);
        onChange(newSorts);
    };

    // دریافت لیبل برای نمایش
    const getSortLabel = (sort: SortItem) => {
        const option = sortOptions.find(opt => opt.value === sort.orderBy);
        if (!option) return "";

        if (option.type === "text") {
            return option.label;
        }

        return sort.direction === "A"
            ? `کمترین ${option.label}`
            : `بیشترین ${option.label}`;
    };

    // ایجاد لیست ترکیبی از دکمه‌های فعال و غیرفعال
    const renderAllButtons = () => {
        // ابتدا دکمه‌های فعال را نمایش می‌دهیم
        const activeButtons = activeSorts.map((sort, index) => {
            const option = sortOptions.find(opt => opt.value === sort.orderBy);
            if (!option) return null;

            return (
                <div
                    key={`active-${sort.orderBy}-${sort.direction}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm cursor-move flex-shrink-0
                        ${draggedIndex === index ? "opacity-50" : ""}
                        bg-blue-50 text-blue-800 border border-blue-300 transition-all duration-200`}
                >
                    <GripVertical className="w-3 h-3 text-blue-500" />
                    <span>{getSortLabel(sort)}</span>
                    <X
                        className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleClear(option, sort.direction)}
                    />
                </div>
            );
        });

        // سپس دکمه‌های غیرفعال را نمایش می‌دهیم
        const inactiveButtons = sortOptions.map((opt) => {
            if (["numeric", "datetime", "location"].includes(opt.type)) {
                return (
                    <div key={`inactive-${opt.value}`} className="flex gap-1 flex-shrink-0">
                        {["asc", "desc"].map((dir) => {
                            const label =
                                dir === "asc" ? `کمترین ${opt.label}` : `بیشترین ${opt.label}`;
                            const isSelected = activeSorts.some(
                                (s) =>
                                    s.orderBy === opt.value &&
                                    s.direction === (dir === "asc" ? "A" : "D")
                            );

                            // اگر دکمه انتخاب شده باشد، از نمایش آن صرف نظر می‌کنیم
                            if (isSelected) return null;

                            return (
                                <Button
                                    key={dir}
                                    size="sm"
                                    variant="default"
                                    className={`px-3 py-1.5 rounded-full text-sm flex-shrink-0 whitespace-nowrap
                                        bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200`}
                                    onClick={() => handleSelect(opt, dir === "asc" ? "A" : "D")}
                                >
                                    <span>{label}</span>
                                </Button>
                            );
                        })}
                    </div>
                );
            } else {
                const isSelected = activeSorts.some((s) => s.orderBy === opt.value);

                // اگر دکمه انتخاب شده باشد، از نمایش آن صرف نظر می‌کنیم
                if (isSelected) return null;

                return (
                    <Button
                        key={`inactive-${opt.value}`}
                        size="sm"
                        variant="default"
                        className={`px-3 py-1.5 rounded-full text-sm flex-shrink-0 whitespace-nowrap
                            bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200`}
                        onClick={() => handleSelect(opt, "A")}
                    >
                        <span>{opt.label}</span>
                    </Button>
                );
            }
        });

        return [...activeButtons, ...inactiveButtons];
    };

    return (
        <div className="w-full">
            <div className="mb-2 text-sm">مرتب سازی بر اساس</div>

            {/* دکمه‌های انتخاب سورت با اسکرول */}
            <div className="w-full overflow-x-auto pb-2 max-w-2xl">
                <div className="flex gap-2 py-2 min-w-max">
                    {renderAllButtons()}
                </div>
            </div>
        </div>
    );
}