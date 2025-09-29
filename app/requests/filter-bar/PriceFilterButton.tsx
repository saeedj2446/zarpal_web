// components/filters/PriceFilterButton.tsx
"use client";

import React from "react";
import { ChevronDownIcon, X } from "lucide-react";
import clsx from "clsx";

interface PriceFilterButtonProps {
    isActive: boolean;
    activeFilter: string;
    onClick: () => void;
    onRemove: () => void;
}

export default function PriceFilterButton({
                                              isActive,
                                              activeFilter,
                                              onClick,
                                              onRemove,
                                          }: PriceFilterButtonProps) {
    return (
        <>
            {isActive && activeFilter ? (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-300 flex-shrink-0 h-10 cursor-pointer" onClick={onClick}>
                    <div className="h-4 text-gray-500">₿</div>
                    <span className="text-sm truncate max-w-[150px]">{activeFilter}</span>
                    <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-purple-500 hover:text-purple-700">
                        <X className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="text-purple-500 hover:text-purple-700">
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button className={clsx(
                    "flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-200 flex-shrink-0 h-10",
                    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 text-sm",
                    isActive && "bg-purple-50 text-purple-700 border-purple-300"
                )} onClick={onClick}>
                    <div className="h-4 text-gray-500">₿</div>
                    <span className="truncate">قیمت</span>
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                </button>
            )}
        </>
    );
}