import React from 'react';
import Loadable from 'react-loadable';
import { Loading as BaseLoading } from '@kudoo/components';

const Loading = (props: LoadableExport.LoadingComponentProps) => {
  /* eslint-disable */
  if (props.error) {
    console.log(props.error);
  }
  /* eslint-enable */
  return <BaseLoading size={100} />;
};

const CreateLoadable = (importedComponent: any) => {
  return Loadable<any, any>({
    loader: () => importedComponent,
    loading: Loading,
  });
};

/* prettier-ignore-start */

export const NotFound = CreateLoadable(
  import('@kudoo/components/build/atoms/NotFound')
);
export const SecondaryTabs = CreateLoadable(
  import('@client/common_screens/SecondaryTabs')
);

// Companies Screens
export const ManageCompanies = CreateLoadable(
  import('@client/common_screens/Companies/ManageCompanies')
);
export const CompanySettings = CreateLoadable(
  import('@client/common_screens/Companies/CompanySettings')
);
export const CreateCompany = CreateLoadable(
  import('@client/common_screens/Companies/CreateCompany')
);

// Auth, User Configuration screens
export const Config = CreateLoadable(
  import('@client/common_screens/Config/Config')
);
export const Login = CreateLoadable(
  import('@client/common_screens/Auth/Login')
);
export const AccountSettings = CreateLoadable(
  import('@client/common_screens/User/AccountSettings/index')
);
export const ConfirmEmail = CreateLoadable(
  import('@client/common_screens/Auth/ConfirmEmail')
);
export const InviteEmail = CreateLoadable(
  import('@client/common_screens/Auth/InviteEmail')
);
export const ForgotPassword = CreateLoadable(
  import('@client/common_screens/Auth/ForgotPassword')
);
export const NewPassword = CreateLoadable(
  import('@client/common_screens/Auth/NewPassword')
);
export const ResetPasswordEmail = CreateLoadable(
  import('@client/common_screens/Auth/ResetPasswordEmail')
);

// Email screens
export const WelcomeEmailPreview = CreateLoadable(
  import('@client/common_screens/Emails/Welcome')
);
export const ConfirmEmailPreview = CreateLoadable(
  import('@client/common_screens/Emails/Confirm')
);
export const RememberEmailPreview = CreateLoadable(
  import('@client/common_screens/Emails/Remember')
);
export const InviteEmailPreview = CreateLoadable(
  import('@client/common_screens/Emails/Invite')
);
export const TimesheetNotifyEmailPreview = CreateLoadable(
  import('@client/common_screens/Emails/TimesheetNotify')
);
export const TimesheetApproveEmailPreview = CreateLoadable(
  import('@client/common_screens/Emails/TimesheetApprove')
);

// Customer Screens
export const ActiveCustomersTab = CreateLoadable(
  import('@client/common_screens/Customers/Customers/ActiveCustomersTab')
);
export const ArchivedCustomersTab = CreateLoadable(
  import('@client/common_screens/Customers/Customers/ArchivedCustomersTab')
);
export const CreateNewCustomer = CreateLoadable(
  import('@client/common_screens/Customers/CreateNewCustomer')
);
export const CustomerDetails = CreateLoadable(
  import('@client/common_screens/Customers/CustomerDetails')
);
export const CreateInventory = CreateLoadable(
  import('@client/common_screens/Inventory/CreateInventory')
);
export const CreateWarehouse = CreateLoadable(
  import('@client/common_screens/Warehouse/CreateWarehouse')
);

// Invoice Screens
export const UnpaidInvoicesTab = CreateLoadable(
  import('@client/common_screens/Invoices/Invoices/UnpaidInvoicesTab')
);
export const PaidInvoicesTab = CreateLoadable(
  import('@client/common_screens/Invoices/Invoices/PaidInvoicesTab')
);
export const ArchivedInvoicesTab = CreateLoadable(
  import('@client/common_screens/Invoices/Invoices/ArchivedInvoicesTab')
);
export const CreateInvoice = CreateLoadable(
  import('@client/common_screens/Invoices/CreateInvoice')
);
export const CreateFreeTextInvoice = CreateLoadable(
  import('@client/common_screens/Invoices/CreateFreeTextInvoice')
);
export const CreateProjectToInvoice = CreateLoadable(
  import('@client/common_screens/Invoices/CreateProjectToInvoice')
);
export const CreateTimesheetsToInvoice = CreateLoadable(
  import('@client/common_screens/Invoices/CreateTimesheetsToInvoice')
);
export const PreviewInvoice = CreateLoadable(
  import('@client/common_screens/Invoices/PreviewInvoice')
);
export const InvoiceSent = CreateLoadable(
  import('@client/common_screens/Invoices/InvoiceSent')
);

// Projects Screens
export const ActiveProjectsTab = CreateLoadable(
  import('@client/screens/health/Projects/Projects/ActiveProjectsTab')
);
export const ArchivedProjectsTab = CreateLoadable(
  import('@client/screens/health/Projects/Projects/ArchivedProjectsTab')
);
export const DraftProjectsTab = CreateLoadable(
  import('@client/screens/health/Projects/Projects/DraftProjectsTab')
);
export const CreateNewProject = CreateLoadable(
  import('@client/screens/health/Projects/CreateNewProject')
);
export const ProjectDetails = CreateLoadable(
  import('@client/screens/health/Projects/ProjectDetails')
);

