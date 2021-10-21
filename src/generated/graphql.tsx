import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Attachment = {
  __typename?: 'Attachment';
  id: Scalars['ID'];
  fileName: Scalars['String'];
  label: Scalars['String'];
  description: Scalars['String'];
  s3Bucket?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  s3Region?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  url: Scalars['String'];
};

export type Contact = {
  __typename?: 'Contact';
  id: Scalars['ID'];
  telegram?: Maybe<Scalars['String']>;
  discord?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  /** default to false */
  isActive: Scalars['Boolean'];
  /** default to false */
  IsDeleted: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  dao: Dao;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Contributor = {
  __typename?: 'Contributor';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  telegramHandle: Scalars['String'];
  discordHandle: Scalars['String'];
  /** Amount */
  amount: Scalars['Float'];
  cChainAddress?: Maybe<Scalars['String']>;
  startDate: Scalars['String'];
  paymentFrequency: PaymentFrequency;
  dao: Dao;
  daoId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  policies?: Maybe<Array<Policy>>;
  payrunDetails?: Maybe<Array<PayrunDetail>>;
};

export type CreateAttachmentInput = {
  fileName: Scalars['String'];
  label: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  s3Bucket: Scalars['String'];
  s3Key: Scalars['String'];
  s3Region: Scalars['String'];
};

export type CreateContactInput = {
  telegram?: Maybe<Scalars['String']>;
  discord?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  jobTitle?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  daoId: Scalars['ID'];
};

export type CreateContributorInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  telegramHandle: Scalars['String'];
  discordHandle: Scalars['String'];
  amount: Scalars['Float'];
  paymentFrequency: PaymentFrequency;
  cChainAddress?: Maybe<Scalars['String']>;
  startDate: Scalars['String'];
  policyIds: Array<Scalars['String']>;
  daoId: Scalars['ID'];
};

export type CreateCustomerInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreateDaoInput = {
  /** Dao name */
  name: Scalars['String'];
  /** Strict legal name as specified in legal status */
  cChainAddress?: Maybe<Scalars['String']>;
  /** Type of the organization */
  currency: Currency;
  /** Dao name) */
  websiteUrl: Scalars['String'];
  /** Dao Logo */
  logo?: Maybe<CreateAttachmentInput>;
};

export type CreateDaoMultisigInput = {
  name: Scalars['String'];
  cChainAddress: Scalars['String'];
  daoId: Scalars['ID'];
};

export type CreateDaomemberInput = {
  role: DaoMemberRole;
  status: DaoMemberStatus;
  daoId: Scalars['ID'];
  user: CreateUserInput;
};

export type CreateInventoryInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreateInvoiceInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreatePayrunDetailInput = {
  payrunId?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  supplierId?: Maybe<Scalars['ID']>;
  contributorId?: Maybe<Scalars['ID']>;
  reoccuringExpenseId?: Maybe<Scalars['ID']>;
  payeeType: PayeeType;
  amount: Scalars['Float'];
  cChainAddress: Scalars['String'];
};

export type CreatePayrunInput = {
  daoId: Scalars['ID'];
  startsAt: Scalars['String'];
  endsAt: Scalars['String'];
  totalAmount: Scalars['Float'];
  payrunDetails: Array<CreatePayrunDetailInput>;
};

export type CreatePoReceiptInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreatePolicyInput = {
  description: Scalars['String'];
  amount: Scalars['Float'];
  paymentFrequency: PolicyPaymentFrequency;
  token?: Maybe<Scalars['String']>;
  daoId: Scalars['ID'];
};

export type CreatePurchaseOrderInput = {
  date: Scalars['DateTime'];
  status: PoStatus;
  /** default to false */
  IsArchived?: Maybe<Scalars['Boolean']>;
  /** default to false */
  isPbsPO?: Maybe<Scalars['Boolean']>;
  /** TBD */
  poNumber: Scalars['Int'];
  supplier_id: Scalars['ID'];
  orderer_id: Scalars['ID'];
  dao_id: Scalars['ID'];
};

export type CreatePurchaseOrderLineInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreateRegisteredServiceInput = {
  billingType: ServiceBillingType;
  daoId: Scalars['ID'];
  /** default to true */
  IsTemplate?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  currency?: Maybe<Currency>;
  /** ... */
  totalAmount?: Maybe<Scalars['Float']>;
};

export type CreateReoccuringExpenseInput = {
  supplierId: Scalars['ID'];
  amount: Scalars['Float'];
  reoccuringFrequency: ReoccuringFrequency;
  daoId: Scalars['ID'];
};

export type CreateSupplierInput = {
  name: Scalars['String'];
  termsOfPayment: SupplierTermsOfPayment;
  cChainAddress?: Maybe<Scalars['String']>;
  emailAddressForRemittance?: Maybe<Scalars['String']>;
  telegramId: Scalars['String'];
  discordId: Scalars['String'];
  currency: Currency;
  amount: Scalars['Float'];
  paymentFrequency: PaymentFrequency;
  type: SupplierType;
  daoId: Scalars['ID'];
};

export type CreateTimesheetEntryInput = {
  serviceId: Scalars['ID'];
  duration: Scalars['Float'];
  date: Scalars['String'];
  timesheetId?: Maybe<Scalars['ID']>;
};

export type CreateTimesheetInput = {
  supplierId: Scalars['ID'];
  number?: Maybe<Scalars['Int']>;
  status: TimeSheetStatus;
  daoId: Scalars['ID'];
  startsAt: Scalars['String'];
  endsAt: Scalars['String'];
  timeSheetEntries: Array<UpdateManyTimesheetEntryInput>;
};

export type CreateUserInput = {
  discord?: Maybe<Scalars['String']>;
  telegram?: Maybe<Scalars['String']>;
  cChainAddress?: Maybe<Scalars['String']>;
  /** User email, only unique supported */
  email?: Maybe<Scalars['String']>;
  jobTitle: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

/** List of supported currencies for payment */
export enum Currency {
  Avax = 'AVAX',
  Png = 'PNG'
}

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['ID'];
  dao: Dao;
  name: Scalars['String'];
  description: Scalars['String'];
  govNumber: Scalars['String'];
  /** default to true */
  salesTax: Scalars['Boolean'];
  billingFrequency: SupplierTermsOfPayment;
  /** default to false */
  IsArchived: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  invoices?: Maybe<Array<Maybe<Invoice>>>;
};

export enum DaoMemberRole {
  MultiSig = 'MultiSig',
  CommunityContributor = 'CommunityContributor'
}

export enum DaoMemberStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export type Dao = {
  __typename?: 'Dao';
  id: Scalars['ID'];
  cChainAddress?: Maybe<Scalars['String']>;
  currency: Currency;
  /** default to false */
  IsArchived: Scalars['Boolean'];
  logo?: Maybe<Attachment>;
  name: Scalars['String'];
  websiteUrl: Scalars['String'];
  contacts?: Maybe<Array<Maybe<Contact>>>;
  daomembers?: Maybe<Array<Maybe<Daomember>>>;
  daoMultisig?: Maybe<Array<Maybe<DaoMultisig>>>;
  registeredServices?: Maybe<Array<Maybe<RegisteredService>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  purchaseOrders?: Maybe<Array<Maybe<PurchaseOrder>>>;
  inventories?: Maybe<Array<Maybe<Inventory>>>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  invoices?: Maybe<Array<Maybe<Invoice>>>;
};

