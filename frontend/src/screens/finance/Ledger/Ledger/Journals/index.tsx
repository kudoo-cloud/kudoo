import {
  Button,
  Checkbox,
  ErrorBoundary,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import URL from 'src/helpers/urls';
import styles, { LedgerStyles } from '../styles';
import Container from './container';

interface IProps {
  actions: any;
  columns: any;
  ledgerJournals: any[];
  onSortRequested: () => {};
  ledgerJournalsLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
}

class LedgerJournals extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Ledger Journals'
        subtitle='Below is a list of all your Ledger Journals'
        renderLeftPart={() => (
          <Button
            title='Create Journal'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_LEDGER_JOURNAL());
            }}
          />
        )}
      />
    );
  }

  public _renderNoItem() {
    const { classes } = this.props;
    return (
      <div className={classes.noLedgerWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no ledger journals. <br />
            Let’s start by creating a new Ledger Journal.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'posted') {
      return (
        <div className={classes.customCell}>
          <Checkbox value={row[cell.id]} size={'medium'} disabled />
        </div>
      );
    }
    if (cell.id === 'includeConsTax') {
      return (
        <div className={classes.customCell}>
          <Checkbox value={row[cell.id]} size={'medium'} disabled />
        </div>
      );
    }
    return ele;
  };

  public _renderLedgerPosting() {
    const {
      ledgerJournals,
      ledgerJournalsLoading,
      onLoadMore,
      columns,
      onSortRequested,
      history,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={ledgerJournals}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={ledgerJournalsLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!ledgerJournalsLoading) {
                onLoadMore();
              }
            }}
            onCellClick={(e, { row }) => {
              history.push(URL.EDIT_LEDGER_JOURNAL({ id: row.id }));
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, ledgerJournals, ledgerJournalsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {!ledgerJournalsLoading &&
              isEmpty(ledgerJournals) &&
              this._renderNoItem()}
            {!isEmpty(ledgerJournals) && this._renderLedgerPosting()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const Styled = withStyles(composeStyles(styles, LedgerStyles))(LedgerJournals);

const EnhancedComponent = (props: any) => (
  <Container {...props} type='active-journals'>
    {(childProps) => <Styled {...childProps} />}
  </Container>
);

export default EnhancedComponent;
