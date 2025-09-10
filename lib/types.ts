// Core TypeScript interfaces for the application

// ---------------------
// FeeFunction
export type FeeFunction = "CI" | "CIo" | "CO" | "T";
export const FeeFunctionTitle: Record<FeeFunction, string> = {
  CI: "کارمزد CI",
  CIo: "کارمزد CIo",
  CO: "کارمزد CO",
  T: "کارمزد T",
};

// FeeSide
export type FeeSide = "C" | "D";
export const FeeSideTitle: Record<FeeSide, string> = {
  C: "خرید",
  D: "فروش",
};

// FeeUsage
export type FeeUsage = "P";
export const FeeUsageTitle: Record<FeeUsage, string> = {
  P: "استفاده استاندارد",
};

// LimitFunction
export type LimitFunction = "CI" | "CIo" | "CO" | "T";
export const LimitFunctionTitle: Record<LimitFunction, string> = {
  CI: "حد مجاز CI",
  CIo: "حد مجاز CIo",
  CO: "حد مجاز CO",
  T: "حد مجاز T",
};

// LimitPeriod
export type LimitPeriod = "Forb" | "Trnx" | "Daily";
export const LimitPeriodTitle: Record<LimitPeriod, string> = {
  Forb: "ممنوع",
  Trnx: "تراکنش",
  Daily: "روزانه",
};

// PaymentType
export type PaymentType = "D" | "A" | "P" | "C" | "F";
export const PaymentTypeTitle: Record<PaymentType, string> = {
  D: "نوع D",
  A: "نوع A",
  P: "نوع P",
  C: "نوع C",
  F: "نوع F",
};

// PurseType
export type PurseType = "IRI" | "gld";
export const PurseTypeTitle: Record<PurseType, string> = {
  IRI: "کیف پول ریالی",
  gld: "کیف پول طلا",
};

// PurseStatus
export type PurseStatus = "O" | "E";
export const PurseStatusTitle: Record<PurseStatus, string> = {
  O: "باز",
  E: "بسته",
};

// UserGender
export type UserGender = "M" | "F" | "N";
export const UserGenderTitle: Record<UserGender, string> = {
  M: "مرد",
  F: "زن",
  N: "نامشخص",
};

// UserNationality
export type UserNationality = "IR";
export const UserNationalityTitle: Record<UserNationality, string> = {
  IR: "ایران",
};

// UserType
export type UserType = "C" | "S";
export const UserTypeTitle: Record<UserType, string> = {
  C: "مشتری",
  S: "فروشنده",
};


export interface Dto_Response {
  responseCode: number
  responseData: any
  responseText:string
}
export interface DtoOut_Response {
  sessionId: string
  encPassword: string
  clientTime: string
}
export interface DtoOut_Session {
  response: Dto_Response
}
export interface DtoIn_Otp {
  //sessionId: string
  otp: string
}
export interface DtoIn_Password {
  //sessionId: string
  encPassword: string
  clientTime: string
}

export interface RegisterUserReq {
  natId: number
  contact: string
  birthDate: string
  hostId: number
  recommender: string
  clientTime: string
  mac: string
}



// تعریف اصلی DTO
export interface Dto_Fee {
  id: number;                // Short (M) → شناسه کارمزد
  function: FeeFunction;     // Text(8) (M) → عملیات شامل کارمزد
  side?: FeeSide;            // Char (O) → سمت کارمزد (اختیاری)
  desc: string;              // Text(256) (M) → شرح فرمول کارمزد
  usage: FeeUsage;           // Text(8) (M) → دلیل اخذ کارمزد
  startDate?: string;        // Timestamp (O) → زمان شروع فعال‌سازی
  endDate?: string;          // Timestamp (O) → زمان پایان
}

// ----------------- Dto_Level -----------------
export interface Dto_Level {
  id: number;                // Short (M) → شناسه سطح عملیاتی
  title?: string;            // Text(128) (O) → عنوان
  limitList?: Dto_Limit[];   // List<Dto_Limit> (O) → لیست محدودیت‌ها
  feeList?: Dto_Fee[];       // List<Dto_Fee> (O) → لیست کارمزدها
}
// ----------------- Dto_Limit -----------------



export interface Dto_Limit {
  id: number;               // Short (M) → شناسه محدودیت
  function: LimitFunction;  // Text(8) (M) → عملیات محدود شده
  period: LimitPeriod;      // Text(8) (M) → نوع بازه زمانی محدودیت
  value?: number;           // Money (C) → مبلغ محدودیت (اختیاری)
}