// Inventory Screens
export const Dashboard = CreateLoadable(
  import('@client/screens/projects/Dashboard/Dashboard')
);
export const Suppliers = CreateLoadable(
  import('@client/screens/inventory/Suppliers/Suppliers')
);
export const CreateSupplier = CreateLoadable(
  import('@client/screens/inventory/Suppliers/CreateSupplier')
);
export const Inventory = CreateLoadable(
  import('@client/screens/inventory/Inventory')
);
export const Warehouse = CreateLoadable(
  import('@client/screens/inventory/Warehouse')
);
export const SalesOrderTab = CreateLoadable(
  import('@client/common_screens/SalesOrder/SalesOrderTab')
);
export const CreateSalesOrder = CreateLoadable(
  import('@client/common_screens/SalesOrder/SalesOrderWizard')
);
export const PBSDrugs = CreateLoadable(
  import('@client/screens/inventory/PBS/Drugs')
);
export const PBSManufacturers = CreateLoadable(
  import('@client/screens/inventory/PBS/Manufacturers')
);
export const ManufacturerDetails = CreateLoadable(
  import('@client/screens/inventory/PBS/ManufacturerDetails')
);
export const CreatePurchaseOrder = CreateLoadable(
  import(
    '@client/screens/inventory/PurchaseOrder/NonPbsPurchaseOrder/CreateNonPbsPO'
  )
);
export const CreatePbsPurchaseOrder = CreateLoadable(
  import(
    '@client/screens/inventory/PurchaseOrder/PbsPurchaseOrderTab/CreatePbsPO'
  )
);
export const PreviewPO = CreateLoadable(
  import('@client/screens/inventory/PurchaseOrder/PurchaseOrder/PreviewPO')
);
export const NonPbsPOList = CreateLoadable(
  import(
    '@client/screens/inventory/PurchaseOrder/NonPbsPurchaseOrder/NonPbsPOList'
  )
);
export const PbsPOList = CreateLoadable(
  import(
    '@client/screens/inventory/PurchaseOrder/PbsPurchaseOrderTab/PbsPOList'
  )
);

// Health Screens
export const CreateNewHealthcareProvider = CreateLoadable(
  import(
    '@client/screens/health/HealthcareProviders/CreateNewHealthcareProvider'
  )
);
export const HealthcareProvidersList = CreateLoadable(
  import('@client/screens/health/HealthcareProviders/HealthcareProviders')
);
export const PatientsList = CreateLoadable(
  import('@client/screens/health/Patients/Patients')
);
export const CreateNewPatient = CreateLoadable(
  import('@client/screens/health/Patients/CreateNewPatient')
);
export const ActiveServiceTab = CreateLoadable(
  import('@client/screens/health/Services/Services/ActiveServiceTab')
);
export const ArchivedServiceTab = CreateLoadable(
  import('@client/screens/health/Services/Services/ArchivedServiceTab')
);
export const CreateNewService = CreateLoadable(
  import('@client/screens/health/Services/CreateNewService')
);
export const ActiveTimesheetsTab = CreateLoadable(
  import('@client/screens/health/Timesheets/Timesheets/ActiveTimesheetsTab')
);
export const ArchivedTimesheetsTab = CreateLoadable(
  import('@client/screens/health/Timesheets/Timesheets/ArchivedTimesheetsTab')
);
export const DraftTimesheetsTab = CreateLoadable(
  import('@client/screens/health/Timesheets/Timesheets/DraftTimesheetsTab')
);
export const CreateTimesheets = CreateLoadable(
  import('@client/screens/health/Timesheets/CreateTimesheets')
);
export const ReviewTimesheet = CreateLoadable(
  import('@client/screens/health/Timesheets/ReviewTimesheet')
);
export const PreviewTimesheet = CreateLoadable(
  import('@client/screens/health/Timesheets/PreviewTimesheet')
);
export const TimesheetSettings = CreateLoadable(
  import('@client/screens/health/Timesheets/TimesheetSettings')
);

// Finance Screen
export const MainAccountTab = CreateLoadable(
  import('@client/screens/finance/Ledger/Ledger/MainAccount')
);
export const LedgerJournalsTab = CreateLoadable(
  import('@client/screens/finance/Ledger/Ledger/Journals')
);
export const LedgerPostingsTab = CreateLoadable(
  import('@client/screens/finance/Ledger/Ledger/LedgerPostings')
);
export const ProfitAndLoss = CreateLoadable(
  import('@client/screens/finance/Reporting/ProfitAndLoss')
);
export const BalanceSheet = CreateLoadable(
  import('@client/screens/finance/Reporting/BalanceSheet')
);
export const CreateMainAccount = CreateLoadable(
  import('@client/screens/finance/Ledger/CreateNewMainAccount')
);
export const CreateLedgerPosting = CreateLoadable(
  import('@client/screens/finance/Ledger/CreateNewLedgerPosting')
);
export const CreateLedgerJournal = CreateLoadable(
  import('@client/screens/finance/Ledger/CreateLedgerJournal')
);
export const CreateBankTransaction = CreateLoadable(
  import(
    '@client/screens/finance/Banking/BankTransactions/CreateBankTransaction'
  )
);
export const BankAccounts = CreateLoadable(
  import('@client/screens/finance/Banking/BankAccount/BankAccount')
);
export const BankTransactions = CreateLoadable(
  import('@client/screens/finance/Banking/BankTransactions/BankTransactions')
);
export const AssetList = CreateLoadable(
  import('@client/screens/finance/Assets/Assets/AssetList')
);
export const AssetGroups = CreateLoadable(
  import('@client/screens/finance/Assets/Assets/AssetGroups')
);
export const CreateAssetGroup = CreateLoadable(
  import('@client/screens/finance/Assets/CreateAssetGroup')
);
export const CreateAsset = CreateLoadable(
  import('@client/screens/finance/Assets/CreateAsset')
);
export const DataImportFile = CreateLoadable(
  import('@client/screens/finance/DataImport/FileUpload')
);

/* prettier-ignore-end */
