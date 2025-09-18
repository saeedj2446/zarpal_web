"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { ArrowRight, Edit, Settings, CreditCard, FileText, BarChart3, Shield } from "lucide-react";
import Link from "next/link";
import {useAuth} from "@/lib/hooks/useAuth";

export default function ProfileComponent() {
  const { sessionId,logout ,profile={}} = useAuth();
  const menuItems = [
    {
      title: "مدیریت حساب",
      icon: <CreditCard className="w-6 h-6" />,
      href: "/account-management",
      color: "bg-blue-500"
    },
    {
      title: "گزارشات",
      icon: <BarChart3 className="w-6 h-6" />,
      href: "/reports",
      color: "bg-green-500"
    },
    {
      title: "تنظیمات",
      icon: <Settings className="w-6 h-6" />,
      href: "/settings",
      color: "bg-purple-500"
    },
    {
      title: "امنیت",
      icon: <Shield className="w-6 h-6" />,
      href: "/security",
      color: "bg-red-500"
    },
    {
      title: "اسناد",
      icon: <FileText className="w-6 h-6" />,
      href: "/documents",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-['iransans']">
      {/* Header */}
      <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
        <Link href="/" className="text-white">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <span className="text-lg font-medium">پروفایل کاربری</span>
        <div className="w-6 h-6"></div>
      </div>

      {/* Profile Section */}
      <div className="max-w-[1000px] mx-auto p-4">
        <Card className="mb-6 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-2xl">ا</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 bg-[#a85a7a] text-white rounded-full p-2 shadow-lg">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold mb-2">ابراهیم اصغری پور نیا</h2>
              <p className="text-gray-600 mb-4">۰۹۱۳ ۳۶۳ ۹۶۳۷</p>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">ایمیل:</span>
                  <span>ebrahim@example.com</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">تاریخ عضویت:</span>
                  <span>۱۴۰۳/۰۵/۱۵</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">وضعیت حساب:</span>
                  <span className="text-green-600 font-medium">فعال</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">تعداد حساب:</span>
                  <span className="font-medium">۳ حساب</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`${item.color} text-white rounded-lg p-3`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <Button onClick={logout} className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3">
          خروج از حساب کاربری
        </Button>
      </div>
    </div>
  );
}