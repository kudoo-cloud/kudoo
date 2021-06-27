import URL from 'src/helpers/urls';
import { IRoute } from 'src/store/types/security';
import * as Components from '../LoadableComponents';
import * as Tabs from './tab';

const paramsOptions = { path: true };

export default [
  {
    name: 'Projects',
    path: URL.PROJECTS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.projectTabs,
  },
  {
    name: 'Create Project',
    path: URL.PROJECT_CREATE(paramsOptions),
    component: Components.CreateNewProject,
  },
  {
    name: 'Project Details',
    path: URL.PROJECT_DETAILS(paramsOptions),
    component: Components.ProjectDetails,
  },
  {
    name: 'Create Invoice',
    path: URL.CREATE_INVOICES(paramsOptions),
    component: Components.CreateInvoice,
  },
  {
    name: 'Create Text Invoice',
    path: URL.CREATE_TEXT_INVOICES(paramsOptions),
    component: Components.CreateFreeTextInvoice,
  },
  {
    name: 'Create Project to Invoice',
    path: URL.CREATE_PROJECT_TO_INVOICES(paramsOptions),
    component: Components.CreateProjectToInvoice,
  },
  {
    name: 'Create Timesheet to Invoice',
    path: URL.CREATE_TIMESHEETS_TO_INVOICES(paramsOptions),
    component: Components.CreateTimesheetsToInvoice,
  },
  {
    name: 'Invoice Sent',
    path: URL.INVOICE_SENT(paramsOptions),
    component: Components.InvoiceSent,
  },
  {
    name: 'Invoices',
    path: URL.INVOICES(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.invoiceTabs,
  },
  {
    name: 'Create Timesheet',
    path: URL.CREATE_TIMESHEETS(paramsOptions),
    component: Components.CreateTimesheets,
  },
  {
    name: 'Edit Timesheet',
    path: URL.EDIT_TIMESHEETS(paramsOptions),
    component: Components.CreateTimesheets,
  },
  {
    name: 'Review Timesheet',
    path: URL.REVIEW_TIMESHEET(paramsOptions),
    component: Components.ReviewTimesheet,
  },
  {
    name: 'Timesheet Settings',
    path: URL.TIMESHEET_SETTINGS(paramsOptions),
    component: Components.TimesheetSettings,
  },
  {
    name: 'Timesheets',
    path: URL.TIMESHEETS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.timesheetTabs,
  },
  {
    name: 'Create Customer',
    path: URL.CREATE_CUSTOMER(paramsOptions),
    component: Components.CreateNewCustomer,
  },
  {
    name: 'Customer Details',
    path: URL.CUSTOMER_DETAILS(paramsOptions),
    component: Components.CustomerDetails,
  },
  {
    name: 'Customers',
    path: URL.CUSTOMERS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.customerTabs,
  },
  {
    name: 'Create Patient',
    path: URL.CREATE_PATIENT(paramsOptions),
    component: Components.CreateNewPatient,
  },
  {
    name: 'Patients',
    path: URL.PATIENTS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.patientTabs,
  },
  {
    name: 'Create HealthCare Provider',
    path: URL.CREATE_HEALTH_CARE_PROVIDER(paramsOptions),
    component: Components.CreateNewHealthcareProvider,
  },
  {
    name: 'Healthcare Provider',
    path: URL.HEALTH_CARE_PROVIDERS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.healthcareProviderTabs,
  },
  {
    name: 'Create Service',
    path: URL.CREATE_SERVICES(paramsOptions),
    component: Components.CreateNewService,
  },
  {
    name: 'Edit Service',
    path: URL.EDIT_SERVICE(paramsOptions),
    component: Components.CreateNewService,
  },
  {
    name: 'Services',
    path: URL.SERVICES(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.serviceTabs,
  },
] as IRoute[];
