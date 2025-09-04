import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { Badge } from "@/components/radix/badge";

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-gray-100 font-['iransans']">
            {/* Header */}
            <div className="bg-[#a85a7a] text-white p-4 text-center">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-6 bg-white rounded flex items-center justify-center">
                        <div className="w-6 h-4 bg-yellow-500 rounded-sm"></div>
                    </div>
                    <span className="text-lg font-medium">
            سامانه مدیریت سرمایه و پرداخت زیربال
          </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[800px] mx-auto p-4">
                {/* Business Info */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border">
                                <span className="text-green-600 font-bold text-xs">Delvan</span>
                            </div>
                            <div className="flex-1 text-right">
                                <h2 className="text-xl font-bold mb-2">کلینیک زیبایی دلوان</h2>
                                <p className="text-gray-600 text-sm mb-3">
                                    زیبایی را با دلوان تجربه کنید
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>تلفن :</span>
                                <span>۰۲۱-۳۷۳۳۵۴۴</span>
                            </div>
                            <div className="flex justify-between">
                                <span>تلگرام :</span>
                                <span>@Delvinbiuty</span>
                            </div>
                            <div className="flex justify-between">
                                <span>اینستاگرام :</span>
                                <span>@DelVinSalon</span>
                            </div>
                            <div className="flex justify-between">
                                <span>آدرس :</span>
                                <span>تهران - انتهای خیابان ولیعصر - پلاک ۷۴ واحد ۱۸</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Details */}
                <div className="bg-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="text-center font-medium text-gray-700 mb-4">
                        توضیحات : بابت ویزیت دکتر محمود احمدی نژاد
                    </h3>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg aspect-square"></div>
                        <div className="bg-white rounded-lg aspect-square"></div>
                        <div className="bg-white rounded-lg aspect-square"></div>
                    </div>

                    {/* Payment Amount */}
                    <Button className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-4 text-xl font-bold mb-4">
                        پرداخت ۲/۵۰۰/۰۰۰ ریال
                        <div className="text-sm font-normal mt-1">
                            از طریق
                            <span className="inline-block w-12 h-4 bg-white/20 rounded ml-1"></span>
                        </div>
                    </Button>

                    {/* Timer */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="text-center text-gray-600 mb-2">قابل پرداخت تا</div>
                        <div className="flex justify-center gap-4 text-2xl font-bold">
                            <div className="text-center">
                                <div>روز</div>
                            </div>
                            <div className="text-center">
                                <div>ساعت</div>
                            </div>
                            <div className="text-center">
                                <div>دقیقه</div>
                            </div>
                            <div className="text-center">
                                <div>ثانیه</div>
                            </div>
                        </div>
                    </div>

                    {/* Payer Info */}
                    <div className="bg-gray-300 rounded-lg p-4">
                        <div className="text-center text-sm text-gray-700 mb-2">
                            پرداخت کننده محترم : مرتضی رئیسی فرد ۰۹۱۳ ۳۶۳ ۹۶۳۷
                        </div>
                        <p className="text-xs text-gray-600 text-center leading-relaxed">
                            از طریق لمس این لینک میتوانید کلیه فاکتورها و پرداخت های انجام شده
                            در پلتفرم زیربال را مشاهده و مدیریت فرمایید.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
