import { createAction } from 'redux-actions';
import { v4 as uuidv4 } from 'uuid';
import Types from '../types/createNewProject';

const updateProjectName = createAction(
  Types.CREATE_PROJECT__UPDATE_PROJECT_NAME,
  (name: string) => ({ name }),
);

interface IUpdateCustomerInfoParams {
  companyName: string;
  contactName: string;
  contactSurname: string;
  govNumber: string;
  email: string;
  id: string;
  isAlreadySaved: boolean;
  traderId: string;
}

const updateCustomerInfo = createAction(
  Types.CREATE_PROJECT__UPDATE_CUSTOMER_INFO,
  (params: IUpdateCustomerInfoParams) => params,
);

interface IAddServiceParams {
  name: string;
  billingType: string;
  paymentTotal: string | number;
  chargeGST: boolean;
  perUnit: string | number;
  isTemplate: string;
  isAlreadySaved: boolean;
  alreadySavedId: string;
}

const addService = createAction(
  Types.CREATE_PROJECT__ADD_SERVICE,
  (params: IAddServiceParams) => ({
    id: params.alreadySavedId || uuidv4(),
    ...params,
  }),
);

const removeService = createAction(
  Types.CREATE_PROJECT__REMOVE_SERVICE,
  (id: string) => ({ id }),
);

interface IAddPaymentRulesParams {
  serviceId: string;
  period: string;
  type: string;
  amount: string | number;
  // sendInvoiceToCustomer: boolean;
}

const addPaymentRule = createAction(
  Types.CREATE_PROJECT__ADD_PAYMENT_RULE,
  ({
    serviceId,
    period,
    type,
    amount,
  }: // sendInvoiceToCustomer,
  IAddPaymentRulesParams) => ({
    serviceId,
    period,
    type,
    amount: Number(amount),
    // sendInvoiceToCustomer,
  }),
);

const resetNewProjectData = createAction(Types.CREATE_PROJECT__RESET_DATA);

export default {
  updateProjectName,
  updateCustomerInfo,
  addService,
  removeService,
  addPaymentRule,
  resetNewProjectData,
};
