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
  banks: any;
  banksLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedBanks: any;
  columns: any;
}

class BankContainer extends Component<IProps, IState> {
  public static defaultProps = {
    banks: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedBanks: idx(props, (_) => _.banks.data),
      columns: [
        {
          id: 'name',
          label: 'Name',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'institution',
          label: 'Institution',
        },
        {
          id: 'accountNumber',
          label: 'Account number',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldBanks = idx(prevProps, (_) => _.banks.data) || [];
    const newBanks = idx(this.props, (_) => _.banks.data) || [];
    if (!isEqual(oldBanks, newBanks)) {
      this._updateBanks(newBanks);
    }
  }

  public _updateBanks(banks) {
    banks.forEach(() => {
      //data.transactionDate = moment(data.transactionDate).format('DD MMM YYYY');
    });
    this.setState({ displayedBanks: banks });
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
    await this.props.banks.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedBanks, columns } = this.state;
    const { match, history, location, actions, banks = {} } = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO onChange={banks.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            banks: displayedBanks,
            banksLoading: get(this.props, 'banks.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'banks.loadNextPage'),
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
  // withBanks(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-banks') {
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
)(BankContainer);
