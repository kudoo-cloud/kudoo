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
  inventories: any;
  inventoriesLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedInventories: any;
  columns: any;
}

class InventoryTabContainer extends Component<IProps, IState> {
  public static defaultProps = {
    inventories: {
      refetch: () => {},
      loadNextPage: () => {},
      children: ({}) => {},
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedInventories: idx(props, (_) => _.inventories.data),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'inventoryModel',
          label: 'Costing Model',
        },
        {
          id: 'uom',
          label: 'Unit of Measure',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldInventories = idx(prevProps, (_) => _.inventories.data) || [];
    const newInventories = idx(this.props, (_) => _.inventories.data) || [];
    if (!isEqual(oldInventories, newInventories)) {
      this._updateInventories(newInventories);
    }
  }

  public _updateInventories(inventories) {
    this.setState({ displayedInventories: inventories });
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
    await this.props.inventories.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedInventories, columns } = this.state;
    const { match, history, location, actions, inventories = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO onChange={inventories.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            inventories: displayedInventories,
            inventoriesLoading: get(this.props, 'inventories.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'inventories.loadNextPage'),
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
  // withInventories(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-inventories') {
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
)(InventoryTabContainer);
