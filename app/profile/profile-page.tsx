"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import {
  ArrowRight,
  Edit,
  Settings,
  CreditCard,
  LogOut,
  Lock,
  FileText,
  BarChart3,
  Shield,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import jMoment from "moment-jalaali";
import InviteFriendsCard from "@/app/profile/InviteFriendsCard";
import {useRouter} from "next/navigation";
import UserProfileCard from "@/app/profile/UserProfileCard";

export default function ProfileComponent() {
  const { logout, profile = {} } = useAuth();
  const router = useRouter();
  // 📌 استخراج داده‌ها از پروفایل
  const fullName = `${profile.fisrtName || ""} ${profile.lastName || ""}`.trim();
  const contact = profile.contact || "";
  const birthDate = profile.birthDate
      ? jMoment(profile.birthDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD")
      : "-";
  const joinDate =
      profile.purseList && profile.purseList[0]?.createdOn
          ? jMoment(profile.purseList[0].createdOn, "YYYY-MM-DD HH:mm:ss").format(
              "jYYYY/jMM/jDD"
          )
          : "-";
  const accountCount = profile.purseList ? profile.purseList.length : 0;



  const menuItems = [
    {
      title: "حسابها",
      icon: <CreditCard className="w-7 h-7 text-white" />,
      href: "/account-management",
      color: "bg-pink-500",
      action:()=>router.push("/accounts"),
    },
    {
      title: "کاربر فرعی",
      icon: <UserPlus className="w-7 h-7 text-white" />,
      href: "/sub-users",
      color: "bg-green-500",
    },
    {
      title: "رمز عبور",
      icon: <Lock className="w-7 h-7 text-white" />,
      href: "/change-password",
      color: "bg-blue-500",
    },
    {
      title: "خروج",
      icon: <LogOut className="w-7 h-7 text-white" />,
      href: "/logout",
      color: "bg-gray-500",
      action: logout,
    },
  ];

  return (
      <div className="min-h-screen bg-gray-100 ">
        {/* Header */}
        <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
          <Link href="/" className="text-white">
            <ArrowRight className="w-6 h-6"/>
          </Link>
          <span className="text-lg font-medium">پروفایل کاربری</span>
          <div className="w-6 h-6"></div>
        </div>

        {/* Profile Section */}
        <div className="max-w-[1000px] mx-auto p-4">
          <UserProfileCard/>

          {/* Menu Items */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    onClick={() => (item.action ? item.action() : null)}
                    className="flex flex-col items-center justify-center cursor-pointer p-3 hover:shadow-md transition"
                >
                  <div className={`${item.color} rounded-lg p-3 mb-2`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium">{item.title}</span>
                </div>
            ))}
          </div>


        </div>
       {/* <div className="max-w-[1000px] mx-auto p-4">
          <InviteFriendsCard/>
        </div>*/}

        </div>
        );
        }
