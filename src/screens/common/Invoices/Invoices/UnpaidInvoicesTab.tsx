import {
  Button,
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  Tabs,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import clone from 'lodash/clone';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import URL from 'src/helpers/urls';
import { UnpaidInvoicesTabStyles } from './styles';
import TabContainer from './TabContainer';

type Props = {
  invoices: Array<any>;
  markInvoiceAsPaid: Function;
  showInvoiceEmailModal: Function;
  onRequestSort: Function;
  invoicesLoading: boolean;
  onLoadMore: Function;
  history: any;
  theme: any;
  classes: any;
};
type State = {
  headerData: any;
  // headerData: Array<ColumnFlowType>,
};

class UnpaidInvoicesTab extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      headerData: [
        {
          id: 'hash',
          label: '#',
        },
        {
          id: 'customer',
          label: 'Customer',
        },
        {
          id: 'date',
          label: 'Date',
          sorted: true,
          order: 'desc',
        },
        {
          id: 'due',
          label: 'Due',
        },
        {
          id: 'total',
          label: 'Total',
        },
        {
          id: 'balance',
          label: 'Balance',
        },
      ],
    };
  }

  _onRequestSort = (column) => {
    const { headerData } = this.state;
    const newHeaderData = clone(headerData);
    const sortedColumn = find(newHeaderData, { sorted: true });
    if (sortedColumn && column.id !== sortedColumn.id) {
      sortedColumn.sorted = false;
      sortedColumn.order = 'asc';
    }
    const goingToBeSortedColumn = find(newHeaderData, { id: column.id });
    let sortDirection = 'asc';
    goingToBeSortedColumn.sorted = true;
    if (goingToBeSortedColumn.order === 'asc') {
      sortDirection = 'desc';
    }
    goingToBeSortedColumn.order = sortDirection;
    this.setState({ headerData: newHeaderData });
    this.props.onRequestSort(column, sortDirection);
  };

  _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title={'Unpaid invoices'}
        subtitle='Below is a list of all your invoice which have not yet been paid by the customer.'
        renderLeftPart={() => (
          <Button
            title='Create new Invoice'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_INVOICES());
            }}
          />
        )}
      />
    );
  }

  _renderNoInvoices() {
    const { classes } = this.props;
    return (
      <div className={classes.noInvoicesWrapper}>
        <div className={classes.noInvoicesMessageWrapper}>
          <div className={classes.noInvoiceMessage}>
            There are no unpaid invoices. <br />
            Let’s start by creating a new invoice.
          </div>
        </div>
      </div>
    );
  }

  _renderCell = (row, column, ele) => {
    const { classes, markInvoiceAsPaid, showInvoiceEmailModal } = this.props;
    if (column.id === 'hash') {
      return (
        <div className={classes.borderCell}>
          <Link
            to={URL.PREVIEW_INVOICE({ id: row.id })}
            target='_blank'
            className={classes.invoiceLink}
          >
            {row[column.id]}
          </Link>
        </div>
      );
    } else if (column.id === 'total') {
      return <div className={classes.borderCell}>{row[column.id]}</div>;
    } else if (column.id === 'balance') {
      return (
        <div className={cx(classes.borderCell, classes.balanceCell)}>
          {row[column.id]}
          <div className={classes.iconsWrapper}>
            <Tooltip
              title='Email invoice'
              animation='fade'
              position='left'
              arrow
              // arrowType='round'
              trigger={'mouseenter focus' as any}
            >
              <span
                className={classes.dollarIcon}
                style={{ marginRight: 10 }}
                onClick={() => {
                  showInvoiceEmailModal(row);
                }}
              >
                <i className='fa fa-envelope-o' />
              </span>
            </Tooltip>
            <Tooltip
              title='Mark as paid'
              animation='fade'
              position='left'
              arrow
              // arrowType='round'
              trigger={'mouseenter focus' as any}
            >
              <span
                data-test='invoice-paid-button'
                className={classes.dollarIcon}
                onClick={() => {
                  markInvoiceAsPaid(row);
                }}
              >
                <i className='fa fa-usd' />
              </span>
            </Tooltip>
          </div>
        </div>
      );
    }
    return ele;
  };

  _renderInvoices() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={this.state.headerData}
            data={this.props.invoices}
            stripe={false}
            showRemoveIcon={false}
            sortable
            cellRenderer={this._renderCell}
            onRequestSort={this._onRequestSort}
            loading={this.props.invoicesLoading}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!this.props.invoicesLoading) {
                this.props.onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  _renderTertiaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'Sent',
            onClick: () => {},
          },
          {
            label: 'Draft',
            onClick: () => {},
          },
        ]}
        tabTheme='tertiary'
        activeIndex={0}
      />
    );
  }

  render() {
    const { classes, invoices, invoicesLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {!isEmpty(invoices) && this._renderTertiaryTabs()}
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {invoicesLoading && <Loading />}
            {!invoicesLoading && isEmpty(invoices) && this._renderNoInvoices()}
            {!isEmpty(invoices) && this._renderInvoices()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const Styled = withStyles(UnpaidInvoicesTabStyles)(UnpaidInvoicesTab);

const UnpaidTabContainer = (props: any) => (
  <TabContainer {...props} invoiceType='unpaid'>
    {(childProps) => <Styled {...childProps} />}
  </TabContainer>
);

export default UnpaidTabContainer;
