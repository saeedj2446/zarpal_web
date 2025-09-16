"use client";

import { useState } from "react";
import { Input } from "@/components/radix/input";
import { Textarea } from "@/components/radix/textarea";
import { Button } from "@/components/radix/button";
import { Card, CardContent } from "@/components/radix/card";
import { Phone, MapPin, Globe, Instagram, MessageCircle } from "lucide-react";

export default function AccountForm({ selectedAccount, isNewAccount }) {
  const [formData, setFormData] = useState({
    businessName: selectedAccount?.title || "",
    phone: selectedAccount?.phone || "",
    address: selectedAccount?.address || "",
    website: selectedAccount?.website || "",
    instagram: selectedAccount?.instagram || "",
    telegram: selectedAccount?.telegram || "",
    description: selectedAccount?.description || ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const isReadOnly = selectedAccount && selectedAccount.status === 'active';

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-6 text-center">
          {isNewAccount ? "افتتاح حساب جدید" : 
           selectedAccount ? "ویرایش حساب" : "اطلاعات حساب"}
        </h3>

        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              نام کسب و کار
            </label>
            <Input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="text-right bg-white border rounded-lg h-12"
              dir="rtl"
              readOnly={isReadOnly}
              placeholder="نام کسب و کار خود را وارد کنید"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              شماره تماس
            </label>
            <div className="relative">
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="text-right pr-12 bg-white border rounded-lg h-12"
                dir="rtl"
                readOnly={isReadOnly}
                placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              آدرس
            </label>
            <div className="relative">
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="text-right pr-12 min-h-[80px] bg-white border rounded-lg"
                dir="rtl"
                readOnly={isReadOnly}
                placeholder="آدرس کامل کسب و کار"
              />
              <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              وب سایت
            </label>
            <div className="relative">
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="text-right pr-12 bg-white border rounded-lg h-12"
                dir="rtl"
                readOnly={isReadOnly}
                placeholder="https://example.com"
              />
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              اینستاگرام
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="text-right pr-12 bg-white border rounded-lg h-12"
                dir="rtl"
                readOnly={isReadOnly}
                placeholder="@username"
              />
              <Instagram className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Telegram */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              تلگرام
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                className="text-right pr-12 bg-white border rounded-lg h-12"
                dir="rtl"
                readOnly={isReadOnly}
                placeholder="@username"
              />
              <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-right text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="text-right min-h-[80px] bg-white border rounded-lg"
              dir="rtl"
              readOnly={isReadOnly}
              placeholder="توضیحات اضافی در مورد کسب و کار"
            />
          </div>

          {/* Submit Button */}
          {!isReadOnly && (
            <Button 
              onClick={handleSubmit}
              className="w-full bg-[#a85a7a] hover:bg-[#96527a] text-white py-4 text-lg font-medium mt-6 rounded-lg"
            >
              {isNewAccount ? "ایجاد حساب" : "ذخیره تغییرات"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}