export type DaoMultisig = {
  __typename?: 'DaoMultisig';
  id: Scalars['ID'];
  name: Scalars['String'];
  cChainAddress?: Maybe<Scalars['String']>;
  dao: Dao;
  daoId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Daomember = {
  __typename?: 'Daomember';
  id: Scalars['ID'];
  dao?: Maybe<Dao>;
  user?: Maybe<User>;
  role: DaoMemberRole;
  status: DaoMemberStatus;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
};


export type GetUploadSignedUrlOutput = {
  __typename?: 'GetUploadSignedUrlOutput';
  url: Scalars['String'];
  s3Bucket: Scalars['String'];
  s3Key: Scalars['String'];
  s3Region: Scalars['String'];
};

export type Inventory = {
  __typename?: 'Inventory';
  id: Scalars['ID'];
  name: Scalars['String'];
  inventoryModel?: Maybe<InventoryModel>;
  uom?: Maybe<Uom>;
  /** TBD */
  price?: Maybe<Scalars['Float']>;
  /** TBD */
  sellingPrice?: Maybe<Scalars['Float']>;
  dao?: Maybe<Dao>;
  /** default to false */
  IsArchived: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum InventoryModel {
  Fifo = 'FIFO',
  Lifo = 'LIFO',
  WeightedAverage = 'WEIGHTED_AVERAGE'
}

export type Invoice = {
  __typename?: 'Invoice';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  buyer: Customer;
  /** TBD */
  number: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  invoiceDate?: Maybe<Scalars['DateTime']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  preview?: Maybe<Attachment>;
  seller?: Maybe<Dao>;
  status?: Maybe<InvoiceStatus>;
  type?: Maybe<InvoiceType>;
  /** TBD */
  total?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum InvoiceStatus {
  Approved = 'APPROVED',
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  FullyPaid = 'FULLY_PAID',
  PartiallyPaid = 'PARTIALLY_PAID',
  Unpaid = 'UNPAID',
  Proposed = 'PROPOSED',
  Rejected = 'REJECTED'
}

export enum InvoiceType {
  Project = 'PROJECT',
  Timesheet = 'TIMESHEET',
  TimesheetWithDetails = 'TIMESHEET_WITH_DETAILS',
  FreeText = 'FREE_TEXT'
}

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  updateUser: User;
  deleteUser: Dao;
  createDao: Dao;
  updateDao: Dao;
  archiveDao: Dao;
  unarchiveDao: Dao;
  deleteDao: Dao;
  createDaomember: Daomember;
  updateDaomember: Daomember;
  archiveDaomember: Daomember;
  unarchiveDaomember: Daomember;
  deleteDaomember: Daomember;
  createContact: Contact;
  updateContact: Contact;
  deleteContact: Contact;
  createInventory: Inventory;
  updateInventory: Inventory;
  removeInventory: Inventory;
  createAttachment: Attachment;
  getUploadSignedUrl: GetUploadSignedUrlOutput;
  createSupplier: Supplier;
  updateSupplier: Supplier;
  archiveSupplier: Supplier;
  unarchiveSupplier: Supplier;
  deleteSupplier: Supplier;
  createRegisteredService: RegisteredService;
  updateRegisteredService: RegisteredService;
  archiveRegisteredService: RegisteredService;
  unarchiveRegisteredService: RegisteredService;
  deleteRegisteredService: RegisteredService;
  createPurchaseOrder: PurchaseOrder;
  updatePurchaseOrder: PurchaseOrder;
  deletePurchaseOrder: PurchaseOrder;
  createPoReceipt: PoReceipt;
  updatePoReceipt: PoReceipt;
  removePoReceipt: PoReceipt;
  createPurchaseOrderLine: PurchaseOrderLine;
  updatePurchaseOrderLine: PurchaseOrderLine;
  removePurchaseOrderLine: PurchaseOrderLine;
  createCustomer: Customer;
  updateCustomer: Customer;
  removeCustomer: Customer;
  createInvoice: Invoice;
  updateInvoice: Invoice;
  removeInvoice: Invoice;
  createContributor: Contributor;
  updateContributor: Contributor;
  archiveContributor: Contributor;
  unarchiveContributor: Contributor;
  deleteContributor: Contributor;
  createPolicy: Policy;
  updatePolicy: Policy;
  archivePolicy: Policy;
  unarchivePolicy: Policy;
  deletePolicy: Policy;
  createReoccuringExpense: ReoccuringExpense;
  updateReoccuringExpense: ReoccuringExpense;
  archiveReoccuringExpense: ReoccuringExpense;
  unarchiveReoccuringExpense: ReoccuringExpense;
  deleteReoccuringExpense: ReoccuringExpense;
  createDaoMultisig: DaoMultisig;
  updateDaoMultisig: DaoMultisig;
  updateManyDaoMultisigs: Array<DaoMultisig>;
  archiveDaoMultisig: DaoMultisig;
  unarchiveDaoMultisig: DaoMultisig;
  deleteDaoMultisig: DaoMultisig;
  createTimesheet: Timesheet;
  updateTimesheet: Timesheet;
  archiveTimesheet: Timesheet;
  unarchiveTimesheet: Timesheet;
  deleteTimesheet: Timesheet;
  createTimesheetEntry: TimesheetEntry;
  updateTimesheetEntry: TimesheetEntry;
  archiveTimesheetEntry: TimesheetEntry;
  unarchiveTimesheetEntry: TimesheetEntry;
  deleteTimesheetEntry: TimesheetEntry;
  createPayrun: Payrun;
  archivePayrun: Payrun;
  unarchivePayrun: Payrun;
  deletePayrun: Payrun;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationCreateDaoArgs = {
  createDaoInput: CreateDaoInput;
};


export type MutationUpdateDaoArgs = {
  updateDaoInput: UpdateDaoInput;
};


export type MutationArchiveDaoArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveDaoArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDaoArgs = {
  id: Scalars['ID'];
};


export type MutationCreateDaomemberArgs = {
  createDaomemberInput: CreateDaomemberInput;
};


export type MutationUpdateDaomemberArgs = {
  updateDaomemberInput: UpdateDaomemberInput;
};


export type MutationArchiveDaomemberArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveDaomemberArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDaomemberArgs = {
  id: Scalars['ID'];
};


export type MutationCreateContactArgs = {
  createContactInput: CreateContactInput;
};


export type MutationUpdateContactArgs = {
  updateContactInput: UpdateContactInput;
};


export type MutationDeleteContactArgs = {
  id: Scalars['ID'];
};


export type MutationCreateInventoryArgs = {
  createInventoryInput: CreateInventoryInput;
};


export type MutationUpdateInventoryArgs = {
  updateInventoryInput: UpdateInventoryInput;
};


export type MutationRemoveInventoryArgs = {
  id: Scalars['Int'];
};


export type MutationCreateAttachmentArgs = {
  createAttachmentInput: CreateAttachmentInput;
};


export type MutationGetUploadSignedUrlArgs = {
  mimeType: Scalars['String'];
  s3Key: Scalars['String'];
};


export type MutationCreateSupplierArgs = {
  createSupplierInput: CreateSupplierInput;
};


export type MutationUpdateSupplierArgs = {
  updateSupplierInput: UpdateSupplierInput;
};


export type MutationArchiveSupplierArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveSupplierArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSupplierArgs = {
  id: Scalars['ID'];
};


export type MutationCreateRegisteredServiceArgs = {
  data: CreateRegisteredServiceInput;
};


export type MutationUpdateRegisteredServiceArgs = {
  data: UpdateRegisteredServiceInput;
};


export type MutationArchiveRegisteredServiceArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveRegisteredServiceArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRegisteredServiceArgs = {
  id: Scalars['ID'];
};


export type MutationCreatePurchaseOrderArgs = {
  createPurchaseOrderInput: CreatePurchaseOrderInput;
};


export type MutationUpdatePurchaseOrderArgs = {
  updatePurchaseOrderInput: UpdatePurchaseOrderInput;
};


export type MutationDeletePurchaseOrderArgs = {
  id: Scalars['ID'];
};


export type MutationCreatePoReceiptArgs = {
  createPoReceiptInput: CreatePoReceiptInput;
};


export type MutationUpdatePoReceiptArgs = {
  updatePoReceiptInput: UpdatePoReceiptInput;
};


export type MutationRemovePoReceiptArgs = {
  id: Scalars['Int'];
};


export type MutationCreatePurchaseOrderLineArgs = {
  createPurchaseOrderLineInput: CreatePurchaseOrderLineInput;
};


export type MutationUpdatePurchaseOrderLineArgs = {
  updatePurchaseOrderLineInput: UpdatePurchaseOrderLineInput;
};


export type MutationRemovePurchaseOrderLineArgs = {
  id: Scalars['Int'];
};


export type MutationCreateCustomerArgs = {
  createCustomerInput: CreateCustomerInput;
};


export type MutationUpdateCustomerArgs = {
  updateCustomerInput: UpdateCustomerInput;
};


export type MutationRemoveCustomerArgs = {
  id: Scalars['Int'];
};


export type MutationCreateInvoiceArgs = {
  createInvoiceInput: CreateInvoiceInput;
};


export type MutationUpdateInvoiceArgs = {
  updateInvoiceInput: UpdateInvoiceInput;
};


export type MutationRemoveInvoiceArgs = {
  id: Scalars['Int'];
};


export type MutationCreateContributorArgs = {
  createContributorInput: CreateContributorInput;
};


export type MutationUpdateContributorArgs = {
  updateContributorInput: UpdateContributorInput;
};


export type MutationArchiveContributorArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveContributorArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteContributorArgs = {
  id: Scalars['ID'];
};


export type MutationCreatePolicyArgs = {
  createPolicyInput: CreatePolicyInput;
};


export type MutationUpdatePolicyArgs = {
  updatePolicyInput: UpdatePolicyInput;
};


export type MutationArchivePolicyArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchivePolicyArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePolicyArgs = {
  id: Scalars['ID'];
};


export type MutationCreateReoccuringExpenseArgs = {
  createReoccuringExpenseInput: CreateReoccuringExpenseInput;
};


export type MutationUpdateReoccuringExpenseArgs = {
  updateReoccuringExpenseInput: UpdateReoccuringExpenseInput;
};


export type MutationArchiveReoccuringExpenseArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveReoccuringExpenseArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteReoccuringExpenseArgs = {
  id: Scalars['ID'];
};


export type MutationCreateDaoMultisigArgs = {
  data: CreateDaoMultisigInput;
};


export type MutationUpdateDaoMultisigArgs = {
  data: UpdateDaoMultisigInput;
};


export type MutationUpdateManyDaoMultisigsArgs = {
  data: Array<UpdateManyDaoMultisigInput>;
};


export type MutationArchiveDaoMultisigArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveDaoMultisigArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDaoMultisigArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTimesheetArgs = {
  data: CreateTimesheetInput;
};


export type MutationUpdateTimesheetArgs = {
  data: UpdateTimesheetInput;
};


export type MutationArchiveTimesheetArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveTimesheetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTimesheetArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTimesheetEntryArgs = {
  data: CreateTimesheetEntryInput;
};


export type MutationUpdateTimesheetEntryArgs = {
  data: UpdateTimesheetEntryInput;
};


export type MutationArchiveTimesheetEntryArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchiveTimesheetEntryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTimesheetEntryArgs = {
  id: Scalars['ID'];
};


export type MutationCreatePayrunArgs = {
  data: CreatePayrunInput;
};


export type MutationArchivePayrunArgs = {
  id: Scalars['ID'];
};


export type MutationUnarchivePayrunArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePayrunArgs = {
  id: Scalars['ID'];
};

export enum PayeeType {
  Contributor = 'Contributor',
  Supplier = 'Supplier',
  ReoccuringExpense = 'ReoccuringExpense'
}

export enum PaymentFrequency {
  Monthly = 'Monthly',
  Fortnightly = 'Fortnightly'
}

export type Payrun = {
  __typename?: 'Payrun';
  id: Scalars['ID'];
  dao: Dao;
  daoId: Scalars['String'];
  /** Amount */
  totalAmount: Scalars['Float'];
  startsAt: Scalars['String'];
  endsAt: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  payrunDetails?: Maybe<Array<Maybe<PayrunDetail>>>;
};

export type PayrunDetail = {
  __typename?: 'PayrunDetail';
  id: Scalars['ID'];
  name: Scalars['String'];
  supplier?: Maybe<Supplier>;
  supplierId?: Maybe<Scalars['ID']>;
  contributor?: Maybe<Contributor>;
  contributorId?: Maybe<Scalars['ID']>;
  reoccuringExpense?: Maybe<ReoccuringExpense>;
  reoccuringExpenseId?: Maybe<Scalars['ID']>;
  cChainAddress?: Maybe<Scalars['String']>;
  /** Amount */
  amount: Scalars['Float'];
  payeeType: PayeeType;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  payrun?: Maybe<Payrun>;
};

export type PayrunDetailResponse = {
  __typename?: 'PayrunDetailResponse';
  name: Scalars['String'];
  supplierId?: Maybe<Scalars['ID']>;
  contributorId?: Maybe<Scalars['ID']>;
  reoccuringExpenseId?: Maybe<Scalars['ID']>;
  payeeType: PayeeType;
  amount: Scalars['Float'];
  cChainAddress: Scalars['String'];
};

export type PayrunQueryInput = {
  payrunType: PayrunType;
  daoId: Scalars['ID'];
  includeCoreContributor?: Maybe<Scalars['Boolean']>;
  includeSuppliers?: Maybe<Scalars['Boolean']>;
  includeReoccuringPayments?: Maybe<Scalars['Boolean']>;
};

export enum PayrunType {
  FirstOfMonth = 'FIRST_OF_MONTH',
  FifteenOfMonth = 'FIFTEEN_OF_MONTH'
}

export type PoReceipt = {
  __typename?: 'PoReceipt';
  id: Scalars['ID'];
  receiptNumber?: Maybe<Scalars['String']>;
  /** default to false */
  IsArchived: Scalars['Boolean'];
  purchaseOrder?: Maybe<PurchaseOrder>;
  receiptDate?: Maybe<Scalars['DateTime']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum PoStatus {
  Open = 'OPEN',
  Confirmed = 'CONFIRMED',
  Delivered = 'DELIVERED',
  PartiallyDelivered = 'PARTIALLY_DELIVERED',
  Packed = 'PACKED',
  PartiallyPacked = 'PARTIALLY_PACKED',
  Invoiced = 'INVOICED',
  Receipted = 'RECEIPTED'
}

export type Policy = {
  __typename?: 'Policy';
  id: Scalars['ID'];
  description: Scalars['String'];
  /** Amount */
  amount: Scalars['Float'];
  token?: Maybe<Scalars['String']>;
  paymentFrequency: PolicyPaymentFrequency;
  dao: Dao;
  daoId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum PolicyPaymentFrequency {
  Esd = 'ESD',
  Monthly = 'Monthly',
  Fortnightly = 'Fortnightly'
}

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  id: Scalars['ID'];
  date: Scalars['DateTime'];
  status: PoStatus;
  /** default to false */
  IsArchived: Scalars['Boolean'];
  /** default to false */
  isPbsPO?: Maybe<Scalars['Boolean']>;
  /** TBD */
  poNumber: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  supplier?: Maybe<Supplier>;
  dao: Dao;
  preview?: Maybe<Attachment>;
};

export type PurchaseOrderLine = {
  __typename?: 'PurchaseOrderLine';
  id: Scalars['ID'];
  item?: Maybe<Inventory>;
  /** TBD */
  qty: Scalars['Int'];
  unit?: Maybe<Uom>;
  /** TBD */
  unitPrice?: Maybe<Scalars['Float']>;
  purchaseOrder?: Maybe<PurchaseOrder>;
  poReceipt?: Maybe<PoReceipt>;
  /** default to false */
  IsArchived: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  user: User;
  daos: Array<Dao>;
  dao: Dao;
  daomember: Daomember;
  daomembers: Array<Daomember>;
  daomembersByDao: Array<Daomember>;
  contacts: Array<Contact>;
  contact: Contact;
  inventories: Array<Inventory>;
  inventory: Inventory;
  attachment: Attachment;
  supplier: Supplier;
  suppliersByDao: Array<Supplier>;
  suppliers: Array<Supplier>;
  registeredServiceByDao: Array<RegisteredService>;
  registeredServices: Array<RegisteredService>;
  registeredService: RegisteredService;
  purchaseOrders: Array<PurchaseOrder>;
  purchaseOrder: PurchaseOrder;
  poReceipts: Array<PoReceipt>;
  poReceipt: PoReceipt;
  purchaseOrderLines: Array<PurchaseOrderLine>;
  purchaseOrderLine: PurchaseOrderLine;
  customer: Customer;
  invoice: Invoice;
  contributor: Contributor;
  contributorsByDao: Array<Contributor>;
  contributors: Array<Contributor>;
  policy: Policy;
  policiesByDao: Array<Policy>;
  policies: Array<Policy>;
  reoccuringExpense: ReoccuringExpense;
  reoccuringExpensesByDao: Array<ReoccuringExpense>;
  reoccuringExpenses: Array<ReoccuringExpense>;
  daoMultisigsByDao: Array<DaoMultisig>;
  daoMultisigs: Array<DaoMultisig>;
  timesheet: Timesheet;
  timesheetsByDao: Array<Timesheet>;
  timesheets: Array<Timesheet>;
  timesheetEntry: TimesheetEntry;
  timesheetEntries: Array<TimesheetEntry>;
  payrun: Payrun;
  payrunsByDao: Array<Payrun>;
  payruns: Array<Payrun>;
  payrunDetails: Array<PayrunDetail>;
  getPayrunDetailsByDao: Array<PayrunDetailResponse>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryDaoArgs = {
  id: Scalars['String'];
};


export type QueryDaomemberArgs = {
  id: Scalars['String'];
};


export type QueryDaomembersByDaoArgs = {
  daoId: Scalars['ID'];
};


export type QueryContactArgs = {
  id: Scalars['String'];
};


export type QueryInventoryArgs = {
  id: Scalars['Int'];
};


export type QueryAttachmentArgs = {
  id: Scalars['String'];
};


export type QuerySupplierArgs = {
  id: Scalars['String'];
};


export type QuerySuppliersByDaoArgs = {
  daoId: Scalars['String'];
};


export type QueryRegisteredServiceByDaoArgs = {
  billingType?: Maybe<ServiceBillingType>;
  archived?: Maybe<Scalars['Boolean']>;
  daoId: Scalars['String'];
};


export type QueryRegisteredServiceArgs = {
  id: Scalars['String'];
};


export type QueryPurchaseOrderArgs = {
  id: Scalars['ID'];
};


export type QueryPoReceiptArgs = {
  id: Scalars['Int'];
};


export type QueryPurchaseOrderLineArgs = {
  id: Scalars['Int'];
};


export type QueryCustomerArgs = {
  id: Scalars['Int'];
};


export type QueryInvoiceArgs = {
  id: Scalars['Int'];
};


export type QueryContributorArgs = {
  id: Scalars['String'];
};


export type QueryContributorsByDaoArgs = {
  daoId: Scalars['String'];
};


export type QueryPolicyArgs = {
  id: Scalars['String'];
};


export type QueryPoliciesByDaoArgs = {
  daoId: Scalars['String'];
};


export type QueryReoccuringExpenseArgs = {
  id: Scalars['String'];
};


export type QueryReoccuringExpensesByDaoArgs = {
  daoId: Scalars['String'];
};


export type QueryDaoMultisigsByDaoArgs = {
  daoId: Scalars['String'];
};


export type QueryTimesheetArgs = {
  id: Scalars['String'];
};


export type QueryTimesheetsByDaoArgs = {
  data: TimesheetQueryInput;
};


export type QueryTimesheetEntryArgs = {
  id: Scalars['String'];
};


export type QueryPayrunArgs = {
  id: Scalars['String'];
};


export type QueryPayrunsByDaoArgs = {
  daoId: Scalars['String'];
};


export type QueryGetPayrunDetailsByDaoArgs = {
  data: PayrunQueryInput;
};

export type RegisteredService = {
  __typename?: 'RegisteredService';
  id: Scalars['ID'];
  billingType: ServiceBillingType;
  dao?: Maybe<Dao>;
  /** default to true */
  IsTemplate?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  currency?: Maybe<Currency>;
  /** ... */
  totalAmount?: Maybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ReoccuringExpense = {
  __typename?: 'ReoccuringExpense';
  id: Scalars['ID'];
  supplier?: Maybe<Supplier>;
  /** Amount */
  amount: Scalars['Float'];
  reoccuringFrequency: ReoccuringFrequency;
  dao: Dao;
  daoId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  payrunDetails?: Maybe<Array<PayrunDetail>>;
};

export enum ReoccuringFrequency {
  Monthly = 'Monthly',
  Fortnightly = 'Fortnightly'
}

export enum ServiceBillingType {
  Fixed = 'FIXED',
  TimeBased = 'TIME_BASED'
}

export type Supplier = {
  __typename?: 'Supplier';
  id: Scalars['ID'];
  name: Scalars['String'];
  termsOfPayment: SupplierTermsOfPayment;
  cChainAddress?: Maybe<Scalars['String']>;
  emailAddressForRemittance?: Maybe<Scalars['String']>;
  telegramId: Scalars['String'];
  discordId: Scalars['String'];
  currency: Currency;
  /** Amount */
  amount: Scalars['Float'];
  paymentFrequency: PaymentFrequency;
  type: SupplierType;
  dao: Dao;
  daoId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  purchaseOrders?: Maybe<Array<Maybe<PurchaseOrder>>>;
  timesheets?: Maybe<Array<Maybe<Timesheet>>>;
  payrunDetails?: Maybe<Array<PayrunDetail>>;
};

/** Terms of payment in days */
export enum SupplierTermsOfPayment {
  Cod = 'COD',
  Days_14 = 'DAYS_14',
  Days_30 = 'DAYS_30',
  Days_60 = 'DAYS_60'
}

/** Types of Supplier */
export enum SupplierType {
  Dev = 'Dev',
  Mod = 'Mod',
  Intern = 'Intern',
  Advisor = 'Advisor'
}

export enum TimeSheetStatus {
  Approved = 'APPROVED',
  Draft = 'DRAFT',
  Finalised = 'FINALISED'
}

export type Timesheet = {
  __typename?: 'Timesheet';
  id: Scalars['ID'];
  supplier: Supplier;
  supplierId?: Maybe<Scalars['ID']>;
  dao: Dao;
  daoId: Scalars['String'];
  /** Number */
  number?: Maybe<Scalars['Float']>;
  status: TimeSheetStatus;
  preview?: Maybe<Attachment>;
  startsAt: Scalars['String'];
  endsAt: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  timeSheetEntries?: Maybe<Array<Maybe<TimesheetEntry>>>;
};

export type TimesheetEntry = {
  __typename?: 'TimesheetEntry';
  id: Scalars['ID'];
  service: RegisteredService;
  /** Duration */
  duration: Scalars['Float'];
  /** default to false */
  isInvoiced?: Maybe<Scalars['Boolean']>;
  /** default to false */
  isPaid?: Maybe<Scalars['Boolean']>;
  date: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  timesheet?: Maybe<Timesheet>;
};

export type TimesheetQueryInput = {
  supplierIds?: Maybe<Array<Scalars['String']>>;
  status?: Maybe<TimeSheetStatus>;
  daoId: Scalars['ID'];
  archived?: Maybe<Scalars['Boolean']>;
};

export enum Uom {
  Ea = 'EA'
}

export type UpdateAttachmentInput = {
  fileName?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  s3Bucket?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  s3Region?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};

export type UpdateContactInput = {
  telegram?: Maybe<Scalars['String']>;
  discord?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  jobTitle?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  daoId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdateContributorInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  telegramHandle?: Maybe<Scalars['String']>;
  discordHandle?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  paymentFrequency?: Maybe<PaymentFrequency>;
  cChainAddress?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  policyIds?: Maybe<Array<Scalars['String']>>;
  daoId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdateCustomerInput = {
  /** Example field (placeholder) */
  exampleField?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateDaoInput = {
  /** Dao name */
  name?: Maybe<Scalars['String']>;
  /** Strict legal name as specified in legal status */
  cChainAddress?: Maybe<Scalars['String']>;
  /** Type of the organization */
  currency?: Maybe<Currency>;
  /** Dao name) */
  websiteUrl?: Maybe<Scalars['String']>;
  /** Dao Logo */
  logo?: Maybe<UpdateAttachmentInput>;
  id: Scalars['ID'];
};

export type UpdateDaoMultisigInput = {
  name?: Maybe<Scalars['String']>;
  cChainAddress?: Maybe<Scalars['String']>;
  daoId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdateDaomemberInput = {
  role?: Maybe<DaoMemberRole>;
  status?: Maybe<DaoMemberStatus>;
  daoId?: Maybe<Scalars['ID']>;
  user?: Maybe<CreateUserInput>;
  id: Scalars['ID'];
};

export type UpdateInventoryInput = {
  /** Example field (placeholder) */
  exampleField?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateInvoiceInput = {
  /** Example field (placeholder) */
  exampleField?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateManyDaoMultisigInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  cChainAddress: Scalars['String'];
  daoId: Scalars['ID'];
};

export type UpdateManyTimesheetEntryInput = {
  id?: Maybe<Scalars['ID']>;
  serviceId: Scalars['ID'];
  duration: Scalars['Float'];
  date: Scalars['String'];
  timesheetId?: Maybe<Scalars['ID']>;
};

export type UpdatePoReceiptInput = {
  /** Example field (placeholder) */
  exampleField?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdatePolicyInput = {
  description?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  paymentFrequency?: Maybe<PolicyPaymentFrequency>;
  token?: Maybe<Scalars['String']>;
  daoId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdatePurchaseOrderInput = {
  date?: Maybe<Scalars['DateTime']>;
  status?: Maybe<PoStatus>;
  /** default to false */
  IsArchived?: Maybe<Scalars['Boolean']>;
  /** default to false */
  isPbsPO?: Maybe<Scalars['Boolean']>;
  /** TBD */
  poNumber?: Maybe<Scalars['Int']>;
  supplier_id?: Maybe<Scalars['ID']>;
  orderer_id?: Maybe<Scalars['ID']>;
  dao_id?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdatePurchaseOrderLineInput = {
  /** Example field (placeholder) */
  exampleField?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateRegisteredServiceInput = {
  billingType?: Maybe<ServiceBillingType>;
  daoId?: Maybe<Scalars['ID']>;
  /** default to true */
  IsTemplate?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  currency?: Maybe<Currency>;
  /** ... */
  totalAmount?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
};

export type UpdateReoccuringExpenseInput = {
  supplierId?: Maybe<Scalars['ID']>;
  amount?: Maybe<Scalars['Float']>;
  reoccuringFrequency?: Maybe<ReoccuringFrequency>;
  daoId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdateSupplierInput = {
  name?: Maybe<Scalars['String']>;
  termsOfPayment?: Maybe<SupplierTermsOfPayment>;
  cChainAddress?: Maybe<Scalars['String']>;
  emailAddressForRemittance?: Maybe<Scalars['String']>;
  telegramId?: Maybe<Scalars['String']>;
  discordId?: Maybe<Scalars['String']>;
  currency?: Maybe<Currency>;
  amount?: Maybe<Scalars['Float']>;
  paymentFrequency?: Maybe<PaymentFrequency>;
  type?: Maybe<SupplierType>;
  daoId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdateTimesheetEntryInput = {
  serviceId?: Maybe<Scalars['ID']>;
  duration?: Maybe<Scalars['Float']>;
  date?: Maybe<Scalars['String']>;
  timesheetId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
};

export type UpdateTimesheetInput = {
  supplierId?: Maybe<Scalars['ID']>;
  number?: Maybe<Scalars['Int']>;
  status?: Maybe<TimeSheetStatus>;
  daoId?: Maybe<Scalars['ID']>;
  startsAt?: Maybe<Scalars['String']>;
  endsAt?: Maybe<Scalars['String']>;
  timeSheetEntries?: Maybe<Array<UpdateManyTimesheetEntryInput>>;
  id: Scalars['ID'];
};

export type UpdateUserInput = {
  discord?: Maybe<Scalars['String']>;
  telegram?: Maybe<Scalars['String']>;
  cChainAddress?: Maybe<Scalars['String']>;
  /** User email, only unique supported */
  email?: Maybe<Scalars['String']>;
  jobTitle?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  telegram?: Maybe<Scalars['String']>;
  discord?: Maybe<Scalars['String']>;
  cChainAddress?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  /** default to false */
  isActive: Scalars['Boolean'];
  /** default to false */
  IsArchived: Scalars['Boolean'];
  /** default to false */
  isRoot: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type GetUploadSignedUrlMutationVariables = Exact<{
  mimeType: Scalars['String'];
  s3Key: Scalars['String'];
}>;


export type GetUploadSignedUrlMutation = (
  { __typename?: 'Mutation' }
  & { getUploadSignedUrl: (
    { __typename?: 'GetUploadSignedUrlOutput' }
    & Pick<GetUploadSignedUrlOutput, 'url' | 's3Bucket' | 's3Key' | 's3Region'>
  ) }
);

export type CreateContributorMutationVariables = Exact<{
  createContributorInput: CreateContributorInput;
}>;


export type CreateContributorMutation = (
  { __typename?: 'Mutation' }
  & { createContributor: (
    { __typename?: 'Contributor' }
    & ContributorFragment
  ) }
);

export type UpdateContributorMutationVariables = Exact<{
  updateContributorInput: UpdateContributorInput;
}>;


export type UpdateContributorMutation = (
  { __typename?: 'Mutation' }
  & { updateContributor: (
    { __typename?: 'Contributor' }
    & ContributorFragment
  ) }
);

export type DeleteContributorMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteContributorMutation = (
  { __typename?: 'Mutation' }
  & { deleteContributor: (
    { __typename?: 'Contributor' }
    & ContributorFragment
  ) }
);

export type ContributorQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ContributorQuery = (
  { __typename?: 'Query' }
  & { contributor: (
    { __typename?: 'Contributor' }
    & ContributorFragment
  ) }
);

export type ContributorsQueryVariables = Exact<{ [key: string]: never; }>;


export type ContributorsQuery = (
  { __typename?: 'Query' }
  & { contributors: Array<(
    { __typename?: 'Contributor' }
    & ContributorFragment
  )> }
);

export type ContributorsByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
}>;


export type ContributorsByDaoQuery = (
  { __typename?: 'Query' }
  & { contributorsByDao: Array<(
    { __typename?: 'Contributor' }
    & ContributorFragment
  )> }
);

export type CreateDaoMutationVariables = Exact<{
  createDaoInput: CreateDaoInput;
}>;


export type CreateDaoMutation = (
  { __typename?: 'Mutation' }
  & { createDao: (
    { __typename?: 'Dao' }
    & DaoFragment
  ) }
);

export type UpdateDaoMutationVariables = Exact<{
  updateDaoInput: UpdateDaoInput;
}>;


export type UpdateDaoMutation = (
  { __typename?: 'Mutation' }
  & { updateDao: (
    { __typename?: 'Dao' }
    & DaoFragment
  ) }
);

export type DeleteDaoMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteDaoMutation = (
  { __typename?: 'Mutation' }
  & { deleteDao: (
    { __typename?: 'Dao' }
    & DaoFragment
  ) }
);

export type ArchiveDaoMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ArchiveDaoMutation = (
  { __typename?: 'Mutation' }
  & { archiveDao: (
    { __typename?: 'Dao' }
    & DaoFragment
  ) }
);

export type UnarchiveDaoMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnarchiveDaoMutation = (
  { __typename?: 'Mutation' }
  & { unarchiveDao: (
    { __typename?: 'Dao' }
    & DaoFragment
  ) }
);

export type DaosQueryVariables = Exact<{ [key: string]: never; }>;


export type DaosQuery = (
  { __typename?: 'Query' }
  & { daos: Array<(
    { __typename?: 'Dao' }
    & DaoFragment
  )> }
);

export type DaoQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type DaoQuery = (
  { __typename?: 'Query' }
  & { dao: (
    { __typename?: 'Dao' }
    & DaoFragment
  ) }
);

export type CreateDaoMemberMutationVariables = Exact<{
  data: CreateDaomemberInput;
}>;


export type CreateDaoMemberMutation = (
  { __typename?: 'Mutation' }
  & { createDaomember: (
    { __typename?: 'Daomember' }
    & DaomemberFragment
  ) }
);

export type UpdateDaoMemberMutationVariables = Exact<{
  data: UpdateDaomemberInput;
}>;


export type UpdateDaoMemberMutation = (
  { __typename?: 'Mutation' }
  & { updateDaomember: (
    { __typename?: 'Daomember' }
    & DaomemberFragment
  ) }
);

export type ArchiveDaoMemberMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ArchiveDaoMemberMutation = (
  { __typename?: 'Mutation' }
  & { archiveDaomember: (
    { __typename?: 'Daomember' }
    & DaomemberFragment
  ) }
);

export type DaomembersByDaoQueryVariables = Exact<{
  daoId: Scalars['ID'];
}>;


export type DaomembersByDaoQuery = (
  { __typename?: 'Query' }
  & { daomembersByDao: Array<(
    { __typename?: 'Daomember' }
    & DaomemberFragment
  )> }
);

export type UpdateDaoMultisigMutationVariables = Exact<{
  data: UpdateDaoMultisigInput;
}>;


export type UpdateDaoMultisigMutation = (
  { __typename?: 'Mutation' }
  & { updateDaoMultisig: (
    { __typename?: 'DaoMultisig' }
    & DaoMultisigFragment
  ) }
);

export type UpdateManyDaoMultisigsMutationVariables = Exact<{
  data: Array<UpdateManyDaoMultisigInput> | UpdateManyDaoMultisigInput;
}>;


export type UpdateManyDaoMultisigsMutation = (
  { __typename?: 'Mutation' }
  & { updateManyDaoMultisigs: Array<(
    { __typename?: 'DaoMultisig' }
    & DaoMultisigFragment
  )> }
);

export type DaoMultisigsByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
}>;


export type DaoMultisigsByDaoQuery = (
  { __typename?: 'Query' }
  & { daoMultisigsByDao: Array<(
    { __typename?: 'DaoMultisig' }
    & DaoMultisigFragment
  )> }
);

export type DeleteDaoMultisigMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteDaoMultisigMutation = (
  { __typename?: 'Mutation' }
  & { deleteDaoMultisig: (
    { __typename?: 'DaoMultisig' }
    & DaoMultisigFragment
  ) }
);

export type AttachmentFragment = (
  { __typename?: 'Attachment' }
  & Pick<Attachment, 'id' | 'fileName' | 'label' | 'description' | 'url' | 's3Bucket' | 's3Key' | 'createdAt' | 'updatedAt'>
);

export type ContactFragment = (
  { __typename?: 'Contact' }
  & Pick<Contact, 'id' | 'telegram' | 'discord' | 'email' | 'isActive' | 'IsDeleted' | 'jobTitle' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt'>
  & { dao: (
    { __typename?: 'Dao' }
    & Pick<Dao, 'id'>
  ) }
);

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'telegram' | 'discord' | 'cChainAddress' | 'email' | 'isActive' | 'IsArchived' | 'isRoot' | 'jobTitle' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt'>
);

export type DaomemberFragment = (
  { __typename?: 'Daomember' }
  & Pick<Daomember, 'id' | 'role' | 'status' | 'createdAt' | 'updatedAt'>
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type RegisteredServiceFragment = (
  { __typename?: 'RegisteredService' }
  & Pick<RegisteredService, 'id' | 'billingType' | 'currency' | 'IsTemplate' | 'name' | 'totalAmount'>
  & { dao?: Maybe<(
    { __typename?: 'Dao' }
    & Pick<Dao, 'id'>
  )> }
);

export type DaoFragment = (
  { __typename?: 'Dao' }
  & Pick<Dao, 'id' | 'cChainAddress' | 'currency' | 'IsArchived' | 'name' | 'websiteUrl' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  & { logo?: Maybe<(
    { __typename?: 'Attachment' }
    & AttachmentFragment
  )>, contacts?: Maybe<Array<Maybe<(
    { __typename?: 'Contact' }
    & ContactFragment
  )>>>, daomembers?: Maybe<Array<Maybe<(
    { __typename?: 'Daomember' }
    & DaomemberFragment
  )>>>, registeredServices?: Maybe<Array<Maybe<(
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  )>>> }
);

export type SupplierFragment = (
  { __typename?: 'Supplier' }
  & Pick<Supplier, 'id' | 'name' | 'termsOfPayment' | 'cChainAddress' | 'emailAddressForRemittance' | 'telegramId' | 'discordId' | 'currency' | 'amount' | 'type' | 'paymentFrequency' | 'createdAt' | 'updatedAt'>
);

export type PolicyFragment = (
  { __typename?: 'Policy' }
  & Pick<Policy, 'id' | 'description' | 'amount' | 'token' | 'paymentFrequency'>
);

export type ContributorFragment = (
  { __typename?: 'Contributor' }
  & Pick<Contributor, 'id' | 'firstName' | 'lastName' | 'telegramHandle' | 'discordHandle' | 'amount' | 'cChainAddress' | 'startDate' | 'paymentFrequency'>
  & { policies?: Maybe<Array<(
    { __typename?: 'Policy' }
    & PolicyFragment
  )>> }
);

export type ReoccuringExpenseFragment = (
  { __typename?: 'ReoccuringExpense' }
  & Pick<ReoccuringExpense, 'id' | 'amount' | 'reoccuringFrequency'>
  & { supplier?: Maybe<(
    { __typename?: 'Supplier' }
    & SupplierFragment
  )> }
);

export type DaoMultisigFragment = (
  { __typename?: 'DaoMultisig' }
  & Pick<DaoMultisig, 'id' | 'name' | 'cChainAddress' | 'daoId'>
);

export type TimesheetEntryFragment = (
  { __typename?: 'TimesheetEntry' }
  & Pick<TimesheetEntry, 'id' | 'duration' | 'isInvoiced' | 'date'>
  & { service: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type TimesheetFragment = (
  { __typename?: 'Timesheet' }
  & Pick<Timesheet, 'id' | 'daoId' | 'number' | 'status' | 'supplierId' | 'startsAt' | 'endsAt'>
  & { supplier: (
    { __typename?: 'Supplier' }
    & SupplierFragment
  ), preview?: Maybe<(
    { __typename?: 'Attachment' }
    & AttachmentFragment
  )>, timeSheetEntries?: Maybe<Array<Maybe<(
    { __typename?: 'TimesheetEntry' }
    & TimesheetEntryFragment
  )>>> }
);

export type PayrunDetailFragment = (
  { __typename?: 'PayrunDetail' }
  & Pick<PayrunDetail, 'id' | 'name' | 'supplierId' | 'contributorId' | 'reoccuringExpenseId' | 'cChainAddress' | 'amount' | 'payeeType'>
);

export type PayrunFragment = (
  { __typename?: 'Payrun' }
  & Pick<Payrun, 'id' | 'daoId' | 'totalAmount' | 'startsAt' | 'endsAt'>
  & { payrunDetails?: Maybe<Array<Maybe<(
    { __typename?: 'PayrunDetail' }
    & PayrunDetailFragment
  )>>> }
);

export type PayrunDetailResponseFragment = (
  { __typename?: 'PayrunDetailResponse' }
  & Pick<PayrunDetailResponse, 'name' | 'supplierId' | 'contributorId' | 'reoccuringExpenseId' | 'payeeType' | 'amount' | 'cChainAddress'>
);

export type CreatePayrunMutationVariables = Exact<{
  data: CreatePayrunInput;
}>;


export type CreatePayrunMutation = (
  { __typename?: 'Mutation' }
  & { createPayrun: (
    { __typename?: 'Payrun' }
    & PayrunFragment
  ) }
);

export type PayrunsByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
}>;


export type PayrunsByDaoQuery = (
  { __typename?: 'Query' }
  & { payrunsByDao: Array<(
    { __typename?: 'Payrun' }
    & PayrunFragment
  )> }
);

export type GetPayrunDetailsByDaoQueryVariables = Exact<{
  data: PayrunQueryInput;
}>;


export type GetPayrunDetailsByDaoQuery = (
  { __typename?: 'Query' }
  & { getPayrunDetailsByDao: Array<(
    { __typename?: 'PayrunDetailResponse' }
    & PayrunDetailResponseFragment
  )> }
);

export type CreatePolicyMutationVariables = Exact<{
  createPolicyInput: CreatePolicyInput;
}>;


export type CreatePolicyMutation = (
  { __typename?: 'Mutation' }
  & { createPolicy: (
    { __typename?: 'Policy' }
    & PolicyFragment
  ) }
);

export type UpdatePolicyMutationVariables = Exact<{
  updatePolicyInput: UpdatePolicyInput;
}>;


export type UpdatePolicyMutation = (
  { __typename?: 'Mutation' }
  & { updatePolicy: (
    { __typename?: 'Policy' }
    & PolicyFragment
  ) }
);

export type DeletePolicyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePolicyMutation = (
  { __typename?: 'Mutation' }
  & { deletePolicy: (
    { __typename?: 'Policy' }
    & PolicyFragment
  ) }
);

export type PolicyQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PolicyQuery = (
  { __typename?: 'Query' }
  & { policy: (
    { __typename?: 'Policy' }
    & PolicyFragment
  ) }
);

export type PoliciesQueryVariables = Exact<{ [key: string]: never; }>;


export type PoliciesQuery = (
  { __typename?: 'Query' }
  & { policies: Array<(
    { __typename?: 'Policy' }
    & PolicyFragment
  )> }
);

export type PoliciesByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
}>;


export type PoliciesByDaoQuery = (
  { __typename?: 'Query' }
  & { policiesByDao: Array<(
    { __typename?: 'Policy' }
    & PolicyFragment
  )> }
);

export type CreateRegisteredServiceMutationVariables = Exact<{
  data: CreateRegisteredServiceInput;
}>;


export type CreateRegisteredServiceMutation = (
  { __typename?: 'Mutation' }
  & { createRegisteredService: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type UpdateRegisteredServiceMutationVariables = Exact<{
  data: UpdateRegisteredServiceInput;
}>;


export type UpdateRegisteredServiceMutation = (
  { __typename?: 'Mutation' }
  & { updateRegisteredService: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type RegisteredServiceQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type RegisteredServiceQuery = (
  { __typename?: 'Query' }
  & { registeredService: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type RegisteredServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type RegisteredServicesQuery = (
  { __typename?: 'Query' }
  & { registeredServices: Array<(
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  )> }
);

export type DeleteRegisteredServiceMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRegisteredServiceMutation = (
  { __typename?: 'Mutation' }
  & { deleteRegisteredService: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type ArchiveRegisteredServiceMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ArchiveRegisteredServiceMutation = (
  { __typename?: 'Mutation' }
  & { archiveRegisteredService: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type UnarchiveRegisteredServiceMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnarchiveRegisteredServiceMutation = (
  { __typename?: 'Mutation' }
  & { unarchiveRegisteredService: (
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  ) }
);

export type RegisteredServiceByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
  archived?: Maybe<Scalars['Boolean']>;
  billingType?: Maybe<ServiceBillingType>;
}>;


export type RegisteredServiceByDaoQuery = (
  { __typename?: 'Query' }
  & { registeredServiceByDao: Array<(
    { __typename?: 'RegisteredService' }
    & RegisteredServiceFragment
  )> }
);

export type CreateReoccuringExpenseMutationVariables = Exact<{
  createReoccuringExpenseInput: CreateReoccuringExpenseInput;
}>;


export type CreateReoccuringExpenseMutation = (
  { __typename?: 'Mutation' }
  & { createReoccuringExpense: (
    { __typename?: 'ReoccuringExpense' }
    & ReoccuringExpenseFragment
  ) }
);

export type UpdateReoccuringExpenseMutationVariables = Exact<{
  updateReoccuringExpenseInput: UpdateReoccuringExpenseInput;
}>;


export type UpdateReoccuringExpenseMutation = (
  { __typename?: 'Mutation' }
  & { updateReoccuringExpense: (
    { __typename?: 'ReoccuringExpense' }
    & ReoccuringExpenseFragment
  ) }
);

export type DeleteReoccuringExpenseMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteReoccuringExpenseMutation = (
  { __typename?: 'Mutation' }
  & { deleteReoccuringExpense: (
    { __typename?: 'ReoccuringExpense' }
    & ReoccuringExpenseFragment
  ) }
);

export type ReoccuringExpenseQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ReoccuringExpenseQuery = (
  { __typename?: 'Query' }
  & { reoccuringExpense: (
    { __typename?: 'ReoccuringExpense' }
    & ReoccuringExpenseFragment
  ) }
);

export type ReoccuringExpensesQueryVariables = Exact<{ [key: string]: never; }>;


export type ReoccuringExpensesQuery = (
  { __typename?: 'Query' }
  & { reoccuringExpenses: Array<(
    { __typename?: 'ReoccuringExpense' }
    & ReoccuringExpenseFragment
  )> }
);

export type ReoccuringExpensesByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
}>;


export type ReoccuringExpensesByDaoQuery = (
  { __typename?: 'Query' }
  & { reoccuringExpensesByDao: Array<(
    { __typename?: 'ReoccuringExpense' }
    & ReoccuringExpenseFragment
  )> }
);

export type CreateSupplierMutationVariables = Exact<{
  createSupplierInput: CreateSupplierInput;
}>;


export type CreateSupplierMutation = (
  { __typename?: 'Mutation' }
  & { createSupplier: (
    { __typename?: 'Supplier' }
    & SupplierFragment
  ) }
);

export type UpdateSupplierMutationVariables = Exact<{
  updateSupplierInput: UpdateSupplierInput;
}>;


export type UpdateSupplierMutation = (
  { __typename?: 'Mutation' }
  & { updateSupplier: (
    { __typename?: 'Supplier' }
    & SupplierFragment
  ) }
);

export type SuppliersByDaoQueryVariables = Exact<{
  daoId: Scalars['String'];
}>;


export type SuppliersByDaoQuery = (
  { __typename?: 'Query' }
  & { suppliersByDao: Array<(
    { __typename?: 'Supplier' }
    & SupplierFragment
  )> }
);

export type SupplierQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type SupplierQuery = (
  { __typename?: 'Query' }
  & { supplier: (
    { __typename?: 'Supplier' }
    & SupplierFragment
  ) }
);

export type CreateTimesheetMutationVariables = Exact<{
  data: CreateTimesheetInput;
}>;


export type CreateTimesheetMutation = (
  { __typename?: 'Mutation' }
  & { createTimesheet: (
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  ) }
);

export type UpdateTimesheetMutationVariables = Exact<{
  data: UpdateTimesheetInput;
}>;


export type UpdateTimesheetMutation = (
  { __typename?: 'Mutation' }
  & { updateTimesheet: (
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  ) }
);

export type TimesheetsByDaoQueryVariables = Exact<{
  data: TimesheetQueryInput;
}>;


export type TimesheetsByDaoQuery = (
  { __typename?: 'Query' }
  & { timesheetsByDao: Array<(
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  )> }
);

export type TimesheetQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TimesheetQuery = (
  { __typename?: 'Query' }
  & { timesheet: (
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  ) }
);

export type DeleteTimesheetMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTimesheetMutation = (
  { __typename?: 'Mutation' }
  & { deleteTimesheet: (
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  ) }
);

export type ArchiveTimesheetMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ArchiveTimesheetMutation = (
  { __typename?: 'Mutation' }
  & { archiveTimesheet: (
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  ) }
);

export type UnarchiveTimesheetMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnarchiveTimesheetMutation = (
  { __typename?: 'Mutation' }
  & { unarchiveTimesheet: (
    { __typename?: 'Timesheet' }
    & TimesheetFragment
  ) }
);

export type DeleteTimesheetEntryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTimesheetEntryMutation = (
  { __typename?: 'Mutation' }
  & { deleteTimesheetEntry: (
    { __typename?: 'TimesheetEntry' }
    & TimesheetEntryFragment
  ) }
);

export const AttachmentFragmentDoc = gql`
    fragment Attachment on Attachment {
  id
  fileName
  label
  description
  url
  s3Bucket
  s3Key
  createdAt
  updatedAt
}
    `;
export const ContactFragmentDoc = gql`
    fragment Contact on Contact {
  id
  telegram
  discord
  email
  isActive
  IsDeleted
  jobTitle
  firstName
  lastName
  dao {
    id
  }
  createdAt
  updatedAt
}
    `;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  telegram
  discord
  cChainAddress
  email
  isActive
  IsArchived
  isRoot
  jobTitle
  firstName
  lastName
  createdAt
  updatedAt
}
    `;
export const DaomemberFragmentDoc = gql`
    fragment Daomember on Daomember {
  id
  user {
    ...User
  }
  role
  status
  createdAt
  updatedAt
}
    ${UserFragmentDoc}`;
export const RegisteredServiceFragmentDoc = gql`
    fragment RegisteredService on RegisteredService {
  id
  billingType
  dao {
    id
  }
  currency
  IsTemplate
  name
  totalAmount
}
    `;
export const DaoFragmentDoc = gql`
    fragment Dao on Dao {
  id
  cChainAddress
  currency
  IsArchived
  logo {
    ...Attachment
  }
  name
  websiteUrl
  contacts {
    ...Contact
  }
  daomembers {
    ...Daomember
  }
  registeredServices {
    ...RegisteredService
  }
  createdAt
  updatedAt
  deletedAt
}
    ${AttachmentFragmentDoc}
${ContactFragmentDoc}
${DaomemberFragmentDoc}
${RegisteredServiceFragmentDoc}`;
export const PolicyFragmentDoc = gql`
    fragment Policy on Policy {
  id
  description
  amount
  token
  paymentFrequency
}
    `;
export const ContributorFragmentDoc = gql`
    fragment Contributor on Contributor {
  id
  firstName
  lastName
  telegramHandle
  discordHandle
  amount
  cChainAddress
  startDate
  paymentFrequency
  policies {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;
export const SupplierFragmentDoc = gql`
    fragment Supplier on Supplier {
  id
  name
  termsOfPayment
  cChainAddress
  emailAddressForRemittance
  telegramId
  discordId
  currency
  amount
  type
  paymentFrequency
  createdAt
  updatedAt
}
    `;
export const ReoccuringExpenseFragmentDoc = gql`
    fragment ReoccuringExpense on ReoccuringExpense {
  id
  supplier {
    ...Supplier
  }
  amount
  reoccuringFrequency
}
    ${SupplierFragmentDoc}`;
export const DaoMultisigFragmentDoc = gql`
    fragment DaoMultisig on DaoMultisig {
  id
  name
  cChainAddress
  daoId
}
    `;
export const TimesheetEntryFragmentDoc = gql`
    fragment TimesheetEntry on TimesheetEntry {
  id
  service {
    ...RegisteredService
  }
  duration
  isInvoiced
  date
}
    ${RegisteredServiceFragmentDoc}`;
export const TimesheetFragmentDoc = gql`
    fragment Timesheet on Timesheet {
  id
  daoId
  number
  status
  supplierId
  supplier {
    ...Supplier
  }
  preview {
    ...Attachment
  }
  startsAt
  endsAt
  timeSheetEntries {
    ...TimesheetEntry
  }
}
    ${SupplierFragmentDoc}
${AttachmentFragmentDoc}
${TimesheetEntryFragmentDoc}`;
export const PayrunDetailFragmentDoc = gql`
    fragment PayrunDetail on PayrunDetail {
  id
  name
  supplierId
  contributorId
  reoccuringExpenseId
  cChainAddress
  amount
  payeeType
}
    `;
export const PayrunFragmentDoc = gql`
    fragment Payrun on Payrun {
  id
  daoId
  totalAmount
  startsAt
  endsAt
  payrunDetails {
    ...PayrunDetail
  }
}
    ${PayrunDetailFragmentDoc}`;
export const PayrunDetailResponseFragmentDoc = gql`
    fragment PayrunDetailResponse on PayrunDetailResponse {
  name
  supplierId
  contributorId
  reoccuringExpenseId
  payeeType
  amount
  cChainAddress
}
    `;
export const GetUploadSignedUrlDocument = gql`
    mutation getUploadSignedUrl($mimeType: String!, $s3Key: String!) {
  getUploadSignedUrl(mimeType: $mimeType, s3Key: $s3Key) {
    url
    s3Bucket
    s3Key
    s3Region
  }
}
    `;
export type GetUploadSignedUrlMutationFn = Apollo.MutationFunction<GetUploadSignedUrlMutation, GetUploadSignedUrlMutationVariables>;

/**
 * __useGetUploadSignedUrlMutation__
 *
 * To run a mutation, you first call `useGetUploadSignedUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetUploadSignedUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getUploadSignedUrlMutation, { data, loading, error }] = useGetUploadSignedUrlMutation({
 *   variables: {
 *      mimeType: // value for 'mimeType'
 *      s3Key: // value for 's3Key'
 *   },
 * });
 */
export function useGetUploadSignedUrlMutation(baseOptions?: Apollo.MutationHookOptions<GetUploadSignedUrlMutation, GetUploadSignedUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetUploadSignedUrlMutation, GetUploadSignedUrlMutationVariables>(GetUploadSignedUrlDocument, options);
      }
export type GetUploadSignedUrlMutationHookResult = ReturnType<typeof useGetUploadSignedUrlMutation>;
export type GetUploadSignedUrlMutationResult = Apollo.MutationResult<GetUploadSignedUrlMutation>;
export type GetUploadSignedUrlMutationOptions = Apollo.BaseMutationOptions<GetUploadSignedUrlMutation, GetUploadSignedUrlMutationVariables>;
export const CreateContributorDocument = gql`
    mutation createContributor($createContributorInput: CreateContributorInput!) {
  createContributor(createContributorInput: $createContributorInput) {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;
export type CreateContributorMutationFn = Apollo.MutationFunction<CreateContributorMutation, CreateContributorMutationVariables>;

/**
 * __useCreateContributorMutation__
 *
 * To run a mutation, you first call `useCreateContributorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContributorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContributorMutation, { data, loading, error }] = useCreateContributorMutation({
 *   variables: {
 *      createContributorInput: // value for 'createContributorInput'
 *   },
 * });
 */
export function useCreateContributorMutation(baseOptions?: Apollo.MutationHookOptions<CreateContributorMutation, CreateContributorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContributorMutation, CreateContributorMutationVariables>(CreateContributorDocument, options);
      }
export type CreateContributorMutationHookResult = ReturnType<typeof useCreateContributorMutation>;
export type CreateContributorMutationResult = Apollo.MutationResult<CreateContributorMutation>;
export type CreateContributorMutationOptions = Apollo.BaseMutationOptions<CreateContributorMutation, CreateContributorMutationVariables>;
export const UpdateContributorDocument = gql`
    mutation updateContributor($updateContributorInput: UpdateContributorInput!) {
  updateContributor(updateContributorInput: $updateContributorInput) {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;
export type UpdateContributorMutationFn = Apollo.MutationFunction<UpdateContributorMutation, UpdateContributorMutationVariables>;

/**
 * __useUpdateContributorMutation__
 *
 * To run a mutation, you first call `useUpdateContributorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContributorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContributorMutation, { data, loading, error }] = useUpdateContributorMutation({
 *   variables: {
 *      updateContributorInput: // value for 'updateContributorInput'
 *   },
 * });
 */
export function useUpdateContributorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateContributorMutation, UpdateContributorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContributorMutation, UpdateContributorMutationVariables>(UpdateContributorDocument, options);
      }
export type UpdateContributorMutationHookResult = ReturnType<typeof useUpdateContributorMutation>;
export type UpdateContributorMutationResult = Apollo.MutationResult<UpdateContributorMutation>;
export type UpdateContributorMutationOptions = Apollo.BaseMutationOptions<UpdateContributorMutation, UpdateContributorMutationVariables>;
export const DeleteContributorDocument = gql`
    mutation deleteContributor($id: ID!) {
  deleteContributor(id: $id) {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;
export type DeleteContributorMutationFn = Apollo.MutationFunction<DeleteContributorMutation, DeleteContributorMutationVariables>;

/**
 * __useDeleteContributorMutation__
 *
 * To run a mutation, you first call `useDeleteContributorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContributorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContributorMutation, { data, loading, error }] = useDeleteContributorMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteContributorMutation(baseOptions?: Apollo.MutationHookOptions<DeleteContributorMutation, DeleteContributorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteContributorMutation, DeleteContributorMutationVariables>(DeleteContributorDocument, options);
      }
export type DeleteContributorMutationHookResult = ReturnType<typeof useDeleteContributorMutation>;
export type DeleteContributorMutationResult = Apollo.MutationResult<DeleteContributorMutation>;
export type DeleteContributorMutationOptions = Apollo.BaseMutationOptions<DeleteContributorMutation, DeleteContributorMutationVariables>;
export const ContributorDocument = gql`
    query contributor($id: String!) {
  contributor(id: $id) {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;

/**
 * __useContributorQuery__
 *
 * To run a query within a React component, call `useContributorQuery` and pass it any options that fit your needs.
 * When your component renders, `useContributorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContributorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useContributorQuery(baseOptions: Apollo.QueryHookOptions<ContributorQuery, ContributorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContributorQuery, ContributorQueryVariables>(ContributorDocument, options);
      }
export function useContributorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContributorQuery, ContributorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContributorQuery, ContributorQueryVariables>(ContributorDocument, options);
        }
export type ContributorQueryHookResult = ReturnType<typeof useContributorQuery>;
export type ContributorLazyQueryHookResult = ReturnType<typeof useContributorLazyQuery>;
export type ContributorQueryResult = Apollo.QueryResult<ContributorQuery, ContributorQueryVariables>;
export const ContributorsDocument = gql`
    query contributors {
  contributors {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;

/**
 * __useContributorsQuery__
 *
 * To run a query within a React component, call `useContributorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useContributorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContributorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useContributorsQuery(baseOptions?: Apollo.QueryHookOptions<ContributorsQuery, ContributorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContributorsQuery, ContributorsQueryVariables>(ContributorsDocument, options);
      }
export function useContributorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContributorsQuery, ContributorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContributorsQuery, ContributorsQueryVariables>(ContributorsDocument, options);
        }
export type ContributorsQueryHookResult = ReturnType<typeof useContributorsQuery>;
export type ContributorsLazyQueryHookResult = ReturnType<typeof useContributorsLazyQuery>;
export type ContributorsQueryResult = Apollo.QueryResult<ContributorsQuery, ContributorsQueryVariables>;
export const ContributorsByDaoDocument = gql`
    query contributorsByDao($daoId: String!) {
  contributorsByDao(daoId: $daoId) {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;

/**
 * __useContributorsByDaoQuery__
 *
 * To run a query within a React component, call `useContributorsByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useContributorsByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContributorsByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function useContributorsByDaoQuery(baseOptions: Apollo.QueryHookOptions<ContributorsByDaoQuery, ContributorsByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContributorsByDaoQuery, ContributorsByDaoQueryVariables>(ContributorsByDaoDocument, options);
      }
export function useContributorsByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContributorsByDaoQuery, ContributorsByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContributorsByDaoQuery, ContributorsByDaoQueryVariables>(ContributorsByDaoDocument, options);
        }
export type ContributorsByDaoQueryHookResult = ReturnType<typeof useContributorsByDaoQuery>;
export type ContributorsByDaoLazyQueryHookResult = ReturnType<typeof useContributorsByDaoLazyQuery>;
export type ContributorsByDaoQueryResult = Apollo.QueryResult<ContributorsByDaoQuery, ContributorsByDaoQueryVariables>;
export const CreateDaoDocument = gql`
    mutation createDao($createDaoInput: CreateDaoInput!) {
  createDao(createDaoInput: $createDaoInput) {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;
export type CreateDaoMutationFn = Apollo.MutationFunction<CreateDaoMutation, CreateDaoMutationVariables>;

/**
 * __useCreateDaoMutation__
 *
 * To run a mutation, you first call `useCreateDaoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDaoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDaoMutation, { data, loading, error }] = useCreateDaoMutation({
 *   variables: {
 *      createDaoInput: // value for 'createDaoInput'
 *   },
 * });
 */
export function useCreateDaoMutation(baseOptions?: Apollo.MutationHookOptions<CreateDaoMutation, CreateDaoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDaoMutation, CreateDaoMutationVariables>(CreateDaoDocument, options);
      }
export type CreateDaoMutationHookResult = ReturnType<typeof useCreateDaoMutation>;
export type CreateDaoMutationResult = Apollo.MutationResult<CreateDaoMutation>;
export type CreateDaoMutationOptions = Apollo.BaseMutationOptions<CreateDaoMutation, CreateDaoMutationVariables>;
export const UpdateDaoDocument = gql`
    mutation updateDao($updateDaoInput: UpdateDaoInput!) {
  updateDao(updateDaoInput: $updateDaoInput) {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;
export type UpdateDaoMutationFn = Apollo.MutationFunction<UpdateDaoMutation, UpdateDaoMutationVariables>;

/**
 * __useUpdateDaoMutation__
 *
 * To run a mutation, you first call `useUpdateDaoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDaoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDaoMutation, { data, loading, error }] = useUpdateDaoMutation({
 *   variables: {
 *      updateDaoInput: // value for 'updateDaoInput'
 *   },
 * });
 */
export function useUpdateDaoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDaoMutation, UpdateDaoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDaoMutation, UpdateDaoMutationVariables>(UpdateDaoDocument, options);
      }
export type UpdateDaoMutationHookResult = ReturnType<typeof useUpdateDaoMutation>;
export type UpdateDaoMutationResult = Apollo.MutationResult<UpdateDaoMutation>;
export type UpdateDaoMutationOptions = Apollo.BaseMutationOptions<UpdateDaoMutation, UpdateDaoMutationVariables>;
export const DeleteDaoDocument = gql`
    mutation deleteDao($id: ID!) {
  deleteDao(id: $id) {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;
export type DeleteDaoMutationFn = Apollo.MutationFunction<DeleteDaoMutation, DeleteDaoMutationVariables>;

/**
 * __useDeleteDaoMutation__
 *
 * To run a mutation, you first call `useDeleteDaoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDaoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDaoMutation, { data, loading, error }] = useDeleteDaoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDaoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDaoMutation, DeleteDaoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDaoMutation, DeleteDaoMutationVariables>(DeleteDaoDocument, options);
      }
export type DeleteDaoMutationHookResult = ReturnType<typeof useDeleteDaoMutation>;
export type DeleteDaoMutationResult = Apollo.MutationResult<DeleteDaoMutation>;
export type DeleteDaoMutationOptions = Apollo.BaseMutationOptions<DeleteDaoMutation, DeleteDaoMutationVariables>;
export const ArchiveDaoDocument = gql`
    mutation archiveDao($id: ID!) {
  archiveDao(id: $id) {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;
export type ArchiveDaoMutationFn = Apollo.MutationFunction<ArchiveDaoMutation, ArchiveDaoMutationVariables>;

/**
 * __useArchiveDaoMutation__
 *
 * To run a mutation, you first call `useArchiveDaoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveDaoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveDaoMutation, { data, loading, error }] = useArchiveDaoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveDaoMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveDaoMutation, ArchiveDaoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveDaoMutation, ArchiveDaoMutationVariables>(ArchiveDaoDocument, options);
      }
export type ArchiveDaoMutationHookResult = ReturnType<typeof useArchiveDaoMutation>;
export type ArchiveDaoMutationResult = Apollo.MutationResult<ArchiveDaoMutation>;
export type ArchiveDaoMutationOptions = Apollo.BaseMutationOptions<ArchiveDaoMutation, ArchiveDaoMutationVariables>;
export const UnarchiveDaoDocument = gql`
    mutation unarchiveDao($id: ID!) {
  unarchiveDao(id: $id) {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;
export type UnarchiveDaoMutationFn = Apollo.MutationFunction<UnarchiveDaoMutation, UnarchiveDaoMutationVariables>;

/**
 * __useUnarchiveDaoMutation__
 *
 * To run a mutation, you first call `useUnarchiveDaoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnarchiveDaoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unarchiveDaoMutation, { data, loading, error }] = useUnarchiveDaoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnarchiveDaoMutation(baseOptions?: Apollo.MutationHookOptions<UnarchiveDaoMutation, UnarchiveDaoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnarchiveDaoMutation, UnarchiveDaoMutationVariables>(UnarchiveDaoDocument, options);
      }
export type UnarchiveDaoMutationHookResult = ReturnType<typeof useUnarchiveDaoMutation>;
export type UnarchiveDaoMutationResult = Apollo.MutationResult<UnarchiveDaoMutation>;
export type UnarchiveDaoMutationOptions = Apollo.BaseMutationOptions<UnarchiveDaoMutation, UnarchiveDaoMutationVariables>;
export const DaosDocument = gql`
    query daos {
  daos {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;

/**
 * __useDaosQuery__
 *
 * To run a query within a React component, call `useDaosQuery` and pass it any options that fit your needs.
 * When your component renders, `useDaosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDaosQuery({
 *   variables: {
 *   },
 * });
 */
export function useDaosQuery(baseOptions?: Apollo.QueryHookOptions<DaosQuery, DaosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DaosQuery, DaosQueryVariables>(DaosDocument, options);
      }
export function useDaosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DaosQuery, DaosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DaosQuery, DaosQueryVariables>(DaosDocument, options);
        }
export type DaosQueryHookResult = ReturnType<typeof useDaosQuery>;
export type DaosLazyQueryHookResult = ReturnType<typeof useDaosLazyQuery>;
export type DaosQueryResult = Apollo.QueryResult<DaosQuery, DaosQueryVariables>;
export const DaoDocument = gql`
    query dao($id: String!) {
  dao(id: $id) {
    ...Dao
  }
}
    ${DaoFragmentDoc}`;

/**
 * __useDaoQuery__
 *
 * To run a query within a React component, call `useDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDaoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDaoQuery(baseOptions: Apollo.QueryHookOptions<DaoQuery, DaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DaoQuery, DaoQueryVariables>(DaoDocument, options);
      }
export function useDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DaoQuery, DaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DaoQuery, DaoQueryVariables>(DaoDocument, options);
        }
export type DaoQueryHookResult = ReturnType<typeof useDaoQuery>;
export type DaoLazyQueryHookResult = ReturnType<typeof useDaoLazyQuery>;
export type DaoQueryResult = Apollo.QueryResult<DaoQuery, DaoQueryVariables>;
export const CreateDaoMemberDocument = gql`
    mutation createDaoMember($data: CreateDaomemberInput!) {
  createDaomember(createDaomemberInput: $data) {
    ...Daomember
  }
}
    ${DaomemberFragmentDoc}`;
export type CreateDaoMemberMutationFn = Apollo.MutationFunction<CreateDaoMemberMutation, CreateDaoMemberMutationVariables>;

/**
 * __useCreateDaoMemberMutation__
 *
 * To run a mutation, you first call `useCreateDaoMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDaoMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDaoMemberMutation, { data, loading, error }] = useCreateDaoMemberMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateDaoMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateDaoMemberMutation, CreateDaoMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDaoMemberMutation, CreateDaoMemberMutationVariables>(CreateDaoMemberDocument, options);
      }
export type CreateDaoMemberMutationHookResult = ReturnType<typeof useCreateDaoMemberMutation>;
export type CreateDaoMemberMutationResult = Apollo.MutationResult<CreateDaoMemberMutation>;
export type CreateDaoMemberMutationOptions = Apollo.BaseMutationOptions<CreateDaoMemberMutation, CreateDaoMemberMutationVariables>;
export const UpdateDaoMemberDocument = gql`
    mutation updateDaoMember($data: UpdateDaomemberInput!) {
  updateDaomember(updateDaomemberInput: $data) {
    ...Daomember
  }
}
    ${DaomemberFragmentDoc}`;
export type UpdateDaoMemberMutationFn = Apollo.MutationFunction<UpdateDaoMemberMutation, UpdateDaoMemberMutationVariables>;

/**
 * __useUpdateDaoMemberMutation__
 *
 * To run a mutation, you first call `useUpdateDaoMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDaoMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDaoMemberMutation, { data, loading, error }] = useUpdateDaoMemberMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateDaoMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDaoMemberMutation, UpdateDaoMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDaoMemberMutation, UpdateDaoMemberMutationVariables>(UpdateDaoMemberDocument, options);
      }
export type UpdateDaoMemberMutationHookResult = ReturnType<typeof useUpdateDaoMemberMutation>;
export type UpdateDaoMemberMutationResult = Apollo.MutationResult<UpdateDaoMemberMutation>;
export type UpdateDaoMemberMutationOptions = Apollo.BaseMutationOptions<UpdateDaoMemberMutation, UpdateDaoMemberMutationVariables>;
export const ArchiveDaoMemberDocument = gql`
    mutation archiveDaoMember($id: ID!) {
  archiveDaomember(id: $id) {
    ...Daomember
  }
}
    ${DaomemberFragmentDoc}`;
export type ArchiveDaoMemberMutationFn = Apollo.MutationFunction<ArchiveDaoMemberMutation, ArchiveDaoMemberMutationVariables>;

/**
 * __useArchiveDaoMemberMutation__
 *
 * To run a mutation, you first call `useArchiveDaoMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveDaoMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveDaoMemberMutation, { data, loading, error }] = useArchiveDaoMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveDaoMemberMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveDaoMemberMutation, ArchiveDaoMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveDaoMemberMutation, ArchiveDaoMemberMutationVariables>(ArchiveDaoMemberDocument, options);
      }
export type ArchiveDaoMemberMutationHookResult = ReturnType<typeof useArchiveDaoMemberMutation>;
export type ArchiveDaoMemberMutationResult = Apollo.MutationResult<ArchiveDaoMemberMutation>;
export type ArchiveDaoMemberMutationOptions = Apollo.BaseMutationOptions<ArchiveDaoMemberMutation, ArchiveDaoMemberMutationVariables>;
export const DaomembersByDaoDocument = gql`
    query daomembersByDao($daoId: ID!) {
  daomembersByDao(daoId: $daoId) {
    ...Daomember
  }
}
    ${DaomemberFragmentDoc}`;

/**
 * __useDaomembersByDaoQuery__
 *
 * To run a query within a React component, call `useDaomembersByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useDaomembersByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDaomembersByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function useDaomembersByDaoQuery(baseOptions: Apollo.QueryHookOptions<DaomembersByDaoQuery, DaomembersByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DaomembersByDaoQuery, DaomembersByDaoQueryVariables>(DaomembersByDaoDocument, options);
      }
export function useDaomembersByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DaomembersByDaoQuery, DaomembersByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DaomembersByDaoQuery, DaomembersByDaoQueryVariables>(DaomembersByDaoDocument, options);
        }
export type DaomembersByDaoQueryHookResult = ReturnType<typeof useDaomembersByDaoQuery>;
export type DaomembersByDaoLazyQueryHookResult = ReturnType<typeof useDaomembersByDaoLazyQuery>;
export type DaomembersByDaoQueryResult = Apollo.QueryResult<DaomembersByDaoQuery, DaomembersByDaoQueryVariables>;
export const UpdateDaoMultisigDocument = gql`
    mutation updateDaoMultisig($data: UpdateDaoMultisigInput!) {
  updateDaoMultisig(data: $data) {
    ...DaoMultisig
  }
}
    ${DaoMultisigFragmentDoc}`;
export type UpdateDaoMultisigMutationFn = Apollo.MutationFunction<UpdateDaoMultisigMutation, UpdateDaoMultisigMutationVariables>;

/**
 * __useUpdateDaoMultisigMutation__
 *
 * To run a mutation, you first call `useUpdateDaoMultisigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDaoMultisigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDaoMultisigMutation, { data, loading, error }] = useUpdateDaoMultisigMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateDaoMultisigMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDaoMultisigMutation, UpdateDaoMultisigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDaoMultisigMutation, UpdateDaoMultisigMutationVariables>(UpdateDaoMultisigDocument, options);
      }
export type UpdateDaoMultisigMutationHookResult = ReturnType<typeof useUpdateDaoMultisigMutation>;
export type UpdateDaoMultisigMutationResult = Apollo.MutationResult<UpdateDaoMultisigMutation>;
export type UpdateDaoMultisigMutationOptions = Apollo.BaseMutationOptions<UpdateDaoMultisigMutation, UpdateDaoMultisigMutationVariables>;
export const UpdateManyDaoMultisigsDocument = gql`
    mutation updateManyDaoMultisigs($data: [UpdateManyDaoMultisigInput!]!) {
  updateManyDaoMultisigs(data: $data) {
    ...DaoMultisig
  }
}
    ${DaoMultisigFragmentDoc}`;
export type UpdateManyDaoMultisigsMutationFn = Apollo.MutationFunction<UpdateManyDaoMultisigsMutation, UpdateManyDaoMultisigsMutationVariables>;

/**
 * __useUpdateManyDaoMultisigsMutation__
 *
 * To run a mutation, you first call `useUpdateManyDaoMultisigsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateManyDaoMultisigsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateManyDaoMultisigsMutation, { data, loading, error }] = useUpdateManyDaoMultisigsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateManyDaoMultisigsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateManyDaoMultisigsMutation, UpdateManyDaoMultisigsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateManyDaoMultisigsMutation, UpdateManyDaoMultisigsMutationVariables>(UpdateManyDaoMultisigsDocument, options);
      }
export type UpdateManyDaoMultisigsMutationHookResult = ReturnType<typeof useUpdateManyDaoMultisigsMutation>;
export type UpdateManyDaoMultisigsMutationResult = Apollo.MutationResult<UpdateManyDaoMultisigsMutation>;
export type UpdateManyDaoMultisigsMutationOptions = Apollo.BaseMutationOptions<UpdateManyDaoMultisigsMutation, UpdateManyDaoMultisigsMutationVariables>;
export const DaoMultisigsByDaoDocument = gql`
    query daoMultisigsByDao($daoId: String!) {
  daoMultisigsByDao(daoId: $daoId) {
    ...DaoMultisig
  }
}
    ${DaoMultisigFragmentDoc}`;

/**
 * __useDaoMultisigsByDaoQuery__
 *
 * To run a query within a React component, call `useDaoMultisigsByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useDaoMultisigsByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDaoMultisigsByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function useDaoMultisigsByDaoQuery(baseOptions: Apollo.QueryHookOptions<DaoMultisigsByDaoQuery, DaoMultisigsByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DaoMultisigsByDaoQuery, DaoMultisigsByDaoQueryVariables>(DaoMultisigsByDaoDocument, options);
      }
export function useDaoMultisigsByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DaoMultisigsByDaoQuery, DaoMultisigsByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DaoMultisigsByDaoQuery, DaoMultisigsByDaoQueryVariables>(DaoMultisigsByDaoDocument, options);
        }
export type DaoMultisigsByDaoQueryHookResult = ReturnType<typeof useDaoMultisigsByDaoQuery>;
export type DaoMultisigsByDaoLazyQueryHookResult = ReturnType<typeof useDaoMultisigsByDaoLazyQuery>;
export type DaoMultisigsByDaoQueryResult = Apollo.QueryResult<DaoMultisigsByDaoQuery, DaoMultisigsByDaoQueryVariables>;
export const DeleteDaoMultisigDocument = gql`
    mutation deleteDaoMultisig($id: ID!) {
  deleteDaoMultisig(id: $id) {
    ...DaoMultisig
  }
}
    ${DaoMultisigFragmentDoc}`;
export type DeleteDaoMultisigMutationFn = Apollo.MutationFunction<DeleteDaoMultisigMutation, DeleteDaoMultisigMutationVariables>;

/**
 * __useDeleteDaoMultisigMutation__
 *
 * To run a mutation, you first call `useDeleteDaoMultisigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDaoMultisigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDaoMultisigMutation, { data, loading, error }] = useDeleteDaoMultisigMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDaoMultisigMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDaoMultisigMutation, DeleteDaoMultisigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDaoMultisigMutation, DeleteDaoMultisigMutationVariables>(DeleteDaoMultisigDocument, options);
      }
export type DeleteDaoMultisigMutationHookResult = ReturnType<typeof useDeleteDaoMultisigMutation>;
export type DeleteDaoMultisigMutationResult = Apollo.MutationResult<DeleteDaoMultisigMutation>;
export type DeleteDaoMultisigMutationOptions = Apollo.BaseMutationOptions<DeleteDaoMultisigMutation, DeleteDaoMultisigMutationVariables>;
export const CreatePayrunDocument = gql`
    mutation createPayrun($data: CreatePayrunInput!) {
  createPayrun(data: $data) {
    ...Payrun
  }
}
    ${PayrunFragmentDoc}`;
export type CreatePayrunMutationFn = Apollo.MutationFunction<CreatePayrunMutation, CreatePayrunMutationVariables>;

/**
 * __useCreatePayrunMutation__
 *
 * To run a mutation, you first call `useCreatePayrunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePayrunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPayrunMutation, { data, loading, error }] = useCreatePayrunMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePayrunMutation(baseOptions?: Apollo.MutationHookOptions<CreatePayrunMutation, CreatePayrunMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePayrunMutation, CreatePayrunMutationVariables>(CreatePayrunDocument, options);
      }
export type CreatePayrunMutationHookResult = ReturnType<typeof useCreatePayrunMutation>;
export type CreatePayrunMutationResult = Apollo.MutationResult<CreatePayrunMutation>;
export type CreatePayrunMutationOptions = Apollo.BaseMutationOptions<CreatePayrunMutation, CreatePayrunMutationVariables>;
export const PayrunsByDaoDocument = gql`
    query payrunsByDao($daoId: String!) {
  payrunsByDao(daoId: $daoId) {
    ...Payrun
  }
}
    ${PayrunFragmentDoc}`;

/**
 * __usePayrunsByDaoQuery__
 *
 * To run a query within a React component, call `usePayrunsByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `usePayrunsByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePayrunsByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function usePayrunsByDaoQuery(baseOptions: Apollo.QueryHookOptions<PayrunsByDaoQuery, PayrunsByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PayrunsByDaoQuery, PayrunsByDaoQueryVariables>(PayrunsByDaoDocument, options);
      }
export function usePayrunsByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PayrunsByDaoQuery, PayrunsByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PayrunsByDaoQuery, PayrunsByDaoQueryVariables>(PayrunsByDaoDocument, options);
        }
export type PayrunsByDaoQueryHookResult = ReturnType<typeof usePayrunsByDaoQuery>;
export type PayrunsByDaoLazyQueryHookResult = ReturnType<typeof usePayrunsByDaoLazyQuery>;
export type PayrunsByDaoQueryResult = Apollo.QueryResult<PayrunsByDaoQuery, PayrunsByDaoQueryVariables>;
export const GetPayrunDetailsByDaoDocument = gql`
    query getPayrunDetailsByDao($data: PayrunQueryInput!) {
  getPayrunDetailsByDao(data: $data) {
    ...PayrunDetailResponse
  }
}
    ${PayrunDetailResponseFragmentDoc}`;

/**
 * __useGetPayrunDetailsByDaoQuery__
 *
 * To run a query within a React component, call `useGetPayrunDetailsByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPayrunDetailsByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPayrunDetailsByDaoQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetPayrunDetailsByDaoQuery(baseOptions: Apollo.QueryHookOptions<GetPayrunDetailsByDaoQuery, GetPayrunDetailsByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPayrunDetailsByDaoQuery, GetPayrunDetailsByDaoQueryVariables>(GetPayrunDetailsByDaoDocument, options);
      }
export function useGetPayrunDetailsByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPayrunDetailsByDaoQuery, GetPayrunDetailsByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPayrunDetailsByDaoQuery, GetPayrunDetailsByDaoQueryVariables>(GetPayrunDetailsByDaoDocument, options);
        }
export type GetPayrunDetailsByDaoQueryHookResult = ReturnType<typeof useGetPayrunDetailsByDaoQuery>;
export type GetPayrunDetailsByDaoLazyQueryHookResult = ReturnType<typeof useGetPayrunDetailsByDaoLazyQuery>;
export type GetPayrunDetailsByDaoQueryResult = Apollo.QueryResult<GetPayrunDetailsByDaoQuery, GetPayrunDetailsByDaoQueryVariables>;
export const CreatePolicyDocument = gql`
    mutation createPolicy($createPolicyInput: CreatePolicyInput!) {
  createPolicy(createPolicyInput: $createPolicyInput) {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;
export type CreatePolicyMutationFn = Apollo.MutationFunction<CreatePolicyMutation, CreatePolicyMutationVariables>;

/**
 * __useCreatePolicyMutation__
 *
 * To run a mutation, you first call `useCreatePolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPolicyMutation, { data, loading, error }] = useCreatePolicyMutation({
 *   variables: {
 *      createPolicyInput: // value for 'createPolicyInput'
 *   },
 * });
 */
export function useCreatePolicyMutation(baseOptions?: Apollo.MutationHookOptions<CreatePolicyMutation, CreatePolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePolicyMutation, CreatePolicyMutationVariables>(CreatePolicyDocument, options);
      }
export type CreatePolicyMutationHookResult = ReturnType<typeof useCreatePolicyMutation>;
export type CreatePolicyMutationResult = Apollo.MutationResult<CreatePolicyMutation>;
export type CreatePolicyMutationOptions = Apollo.BaseMutationOptions<CreatePolicyMutation, CreatePolicyMutationVariables>;
export const UpdatePolicyDocument = gql`
    mutation updatePolicy($updatePolicyInput: UpdatePolicyInput!) {
  updatePolicy(updatePolicyInput: $updatePolicyInput) {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;
export type UpdatePolicyMutationFn = Apollo.MutationFunction<UpdatePolicyMutation, UpdatePolicyMutationVariables>;

/**
 * __useUpdatePolicyMutation__
 *
 * To run a mutation, you first call `useUpdatePolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePolicyMutation, { data, loading, error }] = useUpdatePolicyMutation({
 *   variables: {
 *      updatePolicyInput: // value for 'updatePolicyInput'
 *   },
 * });
 */
export function useUpdatePolicyMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePolicyMutation, UpdatePolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePolicyMutation, UpdatePolicyMutationVariables>(UpdatePolicyDocument, options);
      }
export type UpdatePolicyMutationHookResult = ReturnType<typeof useUpdatePolicyMutation>;
export type UpdatePolicyMutationResult = Apollo.MutationResult<UpdatePolicyMutation>;
export type UpdatePolicyMutationOptions = Apollo.BaseMutationOptions<UpdatePolicyMutation, UpdatePolicyMutationVariables>;
export const DeletePolicyDocument = gql`
    mutation deletePolicy($id: ID!) {
  deletePolicy(id: $id) {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;
export type DeletePolicyMutationFn = Apollo.MutationFunction<DeletePolicyMutation, DeletePolicyMutationVariables>;

/**
 * __useDeletePolicyMutation__
 *
 * To run a mutation, you first call `useDeletePolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePolicyMutation, { data, loading, error }] = useDeletePolicyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePolicyMutation(baseOptions?: Apollo.MutationHookOptions<DeletePolicyMutation, DeletePolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePolicyMutation, DeletePolicyMutationVariables>(DeletePolicyDocument, options);
      }
export type DeletePolicyMutationHookResult = ReturnType<typeof useDeletePolicyMutation>;
export type DeletePolicyMutationResult = Apollo.MutationResult<DeletePolicyMutation>;
export type DeletePolicyMutationOptions = Apollo.BaseMutationOptions<DeletePolicyMutation, DeletePolicyMutationVariables>;
export const PolicyDocument = gql`
    query policy($id: String!) {
  policy(id: $id) {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;

/**
 * __usePolicyQuery__
 *
 * To run a query within a React component, call `usePolicyQuery` and pass it any options that fit your needs.
 * When your component renders, `usePolicyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePolicyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePolicyQuery(baseOptions: Apollo.QueryHookOptions<PolicyQuery, PolicyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PolicyQuery, PolicyQueryVariables>(PolicyDocument, options);
      }
export function usePolicyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PolicyQuery, PolicyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PolicyQuery, PolicyQueryVariables>(PolicyDocument, options);
        }
export type PolicyQueryHookResult = ReturnType<typeof usePolicyQuery>;
export type PolicyLazyQueryHookResult = ReturnType<typeof usePolicyLazyQuery>;
export type PolicyQueryResult = Apollo.QueryResult<PolicyQuery, PolicyQueryVariables>;
export const PoliciesDocument = gql`
    query policies {
  policies {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;

/**
 * __usePoliciesQuery__
 *
 * To run a query within a React component, call `usePoliciesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoliciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoliciesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePoliciesQuery(baseOptions?: Apollo.QueryHookOptions<PoliciesQuery, PoliciesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PoliciesQuery, PoliciesQueryVariables>(PoliciesDocument, options);
      }
export function usePoliciesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoliciesQuery, PoliciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PoliciesQuery, PoliciesQueryVariables>(PoliciesDocument, options);
        }
export type PoliciesQueryHookResult = ReturnType<typeof usePoliciesQuery>;
export type PoliciesLazyQueryHookResult = ReturnType<typeof usePoliciesLazyQuery>;
export type PoliciesQueryResult = Apollo.QueryResult<PoliciesQuery, PoliciesQueryVariables>;
export const PoliciesByDaoDocument = gql`
    query policiesByDao($daoId: String!) {
  policiesByDao(daoId: $daoId) {
    ...Policy
  }
}
    ${PolicyFragmentDoc}`;

/**
 * __usePoliciesByDaoQuery__
 *
 * To run a query within a React component, call `usePoliciesByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoliciesByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoliciesByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function usePoliciesByDaoQuery(baseOptions: Apollo.QueryHookOptions<PoliciesByDaoQuery, PoliciesByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PoliciesByDaoQuery, PoliciesByDaoQueryVariables>(PoliciesByDaoDocument, options);
      }
export function usePoliciesByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoliciesByDaoQuery, PoliciesByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PoliciesByDaoQuery, PoliciesByDaoQueryVariables>(PoliciesByDaoDocument, options);
        }
export type PoliciesByDaoQueryHookResult = ReturnType<typeof usePoliciesByDaoQuery>;
export type PoliciesByDaoLazyQueryHookResult = ReturnType<typeof usePoliciesByDaoLazyQuery>;
export type PoliciesByDaoQueryResult = Apollo.QueryResult<PoliciesByDaoQuery, PoliciesByDaoQueryVariables>;
export const CreateRegisteredServiceDocument = gql`
    mutation createRegisteredService($data: CreateRegisteredServiceInput!) {
  createRegisteredService(data: $data) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;
export type CreateRegisteredServiceMutationFn = Apollo.MutationFunction<CreateRegisteredServiceMutation, CreateRegisteredServiceMutationVariables>;

/**
 * __useCreateRegisteredServiceMutation__
 *
 * To run a mutation, you first call `useCreateRegisteredServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRegisteredServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRegisteredServiceMutation, { data, loading, error }] = useCreateRegisteredServiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRegisteredServiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateRegisteredServiceMutation, CreateRegisteredServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRegisteredServiceMutation, CreateRegisteredServiceMutationVariables>(CreateRegisteredServiceDocument, options);
      }
export type CreateRegisteredServiceMutationHookResult = ReturnType<typeof useCreateRegisteredServiceMutation>;
export type CreateRegisteredServiceMutationResult = Apollo.MutationResult<CreateRegisteredServiceMutation>;
export type CreateRegisteredServiceMutationOptions = Apollo.BaseMutationOptions<CreateRegisteredServiceMutation, CreateRegisteredServiceMutationVariables>;
export const UpdateRegisteredServiceDocument = gql`
    mutation updateRegisteredService($data: UpdateRegisteredServiceInput!) {
  updateRegisteredService(data: $data) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;
export type UpdateRegisteredServiceMutationFn = Apollo.MutationFunction<UpdateRegisteredServiceMutation, UpdateRegisteredServiceMutationVariables>;

/**
 * __useUpdateRegisteredServiceMutation__
 *
 * To run a mutation, you first call `useUpdateRegisteredServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRegisteredServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRegisteredServiceMutation, { data, loading, error }] = useUpdateRegisteredServiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateRegisteredServiceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRegisteredServiceMutation, UpdateRegisteredServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRegisteredServiceMutation, UpdateRegisteredServiceMutationVariables>(UpdateRegisteredServiceDocument, options);
      }
export type UpdateRegisteredServiceMutationHookResult = ReturnType<typeof useUpdateRegisteredServiceMutation>;
export type UpdateRegisteredServiceMutationResult = Apollo.MutationResult<UpdateRegisteredServiceMutation>;
export type UpdateRegisteredServiceMutationOptions = Apollo.BaseMutationOptions<UpdateRegisteredServiceMutation, UpdateRegisteredServiceMutationVariables>;
export const RegisteredServiceDocument = gql`
    query registeredService($id: String!) {
  registeredService(id: $id) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;

/**
 * __useRegisteredServiceQuery__
 *
 * To run a query within a React component, call `useRegisteredServiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegisteredServiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegisteredServiceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRegisteredServiceQuery(baseOptions: Apollo.QueryHookOptions<RegisteredServiceQuery, RegisteredServiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegisteredServiceQuery, RegisteredServiceQueryVariables>(RegisteredServiceDocument, options);
      }
export function useRegisteredServiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegisteredServiceQuery, RegisteredServiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegisteredServiceQuery, RegisteredServiceQueryVariables>(RegisteredServiceDocument, options);
        }
export type RegisteredServiceQueryHookResult = ReturnType<typeof useRegisteredServiceQuery>;
export type RegisteredServiceLazyQueryHookResult = ReturnType<typeof useRegisteredServiceLazyQuery>;
export type RegisteredServiceQueryResult = Apollo.QueryResult<RegisteredServiceQuery, RegisteredServiceQueryVariables>;
export const RegisteredServicesDocument = gql`
    query registeredServices {
  registeredServices {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;

/**
 * __useRegisteredServicesQuery__
 *
 * To run a query within a React component, call `useRegisteredServicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegisteredServicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegisteredServicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useRegisteredServicesQuery(baseOptions?: Apollo.QueryHookOptions<RegisteredServicesQuery, RegisteredServicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegisteredServicesQuery, RegisteredServicesQueryVariables>(RegisteredServicesDocument, options);
      }
export function useRegisteredServicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegisteredServicesQuery, RegisteredServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegisteredServicesQuery, RegisteredServicesQueryVariables>(RegisteredServicesDocument, options);
        }
export type RegisteredServicesQueryHookResult = ReturnType<typeof useRegisteredServicesQuery>;
export type RegisteredServicesLazyQueryHookResult = ReturnType<typeof useRegisteredServicesLazyQuery>;
export type RegisteredServicesQueryResult = Apollo.QueryResult<RegisteredServicesQuery, RegisteredServicesQueryVariables>;
export const DeleteRegisteredServiceDocument = gql`
    mutation deleteRegisteredService($id: ID!) {
  deleteRegisteredService(id: $id) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;
export type DeleteRegisteredServiceMutationFn = Apollo.MutationFunction<DeleteRegisteredServiceMutation, DeleteRegisteredServiceMutationVariables>;

/**
 * __useDeleteRegisteredServiceMutation__
 *
 * To run a mutation, you first call `useDeleteRegisteredServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRegisteredServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRegisteredServiceMutation, { data, loading, error }] = useDeleteRegisteredServiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRegisteredServiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRegisteredServiceMutation, DeleteRegisteredServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRegisteredServiceMutation, DeleteRegisteredServiceMutationVariables>(DeleteRegisteredServiceDocument, options);
      }
export type DeleteRegisteredServiceMutationHookResult = ReturnType<typeof useDeleteRegisteredServiceMutation>;
export type DeleteRegisteredServiceMutationResult = Apollo.MutationResult<DeleteRegisteredServiceMutation>;
export type DeleteRegisteredServiceMutationOptions = Apollo.BaseMutationOptions<DeleteRegisteredServiceMutation, DeleteRegisteredServiceMutationVariables>;
export const ArchiveRegisteredServiceDocument = gql`
    mutation archiveRegisteredService($id: ID!) {
  archiveRegisteredService(id: $id) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;
export type ArchiveRegisteredServiceMutationFn = Apollo.MutationFunction<ArchiveRegisteredServiceMutation, ArchiveRegisteredServiceMutationVariables>;

/**
 * __useArchiveRegisteredServiceMutation__
 *
 * To run a mutation, you first call `useArchiveRegisteredServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveRegisteredServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveRegisteredServiceMutation, { data, loading, error }] = useArchiveRegisteredServiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveRegisteredServiceMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveRegisteredServiceMutation, ArchiveRegisteredServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveRegisteredServiceMutation, ArchiveRegisteredServiceMutationVariables>(ArchiveRegisteredServiceDocument, options);
      }
export type ArchiveRegisteredServiceMutationHookResult = ReturnType<typeof useArchiveRegisteredServiceMutation>;
export type ArchiveRegisteredServiceMutationResult = Apollo.MutationResult<ArchiveRegisteredServiceMutation>;
export type ArchiveRegisteredServiceMutationOptions = Apollo.BaseMutationOptions<ArchiveRegisteredServiceMutation, ArchiveRegisteredServiceMutationVariables>;
export const UnarchiveRegisteredServiceDocument = gql`
    mutation unarchiveRegisteredService($id: ID!) {
  unarchiveRegisteredService(id: $id) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;
export type UnarchiveRegisteredServiceMutationFn = Apollo.MutationFunction<UnarchiveRegisteredServiceMutation, UnarchiveRegisteredServiceMutationVariables>;

/**
 * __useUnarchiveRegisteredServiceMutation__
 *
 * To run a mutation, you first call `useUnarchiveRegisteredServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnarchiveRegisteredServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unarchiveRegisteredServiceMutation, { data, loading, error }] = useUnarchiveRegisteredServiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnarchiveRegisteredServiceMutation(baseOptions?: Apollo.MutationHookOptions<UnarchiveRegisteredServiceMutation, UnarchiveRegisteredServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnarchiveRegisteredServiceMutation, UnarchiveRegisteredServiceMutationVariables>(UnarchiveRegisteredServiceDocument, options);
      }
export type UnarchiveRegisteredServiceMutationHookResult = ReturnType<typeof useUnarchiveRegisteredServiceMutation>;
export type UnarchiveRegisteredServiceMutationResult = Apollo.MutationResult<UnarchiveRegisteredServiceMutation>;
export type UnarchiveRegisteredServiceMutationOptions = Apollo.BaseMutationOptions<UnarchiveRegisteredServiceMutation, UnarchiveRegisteredServiceMutationVariables>;
export const RegisteredServiceByDaoDocument = gql`
    query registeredServiceByDao($daoId: String!, $archived: Boolean, $billingType: ServiceBillingType) {
  registeredServiceByDao(
    daoId: $daoId
    archived: $archived
    billingType: $billingType
  ) {
    ...RegisteredService
  }
}
    ${RegisteredServiceFragmentDoc}`;

/**
 * __useRegisteredServiceByDaoQuery__
 *
 * To run a query within a React component, call `useRegisteredServiceByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegisteredServiceByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegisteredServiceByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *      archived: // value for 'archived'
 *      billingType: // value for 'billingType'
 *   },
 * });
 */
export function useRegisteredServiceByDaoQuery(baseOptions: Apollo.QueryHookOptions<RegisteredServiceByDaoQuery, RegisteredServiceByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegisteredServiceByDaoQuery, RegisteredServiceByDaoQueryVariables>(RegisteredServiceByDaoDocument, options);
      }
export function useRegisteredServiceByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegisteredServiceByDaoQuery, RegisteredServiceByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegisteredServiceByDaoQuery, RegisteredServiceByDaoQueryVariables>(RegisteredServiceByDaoDocument, options);
        }
export type RegisteredServiceByDaoQueryHookResult = ReturnType<typeof useRegisteredServiceByDaoQuery>;
export type RegisteredServiceByDaoLazyQueryHookResult = ReturnType<typeof useRegisteredServiceByDaoLazyQuery>;
export type RegisteredServiceByDaoQueryResult = Apollo.QueryResult<RegisteredServiceByDaoQuery, RegisteredServiceByDaoQueryVariables>;
export const CreateReoccuringExpenseDocument = gql`
    mutation createReoccuringExpense($createReoccuringExpenseInput: CreateReoccuringExpenseInput!) {
  createReoccuringExpense(
    createReoccuringExpenseInput: $createReoccuringExpenseInput
  ) {
    ...ReoccuringExpense
  }
}
    ${ReoccuringExpenseFragmentDoc}`;
export type CreateReoccuringExpenseMutationFn = Apollo.MutationFunction<CreateReoccuringExpenseMutation, CreateReoccuringExpenseMutationVariables>;

/**
 * __useCreateReoccuringExpenseMutation__
 *
 * To run a mutation, you first call `useCreateReoccuringExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReoccuringExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReoccuringExpenseMutation, { data, loading, error }] = useCreateReoccuringExpenseMutation({
 *   variables: {
 *      createReoccuringExpenseInput: // value for 'createReoccuringExpenseInput'
 *   },
 * });
 */
export function useCreateReoccuringExpenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateReoccuringExpenseMutation, CreateReoccuringExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReoccuringExpenseMutation, CreateReoccuringExpenseMutationVariables>(CreateReoccuringExpenseDocument, options);
      }
export type CreateReoccuringExpenseMutationHookResult = ReturnType<typeof useCreateReoccuringExpenseMutation>;
export type CreateReoccuringExpenseMutationResult = Apollo.MutationResult<CreateReoccuringExpenseMutation>;
export type CreateReoccuringExpenseMutationOptions = Apollo.BaseMutationOptions<CreateReoccuringExpenseMutation, CreateReoccuringExpenseMutationVariables>;
export const UpdateReoccuringExpenseDocument = gql`
    mutation updateReoccuringExpense($updateReoccuringExpenseInput: UpdateReoccuringExpenseInput!) {
  updateReoccuringExpense(
    updateReoccuringExpenseInput: $updateReoccuringExpenseInput
  ) {
    ...ReoccuringExpense
  }
}
    ${ReoccuringExpenseFragmentDoc}`;
export type UpdateReoccuringExpenseMutationFn = Apollo.MutationFunction<UpdateReoccuringExpenseMutation, UpdateReoccuringExpenseMutationVariables>;

/**
 * __useUpdateReoccuringExpenseMutation__
 *
 * To run a mutation, you first call `useUpdateReoccuringExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReoccuringExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReoccuringExpenseMutation, { data, loading, error }] = useUpdateReoccuringExpenseMutation({
 *   variables: {
 *      updateReoccuringExpenseInput: // value for 'updateReoccuringExpenseInput'
 *   },
 * });
 */
export function useUpdateReoccuringExpenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReoccuringExpenseMutation, UpdateReoccuringExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReoccuringExpenseMutation, UpdateReoccuringExpenseMutationVariables>(UpdateReoccuringExpenseDocument, options);
      }
