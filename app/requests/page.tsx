"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Request from "@/app/requests/requests";
import {ArrowLeft, CreditCard} from "lucide-react";
import Link from "next/link";


export default function Requestpage() {
  const router = useRouter();
  return (
      <div className="flex flex-col bg-gray-100 font-['iransans-number'] ">
          <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8"/>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-lg">گزارش پرداختها</span>
              </div>
              <Link href="/" className="p-2 rounded-full hover:bg-white/20 flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5"/>
              </Link>
          </div>
          <div className="flex flex-col  px-4 py-6 ">
              <Request/>
          </div>

      </div>
  );
}