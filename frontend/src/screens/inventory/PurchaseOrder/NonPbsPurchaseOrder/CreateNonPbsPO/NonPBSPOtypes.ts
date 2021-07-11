/* eslint-disable */
import {
  IActions,
  IClasses,
  IHistory,
  IProfile,
  ITheme,
} from '../../PurchaseOrder/purchaseOrderTypes';

//================ Non PBS PO Types ==================//
export interface IPOResponse {
  success?: object;
  result?: {
    id: string;
  };
  error?: [];
}

export interface INONPbsPOProps {
  classes: IClasses;
  history: IHistory;
  profile: IProfile;
}

export interface INONPbsPOState {
  wizardStep: object[];
  activePage: number;
  visitedPages: number[];
  purchaseOrderData: IPurchaseOrderData;
  purchaseOrderLineData: object[];
}

//================ Create PO Types ==================//

export interface IPurchaseOrderData {
  defaultData: {
    id: string;
    date: Date;
    supplier: { key: string; value: string };
    status: string;
    orderer: string;
    preview: object;
  };
  isEditMode: boolean;
  actions: {
    setSubmitting: ({}: {}) => void;
  };
}

export interface ICreatePOProps {
  i18n: object;
  theme: ITheme;
  classes: IClasses;
  profile: IProfile;
  history: IHistory;
  actions: IActions;
  suppliers: {
    data: object[];
  };
  isPbsPO: boolean;
  initialData: {
    id?: string;
    date?: Date;
    supplier?: {
      id: string;
      name: string;
    };
    preview?: object;
  };
  purchaseOrderData: IPurchaseOrderData;
  markedVisited: (data: number) => {};
  makeStepActive: (data: number) => {};
  setPurchaseOrderData: (data: object) => {};
}

export interface ICreatePOState {
  suppliersList: object[];
  isEditMode: boolean;
}

//================ Create PO Line Types ==================//

export interface IPurchaseOrderLineData {
  id: string;
  item: { key: string; value: string };
  qty: number;
  unit: string;
  unitPrice: number;
  site: { key: string; value: string };
  tempId: string;
}

export interface ICreatePOLineProps {
  i18n: object;
  theme: ITheme;
  classes: IClasses;
  history: IHistory;
  wareHouses: {
    data: object[];
  };
  inventories: {
    data: object[];
  };
  markedVisited: (data: number) => {};
  makeStepActive: (data: number) => {};
  unmarkedVisited: (data: number) => {};
  submitForm: () => {};
  purchaseOrderData: IPurchaseOrderData;
  purchaseOrderLines: {
    data: object[];
  };
  purchaseOrderLineData: [IPurchaseOrderLineData];
  setPurchaseOrderLineData: (data: object[]) => {};
  deletePurchaseOrderLine: (data: object) => {};
}

export interface ICreatePOLineState {
  columnData: object[];
  inventoryList: object[];
  wareHouseList: object[];
  showError: boolean;
}

export interface IPOLine {
  id: string;
  item: {
    id: string;
    name: string;
  };
  qty: number;
  site: {
    id: string;
    name: string;
  };
  unit: string;
  unitPrice: number;
}

export interface IPBSDrug {
  id: string;
  brandName: string;
  organisation_id: { id: string; title: string };
}
// ============== Preview Purchase Order ===================//

export interface IPreviewPOProps {
  i18n: object;
  theme: ITheme;
  classes: IClasses;
  history: IHistory;
  profile: IProfile;
  markedVisited: (data: number) => {};
  makeStepActive: (data: number) => {};
  unmarkedVisited: (data: number) => {};
  purchaseOrderData: IPurchaseOrderData;
  purchaseOrderLineData: [IPurchaseOrderLineData];
  createPurchaseOrder: ({}) => {};
  updatePurchaseOrder: ({}) => {};
  createPurchaseOrderLine: ({}) => {};
  updatePurchaseOrderLine: ({}) => {};
  purchaseOrders: {
    data: {};
    count: number;
  };
}

export interface IPreviewPOState {
  submitting: boolean;
}

export default {};
/* eslint-enable */
