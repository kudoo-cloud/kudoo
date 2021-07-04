import URL from 'src/helpers/urls';
import { ITab, LicensePlan, SecurityRole } from 'src/store/types/security';
import {
  ActiveCustomersTab,
  ActiveProjectsTab,
  ActiveServiceTab,
  ActiveTimesheetsTab,
  ArchivedCustomersTab,
  ArchivedInvoicesTab,
  ArchivedProjectsTab,
  ArchivedServiceTab,
  ArchivedTimesheetsTab,
  AssetGroups,
  AssetList,
  BalanceSheet,
  BankAccounts,
  BankTransactions,
  DraftProjectsTab,
  DraftTimesheetsTab,
  HealthcareProvidersList,
  Inventory,
  LedgerJournalsTab,
  LedgerPostingsTab,
  MainAccountTab,
  NonPbsPOList,
  PBSDrugs,
  PBSManufacturers,
  PaidInvoicesTab,
  PatientsList,
  ProfitAndLoss,
  SalesOrderTab,
  SecondaryTabs,
  Suppliers,
  UnpaidInvoicesTab,
  Warehouse,
} from '../LoadableComponents';

/**
 * Inventory Tabs
 */

export const purchaseOrderTabs: Array<ITab> = [
  {
    name: 'Purchase Orders',
    reactComponent: NonPbsPOList,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.NON_PBS_PURCHASE_ORDER,
  },
  /*
  {
    name: 'PBS Purchase Orders',
    reactComponent: PbsPOList,
    availability: [
      {
        security: [SecurityRole.admin, SecurityRole.owner],
        country: ['AU'],
        businessType: ['HEALTH'],
      },
    ],
    licenseRequired: [LicensePlan.ENTERPRISE],
    url: URL.PBS_PURCHASE_ORDER,
  },
  */
];

export const pbsTabs: Array<ITab> = [
  {
    name: 'Drugs',
    reactComponent: PBSDrugs,
    url: URL.DRUGS,
    availability: [
      {
        security: [SecurityRole.admin, SecurityRole.owner],
        country: ['AU'],
        businessType: ['HEALTH'],
      },
    ],
    licenseRequired: [LicensePlan.ENTERPRISE],
  },
  {
    name: 'Manufacturers',
    reactComponent: PBSManufacturers,
    url: URL.MANUFACTURERS,
    availability: [
      {
        security: [SecurityRole.admin, SecurityRole.owner],
        country: ['AU'],
        businessType: ['HEALTH'],
      },
    ],
    licenseRequired: [LicensePlan.ENTERPRISE],
  },
];

export const supplierTabs: Array<ITab> = [
  {
    name: 'All Suppliers',
    reactComponent: Suppliers,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.SUPPLIERS,
  },
];

export const inventoryTabs: Array<ITab> = [
  {
    name: 'All Inventory',
    reactComponent: Inventory,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.INVENTORY,
  },
];

export const warehouseTabs: Array<ITab> = [
  {
    name: 'All Warehouses',
    reactComponent: Warehouse,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.WAREHOUSE,
  },
];

export const salesTabs: Array<ITab> = [
  {
    name: 'Sales Order',
    reactComponent: SalesOrderTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.SALES_ORDER,
  },
];

/**
 * Finance Tabs
 */

export const ledgerTabs: Array<ITab> = [
  {
    name: 'Main Accounts',
    reactComponent: MainAccountTab,
    url: URL.LEDGER_MAIN_ACCOUNTS,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
  },
  {
    name: 'Ledger Postings',
    reactComponent: LedgerPostingsTab,
    url: URL.LEDGER_POSTINGS,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
  },
  {
    name: 'Ledger Journals',
    reactComponent: LedgerJournalsTab,
    url: URL.LEDGER_JOURNALS,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
  },
];

export const bankTabs: Array<ITab> = [
  {
    name: 'Bank Account',
    reactComponent: BankAccounts,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.BANKING_BANK_ACCOUNT,
  },
  {
    name: 'Bank Transactions',
    reactComponent: BankTransactions,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.BANKING_BANK_TRANSACTIONS,
  },
];

export const assetTabs: Array<ITab> = [
  {
    name: 'Asset Groups',
    reactComponent: AssetGroups,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.ASSET_GROUPS,
  },
  {
    name: 'Assets',
    reactComponent: AssetList,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.ASSETS,
  },
];

