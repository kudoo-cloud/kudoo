export const COMPANY_MEMBER_ROLE = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  USER: "USER",
};

export const COMPANY_MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
};

export const ERRORS = {
  USER_DOES_NOT_EXIST: "User doesn't exist",
  USER_ALREADY_EXISTS: "User Already Exists",
  PASSWORD_DOES_NOT_MATCH: "Password doesn't match",
  ACCOUNT_NOT_ACTIVE: "Account is not active",
  EMAIL_OR_PASSWORD_NOT_MATCH: "Email or password doesn't match",
  UNAUTHORIZED: "Unauthorized",
  PASSWORD_EMPTY: "Password should not be empty",
  OLD_PASSWORD_DOES_NOT_MATCH: "Old Password doesn't match",
  MEMBER_ALREADY_EXIST: "Member already exists",
  NO_OBJECT_FOUND: (name: string) => `No ${name} found`,
};

const projectBaseUrl = process.env.WEB_BASE_URL;
export const VIZIER_URL = {
  INVITE: (result, type = "", token = "") =>
    `/account-executive/invite/${result}?target_type=${type}&token=${token}`,
  CONFIRM: result => `/account-executive/confirm/${result}`,
  REMEMBER: (result, query) => `/account-executive/remember/${result}?${query}`,
  TIMESHEET_APPROVE: id => `${projectBaseUrl}/timesheets/${id}/approve`,
};

const skelmUrl = process.env.SKELM_BASE_URL;
export const SKELM_URL = {
  CONFIRM: token => `${skelmUrl}/confirm/${token}`,
  ACCEPT_INVITE: (type, token) => `${skelmUrl}/accept-invite/${type}/${token}`,
  RESET_PASSWORD: token => `${skelmUrl}/reset-password/${token}`,
};

export const S3_BUCKET =
  process.env.NODE_ENV === "production" ? "skelm-prod" : "skelm-dev";

export const S3_SIGNED_URL_EXPIRY = 7 * 24 * 3600;

export interface IS3AttachmentData {
  fileName: string;
  id?: string;
  stream: NodeJS.ReadableStream;
  mimetype: string;
}

export const S3_ATTACHMENT = {
  COMPANY_LOGO: {
    type: "COMPANY_LOGO",
    s3Key: (companyId, data: IS3AttachmentData) => `${companyId}/logo/logo.png`,
    permission: "public-read",
  },
  TIMESHEET_ATTACHMENT: {
    type: "TIMESHEET_ATTACHMENT",
    s3Key: (companyId, data: IS3AttachmentData) =>
      `${companyId}/timesheet/${data.id}/attachments/${data.fileName}`,
    permission: "public-read",
  },
  TIMESHEET_PREVIEW: {
    type: "TIMESHEET_PREVIEW",
    s3Key: (companyId, data: IS3AttachmentData) =>
      `${companyId}/timesheet/${data.id}/preview/${data.fileName}`,
    permission: "public-read",
  },
  INVOICE_ATTACHMENT: {
    type: "INVOICE_ATTACHMENT",
    s3Key: (companyId, data: IS3AttachmentData) =>
      `${companyId}/invoice/${data.id}/attachments/${data.fileName}`,
    permission: "public-read",
  },
  INVOICE_PREVIEW: {
    type: "INVOICE_PREVIEW",
    s3Key: (companyId, data: IS3AttachmentData) =>
      `${companyId}/invoice/${data.id}/preview/preview.pdf`,
    permission: "public-read",
  },
  PURCHASE_ORDER_PREVIEW: {
    type: "PURCHASE_ORDER_PREVIEW",
    s3Key: (companyId, data: IS3AttachmentData) =>
      `${companyId}/po/${data.id}/preview/preview.pdf`,
    permission: "public-read",
  },
  PATIENT_BULK_UPLOAD: {
    type: "PATIENT_BULK_UPLOAD",
    s3Key: (companyId, data: IS3AttachmentData) =>
      `${companyId}/patient/bulkUploads/${data.fileName}.csv`,
    permission: "public-read",
  },
};

export enum PlanName {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export const PLAN_TYPE: { [key in PlanName]: key } = {
  FREE: PlanName.FREE,
  PRO: PlanName.PRO,
  ENTERPRISE: PlanName.ENTERPRISE,
};
