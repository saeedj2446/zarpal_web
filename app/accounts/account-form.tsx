// components/accounts/AccountForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import AccountView from "./AccountView";
import AccountEdit from "./AccountEdit";
import { useWallet } from "@/lib/hooks/useWallet";
import { getLocationTitles } from "@/lib/utils/utils";
import { CurrencyOptionMap } from "@/lib/types";

const AccountForm = ({ selectedAccount, isNewAccount, onCancelNewAccount }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [accountWithLabels, setAccountWithLabels] = useState(null);
    const { editPurseMutation } = useWallet();

    // برای جلوگیری از خطای Hydration، مطمئن می‌شویم که state اولیه فقط در سمت کلایت تنظیم شود
    useEffect(() => {
        setIsMounted(true);
        // اگر حساب جدید است، مستقیماً به حالت ویرایش برو
        if (isNewAccount) {
            setIsEditing(true);
        }
    }, [isNewAccount]);

    useEffect(() => {
        if (isMounted && selectedAccount) {
            // ایجاد یک کپی از selectedAccount برای افزودن ویژگی‌های جدید
            let updatedAccount = { ...selectedAccount };

            // افزودن برچسب‌های محل
            const loc = getLocationTitles(selectedAccount.provinceId, selectedAccount.city) || {};
            updatedAccount.provinceLabel = loc?.province;
            updatedAccount.cityLabel = loc?.city;
            updatedAccount.currencyLabel = CurrencyOptionMap[selectedAccount.currency];

            // حذف بخش افزودن داده‌های نمونه چون حالا در اسلایدر اضافه شده‌اند

            setAccountWithLabels(updatedAccount);
        } else if (isMounted) {
            setAccountWithLabels(null);
        }
    }, [isMounted, selectedAccount]);
    // افزودن برچسب‌های محلی به حساب
    useEffect(() => {
        if (selectedAccount) {
            const loc = getLocationTitles(selectedAccount.provinceId, selectedAccount.city) || {};
            selectedAccount.provinceLabel = loc?.province;
            selectedAccount.cityLabel = loc?.city;
            selectedAccount.currencyLabel = CurrencyOptionMap[selectedAccount.currency];
        }
    }, [selectedAccount]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // اگر در حال ایجاد حساب جدید هستیم، باید به حساب قبلی برگردیم
        if (isNewAccount) {
            onCancelNewAccount();
        }
    };

    const handleSave = (data) => {
        if (isNewAccount) {
            // منطق ایجاد حساب جدید
            console.log("Create account:", data);
        } else {
            // ویرایش حساب موجود
            editPurseMutation.mutate({
                purse: {
                    id: selectedAccount.id,
                    ...data,
                },
            });
        }

        setIsEditing(false);
    };

    const handlePackagePurchase = (packageId) => {
        console.log("Purchasing package:", packageId);
        // در اینجا می‌توانید منطق خرید بسته را پیاده‌سازی کنید
    };

    // اگر کامپوننت هنوز mount نشده، چیزی نمایش نده
    if (!isMounted) {
        return (
            <div className="bg-white shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a85a7a]"></div>
                    </div>
                </div>
            </div>
        );
    }

    // حالت نمایش اطلاعات (حالت پیش‌فرض)
    if (!isEditing) {
        return (
            <AccountView
                account={selectedAccount}
                onEdit={handleEdit}
                onPackagePurchase={handlePackagePurchase}
            />
        );
    }

    // حالت ویرایش
    return (
        <AccountEdit
            account={selectedAccount}
            isNewAccount={isNewAccount}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
};

export default AccountForm;