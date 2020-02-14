import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Trans } from '@lingui/react';
import {
  Table,
  withStyles,
  composeStyles,
  Button,
  SectionHeader,
  ErrorBoundary,
  ToggleButton,
  withStylesProps,
} from '@kudoo/components';
import withTabContainer from './TabContainer';
import styles, { ActiveServicesStyles as ASStyles } from './styles';

// Presentational Component
type Props = {
  actions: any;
  services: Array<any>;
  fetchingServices: boolean;
  totalServices: number;
  onSortRequested: Function;
  goToCreateService: Function;
  goToEditService: Function;
  onArchiveServiceClicked: Function;
  onTypeChange: Function;
  onLoadMore: Function;
  theme: any;
  classes: any;
  columns: any;
};
class ActiveServices extends Component<Props, {}> {
  _showArchiveDialog = service => {
    const { theme } = this.props;
    const title = 'Archive service?';
    const description = (
      <div>
        <div>Are you sure you want to archive this service?</div>
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
        title: 'Archive Service',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onArchiveServiceClicked(service);
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
    const { theme } = this.props;
    return (
      <SectionHeader
        title='Service Templates'
        subtitle='Below is a list of all your saved services. These services can be used to quickly create projects, invoices and timesheets.'
        renderLeftPart={() => (
          <Button
            title='Create New Service'
            id='create-service'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={this.props.goToCreateService}
          />
        )}
      />
    );
  }

  _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'name') {
      return (
        <div
          onClick={() => {
            this.props.goToEditService(row.id);
          }}
          className={classes.nameValueCell}>
          {ele}
        </div>
      );
    } else if (cell.id === 'totalAmount') {
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
          onRequestSort={this.props.onSortRequested}
          onRemoveClicked={this._showArchiveDialog}
          cellRenderer={this._renderCell}
          loading={this.props.fetchingServices}
          onBottomReachedThreshold={500}
          onBottomReached={el => {
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
  ActiveServices
);

export default withTabContainer({ type: 'active-services' })(StyledComponent);
