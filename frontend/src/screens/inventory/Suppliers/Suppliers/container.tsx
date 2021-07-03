import { ErrorBoundary } from '@kudoo/components';
import idx from 'idx';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';

interface IProps {
  actions: any;
  children: ({}) => {};
  suppliers: any;
  suppliersLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedSuppliers: any;
  columns: any;
}

class SupplierTabContainer extends Component<IProps, IState> {
  public static defaultProps = {
    suppliers: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedSuppliers: idx(props, (_) => _.suppliers.data),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'termsOfPayment',
          label: 'Terms Of Payment',
        },
        {
          id: 'emailAddressForRemittance',
          label: 'Email For Remittance',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldSuppliers = idx(prevProps, (_) => _.suppliers.data) || [];
    const newSuppliers = idx(this.props, (_) => _.suppliers.data) || [];
    if (!isEqual(oldSuppliers, newSuppliers)) {
      this._updateSuppliers(newSuppliers);
    }
  }

  public _updateSuppliers(suppliers) {
    this.setState({ displayedSuppliers: suppliers });
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
    await this.props.suppliers.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedSuppliers, columns } = this.state;
    const { match, history, location, actions, suppliers = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO onChange={suppliers.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            suppliers: displayedSuppliers,
            suppliersLoading: get(this.props, 'suppliers.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'suppliers.loadNextPage'),
          })}
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withSuppliers(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-suppliers') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
)(SupplierTabContainer);
