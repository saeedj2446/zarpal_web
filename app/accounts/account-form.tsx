// components/accounts/AccountForm.jsx

"use client";

import React, { useState, useEffect } from "react";
import AccountView from "./AccountView";
import AccountEdit from "./AccountEdit";
import { useWallet } from "@/lib/hooks/useWallet";
import { getLocationTitles } from "@/lib/utils/utils";
import { CurrencyOptionMap } from "@/lib/types";

interface AccountFormProps {
    selectedAccount: any;
    isNewAccount: boolean;
    onCancelNewAccount: () => void;
    onAccountCreated?: (accountId: string) => void;
}

const AccountForm = ({
                         selectedAccount,
                         isNewAccount,
                         onCancelNewAccount,
                         onAccountCreated
                     }: AccountFormProps) => {
    const [editingMode, setEditingMode] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [accountWithLabels, setAccountWithLabels] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // استفاده مستقیم از هوک useWallet برای دسترسی به وضعیت‌ها
    const {
        editPurseMutation,
        addPurseMutation,
        setCurrentWalletValue,
        isAddingPurse  // استفاده مستقیم از وضعیت isLoading
    } = useWallet();

    useEffect(() => {
        setIsMounted(true);
        if (isNewAccount) {
            setEditingMode(true);
        }
    }, [isNewAccount]);

    useEffect(() => {
        if (isMounted && selectedAccount) {
            let updatedAccount = { ...selectedAccount };

            const loc = getLocationTitles(selectedAccount.provinceId, selectedAccount.city) || {};
            updatedAccount.provinceLabel = loc?.province;
            updatedAccount.cityLabel = loc?.city;
            updatedAccount.currencyLabel = CurrencyOptionMap[selectedAccount.currency];

            setAccountWithLabels(updatedAccount);
        } else if (isMounted) {
            setAccountWithLabels(null);
        }
    }, [isMounted, selectedAccount]);

    const handleEdit = () => {
        setEditingMode(true);
    };

    const handleCancel = () => {
        setEditingMode(false);
        if (isNewAccount) {
            onCancelNewAccount();
        }
    };

    const handleSave = async(data) => {
        if (isNewAccount) {
            const res = await addPurseMutation.mutateAsync({
                purse: {
                    ...data,
                    type: "IRI", // نوع پیش‌فرض کیف
                    createdOn: new Date().toISOString(),
                    status: "O", // وضعیت فعال
                    level: {
                        id: 1,
                        title: "سطح پایه",
                        limitList: [],
                        feeList: []
                    }
                }
            });
            setEditingMode(false);
        } else {
            const res = await editPurseMutation.mutate({
                purse: {
                    id: selectedAccount.id,
                    ...data,
                },
            });

            // برای ویرایش، می‌توانیم بلافاصله از حالت ویرایش خارج شویم
            // چون ویرایش معمولاً سریع است و نیاز به انتقال صفحه ندارد
            setEditingMode(false);
        }
    };

    const handlePackagePurchase = (packageId) => {
        console.log("Purchasing package:", packageId);
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
    if (!editingMode) {
        return (
            <AccountView
                account={selectedAccount}
                onEdit={handleEdit}
                onPackagePurchase={handlePackagePurchase}
            />
        );
    }

    // حالت ویرایش/ایجاد - استفاده از وضعیت‌های React Query
    return (
        <AccountEdit
            account={selectedAccount}
            isNewAccount={isNewAccount}
            onSave={handleSave}
            onCancel={handleCancel}
            isSubmitting={isAddingPurse} // استفاده مستقیم از وضعیت isLoading هوک
        />
    );
};

export default AccountForm;