export const reportingTabs: Array<ITab> = [
  {
    name: 'Profit & Loss',
    reactComponent: ProfitAndLoss,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.REPORTING_PROFIT_AND_LOSS,
  },
  {
    name: 'Balance Sheet',
    reactComponent: BalanceSheet,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [LicensePlan.PRO, LicensePlan.ENTERPRISE],
    url: URL.REPORTING_BALANCE_SHEET,
  },
];

/**
 * Health Tabs
 */

export const projectTabs: Array<ITab> = [
  {
    name: 'Active Projects',
    reactComponent: ActiveProjectsTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.PROJECTS_ACTIVE,
  },
  {
    name: 'Archived Projects',
    reactComponent: ArchivedProjectsTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.PROJECTS_ARCHIVED,
  },
  {
    name: 'Draft Projects',
    reactComponent: DraftProjectsTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.PROJECTS_DRAFTS,
  },
];

export const invoiceTabs: Array<ITab> = [
  {
    name: 'Unpaid',
    reactComponent: UnpaidInvoicesTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.UNPAID_INVOICES,
  },
  {
    name: 'Paid',
    reactComponent: PaidInvoicesTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.PAID_INVOICES,
  },
  {
    name: 'Archived',
    reactComponent: ArchivedInvoicesTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ARCHIVED_INVOICES,
  },
];

export const customerTabs: Array<ITab> = [
  {
    name: 'All Customers',
    reactComponent: ActiveCustomersTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ACTIVE_CUSTOMERS,
  },
  {
    name: 'Archived Customers',
    reactComponent: ArchivedCustomersTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ARCHIVED_CUSTOMERS,
  },
];

export const patientTabs: Array<ITab> = [
  {
    name: 'All Patients',
    reactComponent: PatientsList,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ACTIVE_PATIENTS,
  },
  {
    name: 'Archived Patients',
    reactComponent: PatientsList,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ARCHIVED_PATIENTS,
  },
];

export const healthcareProviderTabs: Array<ITab> = [
  {
    name: 'Active',
    reactComponent: HealthcareProvidersList,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ACTIVE_HEALTH_CARE_PROVIDERS,
  },
  {
    name: 'Archived',
    reactComponent: HealthcareProvidersList,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ARCHIVED_HEALTH_CARE_PROVIDERS,
  },
];

export const serviceTabs: Array<ITab> = [
  {
    name: 'Active',
    reactComponent: ActiveServiceTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ACTIVE_SERVICES,
  },
  {
    name: 'Archived',
    reactComponent: ArchivedServiceTab,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.ARCHIVED_SERVICES,
  },
];

export const myTimesheetSubTabs: Array<ITab> = [
  {
    name: 'Active',
    reactComponent: ActiveTimesheetsTab,
    url: URL.MY_ACTIVE_TIMESHEETS,
    // component props
    onlyMyTimesheet: true,
  },
  {
    name: 'Draft',
    reactComponent: DraftTimesheetsTab,
    url: URL.MY_DRAFT_TIMESHEETS,
    // component props
    onlyMyTimesheet: true,
  },
  {
    name: 'Archived',
    reactComponent: ArchivedTimesheetsTab,
    url: URL.MY_ARCHIVED_TIMESHEETS,
    // component props
    onlyMyTimesheet: true,
  },
];

export const workerTimesheetSubTabs: Array<ITab> = [
  {
    name: 'Active',
    reactComponent: ActiveTimesheetsTab,
    url: URL.WORKERS_ACTIVE_TIMESHEETS,
  },
  {
    name: 'Draft',
    reactComponent: DraftTimesheetsTab,
    url: URL.WORKERS_DRAFT_TIMESHEETS,
  },
  {
    name: 'Archived',
    reactComponent: ArchivedTimesheetsTab,
    url: URL.WORKERS_ARCHIVED_TIMESHEETS,
  },
];

export const timesheetTabs: Array<ITab> = [
  {
    name: 'My Timesheets',
    reactComponent: SecondaryTabs,
    isTertiaryTab: true,
    tabs: myTimesheetSubTabs,
    availability: [
      { security: [SecurityRole.admin, SecurityRole.owner, SecurityRole.user] },
    ],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.MY_TIMESHEETS,
  },
  {
    name: 'Supplier Timesheets',
    reactComponent: SecondaryTabs,
    isTertiaryTab: true,
    tabs: workerTimesheetSubTabs,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
    url: URL.WORKERS_TIMESHEETS,
  },
];
