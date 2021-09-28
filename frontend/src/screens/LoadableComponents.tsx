import React from 'react';

export const NotFound = React.lazy(() => import('@kudoo/components/build/atoms/NotFound'));
export const SecondaryTabs = React.lazy(() => import('src/screens/common/SecondaryTabs'));

// daos Screens
export const ManageDAOs = React.lazy(() => import('src/screens/common/DAO/ManageDAOs'));
export const DAOSettings = React.lazy(() => import('src/screens/common/DAO/DAOSettings'));
export const CreateDAO = React.lazy(() => import('src/screens/common/DAO/CreateDAO'));

// Auth, User Configuration screens
export const Config = React.lazy(() => import('src/screens/common/Config/Config'));
export const Login = React.lazy(() => import('src/screens/common/Auth/Login'));
export const AccountSettings = React.lazy(() => import('src/screens/common/User/AccountSettings/index'));
export const ConfirmEmail = React.lazy(() => import('src/screens/common/Auth/ConfirmEmail'));
export const InviteEmail = React.lazy(() => import('src/screens/common/Auth/InviteEmail'));
export const ForgotPassword = React.lazy(() => import('src/screens/common/Auth/ForgotPassword'));
export const NewPassword = React.lazy(() => import('src/screens/common/Auth/NewPassword'));
export const ResetPasswordEmail = React.lazy(() => import('src/screens/common/Auth/ResetPasswordEmail'));

// Email screens
export const WelcomeEmailPreview = React.lazy(() => import('src/screens/common/Emails/Welcome'));
export const ConfirmEmailPreview = React.lazy(() => import('src/screens/common/Emails/Confirm'));
export const RememberEmailPreview = React.lazy(() => import('src/screens/common/Emails/Remember'));
export const InviteEmailPreview = React.lazy(() => import('src/screens/common/Emails/Invite'));
export const TimesheetNotifyEmailPreview = React.lazy(() => import('src/screens/common/Emails/TimesheetNotify'));
export const TimesheetApproveEmailPreview = React.lazy(() => import('src/screens/common/Emails/TimesheetApprove'));

// Customer Screens
export const ActiveCustomersTab = React.lazy(() => import('src/screens/common/Customers/Customers/ActiveCustomersTab'));
export const ArchivedCustomersTab = React.lazy(() => import('src/screens/common/Customers/Customers/ArchivedCustomersTab'));
export const CreateNewCustomer = React.lazy(() => import('src/screens/common/Customers/CreateNewCustomer'));
export const CustomerDetails = React.lazy(() => import('src/screens/common/Customers/CustomerDetails'));
export const CreateInventory = React.lazy(() => import('src/screens/common/Inventory/CreateInventory'));
export const CreateWarehouse = React.lazy(() => import('src/screens/common/Warehouse/CreateWarehouse'));

// Invoice Screens
export const UnpaidInvoicesTab = React.lazy(() => import('src/screens/common/Invoices/Invoices/UnpaidInvoicesTab'));
export const PaidInvoicesTab = React.lazy(() => import('src/screens/common/Invoices/Invoices/PaidInvoicesTab'));
export const ArchivedInvoicesTab = React.lazy(() => import('src/screens/common/Invoices/Invoices/ArchivedInvoicesTab'));
export const CreateInvoice = React.lazy(() => import('src/screens/common/Invoices/CreateInvoice'));
export const CreateFreeTextInvoice = React.lazy(() => import('src/screens/common/Invoices/CreateFreeTextInvoice'));
export const CreateProjectToInvoice = React.lazy(() => import('src/screens/common/Invoices/CreateProjectToInvoice'));
export const CreateTimesheetsToInvoice = React.lazy(() => import('src/screens/common/Invoices/CreateTimesheetsToInvoice'));
export const PreviewInvoice = React.lazy(() => import('src/screens/common/Invoices/PreviewInvoice'));
export const InvoiceSent = React.lazy(() => import('src/screens/common/Invoices/InvoiceSent'));

// Projects Screens
export const ActiveProjectsTab = React.lazy(() => import('src/screens/health/Projects/Projects/ActiveProjectsTab'));
export const ArchivedProjectsTab = React.lazy(() => import('src/screens/health/Projects/Projects/ArchivedProjectsTab'));
export const DraftProjectsTab = React.lazy(() => import('src/screens/health/Projects/Projects/DraftProjectsTab'));
export const CreateNewProject = React.lazy(() => import('src/screens/health/Projects/CreateNewProject'));
export const ProjectDetails = React.lazy(() => import('src/screens/health/Projects/ProjectDetails'));

