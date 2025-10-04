"use client";

import React, {Suspense, useEffect, useState} from "react";
import { CreditCard, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/lib/hooks/useWallet";
import { useAuth } from "@/lib/hooks/useAuth";
import WalletSelector from "@/app/public/WalletSelector";
import GoldRateBoard from "@/app/public/gold-rate-board";
import dynamic from "next/dynamic";

// بارگذاری داینامیک کتابخانه QRCode
const QRCode = dynamic(
    () => import("qrcode.react").then((mod) => mod.QRCodeCanvas),
    { ssr: false }
);

// Radix
import { Card, CardContent } from "@/components/radix/card";
import { Input } from "@/components/radix/input";
import { Button } from "@/components/radix/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/radix/form";
import {
    Dialog,
    DialogTrigger,
    DialogContent as BaseDialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogPortal,
    DialogOverlay,
} from "@/components/radix/dialog";

import { useForm } from "react-hook-form";
import DateSelector from "@/components/common/DateSelector";
import { FloatingLabel, NumberInput } from "@/components/common";
import {
    normalizeDate,
    normalizePhoneNumber,
    rial2Toman,
} from "@/lib/utils/utils";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import AnalogTimePicker from "react-multi-date-picker/plugins/analog_time_picker";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ParamDetector } from "@/app/public/ParamDetector";

// ----- Zod Schema -----
const cashInByOtherSchema = z.object({
    payerContact: z.string().min(11, "شماره همراه معتبر نیست"),
    payerTitle: z.string().min(1, "عنوان الزامی است"),
    amount: z
        .number({ invalid_type_error: "مبلغ باید عدد باشد" })
        .positive("مبلغ باید مثبت باشد"),
    desc: z.string().optional(),
    expiredOn: z.any().refine((v) => !!v, "تاریخ الزامی است"),
    sendSms: z.boolean().optional(),
});

export type CashInByOtherData = z.infer<typeof cashInByOtherSchema>;

// ✅ نسخه سفارشی DialogContent
// ✅ DialogContent سفارشی
const DialogContent = React.forwardRef<
    React.ElementRef<typeof BaseDialogContent>,
    Omit<React.ComponentPropsWithoutRef<typeof BaseDialogContent>, "children"> & {
    hideCloseButton?: boolean;
    children?: React.ReactNode;
}
>(({ children, hideCloseButton, ...rest }, ref) => {
    return (
        <DialogPortal>
            <DialogOverlay />
            <BaseDialogContent ref={ref} {...rest}>
                {children}
                {!hideCloseButton && (
                    <DialogClose className="absolute right-4 top-4">✕</DialogClose>
                )}
            </BaseDialogContent>
        </DialogPortal>
    );
});

DialogContent.displayName = "DialogContent";


