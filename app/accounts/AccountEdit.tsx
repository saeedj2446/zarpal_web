// components/accounts/AccountEdit.jsx

"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { X, Check, Phone, MapPin } from "lucide-react";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/radix/form";
import { Input } from "@/components/radix/input";
import { Textarea } from "@/components/radix/textarea";
import { FileUploader, FloatingLabel, DropSelector } from "@/components/common";
import { BusinessCategories } from "@/lib/local-data/BusinessCategories";
import { IranProvinces } from "@/lib/local-data/Iran-provice";
import { useWallet } from "@/lib/hooks/useWallet";
import { normalizePhoneNumber, increaseStringSize } from "@/lib/utils/utils";
import { CurrencyOption } from "@/lib/types";

const schema = z.object({
    title: z.string().min(2, "عنوان الزامی است"),
    currency: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.enum(["IRR", "egld4Tst", "gldZrl", "egldZrl","gld4Tst"], {
            errorMap: () => ({ message: "ارز کیف الزامی است" }),
        })
    ),
    contact: z
        .string()
        .min(1, { message: "شماره همراه الزامی است" })
        .refine(
            (val) => /^09\d{9}$/.test(val) || /^98\d{10}$/.test(val),
            {
                message: "شماره موبایل باید با 09 یا 98 شروع شود و معتبر باشد",
            }
        ),
    provinceId: z.preprocess(
        (val) => {
            if (val === "" || val == null) return undefined;
            if (typeof val === "number") return String(val);
            return val;
        },
        z.string().refine((v) => v && v !== "", {
            message: "انتخاب استان الزامی است",
        })
    ),
    city: z.preprocess(
        (val) => {
            if (val === "" || val == null) return undefined;
            if (typeof val === "number") return String(val);
            return val;
        },
        z.string().refine((v) => v && v !== "", {
            message: "انتخاب شهر الزامی است",
        })
    ),
    address: z.string().optional(),
    iconId: z.number().nullable().optional(),
    licenceId: z.number().nullable().optional(),
    guildId: z.number().nullable().optional(),
});

type FormData = z.infer<typeof schema>;