export type UpdateReoccuringExpenseMutationHookResult = ReturnType<typeof useUpdateReoccuringExpenseMutation>;
export type UpdateReoccuringExpenseMutationResult = Apollo.MutationResult<UpdateReoccuringExpenseMutation>;
export type UpdateReoccuringExpenseMutationOptions = Apollo.BaseMutationOptions<UpdateReoccuringExpenseMutation, UpdateReoccuringExpenseMutationVariables>;
export const DeleteReoccuringExpenseDocument = gql`
    mutation deleteReoccuringExpense($id: ID!) {
  deleteReoccuringExpense(id: $id) {
    ...ReoccuringExpense
  }
}
    ${ReoccuringExpenseFragmentDoc}`;
export type DeleteReoccuringExpenseMutationFn = Apollo.MutationFunction<DeleteReoccuringExpenseMutation, DeleteReoccuringExpenseMutationVariables>;

/**
 * __useDeleteReoccuringExpenseMutation__
 *
 * To run a mutation, you first call `useDeleteReoccuringExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReoccuringExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReoccuringExpenseMutation, { data, loading, error }] = useDeleteReoccuringExpenseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteReoccuringExpenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReoccuringExpenseMutation, DeleteReoccuringExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReoccuringExpenseMutation, DeleteReoccuringExpenseMutationVariables>(DeleteReoccuringExpenseDocument, options);
      }
export type DeleteReoccuringExpenseMutationHookResult = ReturnType<typeof useDeleteReoccuringExpenseMutation>;
export type DeleteReoccuringExpenseMutationResult = Apollo.MutationResult<DeleteReoccuringExpenseMutation>;
export type DeleteReoccuringExpenseMutationOptions = Apollo.BaseMutationOptions<DeleteReoccuringExpenseMutation, DeleteReoccuringExpenseMutationVariables>;
export const ReoccuringExpenseDocument = gql`
    query reoccuringExpense($id: String!) {
  reoccuringExpense(id: $id) {
    ...ReoccuringExpense
  }
}
    ${ReoccuringExpenseFragmentDoc}`;

/**
 * __useReoccuringExpenseQuery__
 *
 * To run a query within a React component, call `useReoccuringExpenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useReoccuringExpenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReoccuringExpenseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReoccuringExpenseQuery(baseOptions: Apollo.QueryHookOptions<ReoccuringExpenseQuery, ReoccuringExpenseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReoccuringExpenseQuery, ReoccuringExpenseQueryVariables>(ReoccuringExpenseDocument, options);
      }
export function useReoccuringExpenseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReoccuringExpenseQuery, ReoccuringExpenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReoccuringExpenseQuery, ReoccuringExpenseQueryVariables>(ReoccuringExpenseDocument, options);
        }
export type ReoccuringExpenseQueryHookResult = ReturnType<typeof useReoccuringExpenseQuery>;
export type ReoccuringExpenseLazyQueryHookResult = ReturnType<typeof useReoccuringExpenseLazyQuery>;
export type ReoccuringExpenseQueryResult = Apollo.QueryResult<ReoccuringExpenseQuery, ReoccuringExpenseQueryVariables>;
export const ReoccuringExpensesDocument = gql`
    query reoccuringExpenses {
  reoccuringExpenses {
    ...ReoccuringExpense
  }
}
    ${ReoccuringExpenseFragmentDoc}`;

/**
 * __useReoccuringExpensesQuery__
 *
 * To run a query within a React component, call `useReoccuringExpensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useReoccuringExpensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReoccuringExpensesQuery({
 *   variables: {
 *   },
 * });
 */
