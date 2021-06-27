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
  children: any;
  ledgerPostings: any;
  ledgerPostingsLoading: boolean;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedLedgerPostings: any;
  columns: any;
}

class LedgerPostingTabContainer extends Component<IProps, IState> {
  public static defaultProps = {
    ledgerPostings: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedLedgerPostings: idx(props, (_) => _.ledgerPostings.data),
      columns: [
        {
          id: 'postingType',
          label: 'Posting Type',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'mainAccount_type',
          label: 'Main Account Type',
        },
        {
          id: 'mainAccount_code',
          label: 'Main Account Code',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldLedgerPostings =
      idx(prevProps, (_) => _.ledgerPostings.data) || [];
    const newLedgerPostings =
      idx(this.props, (_) => _.ledgerPostings.data) || [];
    if (!isEqual(oldLedgerPostings, newLedgerPostings)) {
      this._updateLedgerPostings(newLedgerPostings);
    }
  }

  public _updateLedgerPostings(ledgerPostings) {
    const ledgerPostingData = ledgerPostings.map((ledgerPosting) => {
      return {
        ...ledgerPosting,
        mainAccount_type: idx(ledgerPosting, (_) => _.mainAccount.type),
        mainAccount_code: idx(ledgerPosting, (_) => _.mainAccount.code),
      };
    });
    this.setState({ displayedLedgerPostings: ledgerPostingData });
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

    if (column.id !== 'mainAccount_type' && column.id !== 'mainAccount_code') {
      await this.props.ledgerPostings.refetch(variables);
    }

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedLedgerPostings, columns } = this.state;
    const {
      match,
      history,
      location,
      actions,
      ledgerPostings = {},
    } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={ledgerPostings.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            ledgerPostings: displayedLedgerPostings,
            ledgerPostingsLoading: get(this.props, 'ledgerPostings.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'ledgerPostings.loadNextPage'),
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
  // withLedgerPostings(({ profile, type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-ledgerPostings') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //         mainAccount: {
  //           company: {
  //             id: profile.selectedCompany.id,
  //           },
  //         },
  //       },
  //       orderBy: 'postingType_ASC',
  //     },
  //   };
  // }),
)(LedgerPostingTabContainer);
