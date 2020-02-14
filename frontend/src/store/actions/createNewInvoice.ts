import { createAction } from 'redux-actions';
import Types, {
  ICustomer as Customer,
  IProject as Project,
  IPayment as Payment,
  InvoiceType,
} from '../types/createNewInvoice';

export const updateCustomerInfo = createAction(
  Types['CREATE_INVOICE.UPDATE_CUSTOMER_INFO'],
  (type: InvoiceType, data: Customer) => ({ type, data })
);

export const updateProjectInfo = createAction(
  Types['CREATE_INVOICE.UPDATE_PROJECT_INFO'],
  (type: InvoiceType, data: Project) => ({ type, data })
);

export const updateTableData = createAction(
  Types['CREATE_INVOICE.UPDATE_TABLE_DATA'],
  (type: InvoiceType, data: any) => ({ type, data })
);

export const updateShowTimesheetDetailsSelection = createAction(
  Types['CREATE_INVOICE.UPDATE_TIMESHEET_DETAILS_SELECTION'],
  (type: InvoiceType, data: any) => ({ type, data })
);

export const updatePaymentInfo = createAction(
  Types['CREATE_INVOICE.UPDATE_PAYMENT_INFO'],
  (type: InvoiceType, data: Payment) => ({ type, data })
);

export const resetInvoiceData = createAction(
  Types['CREATE_INVOICE.RESET_INVOICE_DATA'],
  (type: InvoiceType) => ({ type })
);
