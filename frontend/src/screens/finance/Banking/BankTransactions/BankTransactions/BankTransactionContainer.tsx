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
  bankTransactions: any;
  bankTransactionsLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedBankTransactions: any;
  columns: any;
}

class BankTransactionContainer extends Component<IProps, IState> {
  public static defaultProps = {
    bankTransactions: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedBankTransactions: idx(props, (_) => _.bankTransactions.data),
      columns: [
        {
          id: 'transactionDate',
          label: 'Transaction Date',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'description',
          label: 'Description',
        },
        {
          id: 'amount',
          label: 'Amount',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldBankTransactions =
      idx(prevProps, (_) => _.bankTransactions.data) || [];
    const newBankTransactions =
      idx(this.props, (_) => _.bankTransactions.data) || [];
    if (!isEqual(oldBankTransactions, newBankTransactions)) {
      this._updateBankTransactions(newBankTransactions);
    }
  }

  public _updateBankTransactions(bankTransactions) {
    bankTransactions.forEach((data) => {
      data.transactionDate = moment(data.transactionDate).format('DD MMM YYYY');
    });
    this.setState({ displayedBankTransactions: bankTransactions });
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
    await this.props.bankTransactions.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedBankTransactions, columns } = this.state;
    const {
      match,
      history,
      location,
      actions,
      bankTransactions = {},
    } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={bankTransactions.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            bankTransactions: displayedBankTransactions,
            bankTransactionsLoading: get(
              this.props,
              'bankTransactions.loading',
            ),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'bankTransactions.loadNextPage'),
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
  // withBankTransactions(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-bankTransactions') {
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
)(BankTransactionContainer);
