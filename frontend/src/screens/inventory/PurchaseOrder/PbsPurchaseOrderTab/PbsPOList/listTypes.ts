import {
  IActions,
  IClasses,
  IHistory,
  IProfile,
  ITheme,
} from '../../PurchaseOrder/purchaseOrderTypes';

export interface IListProps {
  theme: ITheme;
  history: IHistory;
  classes: IClasses;
  columns: object[];
  profile: IProfile;
  actions: IActions;
  onLoadMore: () => {};
  purchaseOrders: object[];
  onSortRequested: () => {};
  purchaseOrdersLoading: boolean;
  showPOModal: (row: number, modal: string) => {};
}

export interface IContainerProps {
  match: object;
  location: object;
  actions: IActions;
  profile: IProfile;
  history: IHistory;
  children: ({}) => {};
  purchaseOrdersLoading: boolean;
  purchaseOrders: {
    refetch: ({}) => {};
    loadNextPage: () => {};
    loading: boolean;
    data: object[];
  };
}

export interface IContainerState {
  displayedPurchaseOrders: object[];
  columns: object[];
  notifiedPO: object | null;
  isShowingPOModal: Array<string>;
}
