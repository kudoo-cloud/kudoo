import React, { Component } from 'react';
import { isEmpty } from 'lodash';
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
import cx from 'classnames';
import { Tooltip } from 'react-tippy';
import styles, { purchaseOrderStyles } from '../../PurchaseOrder/styles';
import TabContainer from './POContainer';
import { IListProps } from './listTypes';

class PBSPurchaseOrder extends Component<IListProps> {
  public componentDidMount() {
    this.props.actions.updateHeaderTitle('PBS Purchase Order');
  }

  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='PBS Purchase Order'
        subtitle='Below is a list of all PBS Purchase Orders.'
        renderLeftPart={() => (
          <Button
            title='Create New PBS Purchase Order'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_PBS_PURCHASE_ORDER());
            }}
          />
        )}
      />
    );
  }

  public _renderNoPurchaseOrder() {
    const { classes } = this.props;
    return (
      <div className={classes.noWrapper}>
        <div className={classes.noMessageWrapper}>
          <div className={classes.noMessage}>
            There are no PBS Purchase Orders. <br />
            Let’s start by creating a new PBS Purchase Order.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes, showPOModal } = this.props;
    if (cell.id === 'date') {
      return (
        <Link
          to={
            row.status === 'OPEN'
              ? URL.EDIT_PBS_PURCHASE_ORDER({ id: row.id })
              : URL.PREVIEW_PURCHASE_ORDER({ id: row.id })
          }
          className={classes.PurchaseOrderNameCell}>
          {ele}
        </Link>
      );
    } else if (cell.id === 'status') {
      return (
        <div className={cx(classes.borderCell, classes.balanceCell)}>
          {row[cell.id]}
          <div className={classes.iconsWrapper}>
            <Tooltip
              title='Send Email'
              animation='fade'
              position='left'
              arrow
              arrowType='round'
              trigger='mouseenter focus'>
              <span
                className={classes.dollarIcon}
                style={{ marginRight: row[cell.id] !== 'INVOICED' ? 10 : 0 }}
                onClick={() => {
                  showPOModal(row, 'sendEmail');
                }}>
                <i className='fa fa-envelope-o' />
              </span>
            </Tooltip>
            {row[cell.id] === 'OPEN' && (
              <Tooltip
                title='Receipt'
                animation='fade'
                position='left'
                arrow
                arrowType='round'
                trigger='mouseenter focus'>
                <span
                  data-test='invoice-paid-button'
                  className={classes.dollarIcon}
                  onClick={() => {
                    showPOModal(row, 'receipted');
                  }}>
                  <i className='fa fa-arrow-right' />
                </span>
              </Tooltip>
            )}
            {row[cell.id] === 'RECEIPTED' && (
              <Tooltip
                title='Invoice'
                animation='fade'
                position='left'
                arrow
                arrowType='round'
                trigger='mouseenter focus'>
                <span
                  data-test='invoice-paid-button'
                  className={classes.dollarIcon}
                  onClick={() => {
                    showPOModal(row, 'invoiced');
                  }}>
                  <i className='fa fa-usd' />
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      );
    }
    return ele;
  };

  public _renderPurchaseOrder() {
    const {
      purchaseOrders,
      purchaseOrdersLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={purchaseOrders}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={purchaseOrdersLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!purchaseOrdersLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, purchaseOrders, purchaseOrdersLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {purchaseOrdersLoading && <Loading />}
            {!purchaseOrdersLoading &&
              isEmpty(purchaseOrders) &&
              this._renderNoPurchaseOrder()}
            {!isEmpty(purchaseOrders) && this._renderPurchaseOrder()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledPurchaseOrders = withStyles(
  composeStyles(styles, purchaseOrderStyles)
)(PBSPurchaseOrder);

const EnhancedComponent = (props: object) => (
  <TabContainer {...props} type='active-purchaseOrder'>
    {childProps => <StyledPurchaseOrders {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
