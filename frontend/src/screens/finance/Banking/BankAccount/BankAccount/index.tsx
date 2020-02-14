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
import TabContainer from './BankContainer';
import styles, { BankStyles } from './styles';

interface IProps {
  actions: any;
  banks: any[];
  onSortRequested: () => {};
  banksLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}

class Banks extends Component<IProps> {
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

  public _renderNoBank() {
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

  public _renderBank() {
    const {
      banks,
      banksLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={banks}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={banksLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!banksLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, banks, banksLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {this._renderSectionHeading()}
          {banksLoading && <Loading />}
          {!banksLoading && isEmpty(banks) && this._renderNoBank()}
          {!isEmpty(banks) && this._renderBank()}
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledBanks = withStyles(composeStyles(styles, BankStyles))(Banks);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-banks'>
    {childProps => <StyledBanks {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