export function useReoccuringExpensesQuery(baseOptions?: Apollo.QueryHookOptions<ReoccuringExpensesQuery, ReoccuringExpensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReoccuringExpensesQuery, ReoccuringExpensesQueryVariables>(ReoccuringExpensesDocument, options);
      }
export function useReoccuringExpensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReoccuringExpensesQuery, ReoccuringExpensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReoccuringExpensesQuery, ReoccuringExpensesQueryVariables>(ReoccuringExpensesDocument, options);
        }
export type ReoccuringExpensesQueryHookResult = ReturnType<typeof useReoccuringExpensesQuery>;
export type ReoccuringExpensesLazyQueryHookResult = ReturnType<typeof useReoccuringExpensesLazyQuery>;
export type ReoccuringExpensesQueryResult = Apollo.QueryResult<ReoccuringExpensesQuery, ReoccuringExpensesQueryVariables>;
export const ReoccuringExpensesByDaoDocument = gql`
    query reoccuringExpensesByDao($daoId: String!) {
  reoccuringExpensesByDao(daoId: $daoId) {
    ...ReoccuringExpense
  }
}
    ${ReoccuringExpenseFragmentDoc}`;

/**
 * __useReoccuringExpensesByDaoQuery__
 *
 * To run a query within a React component, call `useReoccuringExpensesByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useReoccuringExpensesByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReoccuringExpensesByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function useReoccuringExpensesByDaoQuery(baseOptions: Apollo.QueryHookOptions<ReoccuringExpensesByDaoQuery, ReoccuringExpensesByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReoccuringExpensesByDaoQuery, ReoccuringExpensesByDaoQueryVariables>(ReoccuringExpensesByDaoDocument, options);
      }
export function useReoccuringExpensesByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReoccuringExpensesByDaoQuery, ReoccuringExpensesByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReoccuringExpensesByDaoQuery, ReoccuringExpensesByDaoQueryVariables>(ReoccuringExpensesByDaoDocument, options);
        }
export type ReoccuringExpensesByDaoQueryHookResult = ReturnType<typeof useReoccuringExpensesByDaoQuery>;
export type ReoccuringExpensesByDaoLazyQueryHookResult = ReturnType<typeof useReoccuringExpensesByDaoLazyQuery>;
export type ReoccuringExpensesByDaoQueryResult = Apollo.QueryResult<ReoccuringExpensesByDaoQuery, ReoccuringExpensesByDaoQueryVariables>;
export const CreateSupplierDocument = gql`
    mutation createSupplier($createSupplierInput: CreateSupplierInput!) {
  createSupplier(createSupplierInput: $createSupplierInput) {
    ...Supplier
  }
}
    ${SupplierFragmentDoc}`;
export type CreateSupplierMutationFn = Apollo.MutationFunction<CreateSupplierMutation, CreateSupplierMutationVariables>;

/**
 * __useCreateSupplierMutation__
 *
 * To run a mutation, you first call `useCreateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSupplierMutation, { data, loading, error }] = useCreateSupplierMutation({
 *   variables: {
 *      createSupplierInput: // value for 'createSupplierInput'
 *   },
 * });
 */
