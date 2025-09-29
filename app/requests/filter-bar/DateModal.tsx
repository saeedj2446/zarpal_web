import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogOverlay} from "@radix-ui/react-dialog";
import clsx from "clsx";
import {X} from "lucide-react";
import DateSelector from "@/components/common/DateSelector";

import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import AnalogTimePicker from "react-multi-date-picker/plugins/analog_time_picker";

export const DateModal = ({
                              isOpen,
                              onClose,
                              onApply,
                              onClear,
                              dateFrom,
                              dateTo,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    onApply: (from: string, to: string) => void;
    onClear: () => void;
    dateFrom: string;
    dateTo: string;
}) => {
    const [tempDateFrom, setTempDateFrom] = useState(dateFrom);
    const [tempDateTo, setTempDateTo] = useState(dateTo);

    useEffect(() => {
        if (isOpen) {
            setTempDateFrom(dateFrom);
            setTempDateTo(dateTo);
        }
    }, [isOpen, dateFrom, dateTo]);

    const applyDateFilter = () => {
        onApply(tempDateFrom, tempDateTo);
        onClose(); // این خط اضافه شد
    };

    const clearDateFilter = () => {
        setTempDateFrom("");
        setTempDateTo("");
        onClear();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] " />

            <DialogContent className={clsx(
                "bg-white p-4 rounded-t-2xl shadow-xl z-[70]",
                "fixed left-0 bottom-0 w-full max-h-[90vh] overflow-auto",
                "sm:max-w-md sm:mx-auto sm:rounded-2xl sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 ",
                "transition-all duration-300  overflow-y-auto"
            )}>
                <div className="flex justify-between items-center mb-3 ">
                    <h3 className="font-bold text-base">محدوده تاریخ</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto min-h-[300px]">
                    <div>
                        <DateSelector
                            value={tempDateFrom}
                            onChange={(val) => setTempDateFrom(val || "")}
                            placeholder="از تاریخ"
                            format="YYYY-MM-DD HH:mm"
                            plugins={[<AnalogTimePicker hideSeconds />]}
                            maxDate={new DateObject({ calendar: persian, locale: persian_fa })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <DateSelector
                            value={tempDateTo}
                            onChange={(val) => setTempDateTo(val || "")}
                            placeholder="تا تاریخ"
                            format="YYYY-MM-DD HH:mm"
                            plugins={[<AnalogTimePicker hideSeconds />]}
                            maxDate={tempDateFrom ? new DateObject(tempDateFrom) : new DateObject({ calendar: persian, locale: persian_fa })}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button onClick={clearDateFilter} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm">
                        پاک کردن
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors" onClick={applyDateFilter}>
                        اعمال فیلتر
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};