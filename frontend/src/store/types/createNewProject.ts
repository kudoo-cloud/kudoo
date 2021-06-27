import createTypes from 'redux-create-action-types';

export interface ICreateProjectActionsTypes {
  CREATE_PROJECT__UPDATE_PROJECT_NAME: string;
  CREATE_PROJECT__UPDATE_CUSTOMER_INFO: string;
  CREATE_PROJECT__ADD_SERVICE: string;
  CREATE_PROJECT__REMOVE_SERVICE: string;
  CREATE_PROJECT__ADD_PAYMENT_RULE: string;
  CREATE_PROJECT__REMOVE_PAYMENT_RULE: string;
  CREATE_PROJECT__RESET_DATA: string;
}

const types: ICreateProjectActionsTypes = createTypes(
  'CREATE_PROJECT__UPDATE_PROJECT_NAME',
  'CREATE_PROJECT__UPDATE_CUSTOMER_INFO',
  'CREATE_PROJECT__ADD_SERVICE',
  'CREATE_PROJECT__REMOVE_SERVICE',
  'CREATE_PROJECT__ADD_PAYMENT_RULE',
  'CREATE_PROJECT__REMOVE_PAYMENT_RULE',
  'CREATE_PROJECT__RESET_DATA',
);

export interface INewProjectState {
  name: string;
  customer: {
    companyName: string;
    contactName: string;
    contactSurname: string;
    govNumber?: number;
    email: string;
    isAlreadySaved?: boolean;
    id?: string;
    traderId?: string;
  };
  service: Array<{
    id: string;
    name: string;
    billingType: 'fixed' | 'timeBased';
    paymentTotal: number;
    chargeGST: boolean;
    perUnit?: string;
    isTemplate: boolean;
    isAlreadySaved: boolean;
    paymentRule?: {
      projectBegins?: {
        fixedOrPercent: string;
        amount: number;
        percentage: number;
        // sendInvoiceToCustomer: boolean;
      };
      projectEnds?: {
        fixedOrPercent: string;
        amount: number;
        percentage: number;
        // sendInvoiceToCustomer: boolean;
      };
    };
  }>;
}

export default types;