export function useCreateSupplierMutation(baseOptions?: Apollo.MutationHookOptions<CreateSupplierMutation, CreateSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSupplierMutation, CreateSupplierMutationVariables>(CreateSupplierDocument, options);
      }
export type CreateSupplierMutationHookResult = ReturnType<typeof useCreateSupplierMutation>;
export type CreateSupplierMutationResult = Apollo.MutationResult<CreateSupplierMutation>;
export type CreateSupplierMutationOptions = Apollo.BaseMutationOptions<CreateSupplierMutation, CreateSupplierMutationVariables>;
export const UpdateSupplierDocument = gql`
    mutation updateSupplier($updateSupplierInput: UpdateSupplierInput!) {
  updateSupplier(updateSupplierInput: $updateSupplierInput) {
    ...Supplier
  }
}
    ${SupplierFragmentDoc}`;
export type UpdateSupplierMutationFn = Apollo.MutationFunction<UpdateSupplierMutation, UpdateSupplierMutationVariables>;

/**
 * __useUpdateSupplierMutation__
 *
 * To run a mutation, you first call `useUpdateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSupplierMutation, { data, loading, error }] = useUpdateSupplierMutation({
 *   variables: {
 *      updateSupplierInput: // value for 'updateSupplierInput'
 *   },
 * });
 */
