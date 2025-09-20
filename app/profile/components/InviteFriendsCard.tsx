"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/radix/card";
import { Button } from "@/components/radix//button";
import {useAuth} from "@/lib/hooks/useAuth";

interface InviteFriendsCardProps {
    inviteCode: string;
}

export default function InviteFriendsCard({ inviteCode }: InviteFriendsCardProps) {
    const [invitedFriends, setInvitedFriends] = useState<string[]>([
        "احسان کاظمی",
        "حمید اصغری",
        "امیر حسین فرجی",
        "مهدی ابراهیمی",
    ]);
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleInvite = () => {
        if (!phoneNumber.trim()) return;

        // فعلا به صورت تستی به لیست اضافه می‌کنیم
        setInvitedFriends([...invitedFriends, phoneNumber]);
        setPhoneNumber("");
    };

    return (
        <Card className="bg-white shadow-md">
            <CardContent className="p-5">
                <h2 className="text-lg font-medium text-center mb-4">دعوت از دوستان</h2>

                {/* کد معرف */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">کد معرف</label>
                    <input
                        type="text"
                        readOnly
                        value={inviteCode}
                        className="w-full p-2 border rounded-lg text-center bg-gray-50"
                    />
                </div>

                {/* لیست دوستان */}
                <div className="mb-4 bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {invitedFriends.map((friend, i) => (
                        <p key={i} className="text-gray-700 mb-1">
                            {friend}
                        </p>
                    ))}
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        تعداد: {invitedFriends.length} نفر
                    </p>
                </div>

                {/* شماره همراه */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">شماره همراه دعوت شونده</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        maxLength={11}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="مثلاً 09120000000"
                        className="w-full p-2 border rounded-lg text-center"
                    />
                </div>

                {/* دکمه دعوت */}
                <Button
                    onClick={handleInvite}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
                >
                    دعوت از دوستان
                </Button>
            </CardContent>
        </Card>
    );
}
