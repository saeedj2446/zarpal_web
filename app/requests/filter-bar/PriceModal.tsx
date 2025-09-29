"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import clsx from "clsx";

interface PriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (from: number | undefined, to: number | undefined) => void;
    onClear: () => void;
    amountFrom: number | undefined;
    amountTo: number | undefined;
}

export default function PriceModal({
                                       isOpen,
                                       onClose,
                                       onApply,
                                       onClear,
                                       amountFrom,
                                       amountTo,
                                   }: PriceModalProps) {
    const [tempAmountFrom, setTempAmountFrom] = useState(amountFrom?.toString() || "");
    const [tempAmountTo, setTempAmountTo] = useState(amountTo?.toString() || "");

    useEffect(() => {
        if (isOpen) {
            setTempAmountFrom(amountFrom?.toString() || "");
            setTempAmountTo(amountTo?.toString() || "");
        }
    }, [isOpen, amountFrom, amountTo]);

    const applyPriceFilter = () => {
        const from = tempAmountFrom ? Number(tempAmountFrom) : undefined;
        const to = tempAmountTo ? Number(tempAmountTo) : undefined;
        onApply(from, to);
        onClose();
    };

    const clearPriceFilter = () => {
        setTempAmountFrom("");
        setTempAmountTo("");
        onClear();
        onClose(); // این خط اضافه شد
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

            <DialogContent className={clsx(
                "bg-white p-4 rounded-t-2xl shadow-xl z-50",
                "fixed left-0 bottom-0 w-full max-h-[80vh] overflow-auto",
                "sm:max-w-md sm:mx-auto sm:rounded-2xl sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[70vh]",
                "transition-all duration-300"
            )}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-base">محدوده قیمت</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ریال</span>
                            <input
                                type="number"
                                value={tempAmountFrom}
                                onChange={(e) => setTempAmountFrom(e.target.value)}
                                placeholder="مبلغ از"
                                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ریال</span>
                            <input
                                type="number"
                                value={tempAmountTo}
                                onChange={(e) => setTempAmountTo(e.target.value)}
                                placeholder="مبلغ تا"
                                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button onClick={clearPriceFilter} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm">
                        پاک کردن
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors" onClick={applyPriceFilter}>
                        اعمال فیلتر
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}