"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/radix/card";
import { Badge } from "@/components/radix/badge";
import { Button } from "@/components/radix/button";
import { Eye, Calendar, User, CreditCard } from "lucide-react";

export default function TransactionsTable() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock transaction data
  const transactions = [
    {
      id: "TXN001",
      amount: "2,500,000",
      customerName: "مرتضی رئیسی فرد",
      customerPhone: "۰۹۱۳ ۳۶۳ ۹۶۳۷",
      description: "بابت ویزیت دکتر محمود احمدی نژاد",
      status: "pending", // pending, paid, cancelled, expired
      date: "۱۴۰۳/۰۶/۱۰",
      time: "۱۴:۳۰"
    },
    {
      id: "TXN002",
      amount: "1,800,000",
      customerName: "فاطمه احمدی",
      customerPhone: "۰۹۱۲ ۱۲۳ ۴۵۶۷",
      description: "خرید محصولات آرایشی",
      status: "paid",
      date: "۱۴۰۳/۰۶/۰۹",
      time: "۱۰:۱۵"
    },
    {
      id: "TXN003",
      amount: "3,200,000",
      customerName: "علی محمدی",
      customerPhone: "۰۹۱۵ ۹۸۷ ۶۵۴۳",
      description: "خدمات زیبایی",
      status: "cancelled",
      date: "۱۴۰۳/۰۶/۰۸",
      time: "۱۶:۴۵"
    },
    {
      id: "TXN004",
      amount: "950,000",
      customerName: "زهرا کریمی",
      customerPhone: "۰۹۱۷ ۵۵۵ ۱۲۳۴",
      description: "مشاوره تخصصی",
      status: "expired",
      date: "۱۴۰۳/۰۶/۰۷",
      time: "۱۲:۰۰"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'منتظر پرداخت';
      case 'paid': return 'پرداخت شده';
      case 'cancelled': return 'لغو شده';
      case 'expired': return 'منقضی شده';
      default: return 'نامشخص';
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCancelTransaction = (transactionId) => {
    console.log("Cancelling transaction:", transactionId);
    // Handle cancel logic here
  };

  if (selectedTransaction) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">جزئیات تراکنش</CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedTransaction(null)}
              className="text-gray-500"
            >
              بازگشت
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">شناسه تراکنش</label>
              <p className="font-medium">{selectedTransaction.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">مبلغ</label>
              <p className="font-medium text-lg">{selectedTransaction.amount} ریال</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">نام پرداخت کننده</label>
              <p className="font-medium">{selectedTransaction.customerName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">شماره تماس</label>
              <p className="font-medium">{selectedTransaction.customerPhone}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">توضیحات</label>
            <p className="font-medium">{selectedTransaction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">تاریخ</label>
              <p className="font-medium">{selectedTransaction.date}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">ساعت</label>
              <p className="font-medium">{selectedTransaction.time}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">وضعیت</label>
            <Badge className={`${getStatusColor(selectedTransaction.status)} mt-1`}>
              {getStatusText(selectedTransaction.status)}
            </Badge>
          </div>

          {selectedTransaction.status === 'pending' && (
            <div className="pt-4 border-t">
              <Button 
                onClick={() => handleCancelTransaction(selectedTransaction.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                لغو تراکنش
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          آخرین تراکنش ها
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => handleTransactionClick(transaction)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{transaction.customerName}</span>
                </div>
                <Badge className={getStatusColor(transaction.status)}>
                  {getStatusText(transaction.status)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{transaction.description}</span>
                <span className="font-medium text-lg text-[#a85a7a]">
                  {transaction.amount} ریال
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{transaction.date} - {transaction.time}</span>
                </div>
                <span>{transaction.id}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="text-[#a85a7a] border-[#a85a7a]">
            مشاهده همه تراکنش ها
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}