export default function RequestPaymentPage() {
    const { currentWallet, cashInByOtherMutation } = useWallet();
    const { profile } = useAuth();
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [formData, setFormData] = useState<CashInByOtherData | null>(null);
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<"link" | "qr" | "self">(
        "link"
    );
    const router = useRouter();

    const findPaymentMethod = (method: string) => {
        if (method === "qr" || method === "link" || method === "self") {
            setPaymentMethod(method as "link" | "qr" | "self");
        }
    };

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

    // Pre-fill form with user data for self payment
    useEffect(() => {
        if (paymentMethod === "self" && profile) {
            form.setValue("payerContact", profile.contact || "");
            form.setValue(
                "payerTitle",
                `${profile.firstName ?? ""} ${profile.lastName ?? ""}`
            );
        }
    }, [paymentMethod, profile]);

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
            sendSms: paymentMethod === "link",
            desc: formData.desc,
            expiredOn: normalizeDate(formData.expiredOn),
            landingBase: "https://zarpal.vercel.app/p",
            self: paymentMethod === "self",
        };

        setLoading(true);
        try {
            const res = await cashInByOtherMutation.mutateAsync(input);
            const link = location.origin + "/" + res.shortId;
            setPaymentLink(link);

            if (paymentMethod === "self") {
                router.push(link);
            } else {
                setResultModalOpen(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmModalOpen(false);
            setLoading(false);
        }
    };

    return (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <div className="min-h-screen font-['iransans-number']">
            <ParamDetector param="method" onDetect={findPaymentMethod} />

            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-3">
                    {paymentMethod == "self" ? "خرید طلا" : "درخواست واریز"}
                </div>
                <Link
                    href="/"
                    className="p-2 rounded-full hover:bg-white/20 flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Main */}
            <div className="max-w-[1000px] mx-auto p-4">
                <WalletSelector />
                <GoldRateBoard />

                {/* Card Form */}
                <div className="flex justify-center mt-6">
                    <Card className="w-full max-w-lg bg-white shadow-md rounded-2xl px-1 py-6">
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleOpenConfirm)}
                                    className="space-y-4"
                                >
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
                                                        <Input
                                                            {...field}
                                                            maxLength={11}
                                                            className="w-full"
                                                            dir="rtl"
                                                            readOnly={paymentMethod === "self"}
                                                        />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">
                                                    {fieldState.error?.message}
                                                </FormMessage>
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
                                                    <FloatingLabel
                                                        id="payerTitle"
                                                        label="عنوان پرداخت کننده"
                                                    >
                                                        <Input
                                                            {...field}
                                                            className="w-full"
                                                            readOnly={paymentMethod === "self"}
                                                        />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">
                                                    {fieldState.error?.message}
                                                </FormMessage>
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
                                                        <NumberInput
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            className="w-full"
                                                            unit="ریال"
                                                        />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">
                                                    {fieldState.error?.message}
                                                </FormMessage>
                                                {field.value && (
                                                    <div className="mt-1 text-gray-500 text-xs">
                                                        {rial2Toman(field.value)} تومان
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    {/* توضیحات */}
                                    <FormField
                                        control={form.control}
                                        name="desc"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel id="desc" label="بابت">
                                                        <Input {...field} className="w-full" />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">
                                                    {fieldState.error?.message}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* تاریخ */}
                                    <FormField
                                        control={form.control}
                                        name="expiredOn"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="mt-6">
                                                <FormControl>
                                                    <FloatingLabel
                                                        id="expiredOn"
                                                        label="تاریخ انقضای لینک پرداخت"
                                                    >
                                                        <DateSelector
                                                            {...field}
                                                            className="peer w-full h-14 rounded-xl"
                                                            onChange={field.onChange}
                                                            value={field.value}
                                                            format="YYYY-MM-DD HH:mm"
                                                            plugins={[<AnalogTimePicker hideSeconds />]}
                                                            minDate={
                                                                new DateObject({
                                                                    calendar: persian,
                                                                    locale: persian_fa,
                                                                })
                                                            }
                                                        />
                                                    </FloatingLabel>
                                                </FormControl>
                                                <FormMessage className="text-right text-red-500 text-sm">
                                                    {fieldState.error?.message}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-6 text-lg font-medium rounded-xl"
                                    >
                                        {loading
                                            ? "در حال پردازش..."
                                            : paymentMethod === "link"
                                                ? "ارسال لینک پرداخت"
                                                : paymentMethod === "qr"
                                                    ? "تولید بارکد پرداخت"
                                                    : "خرید طلا"}
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
                    <DialogDescription>
                        لطفاً اطلاعات زیر را بررسی کنید و در صورت صحت، تایید نمایید.
                    </DialogDescription>
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
                        <Button
                            variant="secondary"
                            onClick={() => setConfirmModalOpen(false)}
                        >
                            ویرایش
                        </Button>
                        <Button onClick={handleConfirm} disabled={loading}>
                            {loading ? "در حال ارسال..." : "تایید و ارسال"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal نتیجه پرداخت */}
            {paymentMethod !== "self" && (
                <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
                    <DialogContent
                        hideCloseButton
                        className="max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg"
                    >
                        <DialogTitle className="px-3">
                            {paymentMethod === "link" ? "لینک پرداخت" : "بارکد پرداخت"}
                        </DialogTitle>

                        <DialogDescription>
                            {paymentMethod === "link"
                                ? "لینک پرداخت ایجاد و ارسال شد."
                                : "برای پرداخت بارکد را اسکن کنید."}
                        </DialogDescription>

                        {paymentLink && (
                            <div className="mt-4 flex flex-col items-center space-y-4">
                                {paymentMethod === "link" ? (
                                    <a
                                        href={paymentLink}
                                        target="_blank"
                                        className="underline text-blue-600 break-all text-center"
                                    >
                                        {paymentLink}
                                    </a>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-2 bg-white border rounded-lg">
                                            <QRCode
                                                value={paymentLink}
                                                size={280}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-6 flex justify-between gap-2">
                            <Button
                                className="flex-1 py-2 text-sm bg-[#a85a7a] hover:bg-[#96527a] text-white rounded-md"
                                onClick={() => router.replace(`/`)}
                            >
                                بستن
                            </Button>

                            {paymentLink && paymentMethod === "link" && (
                                <Button
                                    className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                                    onClick={() => {
                                        const shortId = paymentLink.split("/").pop();
                                        if (shortId) router.replace(`/p/${shortId}`);
                                    }}
                                >
                                    صفحه پرداخت
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
        </Suspense>
    );
}
