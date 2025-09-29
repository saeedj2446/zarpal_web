import React, { useState } from "react";
import { Card, CardContent } from "@/components/radix/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Edit, MapPin, Phone, Calendar, User, CreditCard, Flag, Award, Building, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import FileUploader from "@/components/common/FileUploader";
import jMoment from "moment-jalaali";
import { useAuth } from "@/lib/hooks/useAuth";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/radix/collapsible";

const UserProfileCard = ({ onImageUpload, isSubmitting, accountStatus, accountCount }) => {
    const { profile = {} } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        fisrtName = "",
        lastName = "",
        fathersName = "",
        gender = "",
        nationality = "",
        natId = "",
        contact = "",
        birthDate = "",
        type = "",
        score = 0,
        imageId = null,
        provinceLabel = "",
        cityLabel = "",
        purseList=[]
    } = profile || {};

    // نام کامل کاربر
    const fullName = `${fisrtName} ${lastName}`.trim() || "کاربر";

    // فرمت کردن تاریخ تولد
    const formattedBirthDate = birthDate
        ? jMoment(birthDate).format("jYYYY/jMM/jDD")
        : "-";

    // فرمت کردن تاریخ عضویت (اگر وجود داشت)
    const joinDate = profile?.createdOn
        ? jMoment(profile.createdOn).format("jYYYY/jMM/jDD")
        : "-";

    // تبدیل کد جنسیت به متن
    const genderText = gender === "M" ? "مرد" : gender === "F" ? "زن" : "-";

    // تبدیل کد ملیت به متن
    const nationalityText = nationality === "IRI" ? "ایران" : nationality || "-";

    // تبدیل نوع کاربر به متن
    const userTypeText = type === "C" ? "مشتری" : type || "-";

    // وضعیت حساب پیش‌فرض
    const accountStatusText = accountStatus || "فعال";
    const accountStatusColor = accountStatus === "فعال" ? "text-green-600" : "text-yellow-600";

    // فیلدهای مهم (همیشه نمایش داده می‌شوند)
    const importantFields = [
        {
            label: "تاریخ تولد",
            value: formattedBirthDate,
            icon: <Calendar className="w-4 h-4 text-gray-500" />
        },
        {
            label: "وضعیت حساب",
            value: accountStatusText,
            valueClass: accountStatusColor,
            icon: <CheckCircle className="w-4 h-4 text-gray-500" />
        },
        {
            label: "تعداد حساب",
            value: purseList.length,
            icon: <Building className="w-4 h-4 text-gray-500" />
        },
    ];

    // فیلدهای دیگر (با باز شدن بخش اضافی نمایش داده می‌شوند)
    const otherFields = [
        {
            label: "نام پدر",
            value: fathersName || "-",
            icon: <User className="w-4 h-4 text-gray-500" />
        },
        {
            label: "جنسیت",
            value: genderText,
            icon: <span className="w-4 h-4 flex items-center justify-center">
                {gender === "M" ? "👨" : gender === "F" ? "👩" : "👤"}
            </span>
        },
        {
            label: "ملیت",
            value: nationalityText,
            icon: <Flag className="w-4 h-4 text-gray-500" />
        },
        {
            label: "کد ملی",
            value: natId || "-",
            icon: <CreditCard className="w-4 h-4 text-gray-500" />
        },
        {
            label: "تاریخ عضویت",
            value: joinDate,
            icon: <span className="w-4 h-4 flex items-center justify-center">📅</span>
        },
        {
            label: "نوع کاربر",
            value: userTypeText,
            icon: <span className="w-4 h-4 flex items-center justify-center">🏷️</span>
        },
        {
            label: "مکان",
            value: provinceLabel && cityLabel ? `${provinceLabel}، ${cityLabel}` : "-",
            icon: <MapPin className="w-4 h-4 text-gray-500" />
        },
    ];

    return (
        <Card className="mb-6 bg-white shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={imageId ? `/api/files/${imageId}` : "/placeholder-user.jpg"} />
                            <AvatarFallback className="text-2xl bg-[#a85a7a] text-white">
                                {fisrtName?.[0] || lastName?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                            <FileUploader
                                label=""
                                width={36}
                                height={36}
                                autoUpload
                                fileType="image/*"
                                onUploadComplete={onImageUpload}
                                disabled={isSubmitting}
                                className="rounded-full overflow-hidden"
                            >
                                <div className="w-full h-full bg-[#a85a7a] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#8a4a5a] transition-colors">
                                    <Edit className="w-4 h-4" />
                                </div>
                            </FileUploader>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">{fullName}</h2>
                    <div className="flex items-center text-gray-600 mb-4">
                        <Phone className="w-4 h-4 ml-1" />
                        <span>{contact || "-"}</span>
                    </div>

                    {/* امتیاز کاربر */}
                    <div className="flex items-center justify-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm mb-4">
                        <Award className="w-4 h-4 ml-1" />
                        <span>امتیاز: {score}</span>
                    </div>

                    {/* فیلدهای مهم */}
                    <div className="w-full space-y-3 text-sm mb-3">
                        {importantFields.map((field, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div className="flex items-center">
                                    {field.icon}
                                    <span className="text-gray-600 mr-2">{field.label}</span>
                                </div>
                                <span className={`font-medium ${field.valueClass || ""}`}>{field.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* بخش قابل باز شدن */}
                    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
                        <CollapsibleTrigger asChild>
                            <button className="flex items-center justify-center w-full py-2 text-[#a85a7a] font-medium">
                                {isExpanded ? "نمایش کمتر" : "نمایش اطلاعات بیشتر"}
                                {isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                            </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="w-full space-y-3 text-sm mt-3">
                            {otherFields.map((field, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="flex items-center">
                                        {field.icon}
                                        <span className="text-gray-600 mr-2">{field.label}</span>
                                    </div>
                                    <span className="font-medium">{field.value}</span>
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;