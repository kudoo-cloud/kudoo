import {
  IActions,
  IClasses,
  IHistory,
  IProfile,
  ITheme,
} from '../../PurchaseOrder/purchaseOrderTypes';

//================ Non PBS PO Types ==================//
export interface IPOResponse {
  success: object;
  result: {
    id: string;
  };
  error: [];
}

export interface IPbsPOProps {
  classes: IClasses;
  history: IHistory;
  profile: IProfile;
}

export interface IPbsPOState {
  wizardStep: object[];
  activePage: number;
  visitedPages: number[];
  purchaseOrderData: IPBSPurchaseOrderData;
  purchaseOrderLineData: object[];
}

//================ Create PO Types ==================//

export interface IPBSPurchaseOrderData {
  defaultData: {
    id: string;
    date: Date;
    pbsOrganisation: string;
    status: string;
    orderer: string;
  };
  isEditMode: boolean;
  actions: {
    setSubmitting: ({}: {}) => void;
  };
}

export interface ICreatePBSPOProps {
  i18n: object;
  theme: ITheme;
  classes: IClasses;
  profile: IProfile;
  history: IHistory;
  actions: IActions;
  initialData: {
    id: string;
    date: Date;
    pbsOrganisation: string;
    isPbsPO: boolean;
  };
  purchaseOrderData: IPBSPurchaseOrderData;
  markedVisited: (data: number) => {};
  makeStepActive: (data: number) => {};
  setPurchaseOrderData: (data: object) => {};
  setCheckBoxState: (flag: boolean) => {};
}

export interface ICreatePBSPOState {
  isEditMode: boolean;
}

//================ Create PO Line Types ==================//

export interface IPurchaseOrderLineData {
  id: string;
  pbsDrug: { key: string; value: string };
  qty: number;
  site: { key: string; value: string };
  tempId: string;
  purchaseOrder: string;
  pbsOrganisation: { key: string; value: string };
}

export interface ICreatePBSPOLineProps {
  i18n: object;
  theme: ITheme;
  classes: IClasses;
  history: IHistory;
  wareHouses: {
    data: object[];
  };
  pbsTPPs: {
    data: object[];
    refetch: ({}: {}) => {};
  };
  markedVisited: (data: number) => {};
  makeStepActive: (data: number) => {};
  unmarkedVisited: (data: number) => {};
  submitForm: () => {};
  purchaseOrderData: IPBSPurchaseOrderData;
  purchaseOrderLines: {
    data: object[];
    loading: boolean;
  };
  purchaseOrderLineData: [IPurchaseOrderLineData];
  setPurchaseOrderLineData: (data: object[]) => {};
  deletePurchaseOrderLine: (data: object) => Promise<IPOResponse>;
  setSearchText: (data: string) => {};
}

export interface ICreatePBSPOLineState {
  columnData: object[];
  drugsList: object[];
  wareHouseList: object[];
  showDrugMenu: boolean;
  showError: boolean;
}

export interface IPBSPOLine {
  id: string;
  pbsDrug: string;
  qty: number;
  site: {
    id: string;
    name: string;
  };
  purchaseOrder: {
    id: string;
  };
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
  purchaseOrderData: IPBSPurchaseOrderData;
  purchaseOrderLineData: [IPurchaseOrderLineData];
  createPurchaseOrder: ({}) => Promise<IPOResponse>;
  updatePurchaseOrder: ({}) => Promise<IPOResponse>;
  createPurchaseOrderLine: ({}) => Promise<IPOResponse>;
  updatePurchaseOrderLine: ({}) => Promise<IPOResponse>;
  purchaseOrders: {
    data: {};
    count: number;
  };
}

export interface IPreviewPOState {
  submitting: boolean;
  expanded: string;
  confirmPO: Array<string>;
  previewPDF: Array<object>;
  showError: boolean;
}
