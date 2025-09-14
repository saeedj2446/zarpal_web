import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {generateJWT} from "@/lib/utils/jwt/JWT";
import {generateMac} from "@/lib/utils/jwt/HashPass";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const generateRefreshToken = async (
    clientId = process.env.NEXT_PUBLIC_CLIENT_ID,
    ClientSK =process.env.NEXT_PUBLIC_CLIENT_KEY,
    aud='gp.cytechnology.ir'
) => {
  return generateJWT(
      clientId,
      'Refresh',
      aud,
      30,
      ClientSK,
  );
};
export function increaseStringSize(str = "", num, sp = "0", left = true) {
  str = str.toString();
  let less = num - str.length;
  if (str.length < num) {
    for (let i = 0; i < less; i++) {
      if (left) {
        str = sp + str;
      } else {
        str = str + sp;
      }

    }
  } else {
    str=str.substring(0,num);
  }
  return str;
}

export const generateMyMac = (dataString: string,hexString=process.env.NEXT_PUBLIC_MACKEY || "") => {
  const macKey = [];
  for (let i = 0; i < hexString.length; i += 2) {
    macKey.push("0x" + hexString.slice(i, i + 2));
  }
  return generateMac(dataString, macKey);
};

export const normalizePhoneNumber=(phone: string): string=> {
  if(!phone) return phone;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return "98" + digits.slice(1);
  }
  if (digits.startsWith("98")) {
    return digits;
  }
  return digits;
}

export const hexToBytes=(hex: string): Uint8Array=> {
  if (hex.length % 2 !== 0) {
    throw new Error("رشته هگز باید طولی زوج داشته باشد");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function diffDate(start: string, end: string): number {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  // اختلاف بر حسب میلی‌ثانیه
  const diffMs = endDate.getTime() - startDate.getTime();

  // اختلاف به روز
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

