import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Input } from "@/components/radix/input";
import { Textarea } from "@/components/radix/textarea";
import { Button } from "@/components/radix/button";
import { Badge } from "@/components/radix/badge";
import { Eye, Phone, Camera, Image } from "lucide-react";

export default function RequestPaymentPage() {
    return (
        <div className="min-h-screen bg-gray-100 font-['iransans']">
            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>ا</AvatarFallback>
                    </Avatar>
                    <span className="text-lg">ابراهیم اصغری پور نیا</span>
                </div>
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-sm font-bold">۱۸</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[800px] mx-auto p-4">
                {/* Business Card */}
                <Card className="mb-6 overflow-hidden">
                    <div className="bg-black text-white p-3 flex items-center justify-between">
                        <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-black font-bold text-sm">۴۵</span>
                        </div>
                        <span className="text-sm">نرخ هر گرم ۸۷۵۳</span>
                    </div>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border">
                                <span className="text-green-600 font-bold text-xs">Delvan</span>
                            </div>
                            <div className="flex-1 text-right">
                                <h2 className="text-lg font-bold mb-1">کلینیک زیبایی دلوان</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>۱۳,۳۵۳ گرم طلا</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="w-12 h-8 bg-yellow-500 rounded"></div>
                            <span className="text-sm text-gray-600">شناسه: ۱۶۱۲ ۱۰۰۰</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Request Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-center text-lg font-bold mb-6 text-gray-800">
                        درخواست واریز با لینک پرداخت
                    </h2>

                    <div className="space-y-4">
                        {/* Phone Number */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                شماره همراه پرداخت کننده
                            </label>
                            <div className="relative">
                                <Input
                                    type="tel"
                                    defaultValue="۰۹۱۳ ۳۶۳ ۹۶۳۷"
                                    className="text-right pr-12"
                                    dir="rtl"
                                />
                                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Payer Title */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                عنوان پرداخت کننده
                            </label>
                            <Input
                                type="text"
                                defaultValue="مرتضی رئیسی فرد"
                                className="text-right"
                                dir="rtl"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                مبلغ به ریال
                            </label>
                            <Input
                                type="text"
                                defaultValue="۲,۵۰۰,۰۰۰"
                                className="text-right"
                                dir="rtl"
                            />
                            <p className="text-xs text-gray-500 text-right mt-1">
                                دویست و پنجاه هزار تومان
                            </p>
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                مقدار به گرم
                            </label>
                            <Input
                                type="text"
                                defaultValue="۱,۳۷۴"
                                className="text-right"
                                dir="rtl"
                            />
                            <p className="text-xs text-gray-500 text-right mt-1">
                                یک گرم و سیصد و بیست و چهار صوت
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                توضیحات
                            </label>
                            <Textarea
                                className="text-right min-h-[80px]"
                                dir="rtl"
                                placeholder="توضیحات اضافی..."
                            />
                        </div>

                        {/* Expiry */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                انقضا
                            </label>
                            <Input
                                type="text"
                                defaultValue="۲۳:۰۹:۰۹  ۱۴۰۴/۰۶/۱۰"
                                className="text-right"
                                dir="rtl"
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                                تصاویر
                            </label>
                            <div className="flex gap-3">
                                <button className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                                    <Camera className="w-8 h-8 text-gray-500" />
                                </button>
                                <button className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                                    <Image className="w-8 h-8 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-3 text-lg font-medium mt-6">
                            ارسال
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