interface AccountEditProps {
    account: any;
    isNewAccount: boolean;
    onSave: (data: any) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const AccountEdit = ({ account, isNewAccount, onSave, onCancel, isSubmitting = false }: AccountEditProps) => {
    // حذف استفاده از isAddingPurse در این کامپوننت چون مستقیماً از هوک استفاده می‌کنیم

    // تنظیم مقادیر پیش‌فرض بر اساس حالت ایجاد یا ویرایش
    const defaultValues: FormData = React.useMemo(() => {
        if (account) {
            return {
                title: account.title || "",
                currency: account.currency || "",
                provinceId: account.provinceId != null
                    ? String(increaseStringSize(account.provinceId, 2, "0")) : "",
                city: account.city != null ? String(account.city) : "",
                contact: account.contact || "",
                address: account.address || "",
                iconId: account.iconId || null,
                licenceId: account.licenceId || null,
                guildId: account.guildId || null,
            };
        } else {
            return {
                title: "",
                currency: "IRR", // مقدار پیش‌فرض برای حساب جدید
                provinceId: "",
                city: "",
                contact: "",
                address: "",
                iconId: null,
                licenceId: null,
                guildId: null,
            };
        }
    }, [account]);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: "onChange",
    });

    const watchedValues = useWatch({ control: form.control });

    // بررسی تغییرات فرم
    const [hasChanges, setHasChanges] = React.useState(false);
    useEffect(() => {
        const isChanged = Object.keys(defaultValues).some(key => {
            const defaultValue = defaultValues[key as keyof FormData];
            const currentValue = watchedValues[key as keyof FormData];
            return JSON.stringify(defaultValue) !== JSON.stringify(currentValue);
        });
        setHasChanges(isChanged);
    }, [watchedValues, defaultValues]);

    const onSubmit = (data: FormData) => {
        // مدیریت مقادیر اختیاری - تبدیل به عدد یا null
        const processedData = {
            ...data,
            iconId: data.iconId ? parseInt(data.iconId) : null,
            licenceId: data.licenceId ? parseInt(data.licenceId) : null,
            guildId: data.guildId ? parseInt(data.guildId) : null,
        };

        if (processedData.contact) {
            processedData.contact = normalizePhoneNumber(processedData.contact);
        }
        if (processedData.provinceId) {
            processedData.provinceId = parseInt(processedData.provinceId);
        }

        onSave(processedData);
    };

    return (
        <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">
                        {isNewAccount ? "افتتاح حساب جدید" : "ویرایش اطلاعات حساب"}
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* عنوان کسب و کار */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <FloatingLabel id="title" label="عنوان کسب و کار">
                                            <Input
                                                {...field}
                                                className="w-full"
                                                dir="rtl"
                                                placeholder="مثلا، کلینیک زیبایی دلون"
                                                disabled={isSubmitting}
                                            />
                                        </FloatingLabel>
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* رسته - فقط در حالت ویرایش نمایش داده می‌شود */}
                        {!isNewAccount && (
                            <FormField
                                control={form.control}
                                name="guildId"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <DropSelector
                                                {...field}
                                                placeholder="رسته خود را انتخاب کنید"
                                                options={BusinessCategories}
                                                onChange={(val) => field.onChange(val)}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <FormMessage>{fieldState.error.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* لوگو و مجوز */}
                        <div className="flex flex-wrap gap-6">
                            <FormField
                                control={form.control}
                                name="iconId"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                {...field}
                                                label={"لوگو"}
                                                width={120}
                                                height={120}
                                                autoUpload
                                                fileType="image/*"
                                                onUploadComplete={(val) => field.onChange()}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="licenceId"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                {...field}
                                                label={"تصویر مجوز فعالیت"}
                                                width={120}
                                                height={120}
                                                autoUpload
                                                fileType="image/*"
                                                onUploadComplete={field.onChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <FormMessage>{fieldState.error.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ارز کیف */}
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <DropSelector
                                            {...field}
                                            placeholder="ارز کیف"
                                            options={CurrencyOption}
                                            onChange={(val) => field.onChange(val)}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* شماره همراه */}
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <FloatingLabel
                                            icon={<Phone className="w-5 h-5 text-gray-400" />}
                                            id="contact"
                                            label="شماره همراه"
                                        >
                                            <Input
                                                {...field}
                                                type="tel"
                                                maxLength={11}
                                                placeholder="09123456789"
                                                disabled={isSubmitting}
                                            />
                                        </FloatingLabel>
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* استان و شهر */}
                        <div className="flex flex-wrap gap-6">
                            <FormField
                                control={form.control}
                                name="provinceId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex-1 min-w-[48%]">
                                        <FormControl>
                                            <DropSelector
                                                {...field}
                                                placeholder="استان"
                                                options={IranProvinces}
                                                onChange={(val) => {
                                                    field.onChange(val);
                                                    form.setValue("city", "");
                                                }}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <FormMessage>{fieldState.error.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field, fieldState }) => {
                                    const selectedProvinceId = form.watch("provinceId");
                                    const selectedProvince = IranProvinces.find(
                                        (p) => p.id === selectedProvinceId
                                    );
                                    const cityOptions = selectedProvince?.children || [];

                                    return (
                                        <FormItem className="flex-1 min-w-[48%]">
                                            <FormControl>
                                                <DropSelector
                                                    {...field}
                                                    placeholder="شهر"
                                                    options={cityOptions}
                                                    disabled={!selectedProvince || isSubmitting}
                                                    onChange={(val) => field.onChange(val)}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <FormMessage>{fieldState.error.message}</FormMessage>
                                            )}
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        {/* آدرس */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FloatingLabel
                                            icon={<MapPin className="w-5 h-5 text-gray-400" />}
                                            id="address"
                                            label="آدرس"
                                        >
                                            <Textarea
                                                {...field}
                                                className="w-full min-h-[80px]"
                                                dir="rtl"
                                                placeholder="آدرس کامل کسب و کار"
                                                disabled={isSubmitting}
                                            />
                                        </FloatingLabel>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* دکمه ذخیره - فقط در صورت وجود تغییرات فعال می‌شود */}
                        <Button
                            type="submit"
                            className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-3 text-lg font-medium rounded-lg disabled:opacity-50"
                            disabled={!hasChanges || isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                    {isNewAccount ? "در حال ایجاد حساب..." : "در حال ذخیره..."}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Check className="w-5 h-5 mr-2" />
                                    {isNewAccount ? "ایجاد حساب" : "ذخیره تغییرات"}
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AccountEdit;