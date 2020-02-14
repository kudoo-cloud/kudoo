import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { ErrorBoundary, withRouterProps } from '@kudoo/components';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { withAssetGroups } from '@kudoo/graphql';

interface IProps {
  actions: any;
  children: any;
  assetGroups: any;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedAssetGroups: any;
  columns: any;
}

class AssetGroupsContainer extends Component<IProps, IState> {
  public static defaultProps = {
    assetGroups: {
      refetch: () => {},
      loadNextPage: () => {},
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedAssetGroups: get(props, 'assetGroups.data'),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'depreciationType',
          label: 'Depreciation Type',
        },
        {
          id: 'usefulLife',
          label: 'Useful Life (in months)',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldAssetGroups = get(prevProps, 'assetGroups.data') || [];
    const newAssetGroups = get(this.props, 'assetGroups.data') || [];
    if (!isEqual(oldAssetGroups, newAssetGroups)) {
      this._updateAssetGroups(newAssetGroups);
    }
  }

  public _updateAssetGroups(items) {
    const data = items.map(item => {
      return { ...item };
    });
    this.setState({ displayedAssetGroups: data });
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

    await this.props.assetGroups.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedAssetGroups, columns } = this.state;
    const { match, history, location, actions, assetGroups = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={assetGroups.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            assetGroups: displayedAssetGroups,
            assetGroupsLoading: get(this.props, 'assetGroups.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'assetGroups.loadNextPage'),
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
  withAssetGroups(({ profile, type }) => {
    let isArchived = false;
    if (type === 'archived-asset-groups') {
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
)(AssetGroupsContainer);