export function useUpdateSupplierMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSupplierMutation, UpdateSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSupplierMutation, UpdateSupplierMutationVariables>(UpdateSupplierDocument, options);
      }
export type UpdateSupplierMutationHookResult = ReturnType<typeof useUpdateSupplierMutation>;
export type UpdateSupplierMutationResult = Apollo.MutationResult<UpdateSupplierMutation>;
export type UpdateSupplierMutationOptions = Apollo.BaseMutationOptions<UpdateSupplierMutation, UpdateSupplierMutationVariables>;
export const SuppliersByDaoDocument = gql`
    query suppliersByDao($daoId: String!) {
  suppliersByDao(daoId: $daoId) {
    ...Supplier
  }
}
    ${SupplierFragmentDoc}`;

/**
 * __useSuppliersByDaoQuery__
 *
 * To run a query within a React component, call `useSuppliersByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuppliersByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuppliersByDaoQuery({
 *   variables: {
 *      daoId: // value for 'daoId'
 *   },
 * });
 */
export function useSuppliersByDaoQuery(baseOptions: Apollo.QueryHookOptions<SuppliersByDaoQuery, SuppliersByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuppliersByDaoQuery, SuppliersByDaoQueryVariables>(SuppliersByDaoDocument, options);
      }
export function useSuppliersByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuppliersByDaoQuery, SuppliersByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuppliersByDaoQuery, SuppliersByDaoQueryVariables>(SuppliersByDaoDocument, options);
        }
