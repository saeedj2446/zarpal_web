"use client";

import { LoginForm } from "@/app/login/components/login-form";
import {ChangePasswordForm} from "@/app/change-password/change-password-form";

export default function LoginPage() {
    return (
        <div className="max-w-[800px] mx-auto p-4 min-h-screen bg-white">
            <ChangePasswordForm />
        </div>
    );
}
