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
import styles, { LedgerStyles } from '../styles';
import TabContainer from './container';

interface IProps {
  actions: any;
  mainAccounts: any[];
  onSortRequested: () => {};
  mainAccountsLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}

class MainAccounts extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Main Accounts'
        subtitle='Below is a list of all your main accounts.'
        renderLeftPart={() => (
          <Button
            title='Create New Main Account'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_MAIN_ACCOUNT());
            }}
          />
        )}
      />
    );
  }

  public _renderNoMainAccount() {
    const { classes } = this.props;
    return (
      <div className={classes.noLedgerWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no main acocunts. <br />
            Let’s start by creating a new Main Account.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'name') {
      return (
        <Link
          to={URL.EDIT_MAIN_ACCOUNT({ id: row.id })}
          className={classes.mainAccountNameCell}>
          {ele}
        </Link>
      );
    }
    return ele;
  };

  public _renderMainAccount() {
    const {
      mainAccounts,
      mainAccountsLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={mainAccounts}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={mainAccountsLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!mainAccountsLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, mainAccounts, mainAccountsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {mainAccountsLoading && <Loading />}
            {!mainAccountsLoading &&
              isEmpty(mainAccounts) &&
              this._renderNoMainAccount()}
            {!isEmpty(mainAccounts) && this._renderMainAccount()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledMainAccounts = withStyles(composeStyles(styles, LedgerStyles))(
  MainAccounts
);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-mainAccounts'>
    {childProps => <StyledMainAccounts {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
