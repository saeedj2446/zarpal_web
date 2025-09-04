import { z } from "zod";

export const loginSchema = z.object({
    phone: z
        .string()
        .min(11, "شماره موبایل باید 11 رقم باشد")
        .max(11, "شماره موبایل باید 11 رقم باشد"),
    password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
});

export const registerStepOneSchema = z.object({
   /* firstName: z.string().min(2, "نام باید حداقل 2 کاراکتر باشد"),
    lastName: z.string().min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد"),*/
    phone: z
        .string()
        .min(11, "شماره موبایل باید 11 رقم باشد")
        .max(11, "شماره موبایل باید 11 رقم باشد"),
    email: z.string().email("ایمیل معتبر وارد کنید").optional().or(z.literal("")),
});

export const registerStepTwoSchema = z.object({
    otp: z
        .string()
        .min(4, "کد تایید باید 4 رقم باشد")
        .max(4, "کد تایید باید 4 رقم باشد"),
});

export const registerStepThreeSchema = z
    .object({
        password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
        confirmPassword: z
            .string()
            .min(6, "تکرار رمز عبور باید حداقل 6 کاراکتر باشد"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "رمز عبور و تکرار آن باید یکسان باشند",
        path: ["confirmPassword"],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterStepOneData = z.infer<typeof registerStepOneSchema>;
export type RegisterStepTwoData = z.infer<typeof registerStepTwoSchema>;
export type RegisterStepThreeData = z.infer<typeof registerStepThreeSchema>;
