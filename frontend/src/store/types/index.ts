export interface ICompanyEntity {
  id: string;
  bankAccount: IBankAccount;
  businessType: string;
  country: string;
  currency: string;
  govNumber: string;
  isArchived: boolean;
  legalName: string;
  logo?: null;
  name: string;
  salesTax: boolean;
  HPIO: string;
  timeSheetSettings: ITimeSheetSettings;
  stripeCustomerId: string;
  activePlan: IActivePlan;
  websiteURL: string;
  addresses?: IAddressesEntity[] | null;
  contacts?: IContactsEntity[] | null;
  companyMembers?: ICompanyMembersEntity[] | null;
  role: string;
  owner: string;
  __typename: string;
}
export interface IBankAccount {
  name: string;
  code: string;
  accountNumber: string;
  description: string;
}
export interface ITimeSheetSettings {
  groupEvery: string;
  workingHours: number;
  approvalsEnabled: boolean;
  autoSendInvoices: boolean;
}
export interface IActivePlan {
  id: string;
  company: IShortCompany;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  price: number;
  type: string;
  __typename: string;
}
export interface IShortCompany {
  id: string;
  name: string;
  __typename: string;
}
export interface IAddressesEntity {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postCode: string;
  latitude?: null;
  longitude?: null;
  __typename: string;
}
export interface IContactsEntity {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobileCode: string;
  mobileNumber: string;
  landlineCode: string;
  landlineNumber: string;
  __typename: string;
}
export interface ICompanyMembersEntity {
  id: string;
  company: IShortCompany;
  isArchived: boolean;
  isDeleted: boolean;
  role: string;
  status: string;
  user: IUser;
  __typename: string;
}
export interface IUser {
  id: string;
  contactNumber?: IContactNumber | null;
  email: string;
  firstName?: string | null;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isRoot: boolean;
  jobTitle?: string | null;
  lastName?: string | null;
  password?: string | null;
  secondAuthEnabled: boolean;
  __typename: string;
}
export interface IContactNumber {
  countryCode: string;
  nationalNumber: string;
}

export interface IAttachmentEntity {
  id: string;
  description: string;
  fileName: string;
  label: string;
  url: string;
  s3Bucket: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SupplierTermsOfPayment {
  COD = 'COD',
  DAYS_14 = 'DAYS_14',
  DAYS_30 = 'DAYS_30',
  DAYS_60 = 'DAYS_60',
}

export enum PoStatus {
  OPEN = 'OPEN',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
  PACKED = 'PACKED',
  PARTIALLY_PACKED = 'PARTIALLY_PACKED',
  INVOICED = 'INVOICED',
  RECEIPTED = 'RECEIPTED',
}

export interface ISupplierEntity {
  id: string;
  name: string;
  address: IAddressesEntity[];
  termsOfPayment: SupplierTermsOfPayment;
  bankAccount: Record<string, unknown>;
  emailAddressForRemittance: string;
  company: ICompanyEntity;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseOrderEntity {
  id: string;
  pbsOrganisation: string;
  date: Date;
  orderer: IUser;
  status: PoStatus;
  supplier: ISupplierEntity;
  isPbsPO: boolean;
  poNumber: number;
  preview: IAttachmentEntity;
  company: ICompanyEntity;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