export type SuppliersByDaoQueryHookResult = ReturnType<typeof useSuppliersByDaoQuery>;
export type SuppliersByDaoLazyQueryHookResult = ReturnType<typeof useSuppliersByDaoLazyQuery>;
export type SuppliersByDaoQueryResult = Apollo.QueryResult<SuppliersByDaoQuery, SuppliersByDaoQueryVariables>;
export const SupplierDocument = gql`
    query supplier($id: String!) {
  supplier(id: $id) {
    ...Supplier
  }
}
    ${SupplierFragmentDoc}`;

/**
 * __useSupplierQuery__
 *
 * To run a query within a React component, call `useSupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupplierQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSupplierQuery(baseOptions: Apollo.QueryHookOptions<SupplierQuery, SupplierQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
      }
export function useSupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupplierQuery, SupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
        }
export type SupplierQueryHookResult = ReturnType<typeof useSupplierQuery>;
export type SupplierLazyQueryHookResult = ReturnType<typeof useSupplierLazyQuery>;
export type SupplierQueryResult = Apollo.QueryResult<SupplierQuery, SupplierQueryVariables>;
export const CreateTimesheetDocument = gql`
    mutation createTimesheet($data: CreateTimesheetInput!) {
  createTimesheet(data: $data) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;
export type CreateTimesheetMutationFn = Apollo.MutationFunction<CreateTimesheetMutation, CreateTimesheetMutationVariables>;

/**
 * __useCreateTimesheetMutation__
 *
 * To run a mutation, you first call `useCreateTimesheetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTimesheetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTimesheetMutation, { data, loading, error }] = useCreateTimesheetMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTimesheetMutation(baseOptions?: Apollo.MutationHookOptions<CreateTimesheetMutation, CreateTimesheetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTimesheetMutation, CreateTimesheetMutationVariables>(CreateTimesheetDocument, options);
      }
export type CreateTimesheetMutationHookResult = ReturnType<typeof useCreateTimesheetMutation>;
export type CreateTimesheetMutationResult = Apollo.MutationResult<CreateTimesheetMutation>;
export type CreateTimesheetMutationOptions = Apollo.BaseMutationOptions<CreateTimesheetMutation, CreateTimesheetMutationVariables>;
export const UpdateTimesheetDocument = gql`
    mutation updateTimesheet($data: UpdateTimesheetInput!) {
  updateTimesheet(data: $data) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;
export type UpdateTimesheetMutationFn = Apollo.MutationFunction<UpdateTimesheetMutation, UpdateTimesheetMutationVariables>;

/**
 * __useUpdateTimesheetMutation__
 *
 * To run a mutation, you first call `useUpdateTimesheetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTimesheetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTimesheetMutation, { data, loading, error }] = useUpdateTimesheetMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTimesheetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTimesheetMutation, UpdateTimesheetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTimesheetMutation, UpdateTimesheetMutationVariables>(UpdateTimesheetDocument, options);
      }
export type UpdateTimesheetMutationHookResult = ReturnType<typeof useUpdateTimesheetMutation>;
export type UpdateTimesheetMutationResult = Apollo.MutationResult<UpdateTimesheetMutation>;
export type UpdateTimesheetMutationOptions = Apollo.BaseMutationOptions<UpdateTimesheetMutation, UpdateTimesheetMutationVariables>;
export const TimesheetsByDaoDocument = gql`
    query timesheetsByDao($data: TimesheetQueryInput!) {
  timesheetsByDao(data: $data) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;

/**
 * __useTimesheetsByDaoQuery__
 *
 * To run a query within a React component, call `useTimesheetsByDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimesheetsByDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimesheetsByDaoQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useTimesheetsByDaoQuery(baseOptions: Apollo.QueryHookOptions<TimesheetsByDaoQuery, TimesheetsByDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimesheetsByDaoQuery, TimesheetsByDaoQueryVariables>(TimesheetsByDaoDocument, options);
      }
export function useTimesheetsByDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimesheetsByDaoQuery, TimesheetsByDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimesheetsByDaoQuery, TimesheetsByDaoQueryVariables>(TimesheetsByDaoDocument, options);
        }
export type TimesheetsByDaoQueryHookResult = ReturnType<typeof useTimesheetsByDaoQuery>;
export type TimesheetsByDaoLazyQueryHookResult = ReturnType<typeof useTimesheetsByDaoLazyQuery>;
export type TimesheetsByDaoQueryResult = Apollo.QueryResult<TimesheetsByDaoQuery, TimesheetsByDaoQueryVariables>;
export const TimesheetDocument = gql`
    query timesheet($id: String!) {
  timesheet(id: $id) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;

/**
 * __useTimesheetQuery__
 *
 * To run a query within a React component, call `useTimesheetQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimesheetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimesheetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTimesheetQuery(baseOptions: Apollo.QueryHookOptions<TimesheetQuery, TimesheetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimesheetQuery, TimesheetQueryVariables>(TimesheetDocument, options);
      }
export function useTimesheetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimesheetQuery, TimesheetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimesheetQuery, TimesheetQueryVariables>(TimesheetDocument, options);
        }
export type TimesheetQueryHookResult = ReturnType<typeof useTimesheetQuery>;
export type TimesheetLazyQueryHookResult = ReturnType<typeof useTimesheetLazyQuery>;
export type TimesheetQueryResult = Apollo.QueryResult<TimesheetQuery, TimesheetQueryVariables>;
export const DeleteTimesheetDocument = gql`
    mutation deleteTimesheet($id: ID!) {
  deleteTimesheet(id: $id) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;
export type DeleteTimesheetMutationFn = Apollo.MutationFunction<DeleteTimesheetMutation, DeleteTimesheetMutationVariables>;

/**
 * __useDeleteTimesheetMutation__
 *
 * To run a mutation, you first call `useDeleteTimesheetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTimesheetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTimesheetMutation, { data, loading, error }] = useDeleteTimesheetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTimesheetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimesheetMutation, DeleteTimesheetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimesheetMutation, DeleteTimesheetMutationVariables>(DeleteTimesheetDocument, options);
      }
export type DeleteTimesheetMutationHookResult = ReturnType<typeof useDeleteTimesheetMutation>;
export type DeleteTimesheetMutationResult = Apollo.MutationResult<DeleteTimesheetMutation>;
export type DeleteTimesheetMutationOptions = Apollo.BaseMutationOptions<DeleteTimesheetMutation, DeleteTimesheetMutationVariables>;
export const ArchiveTimesheetDocument = gql`
    mutation archiveTimesheet($id: ID!) {
  archiveTimesheet(id: $id) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;
export type ArchiveTimesheetMutationFn = Apollo.MutationFunction<ArchiveTimesheetMutation, ArchiveTimesheetMutationVariables>;

/**
 * __useArchiveTimesheetMutation__
 *
 * To run a mutation, you first call `useArchiveTimesheetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveTimesheetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveTimesheetMutation, { data, loading, error }] = useArchiveTimesheetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveTimesheetMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveTimesheetMutation, ArchiveTimesheetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveTimesheetMutation, ArchiveTimesheetMutationVariables>(ArchiveTimesheetDocument, options);
      }
export type ArchiveTimesheetMutationHookResult = ReturnType<typeof useArchiveTimesheetMutation>;
export type ArchiveTimesheetMutationResult = Apollo.MutationResult<ArchiveTimesheetMutation>;
export type ArchiveTimesheetMutationOptions = Apollo.BaseMutationOptions<ArchiveTimesheetMutation, ArchiveTimesheetMutationVariables>;
export const UnarchiveTimesheetDocument = gql`
    mutation unarchiveTimesheet($id: ID!) {
  unarchiveTimesheet(id: $id) {
    ...Timesheet
  }
}
    ${TimesheetFragmentDoc}`;
export type UnarchiveTimesheetMutationFn = Apollo.MutationFunction<UnarchiveTimesheetMutation, UnarchiveTimesheetMutationVariables>;

/**
 * __useUnarchiveTimesheetMutation__
 *
 * To run a mutation, you first call `useUnarchiveTimesheetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnarchiveTimesheetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unarchiveTimesheetMutation, { data, loading, error }] = useUnarchiveTimesheetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnarchiveTimesheetMutation(baseOptions?: Apollo.MutationHookOptions<UnarchiveTimesheetMutation, UnarchiveTimesheetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnarchiveTimesheetMutation, UnarchiveTimesheetMutationVariables>(UnarchiveTimesheetDocument, options);
      }
export type UnarchiveTimesheetMutationHookResult = ReturnType<typeof useUnarchiveTimesheetMutation>;
export type UnarchiveTimesheetMutationResult = Apollo.MutationResult<UnarchiveTimesheetMutation>;
export type UnarchiveTimesheetMutationOptions = Apollo.BaseMutationOptions<UnarchiveTimesheetMutation, UnarchiveTimesheetMutationVariables>;
export const DeleteTimesheetEntryDocument = gql`
    mutation deleteTimesheetEntry($id: ID!) {
  deleteTimesheetEntry(id: $id) {
    ...TimesheetEntry
  }
}
    ${TimesheetEntryFragmentDoc}`;
export type DeleteTimesheetEntryMutationFn = Apollo.MutationFunction<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>;

/**
 * __useDeleteTimesheetEntryMutation__
 *
 * To run a mutation, you first call `useDeleteTimesheetEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTimesheetEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTimesheetEntryMutation, { data, loading, error }] = useDeleteTimesheetEntryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTimesheetEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>(DeleteTimesheetEntryDocument, options);
      }
export type DeleteTimesheetEntryMutationHookResult = ReturnType<typeof useDeleteTimesheetEntryMutation>;
export type DeleteTimesheetEntryMutationResult = Apollo.MutationResult<DeleteTimesheetEntryMutation>;
export type DeleteTimesheetEntryMutationOptions = Apollo.BaseMutationOptions<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>;