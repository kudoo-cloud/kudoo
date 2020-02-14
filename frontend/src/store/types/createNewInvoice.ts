import createTypes from 'redux-create-action-types';

export type InvoiceType = 'text' | 'project' | 'timesheet';

export interface ICustomer {
  name: string;
  contactName: string;
  contactSurname: string;
  email: string;
  govNumber: string;
  isAlreadySaved: boolean;
  traderId: string;
  id: string;
}

export interface IProject {
  name: string;
  customerId: any;
  companyId: any;
  isAlreadySaved?: boolean;
  id?: string;
}

export interface IPayment {
  options: string[];
  invoiceDate: string | Date;
  dueDate: string;
  numberOfDays: string | number;
  message: string;
  attachments?: any;
}

export interface ICreateInvoiceActionsTypes {
  'CREATE_INVOICE.UPDATE_CUSTOMER_INFO': string;
  'CREATE_INVOICE.UPDATE_PROJECT_INFO': string;
  'CREATE_INVOICE.UPDATE_TABLE_DATA': string;
  'CREATE_INVOICE.UPDATE_PAYMENT_INFO': string;
  'CREATE_INVOICE.RESET_INVOICE_DATA': string;
  'CREATE_INVOICE.UPDATE_TIMESHEET_DETAILS_SELECTION': string;
}

const types: ICreateInvoiceActionsTypes = createTypes(
  'CREATE_INVOICE.UPDATE_CUSTOMER_INFO',
  'CREATE_INVOICE.UPDATE_PROJECT_INFO',
  'CREATE_INVOICE.UPDATE_TABLE_DATA',
  'CREATE_INVOICE.UPDATE_PAYMENT_INFO',
  'CREATE_INVOICE.RESET_INVOICE_DATA',
  'CREATE_INVOICE.UPDATE_TIMESHEET_DETAILS_SELECTION'
);

export interface INewInvoiceState {
  text: {
    customer: ICustomer;
    tableData:
      | Array<{
          id: string;
          service: string;
          quantity: string | number;
          rate: number;
          amount: number;
          gst: number;
          rate_str: string;
          amount_str: string;
          gst_str: string;
          includeConsTax: boolean;
        }>
      | any[];
    payment: IPayment;
  };
  project: {
    project: IProject;
    customer: ICustomer;
    tableData:
      | Array<{
          id: string;
          serviceId: string;
          service: string;
          billingType: string;
          amount: number;
          gst: number;
          amount_str: string;
          gst_str: string;
          includeConsTax: boolean;
        }>
      | any[];
    payment: IPayment;
  };
  timesheet: {
    customer: ICustomer;
    project: IProject;
    showTimesheetDetails: boolean;
    tableData:
      | Array<{
          id: string;
          timeSheetId: string;
          entriesId: string[];
          serviceId: string;
          service: string;
          time_period: string;
          entry_date: string;
          quantity: string | number;
          rate: number;
          amount: number;
          gst: number;
          rate_str: string;
          amount_str: string;
          gst_str: string;
          includeConsTax: boolean;
          select: boolean;
        }>
      | any[];
    payment: IPayment;
  };
}

const initialCustomer = {
  name: '',
  contactName: '',
  contactSurname: '',
  govNumber: '',
  email: '',
  traderId: '',
  isAlreadySaved: false,
  id: '',
};

const initialProject = {
  name: '',
  customerId: '',
  companyId: '',
  isAlreadySaved: false,
  id: '',
};

const initialPayment = {
  options: [],
  invoiceDate: new Date(),
  dueDate: '',
  numberOfDays: '',
  message: '',
};

export const initialInvoice = {
  text: {
    customer: initialCustomer,
    payment: initialPayment,
    tableData: [],
  },
  project: {
    customer: initialCustomer,
    project: initialProject,
    payment: initialPayment,
    tableData: [],
  },
  timesheet: {
    customer: initialCustomer,
    project: initialProject,
    showTimesheetDetails: false,
    tableData: [],
    payment: initialPayment,
  },
};

export default types;
