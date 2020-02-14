import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import find from 'lodash/find';
import { Tooltip } from 'react-tippy';
import {
  withStyles,
  Table,
  SectionHeader,
  ErrorBoundary,
  withRouterProps,
  withStylesProps,
  Loading,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import TabContainer from './TabContainer';
import { UnpaidInvoicesTabStyles } from './styles';

type Props = {
  actions: any;
  invoices: Array<any>;
  archiveInvoice: Function;
  showInvoiceEmailModal: Function;
  onRequestSort: Function;
  invoicesLoading: boolean;
  onLoadMore: Function;
  theme: any;
  classes: any;
};
type State = {
  headerData: any;
};

class PaidInvoicesTab extends Component<Props, State> {
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

  _onRequestSort = column => {
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

  _showArchivedDialog = invoice => {
    const { theme } = this.props;
    const title = 'Archive Invoice?';
    const description = (
      <div>Are you sure you want to archive the invoice ?</div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Archive Invoice',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.archiveInvoice(invoice);
          this.props.actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.secondary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _renderSectionHeading() {
    return (
      <SectionHeader
        title={'Paid invoices'}
        subtitle='Below is a list of all your invoice which have been paid by the customer.'
      />
    );
  }

  _renderNoInvoices() {
    const { classes } = this.props;
    return (
      <div className={classes.noInvoicesWrapper}>
        <div className={classes.noInvoicesMessageWrapper}>
          <div className={classes.noInvoiceMessage}>
            There are no paid invoices. <br />
          </div>
        </div>
      </div>
    );
  }

  _renderCell = (row, column, ele) => {
    const { classes, showInvoiceEmailModal } = this.props;
    if (column.id === 'hash') {
      return (
        <div className={classes.borderCell}>
          <Link
            to={URL.PREVIEW_INVOICE({ id: row.id })}
            target='_blank'
            className={classes.invoiceLink}>
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
              arrowType='round'
              trigger='mouseenter focus'>
              <span
                className={classes.dollarIcon}
                onClick={() => {
                  showInvoiceEmailModal(row);
                }}>
                <i className='fa fa-envelope-o' />
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
            showRemoveIcon
            sortable
            cellRenderer={this._renderCell}
            onRemoveClicked={item => {
              this._showArchivedDialog(item);
            }}
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

  render() {
    const { classes, invoices, invoicesLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
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

const Styled = withStyles(UnpaidInvoicesTabStyles)(PaidInvoicesTab);

const PaidTabContainer = (props: any) => (
  <TabContainer {...props} invoiceType='paid'>
    {childProps => <Styled {...childProps} />}
  </TabContainer>
);

export default PaidTabContainer;
