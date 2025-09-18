"use client";

import React, {useEffect, useState} from "react";
import { CreditCard, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/lib/hooks/useWallet";
import UserWalletList from "@/app/panel/components/user-wallet-list";
import GoldRateBoard from "@/app/panel/components/gold-rate-board";

// Radix
import { Card, CardContent } from "@/components/radix/card";
import { Input } from "@/components/radix/input";
import { Textarea } from "@/components/radix/textarea";
import { Button } from "@/components/radix/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/radix/form";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/radix/dialog";

import { useForm } from "react-hook-form";
import DateSelector from "@/components/common/DateSelector";
import { FloatingLabel, NumberInput } from "@/components/common";
import {normalizeDate, normalizePhoneNumber, rial2Toman} from "@/lib/utils/utils";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import AnalogTimePicker from "react-multi-date-picker/plugins/analog_time_picker";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";

// ----- Zod Schema -----
const cashInByOtherSchema = z.object({
    payerContact: z.string().min(11, "شماره همراه معتبر نیست"),
    payerTitle: z.string().min(1, "عنوان الزامی است"),
    amount: z.number({ invalid_type_error: "مبلغ باید عدد باشد" }).positive("مبلغ باید مثبت باشد"),
    desc: z.string().optional(),
    expiredOn: z.any().refine(v => !!v, "تاریخ الزامی است"),
});

export type CashInByOtherData = z.infer<typeof cashInByOtherSchema>;

export default function RequestPaymentPage() {
    const { currentWallet, cashInByOtherMutation, } = useWallet();
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [formData, setFormData] = useState<CashInByOtherData | null>(null);
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(23, 59, 59, 0);
    const defaultDate = new DateObject({
        date: tomorrow,
        calendar: persian,
        locale: persian_fa,
    });

    const form = useForm<CashInByOtherData>({
        resolver: zodResolver(cashInByOtherSchema),
        defaultValues: {
            payerContact: "",
            payerTitle: "",
            amount: undefined,
            desc: "",
            expiredOn: defaultDate,
            sendSms: true,
        },
        mode: "all",
    });
    useEffect(() => {
        if (defaultDate) {
            form.setValue("expiredOn", defaultDate, { shouldValidate: true });
        }
    }, []);
    const handleOpenConfirm = (values: CashInByOtherData) => {
        setFormData(values);
        setConfirmModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!formData) return;
        const input = {
            purse: currentWallet.id,
            amount: formData.amount,
            payerContact: normalizePhoneNumber(formData.payerContact),
            payerTitle: formData.payerTitle,
            sendSms: false,
            desc: formData.desc,
            expiredOn: normalizeDate(formData.expiredOn),
            landingBase: "https://zarpal.vercel.app/p",
        };

        setLoading(true);
        try {
            const res = await cashInByOtherMutation.mutateAsync(input);
            const link=location.origin+"/"+res.shortId
            setPaymentLink(link);
            setResultModalOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmModalOpen(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-['iransans-number']">
            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-lg">درخواست واریز</span>
                </div>
                <Link href="/" className="p-2 rounded-full hover:bg-white/20 flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-[1000px] mx-auto p-4">
                <UserWalletList />
                <GoldRateBoard />

                {/* Card Form */}
                <div className="flex justify-center mt-6">
                    <Card className="w-full max-w-lg bg-white shadow-md rounded-2xl px-1 py-6">
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleOpenConfirm)} className="space-y-4">
                                    {/* شماره همراه */}
                                    <FormField
                                        control={form.control}
                                        name="payerContact"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel
                                                        id="payerContact"
                                                        label="شماره همراه پرداخت کننده"
                                                        icon={<Phone className="w-5 h-5 text-gray-400" />}
                                                    >
                                                        <Input {...field} className="w-full" dir="rtl" />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* عنوان */}
                                    <FormField
                                        control={form.control}
                                        name="payerTitle"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel id="payerTitle" label="عنوان پرداخت کننده">
                                                        <Input {...field} className="w-full" />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* مبلغ */}
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel id="amount" label="مبلغ">
                                                        <NumberInput {...field} value={field.value ?? ""} className="w-full" unit="ریال" />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">{fieldState.error?.message}</FormMessage>
                                                {field.value && <div className="mt-1 text-gray-500 text-xs">{rial2Toman(field.value)} تومان</div>}
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="desc"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel id="desc" label="بابت">
                                                        <Input {...field} className="w-full" />
                                                       {/* <Textarea {...field} className="w-full min-h-[80px]" />*/}
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="expiredOn"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel id="expiredOn" label="تاریخ انقضای لینک پرداخت">
                                                        <DateSelector
                                                            {...field}
                                                            className="peer w-full h-14 rounded-xl"
                                                            onChange={field.onChange}
                                                            value={field.value}
                                                            format="YYYY/MM/DD HH:mm"
                                                            plugins={[<AnalogTimePicker hideSeconds />]}
                                                            minDate={new DateObject({ calendar: persian, locale: persian_fa })}
                                                        />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit */}
                                    <Button type="submit" disabled={loading} className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-6 text-lg font-medium rounded-xl">
                                        {loading ? "در حال ارسال..." : "ارسال لینک پرداخت"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal تایید اطلاعات */}
            <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
                <DialogContent className="max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg">
                    <DialogTitle>تایید اطلاعات</DialogTitle>
                    <DialogDescription>لطفاً اطلاعات زیر را بررسی کنید و در صورت صحت، تایید نمایید.</DialogDescription>
                    {formData && (
                        <div className="mt-4 space-y-2 text-right">
                            <p>شماره همراه: {formData.payerContact}</p>
                            <p>عنوان: {formData.payerTitle}</p>
                            <p>مبلغ: {rial2Toman(formData.amount)} تومان</p>
                            <p>توضیحات: {formData.desc || "-"}</p>
                            <p>تاریخ انقضا: {formData.expiredOn.toString()}</p>
                        </div>
                    )}
                    <div className="mt-6 flex justify-between">
                        <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>ویرایش</Button>
                        <Button onClick={handleConfirm} disabled={loading}>
                            {loading ? "در حال ارسال..." : "تایید و ارسال"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal لینک پرداخت */}


            <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
                <DialogContent hideCloseButton className="max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg">
                    <DialogTitle className="px-3" >لینک پرداخت</DialogTitle>
                    {/*<DialogClose asChild>
                        <button
                            onClick={() => {
                                setResultModalOpen(false);
                                router.replace(`/`);
                            }}
                            className="absolute top-3  right-2 rounded-md p-1.5 hover:bg-gray-100"
                        >
                            <div className="w-5 h-5 text-white bg-red-950 rounded z-50">X</div>
                        </button>
                    </DialogClose>*/}
                    <DialogDescription>
                        لینک پرداخت ایجاد و ارسال شد.
                    </DialogDescription>
                    {paymentLink && (
                        <div className="mt-4 text-center space-y-2">
                            <a
                                href={paymentLink}
                                target="_blank"
                                className="underline text-blue-600 break-all"
                            >
                                {paymentLink}
                            </a>

                        </div>
                    )}
                    <div className="mt-6 flex justify-between gap-2">
                        {/* دکمه بستن - Primary */}
                        <Button
                            className="flex-1 py-2 text-sm bg-[#a85a7a] hover:bg-[#96527a] text-white rounded-md"
                            onClick={() => {
                                router.replace(`/`);
                            }}
                        >
                            بستن
                        </Button>

                        {/* دکمه صفحه پرداخت - Secondary */}
                        {paymentLink && (
                            <Button
                                className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                                onClick={() => {
                                    const shortId = paymentLink.split("/").pop();
                                    if (shortId) {
                                        router.replace(`/p/${shortId}`);
                                    }
                                }}
                            >
                                صفحه پرداخت
                            </Button>
                        )}
                    </div>

                </DialogContent>
            </Dialog>

        </div>
    );
}
