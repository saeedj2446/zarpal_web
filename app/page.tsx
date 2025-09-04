import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Badge } from "@/components/radix/badge";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const menuItems = [
    {
      title: "واریز",
      items: [
        { name: "فرم پرداخت", icon: "📋", href: "/request-payment" },
        { name: "کارخوان", icon: "🧮" },
        { name: "درگاه پرداخت", icon: "🏪" },
        { name: "اسکن QR", icon: "⬜" },
        { name: "لینک پرداخت", icon: "💳", href: "/payment" },
      ],
    },
    {
      title: "برداشت",
      items: [
        { name: "تحویل", icon: "📦" },
        { name: "خرید حضوری", icon: "🛒" },
        { name: "خرید برخط", icon: "🏪" },
        { name: "انتقال به زیربال", icon: "📊" },
        { name: "انتقال داخلی", icon: "👥" },
      ],
    },
    {
      title: "گزارشات",
      items: [
        { name: "سود و زیان", icon: "📈" },
        { name: "آمار ملیقی", icon: "🔗" },
        { name: "آمار تعدادی", icon: "🔢" },
        { name: "تراکنش ها", icon: "📄" },
        { name: "صورتحساب", icon: "📋" },
      ],
    },
    {
      title: "تنظیمات",
      items: [
        { name: "افتتاح حساب", icon: "➕" },
        { name: "کاربر فرعی", icon: "👤" },
        { name: "حساب کاربری", icon: "⭕" },
        { name: "اطلاع رسانی", icon: "📢" },
        { name: "صفحه پرداخت", icon: "💰" },
      ],
    },
  ];

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
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="w-12 h-8 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">شناسه: ۱۶۱۲ ۱۰۰۰</span>
            </div>
          </CardContent>
        </Card>

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {section.title}
                </h3>
                <div className="h-px bg-[#a85a7a] flex-1 mx-4"></div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {section.items.map((item, itemIndex) => {
                  const ButtonComponent = item.href ? Link : "button";
                  const buttonProps = item.href ? { href: item.href } : {};

                  return (
                    <ButtonComponent
                      key={itemIndex}
                      {...buttonProps}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <span className="text-xs text-gray-700">{item.name}</span>
                    </ButtonComponent>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Profile */}
        <div className="mt-8 flex justify-center">
          <button className="flex flex-col items-center gap-2 p-4">
            <div className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xl">👤</span>
            </div>
            <span className="text-sm text-gray-600">مدیریت معرفی</span>
          </button>
        </div>
      </div>
    </div>
  );
}
