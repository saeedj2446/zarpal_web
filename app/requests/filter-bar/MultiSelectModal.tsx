// components/filters/MultiSelectModal.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogOverlay } from "@radix-ui/react-dialog";
import { CheckIcon, ChevronDownIcon, X } from "lucide-react";
import { Dto_filterReqi } from "@/lib/types";
import clsx from "clsx";

type Option = { label: string; value: string };

interface MultiSelectModalProps {
    label: string;
    options: Option[];
    selected: string[];
    onSelect: (v: string[]) => void;
    icon?: React.ReactNode;
    filterKey: keyof Dto_filterReqi;
    isActive: boolean;
    activeFilter: string;
    onRemove: (key: keyof Dto_filterReqi) => void;
}

export default function MultiSelectModal({
                                             label,
                                             options,
                                             selected,
                                             onSelect,
                                             icon,
                                             filterKey,
                                             isActive,
                                             activeFilter,
                                             onRemove,
                                         }: MultiSelectModalProps) {
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

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (val) setTempSelected([...selected]);
        }}>
            {isActive && activeFilter ? (
                <DialogTrigger asChild>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-300 flex-shrink-0 h-10 cursor-pointer">
                        {icon}
                        <span className="text-sm truncate max-w-[150px]">{activeFilter}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(filterKey);
                            }}
                            className="text-purple-500 hover:text-purple-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                            className="text-purple-500 hover:text-purple-700"
                        >
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                    </div>
                </DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <button className={clsx(
                        "flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-200 flex-shrink-0 h-10",
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
            )}

            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <DialogContent className={clsx(
                "bg-white p-4 rounded-t-2xl shadow-xl z-50",
                "fixed left-0 bottom-0 w-full max-h-[80vh] overflow-auto",
                "sm:max-w-md sm:mx-auto sm:rounded-2xl sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[70vh]",
                "transition-all duration-300"
            )}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-base">{label}</h3>
                    <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="flex justify-between mb-3">
                    <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700">
                        پاک کردن همه
                    </button>
                    <span className="text-xs text-gray-500">
                        {tempSelected.length} مورد انتخاب شده
                    </span>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-auto">
                    {options.map((opt) => (
                        <div key={opt.value} className={clsx(
                            "flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border-purple-400",
                            tempSelected.includes(opt.value)
                                ? "bg-purple-50 border border-purple-200"
                                : "hover:bg-gray-50"
                        )} onClick={() => toggle(opt.value)}>
                            <div className="w-4 h-4 border rounded flex items-center justify-center border-gray-700 ">
                                {tempSelected.includes(opt.value) && (
                                    <CheckIcon className="w-3 h-3 text-green-400-600" />
                                )}
                            </div>
                            <span className="flex-1 text-sm">{opt.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 mt-4">
                    <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm">
                        انصراف
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors" onClick={confirmSelection}>
                        اعمال فیلتر
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}