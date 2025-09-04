import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-['iransans']">
      {/* Header */}
      <div className="bg-[#a85a7a] text-white p-4 text-center relative">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
            <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm transform -skew-x-12"></div>
          </div>
          <span className="text-lg font-medium">
            سامانه مدیریت سرمایه و پرداخت زیربال
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[400px] mx-auto p-4">
        {/* Business Info Card */}
        <Card className="mb-6 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
                <span className="text-green-600 font-bold text-sm">Delvan</span>
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-xl font-bold mb-2">کلینیک زیبایی دلوان</h2>
                <p className="text-gray-600 text-sm mb-3">
                  زیبایی را با دلوان تجربه کنید
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">تلفن :</span>
                <span>۰۲۱-۳۷۳۳۵۴۴</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">تلگرام :</span>
                <span>@Delvinbiuty</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium">اینستاگرام :</span>
                <span>@DelVinSalon</span>
              </div>
              <div className="flex justify-between items-start py-1">
                <span className="font-medium">آدرس :</span>
                <span className="text-right max-w-[200px]">
                  تهران - انتهای خیابان ولیعصر - پلاک ۷۴ واحد ۱۸
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <div className="bg-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="text-center font-medium text-gray-700 mb-4">
            توضیحات : بابت ویزیت دکتر محمود احمدی نژاد
          </h3>

          {/* Image Placeholders */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
            <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
            <div className="bg-white rounded-lg aspect-square border-2 border-dashed border-gray-300"></div>
          </div>

          {/* Payment Button */}
          <Button className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-6 text-xl font-bold mb-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">پرداخت ۲/۵۰۰/۰۰۰ ریال</div>
              <div className="text-sm font-normal flex items-center justify-center gap-2">
                از طریق
                <div className="w-12 h-4 bg-white/30 rounded"></div>
              </div>
            </div>
          </Button>

          {/* Timer */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-center text-gray-600 mb-3 font-medium">
              قابل پرداخت تا
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="text-2xl font-bold text-gray-800">۰</div>
                <div className="text-xs text-gray-600">روز</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="text-2xl font-bold text-gray-800">۰</div>
                <div className="text-xs text-gray-600">ساعت</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="text-2xl font-bold text-gray-800">۰</div>
                <div className="text-xs text-gray-600">دقیقه</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="text-2xl font-bold text-gray-800">۰</div>
                <div className="text-xs text-gray-600">ثانیه</div>
              </div>
            </div>
          </div>

          {/* Payer Info */}
          <div className="bg-gray-300 rounded-lg p-4">
            <div className="text-center text-sm text-gray-700 mb-3 font-medium">
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
