// components/RangeFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/radix/button";
import { Calendar, DollarSign, X, Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface RangeFilterProps {
    type: "price" | "date";
    title: string;
    min?: number | string;
    max?: number | string;
    isOpen: boolean;
    onToggle: () => void;
    onApply: (min: number | string, max: number | string) => void;
    onClear?: () => void;
    className?: string;
}

export default function RangeFilter({
                                        type,
                                        title,
                                        min,
                                        max,
                                        isOpen,
                                        onToggle,
                                        onApply,
                                        onClear,
                                        className
                                    }: RangeFilterProps) {
    const [localMin, setLocalMin] = useState(min?.toString() || "");
    const [localMax, setLocalMax] = useState(max?.toString() || "");

    useEffect(() => {
        setLocalMin(min?.toString() || "");
        setLocalMax(max?.toString() || "");
    }, [min, max]);

    const handleApply = () => {
        if (type === "price") {
            const minNum = localMin ? parseInt(localMin) : 0;
            const maxNum = localMax ? parseInt(localMax) : Number.MAX_SAFE_INTEGER;
            onApply(minNum, maxNum);
        } else {
            onApply(localMin, localMax);
        }
        onToggle();
    };

    const handleClear = () => {
        setLocalMin("");
        setLocalMax("");
        if (onClear) {
            onClear();
        }
        onToggle();
    };

    const renderInput = (value: string, setValue: (val: string) => void, placeholder: string) => {
        if (type === "price") {
            return (
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ریال</span>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a85a7a] focus:border-[#a85a7a] outline-none"
                    />
                </div>
            );
        } else {
            return (
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a85a7a] focus:border-[#a85a7a] outline-none"
                    />
                </div>
            );
        }
    };

    return (
        <div className={cn("relative", className)}>
            <Button
                variant="outline"
                onClick={onToggle}
                className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    (min || max) && "text-[#a85a7a] border-[#a85a7a]"
                )}
            >
                {type === "price" ? <DollarSign className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                {title}
                {(min || max) && (
                    <span className="text-xs bg-[#a85a7a] text-white rounded-full px-2 py-1">
            {min || "0"} - {max || type === "price" ? "∞" : "اکنون"}
          </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-800">{title}</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onToggle}
                                className="h-6 w-6 text-gray-500"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">از</label>
                                {renderInput(localMin, setLocalMin, "حداقل")}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">تا</label>
                                {renderInput(localMax, setLocalMax, "حداکثر")}
                            </div>
                        </div>

                        <div className="flex justify-between pt-2">
                            <Button
                                variant="ghost"
                                onClick={handleClear}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                پاک کردن
                            </Button>
                            <Button
                                onClick={handleApply}
                                className="bg-[#a85a7a] hover:bg-[#96527a] text-white"
                            >
                                <Check className="w-4 h-4 ml-1" />
                                اعمال
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}