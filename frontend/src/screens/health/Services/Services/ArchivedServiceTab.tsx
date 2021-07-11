import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  ToggleButton,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { Trans } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import styles, { ActiveServicesStyles as ASStyles } from './styles';
import withTabContainer from './TabContainer';

// Presentational Component
type Props = {
  actions: any;
  services: Array<any>;
  fetchingServices: boolean;
  totalServices: number;
  onSortRequested: Function;
  goToCreateService: () => void;
  onRemoveServiceClicked: Function;
  onUnarchiveServiceClicked: Function;
  onTypeChange: Function;
  onLoadMore: Function;
  theme: any;
  columns: any;
  classes: any;
};
class ArchivedServiceTab extends Component<Props, {}> {
  _renderSectionHeading() {
    const { theme } = this.props;
    return (
      <SectionHeader
        title='Service Templates'
        subtitle='Below is a list of all your archived services.'
        renderLeftPart={() => (
          <Button
            title='Create New Service'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={this.props.goToCreateService}
          />
        )}
      />
    );
  }

  _showDeleteDialog = (service) => {
    const { theme } = this.props;
    const title = 'Permanently delete service?';
    const description = (
      <div>
        <div>
          You are trying to permanently delete a service. This action is not
          reversable.
        </div>
        <br />
        <div>Are you sure you want to delete this service?</div>
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
        title: 'Delete Service',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onRemoveServiceClicked(service);
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

  _showUnarchivedDialog = (service) => {
    const { theme } = this.props;
    const title = 'Activate service?';
    const description = (
      <div>
        <div>Are you sure you want to activate this service?</div>
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
        title: 'Activate Service',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onUnarchiveServiceClicked(service);
        },
      },
    ];
    const titleColor = theme.palette.primary.color1;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'totalAmount') {
      return (
        <div className={classes.amountCell}>
          <Trans id='currency-symbol' /> {row[cell.id]}
        </div>
      );
    }
    return ele;
  };

  _renderServices() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.servicesContainer}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <ToggleButton
              labels={['All', 'Fixed Billing', 'Timed Billing']}
              selectedIndex={0}
              activeColor={theme.palette.primary.color1}
              onChange={this.props.onTypeChange}
            />
          </Grid>
        </Grid>
        <Table
          columnData={this.props.columns}
          data={this.props.services}
          sortable
          showAddIcon
          onRequestSort={this.props.onSortRequested}
          onRemoveClicked={this._showDeleteDialog}
          onAddClicked={this._showUnarchivedDialog}
          cellRenderer={this._renderCell}
          loading={this.props.fetchingServices}
          onBottomReachedThreshold={500}
          onBottomReached={() => {
            if (!this.props.fetchingServices) {
              this.props.onLoadMore();
            }
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
          {this._renderServices()}
        </div>
      </ErrorBoundary>
    );
  }
}
const StyledComponent = withStyles(composeStyles(styles, ASStyles))(
  ArchivedServiceTab,
);

export default withTabContainer({ type: 'archived-services' })(StyledComponent);
