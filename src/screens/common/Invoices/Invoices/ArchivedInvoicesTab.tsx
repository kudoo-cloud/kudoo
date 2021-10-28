import {
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import clone from 'lodash/clone';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import URL from 'src/helpers/urls';
import { UnpaidInvoicesTabStyles } from './styles';
import TabContainer from './TabContainer';

type Props = {
  actions: any;
  invoices: Array<any>;
  unArchiveInvoice: Function;
  onRequestSort: Function;
  invoicesLoading: boolean;
  onLoadMore: Function;
  theme: any;
  classes: any;
};
type State = {
  headerData: any;
};

class ArchivedInvoicesTab extends Component<Props, State> {
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

  _showUnArchivedDialog = (invoice) => {
    const { theme } = this.props;
    const title = 'Unarchive Invoice?';
    const description = (
      <div>Are you sure you want to unarchive the invoice ?</div>
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
        title: 'Unarchive Invoice',
        onClick: () => {
          this.props.unArchiveInvoice(invoice);
          this.props.actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
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
        title={'Archived invoices'}
        subtitle='Below is a list of all your invoice which has been archived.'
      />
    );
  }

  _renderNoInvoices() {
    const { classes } = this.props;
    return (
      <div className={classes.noInvoicesWrapper}>
        <div className={classes.noInvoicesMessageWrapper}>
          <div className={classes.noInvoiceMessage}>
            There are no archived invoices. <br />
          </div>
        </div>
      </div>
    );
  }

  _renderCell = (row, column, ele) => {
    const { classes } = this.props;
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
    } else if (column.id === 'total' || column.id === 'balance') {
      return <div className={classes.borderCell}>{row[column.id]}</div>;
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
            showAddIcon
            sortable
            cellRenderer={this._renderCell}
            onAddClicked={(item) => {
              this._showUnArchivedDialog(item);
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

const Styled = withStyles(UnpaidInvoicesTabStyles)(ArchivedInvoicesTab);

const ArchivedTabContainer = (props: any) => (
  <TabContainer {...props} invoiceType='archived'>
    {(childProps) => <Styled {...childProps} />}
  </TabContainer>
);

export default ArchivedTabContainer;