// ----------------- Dto_Permition -----------------



export interface Dto_Permition {
  createdOn: string;         // Timestamp (M) → زمان ایجاد
  usageStart?: string;       // Date (O) → تاریخ شروع
  usageEnd?: string;         // Date (O) → تاریخ پایان
  paymentType?: PaymentType; // Char (O) → نوع پرداخت
  packageId: number;         // Long (M) → شناسه بسته
  packageTitle: string;      // Text(128) (M) → عنوان بسته
}

// ----------------- Dto_Purse -----------------



export interface Dto_Purse {
  id: string;                 // PurseId (M) → شناسه کیف (رشته یکتا)
  title?: string;             // Text(128) (O) → عنوان
  type: PurseType;            // Char (M) → نوع کیف
  createdOn: string;          // Timestamp (M) → زمان افتتاح
  status: PurseStatus;        // Char (M) → وضعیت
  level: Dto_Level;           // Dto_Level[O] (M) → سطح عملیاتی
  active?: Dto_Permition;     // Dto_Permition[O] (O) → مجوز استفاده فعال
  reserved?: Dto_Permition;   // Dto_Permition[O] (O) → مجوز استفاده رزرو
}

// ----------------- Dto_UserProfile -----------------



export interface Dto_UserProfile {
  fisrtName?: string;       // Text(128) (O) → نام
  lastName?: string;        // Text(128) (O) → شهرت
  fathersName?: string;     // Text(128) (O) → نام پدر
  gender?: UserGender;      // Char (O) → جنسیت
  nationality?: UserNationality; // Text(8) (O) → ملیت
  natId: string;            // NatId (M) → کد ملی
  contact?: string;         // CellPhone (O) → شماره تماس (همراه)
  landLine?: string;        // Text(16) (O) → شماره ثابت
  fax?: string;             // Text(16) (O) → فکس
  email?: string;           // Text(64) (O) → ایمیل
  province?: string;        // Text(128) (O) → استان
  city?: string;            // Text(128) (O) → شهرستان
  address?: string;         // Text(256) (O) → بقیه آدرس
  postalCode?: string;      // PostalCode (O) → کد پستی
  birthDate?: string;       // Date (O) → تاریخ تولد
  intFirstName?: string;    // Text(128) (O) → نام بین‌المللی
  intLastName?: string;     // Text(128) (O) → شهرت بین‌المللی
  intFathersName?: string;  // Text(128) (O) → نام پدر بین‌المللی
  createdOn: string;        // Timestamp (M) → تاریخ عضویت
  type: UserType;           // Char (M) → نوع کاربر
  score?: number;           // Short (O) → امتیاز
  avatarId?: number;        // Long (O) → شناسه فایل آواتار
  purseList: Dto_Purse[];   // List<Dto_Purse[O]> (M) → لیست کیف پول‌ها
}

// ----------------- DtoIn_loginStatic -----------------

export interface DtoIn_loginStatic {
  userName: string;      // Text(128) (M) → نام کاربری
  encPassword: string;   // Binary(64) (M) → پسورد رمزنگاری شده (به صورت hex/base64 در رشته ذخیره می‌شود)
  clientTime: string;    // Timestamp (M) → زمان کلاینت
  mac: string;           // Byte(8) (M) → کد امنیتی پیام (معمولاً hex string یا base64)
}

export interface DtoOutLoginStatic {
  sessionId: string;       // 6 بایت
  passChange?: boolean;        // اختیاری، پیش‌فرض false
  userProfile?: Dto_UserProfile[]; // اختیاری
}

export interface ChangePasswordReq {
  phone: string;        // شماره همراه
  nationalId: string;   // کد ملی
  birthDate: string;    // تاریخ تولد، مثل 1402/01/01
  newPassword: string;  // رمز جدید
  confirmPassword: string; // تکرار رمز جدید
}




















export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface CreateTodoRequest {
  todo: string
  completed: boolean
  userId: number
}

export interface UpdateTodoRequest {
  id: number
  todo?: string
  completed?: boolean
}

export interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

export interface TodoState {
  todos: Todo[]
  filter: "all" | "completed" | "incomplete"
  searchQuery: string
  draggedTodo: Todo | null
}

