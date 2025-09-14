"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/radix/avatar";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Eye, Receipt, CreditCard, List, FileText } from "lucide-react";
import Link from "next/link";
import { Timer } from "@/components/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { persistor } from "@/lib/store/store";
import {useAuth} from "@/lib/hooks/useAuth";
import {useWallet} from "@/lib/hooks/useWallet";
import UserWalletList from "@/app/panel/components/user-wallet-list";
import {diffDate} from "@/lib/utils/utils";
import {setCurrentWallet} from "@/lib/store/slices/walletSlice";
import jMoment from "moment-jalaali";
import GoldRateBoard from "@/app/panel/components/gold-rate-board";




export default function PanelForm() {
  const router = useRouter();
  const { sessionId,logout ,profile={}} = useAuth();

  if (!sessionId) {
    router.replace("/login");
    return null;
  }

  const { fisrtName, lastName, fathersName, gender, nationality, natId, contact, birthDate,purseList } = profile;
  const { currentWallet} = useWallet();
  const handleLogout = async () => {
    logout();
    await persistor.purge(); // پاک کردن persisted state
    router.replace("/login");
  };

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
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      title: "تحویل طلا",
      icon: <FileText className="w-8 h-8" />,
      href: "/gold-delivery",
      color: "bg-yellow-500 hover:bg-yellow-600 text-white font-bold",
    },
  ];

  return (
      <div className="min-h-screen bg-gray-100 font-['iransans-number']">
        {/* Header */}
        <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>ا</AvatarFallback>
                </Avatar>
                <span className="text-lg">{(fisrtName+""+lastName).substring(0,15)}</span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="bg-white rounded-md shadow-md border border-gray-200 w-40 p-1 text-sm"
            >
              <DropdownMenuItem
                  className="px-3 py-1.5 cursor-pointer hover:bg-gray-100 rounded text-gray-600"
                  onClick={() => router.push("/profile")}
              >
                پروفایل
              </DropdownMenuItem>
              <DropdownMenuItem
                  className="px-3 py-1.5 cursor-pointer hover:bg-gray-100 rounded text-gray-600"
                  onClick={handleLogout}
              >
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          {/* Timer */}
          <div className="justify-center">
            {currentWallet &&(
                <Timer
                    totalTime={diffDate(currentWallet.active.usageStart, currentWallet.active.usageEnd)}
                    fillColor={"white"}
                    textColor={"white"}
                    currentTime={diffDate(jMoment().format("YYYY-MM-DD HH:mm:ss"), currentWallet.active.usageEnd)}
                    size={50}
                />
                )
            }

          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[800px] mx-auto p-4 ">

            <UserWalletList
                wallets={purseList}
                onSelectWallet={(wallet) => {

                }}
            />

          {/* Menu Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
                <Link key={index} href={item.href} className="max-w-[260px]">
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
