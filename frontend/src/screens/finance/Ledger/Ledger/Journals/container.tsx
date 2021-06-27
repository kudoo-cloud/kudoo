import { ErrorBoundary } from '@kudoo/components';
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
  ledgerJournals: any;
  match: any;
  history: any;
  location: any;
}
interface IState {
  displayedLedgerJournals: any;
  columns: any;
}

class LedgerJournalsContainer extends Component<IProps, IState> {
  public static defaultProps = {
    ledgerJournals: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      displayedLedgerJournals: get(props, 'ledgerJournals.data'),
      columns: [
        {
          id: 'total',
          label: 'Total',
          sorted: true,
          order: 'asc',
        },
        {
          id: 'currency',
          label: 'Currency',
        },
        {
          id: 'includeConsTax',
          label: 'Include Tax',
        },
        {
          id: 'posted',
          label: 'Posted',
        },
      ],
    };
  }

  public componentDidUpdate(prevProps) {
    const oldLedgerJournals = get(prevProps, 'ledgerJournals.data') || [];
    const newLedgerJournals = get(this.props, 'ledgerJournals.data') || [];
    if (!isEqual(oldLedgerJournals, newLedgerJournals)) {
      this._updateLedgerJournals(newLedgerJournals);
    }
  }

  public _updateLedgerJournals(items) {
    const data = items.map((item) => {
      return { ...item };
    });
    this.setState({ displayedLedgerJournals: data });
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

    await this.props.ledgerJournals.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public render() {
    const { displayedLedgerJournals, columns } = this.state;
    const {
      match,
      history,
      location,
      actions,
      ledgerJournals = {},
    } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={ledgerJournals.refetch}>
          {this.props.children({
            match,
            history,
            location,
            actions,
            columns,
            ledgerJournals: displayedLedgerJournals,
            ledgerJournalsLoading: get(this.props, 'ledgerJournals.loading'),
            onSortRequested: this._onRequestSort,
            onLoadMore: get(this.props, 'ledgerJournals.loadNextPage'),
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
  // withLedgerJournals(({ profile, type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-journals') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //         company: {
  //           id: profile.selectedCompany.id,
  //         },
  //       },
  //       orderBy: 'total_ASC',
  //     },
  //   };
  // }),
)(LedgerJournalsContainer);
