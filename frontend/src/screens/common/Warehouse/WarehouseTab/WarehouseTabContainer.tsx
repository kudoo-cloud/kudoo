import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import idx from 'idx';
import get from 'lodash/get';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import { ErrorBoundary, withRouterProps } from '@kudoo/components';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { withWareHouses } from '@kudoo/graphql';

interface IProps {
  actions: any;
  children: ({}) => {};
  wareHouses: any;
  wareHousesLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedWareHouses: any;
  columns: any;
}

class WarehouseTabContainer extends Component<IProps, IState> {
  public static defaultProps = {
    wareHouses: {
      refetch: () => {},
      loadNextPage: () => {},
      children: ({}) => {},
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedWareHouses: idx(props, _ => _.wareHouses.data),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldWareHouses = idx(prevProps, _ => _.wareHouses.data) || [];
    const newWareHouses = idx(this.props, _ => _.wareHouses.data) || [];
    if (!isEqual(oldWareHouses, newWareHouses)) {
      this._updateWareHouses(newWareHouses);
    }
  }

  public _updateWareHouses(wareHouses) {
    this.setState({ displayedWareHouses: wareHouses });
  }

  public _onRequestSort = async column => {
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
    await this.props.wareHouses.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedWareHouses, columns } = this.state;
    const { match, history, location, actions, wareHouses = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={wareHouses.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            wareHouses: displayedWareHouses,
            wareHousesLoading: get(this.props, 'wareHouses.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'wareHouses.loadNextPage'),
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
  withWareHouses(({ profile, type }) => {
    let isArchived = false;
    if (type === 'archived-wareHouses') {
      isArchived = true;
    }
    return {
      variables: {
        where: {
          isArchived,
        },
        orderBy: 'name_ASC',
      },
    };
  })
)(WarehouseTabContainer);
