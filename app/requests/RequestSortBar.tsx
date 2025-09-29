"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/radix/button";
import { X, GripVertical, ArrowUp, ArrowDown, FilterX } from "lucide-react";

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
];

export default function RequestSortBar({
                                           onChange,
                                       }: {
    onChange: (value: SortItem[]) => void;
}) {
    const [activeSorts, setActiveSorts] = useState<SortItem[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [lastToggledSort, setLastToggledSort] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

    useEffect(() => {
        setIsClient(true);
    }, []);

    // جابجایی آیتم‌ها در آرایه
    const reorderItems = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;

        const newItems = [...activeSorts];
        const [removed] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, removed);

        setActiveSorts(newItems);
        onChange(newItems);
    };

    // شروع درگ (برای موبایل و دسکتاپ)
    const handleDragStart = (index: number, clientX: number, clientY: number) => {
        setDraggedIndex(index);
        setTouchStartX(clientX);
        setTouchStartY(clientY);

        // غیرفعال کردن اسکرول در موبایل
        if (containerRef.current) {
            containerRef.current.style.overflow = 'hidden';
        }
    };

    // حین درگ (برای موبایل)
    const handleTouchMove = (e: React.TouchEvent) => {
        if (draggedIndex === null) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        // اگر حرکت عمودی بیشتر از افقی بود، اسکرول مجاز باشد
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }

        e.preventDefault(); // جلوگیری از اسکرول

        // پیدا کردن ایندکس عنصر زیر انگشت
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!elementBelow) return;

        const dropTarget = elementBelow.closest('[data-sort-index]');
        if (!dropTarget) return;

        const dropIndex = parseInt(dropTarget.getAttribute('data-sort-index') || '-1');
        if (dropIndex >= 0 && dropIndex !== draggedIndex) {
            reorderItems(draggedIndex, dropIndex);
            setDraggedIndex(dropIndex);
        }
    };

    // پایان درگ
    const handleDragEnd = () => {
        setDraggedIndex(null);

        // فعال کردن مجدد اسکرول
        if (containerRef.current) {
            containerRef.current.style.overflow = 'auto';
        }
    };

    const handleToggleSort = (option: SortOption) => {
        const existingSortIndex = activeSorts.findIndex(s => s.orderBy === option.value);

        if (existingSortIndex >= 0) {
            // اگر قبلا انتخاب شده بود، جهت را تغییر بده
            const existingSort = activeSorts[existingSortIndex];
            const newDirection = existingSort.direction === "A" ? "D" : "A";

            const newSorts = [...activeSorts];
            newSorts[existingSortIndex] = { ...existingSort, direction: newDirection };

            setActiveSorts(newSorts);
            onChange(newSorts);
            setLastToggledSort(option.value);
        } else {
            // اضافه کردن سورت جدید با جهت صعودی
            const newSorts = [...activeSorts, { orderBy: option.value, direction: "A" }];
            setActiveSorts(newSorts);
            onChange(newSorts);
            setLastToggledSort(option.value);
        }
    };

    const handleClear = (option: SortOption) => {
        const newSorts = activeSorts.filter(s => s.orderBy !== option.value);
        setActiveSorts(newSorts);
        onChange(newSorts);
    };

    // حذف همه سورت‌ها
    const handleClearAll = () => {
        setActiveSorts([]);
        onChange([]);
    };

    // دریافت لیبل برای نمایش
    const getSortLabel = (sort: SortItem) => {
        const option = sortOptions.find(opt => opt.value === sort.orderBy);
        return option ? option.label : "";
    };

    // اسکرول به دکمه سورت انتخاب شده
    useEffect(() => {
        if (lastToggledSort && containerRef.current && isClient) {
            const button = buttonRefs.current[lastToggledSort];
            if (button) {
                button.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
            setLastToggledSort(null);
        }
    }, [lastToggledSort, isClient]);

    // ایجاد لیست ترکیبی از دکمه‌های فعال و غیرفعال
    const renderAllButtons = () => {
        // ابتدا دکمه‌های فعال را نمایش می‌دهیم
        const activeButtons = activeSorts.map((sort, index) => {
            const option = sortOptions.find(opt => opt.value === sort.orderBy);
            if (!option) return null;

            return (
                <div
                    key={`active-${sort.orderBy}-${sort.direction}`}
                    data-sort-value={sort.orderBy}
                    ref={(el) => {
                        if (isClient) {
                            buttonRefs.current[sort.orderBy] = el;
                        }
                    }}
                    data-sort-index={index}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm flex-shrink-0
                        ${draggedIndex === index ? "opacity-50 shadow-lg scale-105" : ""}
                        bg-blue-50 text-blue-800 border border-blue-300 transition-all duration-200`}
                    onClick={() => handleToggleSort(option)}
                >
                    {/* آیکون درگ با پدینگ اضافه برای کار با انگشت‌های بزرگ */}
                    <div
                        style={{ cursor: "move" }}
                        className="pl-2 -ml-2 cursor-move touch-none"
                        draggable
                        onDragStart={(e) => handleDragStart(index, e.clientX, e.clientY)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedIndex !== null && draggedIndex !== index) {
                                reorderItems(draggedIndex, index);
                                setDraggedIndex(index);
                            }
                        }}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => {
                            const touch = e.touches[0];
                            handleDragStart(index, touch.clientX, touch.clientY);
                        }}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleDragEnd}
                    >
                        <GripVertical className="w-4 h-4 text-blue-500" />
                    </div>

                    <div className="flex items-center gap-1">
                        {sort.direction === "A"
                            ? <ArrowUp className="w-4 h-4" />
                            : <ArrowDown className="w-4 h-4" />
                        }
                        <span>{getSortLabel(sort)}</span>
                    </div>
                    <X
                        className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClear(option);
                        }}
                    />
                </div>
            );
        });

        // سپس دکمه‌های غیرفعال را نمایش می‌دهیم
        const inactiveButtons = sortOptions.map((opt) => {
            const isActive = activeSorts.some(s => s.orderBy === opt.value);

            // اگر دکمه انتخاب شده باشد، از نمایش آن صرف نظر می‌کنیم
            if (isActive) return null;

            return (
                <Button
                    key={`inactive-${opt.value}`}
                    size="sm"
                    variant="default"
                    className={`px-3 py-1.5 rounded text-sm flex-shrink-0 whitespace-nowrap
                        bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200`}
                    onClick={() => handleToggleSort(opt)}
                >
                    <ArrowUp className="w-4 h-4 ml-1 opacity-50" />
                    <span>{opt.label}</span>
                </Button>
            );
        });

        return [...activeButtons, ...inactiveButtons];
    };

    return (
        <div className="w-full max-w-full">
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm">مرتب سازی بر اساس</div>
                {activeSorts.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                    >
                        <FilterX className="!w-5 !h-5"/>
                    </Button>


                )}
            </div>

            {/* دکمه‌های انتخاب سورت با اسکرول */}
            <div
                ref={containerRef}
                className="
                    w-full overflow-x-auto pb-2
                    [@media(min-width:750px)_and_(max-width:1000px)]:max-w-[calc(100vw-100px)]
                  "
            >
                <div className="flex gap-2 py-2 min-w-max">
                    {renderAllButtons()}
                </div>
            </div>


        </div>
    );
}