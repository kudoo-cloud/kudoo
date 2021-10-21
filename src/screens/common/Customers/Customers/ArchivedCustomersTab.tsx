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
import React, { Component } from 'react';
import URL from 'src/helpers/urls';
import styles, { ActiveCustomersStyles } from './styles';
import TabContainer from './TabContainer';

type Props = {
  actions: any;
  customers: Array<any>;
  onSortRequested: Function;
  onUnarchiveCustomer: Function;
  onRemoveCustomer: Function;
  theme: any;
  history: any;
  classes: any;
  columns: any;
  onSearchCustomer: any;
};
type State = {};

class ArchivedCustomers extends Component<Props, State> {
  _renderSectionHeading() {
    const { theme } = this.props;
    return (
      <SectionHeader
        title='Archived customers'
        subtitle='Below is a list of all archived customers. Activate a customer by selecting from the list below.'
        renderLeftPart={() => (
          <Button
            title='Delete list permanently'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.secondary.color2}
            onClick={this._showDeleteAllCustomerDialog}
          />
        )}
      />
    );
  }

  _showDeleteAllCustomerDialog = () => {
    const { history, theme } = this.props;
    const title = 'Permanently delete all archived customers?';
    const description = (
      <div>
        <div>
          You are trying to permanently delete all archived customers from this
          account. This action is not reversable.
        </div>
        <br />
        <div>Are you sure you want to delete all archived customers?</div>
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
        title: 'Delete All',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          history.push(URL.ACTIVE_CUSTOMERS());
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

  _showDeleteCustomerDialog = (customer) => {
    const { theme } = this.props;
    const title = 'Permanently delete customer?';
    const description = (
      <div>
        <div>
          You are trying to permanently delete a customer from this account.
          This action is not reversable.
        </div>
        <br />
        <div>Are you sure you want to delete this customer?</div>
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
        title: 'Delete Customer',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onRemoveCustomer(customer);
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

  _showActivateCustomerDialog = (customer) => {
    const { theme } = this.props;
    const title = 'Activate customer?';
    const description = (
      <div>
        <div>
          You are trying to activate a customer from the archived list. This
          will add the customer to your customers list.
        </div>
        <br />
        <div>Are you sure you want to activate this customer?</div>
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
        title: 'Activate customer',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onUnarchiveCustomer(customer);
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

  _renderCustomers() {
    const { classes, customers, columns, onSortRequested, onSearchCustomer } =
      this.props;
    return (
      <div className={classes.customersContainer}>
        <Grid item xs={12} sm={6}>
          <SearchInput
            classes={{ component: classes.searchInput }}
            placeholder={'Search by typing a dao name'}
            items={[]}
            onSearch={onSearchCustomer}
          />
        </Grid>
        <Table
          columnData={columns}
          data={customers}
          sortable
          stripe={false}
          showAddIcon={true}
          onRequestSort={onSortRequested}
          onRemoveClicked={this._showDeleteCustomerDialog}
          onAddClicked={this._showActivateCustomerDialog}
          cellStyler={(row, column) => {
            if (column.id === 'money_made') {
              return classes.greenCell;
            }
            return '';
          }}
        />
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.tabContent}>
          {this._renderSectionHeading()}
          {this._renderCustomers()}
        </div>
      </ErrorBoundary>
    );
  }
}

const ArchivedCustomersStyled = withStyles(
  composeStyles(styles, ActiveCustomersStyles),
)(ArchivedCustomers);

const ArchivedCustomersTabContainer = (props: Props) => (
  <TabContainer {...props} type='archived-customers'>
    {(childProps) => <ArchivedCustomersStyled {...childProps} />}
  </TabContainer>
);

export default ArchivedCustomersTabContainer;
