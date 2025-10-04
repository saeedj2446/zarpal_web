"use client";

import React from "react";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { Check, ShoppingCart } from "lucide-react";
import {usePackages} from "@/lib/hooks/useList";


const PackageSelector = ({ purseId, onPackageSelect, isLoading = false }) => {
    const { data: packagesData, isLoading: isLoadingPackages, error } = usePackages(purseId);

    // اگر در حال بارگذاری هستیم یا داده‌ها آماده نیستند
    if (isLoadingPackages) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // اگر خطایی وجود داشته باشد
    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-red-700">خطا در بارگیری لیست بسته‌ها: {error.message}</p>
            </div>
        );
    }

    // اگر داده‌ها وجود ندارند
    if (!packagesData || !packagesData.list || packagesData.list.length === 0) {
        return (
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-yellow-700">هیچ بسته‌ای برای نمایش وجود ندارد.</p>
            </div>
        );
    }

    const packages = packagesData.list;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                    <Card
                        key={pkg.id}
                        className="border-gray-200 hover:border-gray-300 transition-all"
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{pkg.title}</h3>
                                {pkg.price === 0 && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    رایگان
                  </span>
                                )}
                            </div>

                            {pkg.desc && (
                                <p className="text-gray-600 mb-4">{pkg.desc}</p>
                            )}

                            <div className="space-y-2 mb-4">
                                {pkg.duration && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">مدت:</span>
                                        <span>{pkg.duration} روز</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">قیمت:</span>
                                    <span className="font-bold">
                    {pkg.price === 0 ? "رایگان" : `${pkg.price?.toLocaleString()} تومان`}
                  </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">سطح:</span>
                                    <span>سطح {pkg.levelId}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => onPackageSelect(pkg)}
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {isLoading ? "در حال پردازش..." : pkg.price === 0 ? "فعالسازی رایگان" : "خرید و پرداخت"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PackageSelector;