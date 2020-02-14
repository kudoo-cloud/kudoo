import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import {
  withStyles,
  composeStyles,
  Button,
  SectionHeader,
  ErrorBoundary,
  Table,
  Loading,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import Grid from '@material-ui/core/Grid';
import TabContainer from './BankTransactionContainer';
import styles, { BankTransactionStyles } from './styles';

interface IProps {
  actions: any;
  bankTransactions: any[];
  onSortRequested: () => {};
  bankTransactionsLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}

class BankTransactions extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Bank Transactions'
        subtitle='Below is a list of all your Bank Transactions.'
        renderLeftPart={() => (
          <Button
            title='Create New Bank Transactions'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_BANK_TRANSACTIONS());
            }}
          />
        )}
      />
    );
  }

  public _renderNoBankTransaction() {
    const { classes } = this.props;
    return (
      <div className={classes.noLedgerWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no bank transactions. <br />
            Let’s start by creating a new Main Account.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    if (cell.id === 'transactionDate') {
      return <Link to={URL.EDIT_BANK_TRANSACTIONS({ id: row.id })}>{ele}</Link>;
    }
    return ele;
  };

  public _renderBankTransaction() {
    const {
      bankTransactions,
      bankTransactionsLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={bankTransactions}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={bankTransactionsLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!bankTransactionsLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, bankTransactions, bankTransactionsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {this._renderSectionHeading()}
          {bankTransactionsLoading && <Loading />}
          {!bankTransactionsLoading &&
            isEmpty(bankTransactions) &&
            this._renderNoBankTransaction()}
          {!isEmpty(bankTransactions) && this._renderBankTransaction()}
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledBankTransactions = withStyles(
  composeStyles(styles, BankTransactionStyles)
)(BankTransactions);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-bankTransactions'>
    {childProps => <StyledBankTransactions {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
