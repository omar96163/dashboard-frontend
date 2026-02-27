export const ROLES = {
  ADMIN: "admin",
  FREELANCER: "freelancer",
  CLIENT: "client",
};

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: "قيد الانتظار",
  [BOOKING_STATUS.CONFIRMED]: "مؤكد",
  [BOOKING_STATUS.COMPLETED]: "مكتمل",
  [BOOKING_STATUS.CANCELLED]: "ملغي",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "مدير",
  [ROLES.FREELANCER]: "مستقل",
  [ROLES.CLIENT]: "عميل",
};

export const QUERY_STALE_TIME = {
  SHORT: 30 * 1000, // 30 ثانية
  MEDIUM: 60 * 1000, // دقيقة واحدة
  LONG: 5 * 60 * 1000, // 5 دقائق
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_SERVICE_TITLE: 3,
  MAX_SERVICE_DESCRIPTION: 500,
  MIN_SERVICE_DURATION: 30,
  MIN_SERVICE_PRICE: 50,
  MIN_BOOKING_PRICE: 50,
  MAX_BOOKING_NOTES: 500,
};
