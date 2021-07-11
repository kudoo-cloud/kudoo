import idx from 'idx';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import { IReduxState } from 'src/store/reducers';

type Props = {
  actions: any;
  children: any;
  customers: any;
  archiveCustomer?: Function;
  unArchiveCustomer?: Function;
  deleteCustomer?: Function;
  columns: any;
  match?: any;
  history?: any;
  location?: any;
  type?: string;
};
type State = {
  displayedCustomers: any;
  columns: any;
};

class TabContainer extends Component<Props, State> {
  // data: Array<Object>;

  static defaultProps = {
    customers: { data: [] },
    archiveCustomer: () => ({}),
    unArchiveCustomer: () => ({}),
    deleteCustomer: () => ({}),
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      displayedCustomers: idx(props, (_) => _.customers.data),
      columns: [
        {
          id: 'name',
          label: 'Customer name',
          sorted: true,
          order: 'asc',
        },
        { id: 'email', label: 'Email' },
        { id: 'projects', label: 'Projects' },
        {
          id: 'money_made',
          label: 'Money Made',
        },
        {
          id: 'money_owed',
          label: 'Money Owed',
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    const oldCustomers = idx(prevProps, (_) => _.customers.data) || [];
    const newCustomers = idx(this.props, (_) => _.customers.data) || [];
    if (!isEqual(oldCustomers, newCustomers)) {
      this._updateCustomers(newCustomers);
    }
  }

  _updateCustomers(customers) {
    this.setState({
      displayedCustomers: customers,
    });
  }

  _onSortRequested = async (column) => {
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
    await this.props.customers.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  _onArchiveCustomer = async (customer) => {
    try {
      const res = await this.props.archiveCustomer({
        where: { id: customer.id },
        data: { isArchived: true },
      });
      if (res.success) {
        showToast(null, 'Customer archived successfully');
        this.props.customers.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _onUnarchiveCustomer = async (customer) => {
    try {
      const res = await this.props.unArchiveCustomer({
        where: { id: customer.id },
        data: { isArchived: false },
      });
      if (res.success) {
        showToast(null, 'Customer activated successfully');
        this.props.customers.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _onRemoveCustomer = async (customer) => {
    try {
      const res = await this.props.deleteCustomer({
        where: { id: customer.id },
      });
      if (res.success) {
        showToast(null, 'Customer deleted successfully');
        this.props.customers.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _searchCustomer = async (text) => {
    this.props.customers.refetch({
      where: {
        name_contains: text ? text : undefined,
      },
    });
  };

  render() {
    const { displayedCustomers, columns } = this.state;
    const { match, history, location, actions, customers = {} } = this.props;
    return (
      <SelectedDAO onChange={customers.refetch}>
        {this.props.children({
          match,
          history,
          location,
          actions,
          customers: displayedCustomers,
          columns,
          onSortRequested: this._onSortRequested,
          onArchiveCustomer: this._onArchiveCustomer,
          onUnarchiveCustomer: this._onUnarchiveCustomer,
          onRemoveCustomer: this._onRemoveCustomer,
          onSearchCustomer: this._searchCustomer,
        })}
      </SelectedDAO>
    );
  }
}

export default compose<Props, Props>(
  connect((state: IReduxState) => ({ profile: state.profile })),
  // withCustomers(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-customers') {
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
  // withDeleteCustomer(),
  // withUpdateCustomer(() => ({
  //   name: 'archiveCustomer',
  // })),
  // withUpdateCustomer(() => ({
  //   name: 'unArchiveCustomer',
  // })),
)(TabContainer);
