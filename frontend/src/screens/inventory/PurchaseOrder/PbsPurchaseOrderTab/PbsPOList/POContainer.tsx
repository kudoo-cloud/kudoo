import { ErrorBoundary } from '@kudoo/components';
import idx from 'idx';
import { filter, find, get, includes, isEqual } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import POInvoiceModal from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/POInvoiceModal';
import PONotificationModal from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/PONotificationModal';
import POReceiptModal from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/POReceiptModal';
import { IContainerProps, IContainerState } from './listTypes';

class PurchaseOrderTabContainer extends Component<
  IContainerProps,
  IContainerState
> {
  public static defaultProps = {
    purchaseOrders: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IContainerProps) {
    super(props);
    this.state = {
      displayedPurchaseOrders: props.purchaseOrders.data,
      columns: [
        {
          id: 'date',
          label: 'Purchase Order Date',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'orderer',
          label: 'Orderer',
        },
        {
          id: 'status',
          label: 'Status',
        },
      ],
      notifiedPO: null,
      isShowingPOModal: [],
    };
  }

  public componentDidMount() {
    this.props.purchaseOrders.refetch({
      where: {
        isArchived: false,
      },
      orderBy: 'date_ASC',
    });
  }

  public componentDidUpdate(prevProps) {
    const oldPurchaseOrders =
      idx(prevProps, (_) => _.purchaseOrders.data) || [];
    const newPurchaseOrders =
      idx(this.props, (_) => _.purchaseOrders.data) || [];
    if (!isEqual(oldPurchaseOrders, newPurchaseOrders)) {
      this._updatePurchaseOrders();
    }
  }

  public _updatePurchaseOrders() {
    const {
      purchaseOrders: { data = [] },
    } = this.props;
    const purchaseOrderFilterData: any = [];
    // ===Filter Non PBS Purchase Order Data===/

    filter(data, (_: any) => _.isPbsPO).forEach((po) => {
      purchaseOrderFilterData.push(po);
    });

    // ===Format Data to display===//

    const purchaseOrdersData = purchaseOrderFilterData.map(
      (purchaseOrder: any) => {
        return {
          ...purchaseOrder,
          orderer:
            idx(
              purchaseOrder,
              (_) => _.orderer.firstName + ' ' + _.orderer.lastName,
            ) || '',
          date: moment(purchaseOrder.date).format('DD MMM YYYY'),
        };
      },
    );
    this.setState({ displayedPurchaseOrders: purchaseOrdersData });
  }

  public _onRequestSort = async (column) => {
    const columns = this.state.columns;
    const sortedColumn: any = find(columns, { sorted: true });
    const columnGoingToBeSorted: any = find(columns, { id: column.id });

    let sortDirection = 'asc';
    if (sortedColumn.id === columnGoingToBeSorted.id) {
      if (sortedColumn.order === 'asc') {
        sortDirection = 'desc';
      }
    }
    const variables = {
      orderBy: `${columnGoingToBeSorted.id}_${sortDirection.toUpperCase()}`,
    };
    if (column.id !== 'orderer') {
      this.props.purchaseOrders.refetch(variables);
    }

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public _showPOModal = (purchaseOrder, modalName) => {
    const { isShowingPOModal } = this.state;
    isShowingPOModal.push(modalName);
    this.setState({
      notifiedPO: purchaseOrder,
      isShowingPOModal,
    });
  };

  public _closePOModal = () => {
    const { isShowingPOModal } = this.state;
    isShowingPOModal.pop();
    this.setState({
      notifiedPO: null,
      isShowingPOModal,
    });
  };

  public render() {
    const { displayedPurchaseOrders, columns, isShowingPOModal } = this.state;
    const { match, history, location, actions } = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.PURCHASE_ORDER());
          }}
        >
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            purchaseOrders: displayedPurchaseOrders,
            purchaseOrdersLoading: get(this.props, 'purchaseOrders.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'purchaseOrders.loadNextPage'),
            showPOModal: this._showPOModal,
            closePOModal: this._closePOModal,
          })}
          <PONotificationModal
            visible={includes(isShowingPOModal, 'sendEmail')}
            purchaseOrder={this.state.notifiedPO as any}
            onClose={this._closePOModal}
          />
          <POInvoiceModal
            visible={includes(isShowingPOModal, 'invoiced')}
            purchaseOrder={this.state.notifiedPO}
            onClose={this._closePOModal}
          />
          <POReceiptModal
            visible={includes(isShowingPOModal, 'receipted')}
            purchaseOrder={this.state.notifiedPO as any}
            onClose={this._closePOModal}
          />
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect((state: { profile: object }) => ({
    profile: state.profile,
  })),
  // withPurchaseOrders(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-purchaseOrder') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'date_ASC',
  //     },
  //   };
  // }),
)(PurchaseOrderTabContainer);
