"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import { Eye, Receipt, CreditCard, List, FileText } from "lucide-react";
import Link from "next/link";

export default function HomePageComponent() {
  const menuItems = [
    {
      title: "درخواست پرداخت",
      icon: <Receipt className="w-8 h-8" />,
      href: "/request-payment",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "لینک پرداخت",
      icon: <CreditCard className="w-8 h-8" />,
      href: "/payment",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "تراکنش ها",
      icon: <List className="w-8 h-8" />,
      href: "/transactions",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "صورت حساب",
      icon: <FileText className="w-8 h-8" />,
      href: "/invoice",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "برداشت ریالی",
      icon: <FileText className="w-8 h-8" />,
      href: "/withdraw",
      color: "bg-teal-500 hover:bg-teal-600", // سبز آبی خاص
    },
    {
      title: "تحویل طلا",
      icon: <FileText className="w-8 h-8" />,
      href: "/gold-delivery",
      color: "bg-yellow-500 hover:bg-yellow-600 text-white font-bold", // طلایی
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
        <Card className="mb-8 overflow-hidden">
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

        {/* Menu Buttons */}
        <div className="grid grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                className={`w-full h-32 ${item.color} text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center gap-3`}
              >
                {item.icon}
                <span className="text-lg font-medium">{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
