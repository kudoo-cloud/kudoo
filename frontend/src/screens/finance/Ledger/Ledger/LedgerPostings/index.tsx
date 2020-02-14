import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
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
import { Link } from 'react-router-dom';
import styles, { LedgerStyles } from '../styles';
import TabContainer from './container';

interface IProps {
  actions: any;
  columns: any;
  ledgerPostings: any[];
  onSortRequested: () => {};
  ledgerPostingsLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
}

class LedgerPostings extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Ledger Postings'
        subtitle='Below is a list of all your Ledger Postings'
        renderLeftPart={() => (
          <Button
            title='Create New Ledger Posting'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_LEDGER_POSTING());
            }}
          />
        )}
      />
    );
  }

  public _renderNoLedgerPosting() {
    const { classes } = this.props;
    return (
      <div className={classes.noLedgerWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no ledger postings. <br />
            Let’s start by creating a new Ledger Posting.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'postingType') {
      return (
        <Link
          to={URL.EDIT_LEDGER_POSTING({ id: row.id })}
          className={classes.mainAccountNameCell}>
          {ele}
        </Link>
      );
    }
    return ele;
  };

  public _renderLedgerPosting() {
    const {
      ledgerPostings,
      ledgerPostingsLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={ledgerPostings}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            cellRenderer={this._renderCell}
            loading={ledgerPostingsLoading}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!ledgerPostingsLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, ledgerPostings, ledgerPostingsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {ledgerPostingsLoading && <Loading />}
            {!ledgerPostingsLoading &&
              isEmpty(ledgerPostings) &&
              this._renderNoLedgerPosting()}
            {!isEmpty(ledgerPostings) && this._renderLedgerPosting()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledLedgerPostings = withStyles(composeStyles(styles, LedgerStyles))(
  LedgerPostings
);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-ledgerPostings'>
    {childProps => <StyledLedgerPostings {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
