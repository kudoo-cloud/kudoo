import pathToRegexp from 'path-to-regexp';

// This function process any url/path given path regex and config options
// - pathRegex: is the regex by which we can construct actual url, format is similar to react-router route urls
// - config options: when we pass { path: true } in options it will return plain path regex otherwise it will return compiled path with actual parameter values
// For e.g. when we define react-router routes , we need path regex with parameter placement holder
// so at that time pass { path : true } with will directly return pathRegex
// Suppose in case we need actual url to redirect at that time pass parameters values with { path : false } & it will return actual url to redirect
const processURL = (pathRegex, { path = '', ...params } = {}) => {
  if (path) {
    return pathRegex;
  }
  const toPath = pathToRegexp.compile(pathRegex);
  return toPath(params, { encode: (value, token) => value });
};

const abstractURL = pathRegex => (options = {}) =>
  processURL(pathRegex, options);

export default {
  HOME: abstractURL('/'),

  // AUTH
  LOGIN: abstractURL('/login'),
  SIGNUP: abstractURL('/signup'),
  CONFIRM_EMAIL: abstractURL('/account-executive/confirm/:status?'),
  INVITE_EMAIL: abstractURL('/account-executive/invite/:status?'),
  RESET_PASSWORD: abstractURL('/remember-password'),
  NEW_PASSWORD: abstractURL('/account-executive/remember/:status?'),
  NEW_PASSWORD_SUCCESS: abstractURL('/new-password-success'),
  RESET_PASSWORD_EMAIL: abstractURL('/remember-password-email'),

  // Dashboard
  DASHBOARD: abstractURL('/dashboard'),
  CONFIGURATION: abstractURL('/config'),

  // Acccount Settings
  ACCOUNT_SETTINGS: abstractURL('/account-settings'),
  ACCOUNT_BASIC_DETAILS: abstractURL('/account-settings/basic-details'),
  ACCOUNT_USER_SECURITY: abstractURL('/account-settings/user-security'),
  ACCOUNT_USER_HISTORY: abstractURL('/account-settings/user-history'),

  // Company
  MANAGE_COMPANIES: abstractURL('/companies/manage'),
  CREATE_COMPANY: abstractURL('/companies/create'),
  COMPANY_SETTINGS: abstractURL('/company/settings/:companyId'),
  COMPANY_GENERAL: abstractURL('/company/settings/:companyId/general'),
  COMPANY_GENERAL_BASICS: abstractURL(
    '/company/settings/:companyId/general/basics'
  ),
  COMPANY_GENERAL_CONTACT_DETAILS: abstractURL(
    '/company/settings/:companyId/general/contact'
  ),
  COMPANY_GENERAL_LOCATION: abstractURL(
    '/company/settings/:companyId/general/location'
  ),
  COMPANY_USERS: abstractURL('/company/settings/:companyId/users'),
  COMPANY_USERS_LIST: abstractURL('/company/settings/:companyId/users/list'),
  COMPANY_USERS_ROLES: abstractURL('/company/settings/:companyId/users/roles'),
  INVITE_USER: abstractURL('/company/settings/:companyId/users/invite'),
  COMPANY_BANKING: abstractURL('/company/settings/:companyId/banking'),
  COMPANY_INTEGRATIONS: abstractURL(
    '/company/settings/:companyId/integrations'
  ),
  COMPANY_SUBSCRIPTION: abstractURL(
    '/company/settings/:companyId/subscription'
  ),

  // Projects
  PROJECTS: abstractURL('/projects'),
  PROJECT_CREATE: abstractURL('/project/create'),
  PROJECT_DETAILS: abstractURL('/project/:id/details'),
  PROJECT_SERVICES: abstractURL('/project/:id/details/services'),
  PROJECTS_ACTIVE: abstractURL('/projects/active'),
  PROJECTS_DRAFTS: abstractURL('/projects/drafts'),
  PROJECTS_ARCHIVED: abstractURL('/projects/archived'),

  // Invoices
  INVOICES: abstractURL('/invoices'),
  UNPAID_INVOICES: abstractURL('/invoices/unpaid'),
  PAID_INVOICES: abstractURL('/invoices/paid'),
  ARCHIVED_INVOICES: abstractURL('/invoices/archived'),
  CREATE_INVOICES: abstractURL('/invoices/create'),
  CREATE_TEXT_INVOICES: abstractURL('/invoices/create-text-invoice'),
  CREATE_PROJECT_TO_INVOICES: abstractURL(
    '/invoices/create-project-to-invoice'
  ),
  CREATE_TIMESHEETS_TO_INVOICES: abstractURL(
    '/invoices/create-timesheets-to-invoice'
  ),
  INVOICE_SENT: abstractURL(`/invoices/sent`),
  PREVIEW_INVOICE: abstractURL('/preview/invoice/:id'),

  // Services
  SERVICES: abstractURL('/services'),
  ACTIVE_SERVICES: abstractURL('/services/active'),
  ARCHIVED_SERVICES: abstractURL('/services/archived'),
  CREATE_SERVICES: abstractURL('/services/create'),
  EDIT_SERVICE: abstractURL('/services/:id/edit'),

  // Customers
  CUSTOMERS: abstractURL('/customers'),
  ACTIVE_CUSTOMERS: abstractURL('/customers/active'),
  ARCHIVED_CUSTOMERS: abstractURL('/customers/archived'),
  CREATE_CUSTOMER: abstractURL('/customers/create'),
  CUSTOMER_DETAILS: abstractURL('/customers/:id/details'),

  // Workers
  WORKERS: abstractURL('/workers'),
  ACTIVE_WORKERS: abstractURL('/workers/active'),
  ARCHIVED_WORKERS: abstractURL('/workers/archived'),
  CREATE_WORKERS: abstractURL('/workers/create'),
  WORKER_DETAILS: abstractURL('/workers/:id/details'),

  // Timesheets
  TIMESHEETS: abstractURL('/timesheets'),

  MY_TIMESHEETS: abstractURL('/timesheets/my-timesheets'),
  MY_ACTIVE_TIMESHEETS: abstractURL('/timesheets/my-timesheets/active'),
  MY_DRAFT_TIMESHEETS: abstractURL('/timesheets/my-timesheets/draft'),
  MY_ARCHIVED_TIMESHEETS: abstractURL('/timesheets/my-timesheets/archived'),

  WORKERS_TIMESHEETS: abstractURL('/timesheets/workers-timesheets'),
  WORKERS_ACTIVE_TIMESHEETS: abstractURL(
    '/timesheets/workers-timesheets/active'
  ),
  WORKERS_DRAFT_TIMESHEETS: abstractURL('/timesheets/workers-timesheets/draft'),
  WORKERS_ARCHIVED_TIMESHEETS: abstractURL(
    '/timesheets/workers-timesheets/archived'
  ),

  CREATE_TIMESHEETS: abstractURL('/timesheets/create'),
  EDIT_TIMESHEETS: abstractURL('/timesheets/:id/edit'),
  REVIEW_TIMESHEET: abstractURL('/timesheets/:id/review'),
  APPROVE_TIMESHEET: abstractURL('/timesheets/:id/approve'),
  TIMESHEET_SETTINGS: abstractURL('/timesheet-settings'),
  TIMESHEET_SETTINGS_LAYOUT: abstractURL('/timesheet-settings/layout'),
  TIMESHEET_SETTINGS_AUTOMATION: abstractURL('/timesheet-settings/automation'),
  PREVIEW_TIMESHEET: abstractURL('/preview/time_sheet/:id'),

  // Emails
  WELCOME_EMAIL_PREVIEW: abstractURL('/email/:type/welcome'),
  CONFIRM_EMAIL_PREVIEW: abstractURL('/email/:type/confirm'),
  REMEMBER_EMAIL_PREVIEW: abstractURL('/email/:type/remember'),
  INVITE_EMAIL_PREVIEW: abstractURL('/email/:type/invite'),
  TIMESHEET_NOTIFY_EMAIL_PREVIEW: abstractURL('/email/:type/time_sheet_notify'),
  TIMESHEET_APPROVE_EMAIL_PREVIEW: abstractURL(
    '/email/:type/time_sheet_approve'
  ),
  INVOICE_NOTIFY_EMAIL_PREVIEW: abstractURL('/email/:type/invoice_notify'),

  INTEGRATION_LOGIN: abstractURL('/integrations'),
  INTEGRATION_CHOOSE_COMPANY: abstractURL('/integrations/:type/choose'),

  //Warehouse
  WAREHOUSE: abstractURL('/warehouse'),
  CREATE_WAREHOUSE: abstractURL('/warehouse/create'),
  EDIT_WAREHOUSE: abstractURL('/warehouse/:id/edit'),

  //======================Finance=====================//

  //DataImport
  DATAIMPORT: abstractURL('/dataImport'),

  //Ledger
  LEDGER: abstractURL('/ledger'),
  LEDGER_POSTINGS: abstractURL('/ledger/ledgerPostings'),
  LEDGER_MAIN_ACCOUNTS: abstractURL('/ledger/mainAccounts'),
  LEDGER_JOURNALS: abstractURL('/ledger/journals'),
  CREATE_LEDGER_JOURNAL: abstractURL('/ledger/journals/create'),
  CREATE_LEDGER_POSTING: abstractURL('/ledger/ledgerPostings/create'),
  CREATE_MAIN_ACCOUNT: abstractURL('/ledger/mainAccounts/create'),
  EDIT_MAIN_ACCOUNT: abstractURL('/ledger/mainAccounts/:id/edit'),
  EDIT_LEDGER_POSTING: abstractURL('/ledger/ledgerPostings/:id/edit'),
  EDIT_LEDGER_JOURNAL: abstractURL('/ledger/journals/:id/edit'),

  //Banking
  BANKING: abstractURL('/banking'),
  BANKING_BANK_ACCOUNT: abstractURL('/banking/bankAccount'),
  BANKING_BANK_TRANSACTIONS: abstractURL('/banking/bankTransactions'),
  CREATE_BANK_TRANSACTIONS: abstractURL('/banking/bankTransactions/create'),
  EDIT_BANK_TRANSACTIONS: abstractURL('/banking/bankTransactions/:id/edit'),

  //Assets
  ASSETS: abstractURL('/assets'),
  ASSET_GROUPS: abstractURL('/assets/asset-groups'),
  CREATE_ASSET: abstractURL('/assets/create'),
  CREATE_ASSET_GROUP: abstractURL('/asset-groups/create'),
  EDIT_ASSET: abstractURL('/assets/:id/edit'),
  EDIT_ASSET_GROUP: abstractURL('/asset-groups/:id/edit'),

  //Reporting
  REPORTING: abstractURL('/reporting'),
  REPORTING_PROFIT_AND_LOSS: abstractURL('/reporting/profitAndLoss'),
  REPORTING_BALANCE_SHEET: abstractURL('/reporting/balanceSheet'),

  //======================Health=====================//

  //Patients
  PATIENTS: abstractURL('/patients'),
  ACTIVE_PATIENTS: abstractURL('/patients/active'),
  ARCHIVED_PATIENTS: abstractURL('/patients/archived'),
  CREATE_PATIENT: abstractURL('/patients/create'),
  PATIENT_DETAILS: abstractURL('/patients/:id/details'),

  //HealthcareProviders
  HEALTH_CARE_PROVIDERS: abstractURL('/healthcareProviders'),
  ACTIVE_HEALTH_CARE_PROVIDERS: abstractURL('/healthcareProviders/active'),
  ARCHIVED_HEALTH_CARE_PROVIDERS: abstractURL('/healthcareProviders/archived'),
  CREATE_HEALTH_CARE_PROVIDER: abstractURL('/healthcareProviders/create'),
  EDIT_HEALTH_CARE_PROVIDER: abstractURL('/healthcareProviders/:id/edit'),

  //======================Inventory=====================//

  //Suppliers
  SUPPLIERS: abstractURL('/suppliers'),
  CREATE_SUPPLIERS: abstractURL('/suppliers/create'),
  EDIT_SUPPLIERS: abstractURL('/suppliers/:id/edit'),

  //Inventory
  INVENTORY: abstractURL('/inventory'),
  CREATE_INVENTORY: abstractURL('/inventory/create'),
  EDIT_INVENTORY: abstractURL('/inventory/:id/edit'),

  //Sales
  SALES: abstractURL('/sales'),

  //SalesOrder
  SALES_ORDER: abstractURL('/sales/salesOrder'),
  CREATE_SALES_ORDER: abstractURL('/sales/salesOrder/create'),
  EDIT_SALES_ORDER: abstractURL('/sales/salesOrder/:id/edit'),

  //PurchaseOrder
  PURCHASE_ORDER: abstractURL('/po'),
  PREVIEW_PURCHASE_ORDER: abstractURL('/previewPurchaseOrder/:id'),

  //Non PBS Purchase Order
  NON_PBS_PURCHASE_ORDER: abstractURL('/po/purchaseOrder'),
  CREATE_NON_PBS_PURCHASE_ORDER: abstractURL('/po/purchaseOrder/create'),
  EDIT_NON_PBS_PURCHASE_ORDER: abstractURL('/po/purchaseOrder/:id/edit'),

  //PBS Purchase Order
  PBS_PURCHASE_ORDER: abstractURL('/po/pbsPurchaseOrder'),
  CREATE_PBS_PURCHASE_ORDER: abstractURL('/po/pbsPurchaseOrder/create'),
  EDIT_PBS_PURCHASE_ORDER: abstractURL('/po/pbsPurchaseOrder/:id/edit'),

  //PBS
  PBS: abstractURL('/pbs'),

  //Manufacturers
  MANUFACTURERS: abstractURL('/pbs/manufacturers'),
  CREATE_MANUFACTURER: abstractURL('/pbs/manufacturers/create'),
  EDIT_MANUFACTURER: abstractURL('/pbs/manufacturers/:id/edit'),

  //Drugs
  DRUGS: abstractURL('/pbs/drugs'),
  CREATE_DRUGS: abstractURL('/pbs/drugs/create'),
  EDIT_DRUGS: abstractURL('/pbs/drugs/:id/edit'),

  /**
   * Portal Urls
   */
  COMPLIANCE: abstractURL('/compliance'),
  MARKETPLACE: abstractURL('/marketplace'),
  HOSTED_SERVICE: abstractURL('/hosted-service'),

  APPLICATIONS: abstractURL('/applications'),
  APPLICATIONS_FEDERATED_SCHEMA: abstractURL('/applications/federated-schema'),
  APPLICATIONS_REACT_SCREENS: abstractURL('/applications/react-screens'),
  APPLICATIONS_PROJECT_CONFIG: abstractURL('/applications/project-config'),
  APPLICATIONS_LICENSE_PLAN: abstractURL('/applications/license-plan'),

  PARTNER_SETTINGS: abstractURL('/partner-settings'),

  BILLING: abstractURL('/billing'),
  BILLING_PAYMENT_TERMS: abstractURL('/billing/payment-terms'),
};
