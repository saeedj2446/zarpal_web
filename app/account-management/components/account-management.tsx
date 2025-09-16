"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AccountSlider from "./account-slider";
import AccountForm from "./account-form";
import PackageSlider from "./package-slider";

export default function AccountManagementComponent() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isNewAccount, setIsNewAccount] = useState(false);

  const handleAccountSelect = (account) => {
    if (account.isNew) {
      setIsNewAccount(true);
      setSelectedAccount(null);
    } else {
      setIsNewAccount(false);
      setSelectedAccount(account);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-['iransans']">
      {/* Header */}
      <div className="bg-[#a85a7a] text-white p-4 flex items-center justify-between">
        <Link href="/profile" className="text-white">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <span className="text-lg font-medium">مدیریت حساب</span>
        <div className="w-6 h-6"></div>
      </div>

      {/* Account Slider */}
      <div className="py-6">
        <AccountSlider onAccountSelect={handleAccountSelect} />
      </div>

      {/* Account Form */}
      <div className="max-w-[400px] mx-auto px-4">
        <AccountForm 
          selectedAccount={selectedAccount} 
          isNewAccount={isNewAccount}
        />
      </div>

      {/* Package Selection */}
      {(isNewAccount || selectedAccount?.status === 'approved') && (
        <div className="mt-8">
          <PackageSlider />
        </div>
      )}
    </div>
  );
}