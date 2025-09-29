// components/accounts/PackageBox.jsx

import React from "react";
import { Button } from "@/components/radix/button";
import { Calendar, Clock, Package } from "lucide-react";
import { Timer } from "@/components/common";
import { diffDate } from "@/lib/utils/utils";
import jMoment from "moment-jalaali";

const PackageBox = ({ type, pkg, onCancel, showCancelButton }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    };

    const getBoxStyle = () => {
        if (type === 'active') {
            return {
                container: "p-4 bg-green-50 rounded-lg border border-green-200",
                header: "bg-green-500 text-white",
                badge: "bg-green-100 text-green-800",
                icon: "text-green-600",
                button: "bg-red-100 hover:bg-red-200 text-red-700"
            };
        } else {
            return {
                container: "p-4 bg-blue-50 rounded-lg border border-blue-200",
                header: "bg-blue-500 text-white",
                badge: "bg-blue-100 text-blue-800",
                icon: "text-blue-600",
                button: "bg-red-100 hover:bg-red-200 text-red-700"
            };
        }
    };

    const styles = getBoxStyle();
    const typeLabel = type === 'active' ? 'بسته فعال' : 'بسته رزرو';

    return (
        <div className={styles.container}>
            {/* Package Type Header */}
            <div className={`${styles.header} px-3 py-1 rounded-t-lg -mt-4 -mx-4 mb-3`}>
                <h3 className="font-bold text-center">{typeLabel}</h3>
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{pkg.packageTitle}</h4>
                </div>
                <span className={`px-2 py-1 ${styles.badge} rounded-full text-xs`}>
                    {pkg.paymentType === 'F' ? 'رایگان' : 'پرداخت شده'}
                </span>
            </div>

            {type === 'active' && (
                <Timer
                    color={type === 'active' ? 'green' : 'blue'}
                    totalTime={diffDate(pkg.usageStart, pkg.usageEnd)}
                    currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), pkg.usageEnd)}
                    size={40}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {type === 'active' && (
                    <>
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${styles.icon}`} />
                            <span className="text-sm text-gray-700">شروع: {formatDate(pkg.usageStart)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${styles.icon}`} />
                            <span className="text-sm text-gray-700">پایان: {formatDate(pkg.usageEnd)}</span>
                        </div>
                    </>
                )}
                <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${styles.icon}`} />
                    <span className="text-sm text-gray-700">تاریخ خرید: {formatDate(pkg.createdOn)}</span>
                </div>
                {type === 'reserve' && (
                    <>
                        <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${styles.icon}`} />
                            <span className="text-sm text-gray-700">نوع پرداخت: {pkg.paymentType === 'F' ? 'رایگان' : 'پولی'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className={`w-4 h-4 ${styles.icon}`} />
                            <span className="text-sm text-gray-700">شناسه بسته: {pkg.packageId}</span>
                        </div>
                    </>
                )}
            </div>

            {showCancelButton && (
                <div className="mt-4 flex justify-center">
                    <Button
                        onClick={onCancel}
                        className={`${styles.button} px-3 py-1 text-sm`}
                    >
                        ابطال بسته
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PackageBox;