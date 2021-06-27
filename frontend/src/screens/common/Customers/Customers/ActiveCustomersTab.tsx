import {
  Button,
  ErrorBoundary,
  SearchInput,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import URL from 'src/helpers/urls';
import styles, { ActiveCustomersStyles } from './styles';
import TabContainer from './TabContainer';

type Props = {
  actions: any;
  customers: Array<any>;
  // columns: Array<ColumnFlowType>,
  onSortRequested: Function;
  onArchiveCustomer: Function;
  history: any;
  theme: any;
  classes: any;
  columns: any;
  onSearchCustomer: any;
};
type State = {};

class ActiveCustomers extends Component<Props, State> {
  // data: Array<Object>;

  _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Customer Index'
        subtitle='Below is a list of all your saved customers.'
        renderLeftPart={() => (
          <Button
            title='Create Customer'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_CUSTOMER());
            }}
          />
        )}
      />
    );
  }

  _renderNoActiveCustomers() {
    const { classes } = this.props;
    return (
      <div className={classes.noCustomersWrapper}>
        <div className={classes.noCustomerMessageWrapper}>
          <div className={classes.noCustomerMessage}>
            You have not created any customers yet.
            <br />
            Let’s start by creating your first customer.
          </div>
        </div>
      </div>
    );
  }

  _showArchiveDialog = (customer) => {
    const { theme } = this.props;
    const title = `Archive ${customer.name}?`;
    const description = (
      <div>
        <div>Are you sure you want to archive this customer?</div>
      </div>
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
        title: 'Archive',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onArchiveCustomer(customer);
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

  _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'name') {
      return (
        <Link
          to={URL.CUSTOMER_DETAILS({ id: row.id })}
          className={classes.customerNameCell}
        >
          {ele}
        </Link>
      );
    }
    return ele;
  };

  _renderCustomers() {
    const { classes, customers, columns, onSortRequested, onSearchCustomer } =
      this.props;
    return (
      <div className={classes.customersContainer}>
        <Grid item xs={12} sm={6}>
          <SearchInput
            classes={{ component: classes.searchInput }}
            placeholder={'Search by typing a company name'}
            items={[]}
            onSearch={onSearchCustomer}
          />
        </Grid>
        <Table
          columnData={columns}
          data={customers}
          sortable
          stripe={false}
          onRequestSort={onSortRequested}
          showRemoveIcon={true}
          onRemoveClicked={this._showArchiveDialog}
          cellRenderer={this._renderCell}
        />
      </div>
    );
  }

  render() {
    const { classes, customers } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.tabContent}>
          {this._renderSectionHeading()}
          {isEmpty(customers) && this._renderNoActiveCustomers()}
          {!isEmpty(customers) && this._renderCustomers()}
        </div>
      </ErrorBoundary>
    );
  }
}

const ActiveCustomersStyled = withStyles(
  composeStyles(styles, ActiveCustomersStyles),
)(ActiveCustomers);

const ActiveCustomersTabContainer = (props: Props) => (
  <TabContainer {...props} type='active-customers'>
    {(childProps) => <ActiveCustomersStyled {...childProps} />}
  </TabContainer>
);

export default ActiveCustomersTabContainer;