// Inventory Screens
export const Dashboard = React.lazy(() => import('src/screens/projects/Dashboard/Dashboard'));
export const Suppliers = React.lazy(() => import('src/screens/inventory/Suppliers/Suppliers'));
export const CreateSupplier = React.lazy(() => import('src/screens/inventory/Suppliers/CreateSupplier'));
export const Inventory = React.lazy(() => import('src/screens/inventory/Inventory'));
export const Warehouse = React.lazy(() => import('src/screens/inventory/Warehouse'));
export const SalesOrderTab = React.lazy(() => import('src/screens/common/SalesOrder/SalesOrderTab'));
export const CreateSalesOrder = React.lazy(() => import('src/screens/common/SalesOrder/SalesOrderWizard'));
export const PBSDrugs = React.lazy(() => import('src/screens/inventory/PBS/Drugs'));
export const PBSManufacturers = React.lazy(() => import('src/screens/inventory/PBS/Manufacturers'));
export const ManufacturerDetails = React.lazy(() => import('src/screens/inventory/PBS/ManufacturerDetails'));
export const CreatePurchaseOrder = React.lazy(() => import('src/screens/inventory/PurchaseOrder/NonPbsPurchaseOrder/CreateNonPbsPO'));
export const CreatePbsPurchaseOrder = React.lazy(() => import('src/screens/inventory/PurchaseOrder/PbsPurchaseOrderTab/CreatePbsPO'));
export const PreviewPO = React.lazy(() => import('src/screens/inventory/PurchaseOrder/PurchaseOrder/PreviewPO'));
export const NonPbsPOList = React.lazy(() => import('src/screens/inventory/PurchaseOrder/NonPbsPurchaseOrder/NonPbsPOList'));
export const PbsPOList = React.lazy(() => import('src/screens/inventory/PurchaseOrder/PbsPurchaseOrderTab/PbsPOList'));

// Health Screens
export const CreateNewHealthcareProvider = React.lazy(() => import('src/screens/health/HealthcareProviders/CreateNewHealthcareProvider'));
export const HealthcareProvidersList = React.lazy(() => import('src/screens/health/HealthcareProviders/HealthcareProviders'));
export const PatientsList = React.lazy(() => import('src/screens/health/Patients/Patients'));
export const CreateNewPatient = React.lazy(() => import('src/screens/health/Patients/CreateNewPatient'));
export const ActiveServiceTab = React.lazy(() => import('src/screens/health/Services/Services/ActiveServiceTab'));
export const ArchivedServiceTab = React.lazy(() => import('src/screens/health/Services/Services/ArchivedServiceTab'));
export const CreateNewService = React.lazy(() => import('src/screens/health/Services/CreateNewService'));
export const ActiveTimesheetsTab = React.lazy(() => import('src/screens/health/Timesheets/Timesheets/ActiveTimesheetsTab'));
export const ArchivedTimesheetsTab = React.lazy(() => import('src/screens/health/Timesheets/Timesheets/ArchivedTimesheetsTab'));
export const DraftTimesheetsTab = React.lazy(() => import('src/screens/health/Timesheets/Timesheets/DraftTimesheetsTab'));
export const CreateTimesheets = React.lazy(() => import('src/screens/health/Timesheets/CreateTimesheets'));
export const ReviewTimesheet = React.lazy(() => import('src/screens/health/Timesheets/ReviewTimesheet'));
export const PreviewTimesheet = React.lazy(() => import('src/screens/health/Timesheets/PreviewTimesheet'));
export const TimesheetSettings = React.lazy(() => import('src/screens/health/Timesheets/TimesheetSettings'));

// Finance Screen
export const MainAccountTab = React.lazy(() => import('src/screens/finance/Ledger/Ledger/MainAccount'));
export const LedgerJournalsTab = React.lazy(() => import('src/screens/finance/Ledger/Ledger/Journals'));
export const LedgerPostingsTab = React.lazy(() => import('src/screens/finance/Ledger/Ledger/LedgerPostings'));
export const ProfitAndLoss = React.lazy(() => import('src/screens/finance/Reporting/ProfitAndLoss'));
export const BalanceSheet = React.lazy(() => import('src/screens/finance/Reporting/BalanceSheet'));
export const CreateMainAccount = React.lazy(() => import('src/screens/finance/Ledger/CreateNewMainAccount'));
export const CreateLedgerPosting = React.lazy(() => import('src/screens/finance/Ledger/CreateNewLedgerPosting'));
export const CreateLedgerJournal = React.lazy(() => import('src/screens/finance/Ledger/CreateLedgerJournal'));
export const CreateBankTransaction = React.lazy(() => import('src/screens/finance/Banking/BankTransactions/CreateBankTransaction'));
export const BankAccounts = React.lazy(() => import('src/screens/finance/Banking/BankAccount/BankAccount'));
export const BankTransactions = React.lazy(() => import('src/screens/finance/Banking/BankTransactions/BankTransactions'));
export const AssetList = React.lazy(() => import('src/screens/finance/Assets/Assets/AssetList'));
export const AssetGroups = React.lazy(() => import('src/screens/finance/Assets/Assets/AssetGroups'));
export const CreateAssetGroup = React.lazy(() => import('src/screens/finance/Assets/CreateAssetGroup'));
export const CreateAsset = React.lazy(() => import('src/screens/finance/Assets/CreateAsset'));
export const DataImportFile = React.lazy(() => import('src/screens/finance/DataImport/FileUpload'));
export const Contributors = React.lazy(() => import('src/screens/finance/Contributors/Contributors'));
export const CreateContributor = React.lazy(() => import('src/screens/finance/Contributors/CreateContributor'));
export const Policies = React.lazy(() => import('src/screens/finance/Contributors/Policies'));
export const CreatePolicy = React.lazy(() => import('src/screens/finance/Contributors/CreatePolicy'));
export const ReoccuringExpenses = React.lazy(() => import('src/screens/inventory/Suppliers/ReoccuringExpenses'));
export const CreateReoccuringExpense = React.lazy(() => import('src/screens/inventory/Suppliers/CreateReoccuringExpense'));
