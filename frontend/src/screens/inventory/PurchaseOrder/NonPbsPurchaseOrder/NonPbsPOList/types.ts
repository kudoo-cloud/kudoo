import { IProfileState } from '@client/store/reducers/profile';
import { IPurchaseOrderEntity } from '@client/store/types';
import { StyleKeys, POStyleKeys } from '../../PurchaseOrder/styles';

export type ColumnType = {
  id: string;
  label: string;
  sorted?: boolean;
  order?: string;
};

export type IListProps = IRouteProps<StyleKeys | POStyleKeys> & {
  profile: IProfileState;
  purchaseOrders: {
    refetch: ({}) => {};
    loadNextPage: () => {};
    loading: boolean;
    data: IPurchaseOrderEntity[];
  };
};

export type IContainerProps = IRouteProps<''> & {
  profile: IProfileState;
  children: ({}) => {};
  purchaseOrdersLoading: boolean;
  purchaseOrders: {
    refetch: ({}) => {};
    loadNextPage: () => {};
    loading: boolean;
    data: IPurchaseOrderEntity[];
  };
};

export interface IContainerState {
  displayedPurchaseOrders: IPurchaseOrderEntity[];
  columns: ColumnType[];
  notifiedPO: object | null;
  isShowingPOModal: Array<string>;
}
