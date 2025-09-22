"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/radix/input";
import { Textarea } from "@/components/radix/textarea";
import { Button } from "@/components/radix/button";
import { Card, CardContent } from "@/components/radix/card";
import {
    MapPin,
    Globe,
    Instagram,
    MessageCircle,
    Phone,
} from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/radix/form";
import { FileUploader, FloatingLabel } from "@/components/common";
import DropSelector from "@/components/common/DropSelector";
import { BusinessCategories } from "@/lib/local-data/BusinessCategories";
import { IranProvinces } from "@/lib/local-data/Iran-provice";
import { hostList } from "@/lib/local-data/hostList";
import {useWallet} from "@/lib/hooks/useWallet";
import {useEffect} from "react";
import {increaseStringSize, normalizePhoneNumber} from "@/lib/utils/utils";


const schema = z.object({
    title: z.string().min(2, "عنوان الزامی است"),
    currency: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.enum(["IRR", "egld4Tst", "gldZrl", "egldZrl"], {
            errorMap: () => ({ message: "ارز کیف الزامی است" }),
        })
    ),
    contact: z
        .string()
        .min(1, { message: "شماره همراه الزامی است" }) // الزامی بودن
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
    IconId: z.string().optional(),
});

export default function AccountForm({selectedAccount, isNewAccount }) {

    const d_ata={
        title: selectedAccount?.title || "",
        tagline: selectedAccount?.tagline || "",
        currency: selectedAccount?.currency || "",
        provinceId:
            selectedAccount?.provinceId != null
                ? String(increaseStringSize(selectedAccount.provinceId, 2, "0"))
                : "",
        city:
            selectedAccount?.city != null ? String(selectedAccount.city) : "",
        contact: selectedAccount?.contact || "",
        address: selectedAccount?.address || "",
        website: selectedAccount?.website || "",
        instagram: selectedAccount?.instagram || "",
        telegram: selectedAccount?.telegram || "",
        description: selectedAccount?.description || "",
        IconId: selectedAccount?.IconId.toString() || null,
    };

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues:d_ata ,
    });
    useEffect(() => {
        form.reset(d_ata);
    }, [selectedAccount, isNewAccount, form]);
    const isReadOnly = selectedAccount && selectedAccount.status === "active";

    // 🔹 اتصال به هوک
    const { editPurseMutation } = useWallet();

    const onSubmit = (data) => {
        if(data.IconId){
            data.IconId=parseInt(data.IconId);
        }
        if(data.contact){
            data.contact=normalizePhoneNumber(data.contact);
        }
        if(data.provinceId){
            data.provinceId=parseInt(data.provinceId);
        }

        if (isNewAccount) {
            // اینجا می‌تونی create رو بزنی
            console.log("Create account:", data);
        } else {
            // 🔹 ویرایش کیف موجود

            editPurseMutation.mutate({
                purse: {
                    id: selectedAccount.id,
                    ...data,
                },
            });
        }
    };

    return (
        <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-6 text-center">
                    {isNewAccount
                        ? "افتتاح حساب جدید"
                        : selectedAccount
                            ? "ویرایش حساب"
                            : "اطلاعات حساب"}
                </h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* عنوان پذیرنده */}
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
                                                readOnly={isReadOnly}
                                                placeholder="مثلا، کلینیک زیبایی دلون"
                                            />
                                        </FloatingLabel>
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* شعار برند */}
                        {/*<FormField
                control={form.control}
                name="tagline"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabel id="tagline" label="شعار برند">
                                <Input
                                    {...field}
                                    className="w-full"
                                    dir="rtl"
                                    readOnly={isReadOnly}
                                    placeholder="مثلا، زیبایی را با ما تجربه کنید."
                                />
                            </FloatingLabel>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="category"
                render={({field, fieldState}) => (
                    <FormItem className="mt-6">

                        <FormControl>
                            <DropSelector
                                {...field}
                                placeholder="رسته خود را انتخاب کنید"
                                options={BusinessCategories}
                                fileType="image/*"
                                onChange={(val) => field.onChange(val)}
                            />
                        </FormControl>
                        {fieldState.error && (
                            <FormMessage>{fieldState.error.message}</FormMessage>
                        )}
                    </FormItem>
                )}
            />*/}

                        <div className="flex flex-wrap gap-6">
                            <FormField
                                control={form.control}
                                name="IconId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="mt-6">
                                        <FormControl>
                                            <FileUploader
                                                {...field}
                                                label={"لوگو"}
                                                width={120}
                                                height={120}
                                                autoUpload
                                                fileType="image/*"
                                                onUploadComplete={(val) => {
                                                    field.onChange(val.toString())
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />


                            {/*<FormField
                  control={form.control}
                  name="license"
                  render={({field, fieldState}) => (
                      <FormItem className="mt-6">

                          <FormControl>
                              <FileUploader
                                  {...field}
                                  label={'تصویر مجوز فعالیت'}
                                  width={120}
                                  height={120}
                                  fileType="image/*"
                                  autoUpload
                                  onUploadComplete={(val) => field.onChange(val)}
                              />

                          </FormControl>
                          {fieldState.error && (
                              <FormMessage>{fieldState.error.message}</FormMessage>
                          )}
                      </FormItem>
                  )}
              />*/}
                        </div>

                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <DropSelector
                                            {...field}
                                            placeholder="ارز کیف"
                                            options={[
                                                { value: "IRR", label: "ریال ایران" },
                                                { value: "egld4Tst", label: "طلا – خارجی – محیط تست" },
                                                { value: "gldZrl", label: "طلا – داخلی – زریال" },
                                                { value: "egldZrl", label: "طلا – خارجی - زریال" },
                                            ]}
                                            onChange={(val) => field.onChange(val)}
                                        />
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

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
                                                /*required={true}
                                                onInvalid={(e: any) => {
                                                    const val = e.target.value;
                                                    if (!val) {
                                                        e.target.setCustomValidity("شماره همراه الزامی است"); // خالی است
                                                    } else if (!/^09\d{9}$/.test(val)) {
                                                        e.target.setCustomValidity("شماره موبایل باید با 09 شروع شود و 11 رقم باشد"); // فرمت اشتباه است
                                                    }
                                                }}
                                                onInput={(e: any) => e.target.setCustomValidity("")} */// پاک کردن پیام وقتی کاربر تایپ کرد
                                            />
                                        </FloatingLabel>
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-wrap gap-6">
                            {/* استان */}
                            <FormField
                                control={form.control}
                                name="provinceId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex-1 min-w-[48%] ">
                                        <FormControl>
                                            <DropSelector
                                                {...field}
                                                placeholder="استان"
                                                options={IranProvinces}
                                                onChange={(val) => {
                                                    field.onChange(val);
                                                    form.setValue("city", ""); // ریست شهر وقتی استان عوض شد
                                                }}
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <FormMessage>{fieldState.error.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* شهر */}
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field, fieldState }) => {
                                    const selectedProvinceId = form.watch("provinceId"); // این باید id باشه
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
                                                    disabled={!selectedProvince}
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
                                                readOnly={isReadOnly}
                                                placeholder="آدرس کامل کسب و کار"
                                            />
                                        </FloatingLabel>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                control={form.control}
                name="hostId"
                render={({field, fieldState}) => (
                    <FormItem className="mt-6">

                        <FormControl>
                            <DropSelector
                                {...field}
                                placeholder="پلتفرم مرجع"
                                options={hostList}
                                onChange={(val) => field.onChange(val)}
                            />
                        </FormControl>
                        {fieldState.error && (
                            <FormMessage>{fieldState.error.message}</FormMessage>
                        )}
                    </FormItem>
                )}
            />*/}

                        {/* وب سایت */}

                        {/*

            <FormField
                control={form.control}
                name="website"
                render={({field, fieldState}) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabel id="website" label="وب سایت"
                                           icon={<Globe className="w-5 h-5 text-gray-400"/>}>
                                <Input
                                    {...field}
                                    type="url"
                                    className="w-full pr-10"
                                    dir="rtl"
                                    readOnly={isReadOnly}
                                    placeholder="https://example.com"
                                />
                            </FloatingLabel>
                        </FormControl>
                        <FormMessage>
                            {fieldState.error?.message}
                        </FormMessage>
                    </FormItem>
                )}
            />

             اینستاگرام
            <FormField
                control={form.control}
                name="instagram"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabel id="instagram" label="اینستاگرام"
                                           icon={<Instagram className="w-5 h-5 text-gray-400"/>}>
                                <Input
                                    {...field}
                                    className="w-full pr-10"
                                    dir="rtl"
                                    readOnly={isReadOnly}
                                    placeholder="@username"
                                />
                            </FloatingLabel>
                        </FormControl>
                    </FormItem>
                )}
            />

             تلگرام
            <FormField
                control={form.control}
                name="telegram"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabel id="telegram" label="تلگرام"
                                           icon={<MessageCircle className="w-5 h-5 text-gray-400"/>}>
                                <Input
                                    {...field}
                                    className="w-full pr-10"
                                    dir="rtl"
                                    readOnly={isReadOnly}
                                    placeholder="@username"
                                />
                            </FloatingLabel>
                        </FormControl>
                    </FormItem>
                )}
            />

             توضیحات
            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabel id="description" label="توضیحات" i>
                                <Textarea
                                    {...field}
                                    className="w-full min-h-[80px]"
                                    dir="rtl"
                                    readOnly={isReadOnly}
                                    placeholder="توضیحات اضافی در مورد کسب و کار"
                                />
                            </FloatingLabel>
                        </FormControl>
                    </FormItem>
                )}
            />*/}

                        {/* Submit */}
                        {!isReadOnly && (
                            <Button
                                type="submit"
                                className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-6 text-lg font-medium rounded-lg"
                                disabled={editPurseMutation.isLoading}
                            >
                                {editPurseMutation.isLoading
                                    ? "در حال ذخیره..."
                                    : isNewAccount
                                        ? "ایجاد حساب"
                                        : "ذخیره تغییرات"}
                            </Button>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
