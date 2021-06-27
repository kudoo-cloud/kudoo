import { ErrorBoundary } from '@kudoo/components';
import idx from 'idx';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedCompany from 'src/helpers/SelectedCompany';

interface IProps {
  actions: any;
  children: ({}) => {};
  salesOrders: any;
  salesOrdersLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedSalesOrders: any;
  columns: any;
}

class SalesOrderTabContainer extends Component<IProps, IState> {
  public static defaultProps = {
    salesOrders: {
      refetch: () => {},
      loadNextPage: () => {},
      children: ({}) => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedSalesOrders: idx(props, (_) => _.salesOrders.data),
      columns: [
        {
          id: 'transactionDate',
          label: 'Transaction Date',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'customer',
          label: 'Customer',
        },
        {
          id: 'currency',
          label: 'Currency',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldSalesOrders = idx(prevProps, (_) => _.salesOrders.data) || [];
    const newSalesOrders = idx(this.props, (_) => _.salesOrders.data) || [];
    if (!isEqual(oldSalesOrders, newSalesOrders)) {
      this._updateSalesOrders(newSalesOrders);
    }
  }

  public _updateSalesOrders(salesOrders) {
    const saleOrderData = salesOrders.map((salesOrder) => {
      return {
        ...salesOrder,
        customer: idx(salesOrder, (_) => _.customer.name) || '',
        transactionDate: moment(salesOrder.transactionDate).format(
          'DD MMM YYYY',
        ),
      };
    });
    this.setState({ displayedSalesOrders: saleOrderData });
  }

  public _onRequestSort = async (column) => {
    const columns = this.state.columns;
    const sortedColumn = find(columns, { sorted: true });
    const columnGoingToBeSorted = find(columns, { id: column.id });

    let sortDirection = 'asc';
    if (sortedColumn.id === columnGoingToBeSorted.id) {
      if (sortedColumn.order === 'asc') {
        sortDirection = 'desc';
      }
    }
    const variables = {
      orderBy: `${columnGoingToBeSorted.id}_${sortDirection.toUpperCase()}`,
    };
    if (column.id !== 'customer') {
      await this.props.salesOrders.refetch(variables);
    }
    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedSalesOrders, columns } = this.state;
    const { match, history, location, actions, salesOrders = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={salesOrders.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            salesOrders: displayedSalesOrders,
            salesOrdersLoading: get(this.props, 'salesOrders.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'salesOrders.loadNextPage'),
          })}
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withSalesOrders(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-salesOrders') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'transactionDate_ASC',
  //     },
  //   };
  // }),
)(SalesOrderTabContainer);
