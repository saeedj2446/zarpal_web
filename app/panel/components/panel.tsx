"use client";
import React from "react";
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
import TransactionsTable from "./transactions-table";
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
import {useEffect} from "react";

export default function PanelForm() {
  const router = useRouter();
  const { sessionId,logout ,profile={}} = useAuth();

  useEffect(()=>{
    if (!sessionId) {
      router.replace("/login");

    }
  },[])

  const { fisrtName, lastName, fathersName, gender, nationality, natId, contact, birthDate,purseList } = profile;
  const { currentWallet} = useWallet();
  const handleLogout = async () => {
    logout();
    await persistor.purge(); // پاک کردن persisted state
    router.replace("/login");
  };

  const menuItems = [
    {
        title: "درخواست واریز",
        icon: <Receipt className="w-12 h-12 md:w-16 md:h-16" />,
        href: "/request-payment",
        color: "bg-blue-500 hover:bg-blue-600",
      },
      {
        title: "واریز با بارکد",
        icon: <CreditCard className="w-12 h-12 md:w-16 md:h-16" />,
        href: "/payment",
        color: "bg-green-500 hover:bg-green-600",
      },
      {
        title: "واریز مستقیم",
        icon: <List className="w-12 h-12 md:w-16 md:h-16" />,
        href: "/transactions",
        color: "bg-purple-500 hover:bg-purple-600",
      },
      {
        title: "فرم پرداخت",
        icon: <FileText className="w-12 h-12 md:w-16 md:h-16" />,
        href: "/invoice",
        color: "bg-orange-500 hover:bg-orange-600",
      },
      {
        title: "تراکنش ها",
        icon: <FileText className="w-12 h-12 md:w-16 md:h-16" />,
        href: "/withdraw",
        color: "bg-teal-500 hover:bg-teal-600",
      },
      {
        title: "انتقال طلا",
        icon: <FileText className="w-12 h-12 md:w-16 md:h-16" />,
        href: "/gold-delivery",
        color: "bg-yellow-500 hover:bg-yellow-600 text-white font-bold",
      },
  ];

  return (
      <div className="min-h-screen bg-gray-100 font-['iransans-number']">
        {/* Header */}
          <div className="bg-[#a85a7a] text-white p-1 px-2 flex items-center justify-between">
              <Link href="/profile" className="flex items-center gap-3 cursor-pointer">
                  <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder-user.jpg"/>
                      <AvatarFallback>ا</AvatarFallback>
                  </Avatar>
                  <span className="text-lg">{(fisrtName + " " + lastName)}</span>
              </Link>
              <div className="justify-center">
                  {currentWallet && (
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
          <div className="max-w-[1000px] mx-auto ">
              <UserWalletList/>
              <GoldRateBoard/>
              {/* Menu Buttons */}
              <div className="flex flex-wrap justify-center gap-4 p-4">
                  {menuItems.map((item, index) => (
                      <Link key={index} href={item.href}>
                          <Button
                              className={`flex flex-col items-center justify-center gap-2
                                   w-[90px] h-[90px] md:w-[98px] md:h-[98px] ${item.color} text-white 
                                  rounded-xl shadow-lg transition-all duration-200
                                  hover:shadow-xl hover:scale-105`}
                          >
                              {React.cloneElement(item.icon, {className: "w-12 h-12 md:w-16 md:h-16"})}
                              <span className="text-xs font-medium text-center">{item.title}</span>
                          </Button>
                      </Link>
                  ))}
              </div>

              {/* Transactions Table */}
              <div className="px-4 pb-6 mt-12 text-center">
                  وضعیت آخرین درخواستها
              </div>
              <div className="px-4 pb-6">
                  <TransactionsTable showAllTBtn={true} showSort={false} showFilter={false}/>
              </div>
          </div>
      </div>
  );
}