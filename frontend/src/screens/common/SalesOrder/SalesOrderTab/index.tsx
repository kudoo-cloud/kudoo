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
import SelectedCompany from '@client/helpers/SelectedCompany';
import uuid from 'uuid/v4';
import styles, { SalesOrderStyles } from './styles';
import TabContainer from './SalesOrderTabContainer';

interface IProps {
  actions: any;
  salesOrders: any[];
  onSortRequested: () => {};
  salesOrdersLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}
interface IState {
  contentHash: any;
}

class SalesOrder extends Component<IProps, IState> {
  public state = {
    contentHash: uuid(), // this is used to refresh all widget when company change from sidebar
  };

  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Sales Order'
        subtitle='Below is a list of all Sales Orders.'
        renderLeftPart={() => (
          <Button
            title='Create New Sales Order'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_SALES_ORDER());
            }}
          />
        )}
      />
    );
  }

  public _renderNoSalesOrder() {
    const { classes } = this.props;
    return (
      <div className={classes.noSaleWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no salesOrders. <br />
            Let’s start by creating a new SalesOrder.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'transactionDate') {
      return (
        <Link
          to={URL.EDIT_SALES_ORDER({ id: row.id })}
          className={classes.salesOrderNameCell}>
          {ele}
        </Link>
      );
    }
    return ele;
  };

  public _renderSalesOrder() {
    const {
      salesOrders,
      salesOrdersLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={salesOrders}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={salesOrdersLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!salesOrdersLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, salesOrders, salesOrdersLoading } = this.props;
    return (
      <div>
        <SelectedCompany
          onChange={() => {
            this.setState({
              contentHash: uuid(),
            });
          }}>
          <ErrorBoundary>
            <div className={classes.page}>
              <div className={classes.content}>
                {this._renderSectionHeading()}
                {salesOrdersLoading && <Loading />}
                {!salesOrdersLoading &&
                  isEmpty(salesOrders) &&
                  this._renderNoSalesOrder()}
                {!isEmpty(salesOrders) && this._renderSalesOrder()}
              </div>
            </div>
          </ErrorBoundary>
        </SelectedCompany>
      </div>
    );
  }
}

const StyledSalesOrders = withStyles(composeStyles(styles, SalesOrderStyles))(
  SalesOrder
);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-salesOrders'>
    {childProps => <StyledSalesOrders {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
