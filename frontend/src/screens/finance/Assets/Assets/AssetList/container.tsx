import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { ErrorBoundary, withRouterProps } from '@kudoo/components';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { withAssets } from '@kudoo/graphql';

interface IProps {
  actions: any;
  children: any;
  assets: any;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedAssets: any;
  columns: any;
}

class AssetListContainer extends Component<IProps, IState> {
  public static defaultProps = {
    assets: {
      refetch: () => {},
      loadNextPage: () => {},
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedAssets: get(props, 'assets.data'),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'assetGroup',
          label: 'Asset Group',
        },
        {
          id: 'aquisitionPrice',
          label: 'Aquisition Price',
        },
        {
          id: 'netBookValue',
          label: 'Net Book Value',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldAssets = get(prevProps, 'assets.data') || [];
    const newAssets = get(this.props, 'assets.data') || [];
    if (!isEqual(oldAssets, newAssets)) {
      this._updateAssets(newAssets);
    }
  }

  public _updateAssets(items) {
    const data = items.map(item => {
      return { ...item };
    });
    this.setState({ displayedAssets: data });
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

    if (column.id !== 'assetGroup') {
      await this.props.assets.refetch(variables);
    }

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedAssets, columns } = this.state;
    const { match, history, location, actions, assets = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={assets.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            assets: displayedAssets,
            assetsLoading: get(this.props, 'assets.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'assets.loadNextPage'),
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
  withAssets(({ profile, type }) => {
    let isArchived = false;
    if (type === 'archived-assets') {
      isArchived = true;
    }
    return {
      variables: {
        where: {
          isArchived,
          company: {
            id: profile.selectedCompany.id,
          },
        },
        orderBy: 'name_ASC',
      },
    };
  })
)(AssetListContainer);
