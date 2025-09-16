"use client";

import { LoginForm } from "@/app/login/components/login-form";
import {ForgetPasswordForm} from "@/app/forgot-password/forget-password-form";

export default function LoginPage() {
    return (
        <div className="max-w-[1000px] mx-auto p-4 min-h-screen bg-white">
            <ForgetPasswordForm />
        </div>
    );
}
