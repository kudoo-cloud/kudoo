import { ErrorBoundary } from '@kudoo/components';
import idx from 'idx';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedCompany from 'src/helpers/SelectedCompany';

interface IProps {
  actions: any;
  children: ({}) => {};
  mainAccounts: any;
  mainAccountsLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedMainAccounts: any;
  columns: any;
}

class MainAccountTabContainer extends Component<IProps, IState> {
  public static defaultProps = {
    mainAccounts: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedMainAccounts: idx(props, (_) => _.mainAccounts.data),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'code',
          label: 'code',
        },
        {
          id: 'type',
          label: 'Type',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldMainAccounts = idx(prevProps, (_) => _.mainAccounts.data) || [];
    const newMainAccounts = idx(this.props, (_) => _.mainAccounts.data) || [];
    if (!isEqual(oldMainAccounts, newMainAccounts)) {
      this._updateMainAccounts(newMainAccounts);
    }
  }

  public _updateMainAccounts(mainAccounts) {
    this.setState({ displayedMainAccounts: mainAccounts });
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
    await this.props.mainAccounts.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedMainAccounts, columns } = this.state;
    const { match, history, location, actions, mainAccounts = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={mainAccounts.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            mainAccounts: displayedMainAccounts,
            mainAccountsLoading: get(this.props, 'mainAccounts.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'mainAccounts.loadNextPage'),
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
  // withMainAccounts(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-mainAccounts') {
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
)(MainAccountTabContainer);
