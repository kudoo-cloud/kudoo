import idx from 'idx';
import assign from 'lodash/assign';
import findIndex from 'lodash/findIndex';
import merge from 'lodash/merge';
import remove from 'lodash/remove';
import { handleActions } from 'redux-actions';
import InvoiceTypes, {
  INewInvoiceState,
  initialInvoice,
} from '../types/createNewInvoice';
import PatientTypes, { INewPatientState } from '../types/createNewPatient';
import ProjectTypes, { INewProjectState } from '../types/createNewProject';
import ProfileTypes from '../types/profile';

interface IState {
  newPatient: INewPatientState;
  newProject: INewProjectState;
  newInvoice: INewInvoiceState;
}

const initialState = {
  newPatient: {
    patientCreationOption: '',
  },
  newProject: {
    name: '',
    customer: {
      daoName: '',
      contactName: '',
      contactSurname: '',
      govNumber: null,
      email: '',
    },
    service: [],
  },
  newInvoice: initialInvoice,
} as IState;

function calculatePercentageFromAmount(total, partial) {
  return parseFloat(((partial / total) * 100).toFixed(2));
}

function calculateAmountFromPercentage(total, percentage) {
  return parseFloat(((total * percentage) / 100).toFixed(2));
}

export default handleActions(
  {
    [PatientTypes.CP_PATIENT_RESET_DATA]: (state: IState) => ({
      ...state,
      newPatient: initialState.newPatient,
    }),

    [PatientTypes.CP_UPDATE_PATIENT_CREATION_OPTION]: (
      state: IState,
      action: IReduxAction,
    ) => {
      return assign(
        {},
        merge(state, {
          newPatient: {
            patientCreationOption: action.payload,
          },
        }),
      );
    },

    [PatientTypes.CP_MANUAL_STEP1]: (state: IState, action: IReduxAction) => {
      return assign(
        {},
        merge(state, {
          newPatient: {
            manualPatient: action.payload,
          },
        }),
      );
    },

    [PatientTypes.CP_RESET_MANUAL_DATA]: (state: IState) => {
      return {
        ...state,
        newPatient: {
          ...state.newPatient,
          manualPatient: {},
        },
      };
    },

    [ProjectTypes.CREATE_PROJECT__RESET_DATA]: () => ({
      ...initialState,
    }),

    [ProjectTypes.CREATE_PROJECT__UPDATE_PROJECT_NAME]: (
      state: IState,
      action: IReduxAction,
    ) => ({
      ...state,
      newProject: {
        ...state.newProject,
        name: action.payload.name,
      },
    }),

    [ProjectTypes.CREATE_PROJECT__UPDATE_CUSTOMER_INFO]: (
      state: IState,
      action: IReduxAction,
    ) => ({
      ...state,
      newProject: {
        ...state.newProject,
        customer: {
          id: idx(action, (_) => _.payload.id),
          traderId: idx(action, (_) => _.payload.traderId),
          isAlreadySaved: idx(action, (_) => _.payload.isAlreadySaved),
          daoName: idx(action, (_) => _.payload.daoName),
          contactName: idx(action, (_) => _.payload.contactName),
          contactSurname: idx(action, (_) => _.payload.contactSurname),
          govNumber: idx(action, (_) => _.payload.govNumber),
          email: idx(action, (_) => _.payload.email),
        },
      },
    }),

    [ProjectTypes.CREATE_PROJECT__ADD_SERVICE]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const {
        id,
        name,
        billingType,
        paymentTotal,
        chargeGST,
        perUnit,
        isTemplate,
        isAlreadySaved,
      } = action.payload;
      return {
        ...state,
        newProject: {
          ...state.newProject,
          service: [
            ...(idx(state, (x) => x.newProject.service) || []),
            {
              id,
              name,
              billingType,
              paymentTotal,
              chargeGST,
              perUnit,
              isTemplate,
              isAlreadySaved,
            },
          ],
        },
      };
    },

    [ProjectTypes.CREATE_PROJECT__REMOVE_SERVICE]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const { id } = action.payload;
      const services = idx(state, (x) => x.newProject.service) || [];
      remove(services, { id });
      return {
        ...state,
        newProject: {
          ...state.newProject,
          service: services,
        },
      };
    },

    [ProjectTypes.CREATE_PROJECT__ADD_PAYMENT_RULE]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const {
        serviceId,
        type,
        amount,
        period,
        // sendInvoiceToCustomer,
      } = action.payload;

      const services = idx(state, (x) => x.newProject.service) || [];
      const pos = findIndex(services, { id: serviceId });
      const service = services[pos];
      const paymentRule: any = {};

      if (period === 'projectBegins') {
        if (type === 'fixed') {
          paymentRule.projectBegins = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount,
            percentage: calculatePercentageFromAmount(
              service.paymentTotal,
              amount,
            ),
          };

          paymentRule.projectEnds = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount: service.paymentTotal - amount,
            percentage: calculatePercentageFromAmount(
              service.paymentTotal,
              service.paymentTotal - amount,
            ),
          };
        } else if (type === 'percentage') {
          paymentRule.projectBegins = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount: calculateAmountFromPercentage(service.paymentTotal, amount),
            percentage: amount,
          };

          paymentRule.projectEnds = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount: calculateAmountFromPercentage(
              service.paymentTotal,
              100 - parseFloat(amount),
            ),
            percentage: 100 - parseFloat(amount),
          };
        }
      } else if (period === 'projectEnds') {
        if (type === 'fixed') {
          paymentRule.projectEnds = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount,
            percentage: calculatePercentageFromAmount(
              service.paymentTotal,
              amount,
            ),
          };

          paymentRule.projectBegins = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount: service.paymentTotal - amount,
            percentage: calculatePercentageFromAmount(
              service.paymentTotal,
              service.paymentTotal - amount,
            ),
          };
        } else if (type === 'percentage') {
          paymentRule.projectEnds = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount: calculateAmountFromPercentage(service.paymentTotal, amount),
            percentage: amount,
          };

          paymentRule.projectBegins = {
            fixedOrPercent: type,
            // sendInvoiceToCustomer,
            amount: calculateAmountFromPercentage(
              service.paymentTotal,
              100 - parseFloat(amount),
            ),
            percentage: 100 - parseFloat(amount),
          };
        }
      }

      service.paymentRule = paymentRule;
      services[pos] = service;
      return {
        ...state,
        newProject: {
          ...state.newProject,
          service: services,
        },
      };
    },

    [InvoiceTypes['CREATE_INVOICE.UPDATE_CUSTOMER_INFO']]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const invoiceType: any = idx(action, (_) => _.payload.type);
      const data = idx(action, (_) => _.payload.data) || {};
      const invoiceTypeState =
        idx(state, (x) => x.newInvoice[invoiceType]) || {};
      return {
        ...state,
        newInvoice: {
          ...state.newInvoice,
          [invoiceType]: {
            ...invoiceTypeState,
            customer: {
              ...data,
            },
          },
        },
      };
    },
    [InvoiceTypes['CREATE_INVOICE.UPDATE_PROJECT_INFO']]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const invoiceType: any = idx(action, (_) => _.payload.type);
      const data = idx(action, (_) => _.payload.data) || {};
      const invoiceTypeState =
        idx(state, (x) => x.newInvoice[invoiceType]) || {};
      return {
        ...state,
        newInvoice: {
          ...state.newInvoice,
          [invoiceType]: {
            ...invoiceTypeState,
            project: {
              ...data,
            },
          },
        },
      };
    },
    [InvoiceTypes['CREATE_INVOICE.UPDATE_TABLE_DATA']]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const invoiceType: any = idx(action, (_) => _.payload.type);
      const data = idx(action, (_) => _.payload.data) || {};
      const invoiceTypeState =
        idx(state, (x) => x.newInvoice[invoiceType]) || {};
      return {
        ...state,
        newInvoice: {
          ...state.newInvoice,
          [invoiceType]: {
            ...invoiceTypeState,
            tableData: data,
          },
        },
      };
    },
    [InvoiceTypes['CREATE_INVOICE.UPDATE_PAYMENT_INFO']]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const invoiceType: any = idx(action, (_) => _.payload.type);
      const data = idx(action, (_) => _.payload.data) || {};
      const invoiceTypeState =
        idx(state, (x) => x.newInvoice[invoiceType]) || {};
      return {
        ...state,
        newInvoice: {
          ...state.newInvoice,
          [invoiceType]: {
            ...invoiceTypeState,
            payment: {
              ...invoiceTypeState.payment,
              ...data,
            },
          },
        },
      };
    },
    [InvoiceTypes['CREATE_INVOICE.UPDATE_TIMESHEET_DETAILS_SELECTION']]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const invoiceType: any = idx(action, (_) => _.payload.type);
      const data = idx(action, (_) => _.payload.data) || false;
      const invoiceTypeState =
        idx(state, (x) => x.newInvoice[invoiceType]) || {};
      return {
        ...state,
        newInvoice: {
          ...state.newInvoice,
          [invoiceType]: {
            ...invoiceTypeState,
            showTimesheetDetails: data,
          },
        },
      };
    },
    [InvoiceTypes['CREATE_INVOICE.RESET_INVOICE_DATA']]: (
      state: IState,
      action: IReduxAction,
    ) => {
      const invoiceType: any = idx(action, (_) => _.payload.type);
      return {
        ...state,
        newInvoice: {
          [invoiceType]: initialInvoice[invoiceType],
        },
      };
    },

    [ProfileTypes.LOGOUT_USER]: () => ({
      ...initialState,
    }),
  },
  initialState,
) as IState;
