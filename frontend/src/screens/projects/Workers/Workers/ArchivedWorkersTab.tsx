import React, { Component } from 'react';
import {
  Table,
  withStyles,
  composeStyles,
  SectionHeader,
  ErrorBoundary,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import TabContainer from './TabContainer';
import styles, { ActiveWorkersStyles } from './styles';

type Props = {
  actions: any;
  workers: Array<any>;
  onSortRequested: Function;
  onUnarchiveWorker: Function;
  onRemoveWorker: Function;
  workersLoading: boolean;
  history: any;
  theme: any;
  classes: any;
  columns: any;
};
type State = {};

class ArchivedWorkers extends Component<Props, State> {
  _renderSectionHeading() {
    return (
      <SectionHeader
        title='Archived workeres'
        subtitle='Below is a list of all archived workers. Activate a worker by selecting from the list below.'
      />
    );
  }

  _showDeleteAllWorkerDialog = () => {
    const { history, theme } = this.props;
    const title = 'Permanently delete all archived workers?';
    const description = (
      <div>
        <div>
          You are trying to permanently delete all archived workers from this
          account. This action is not reversable.
        </div>
        <br />
        <div>Are you sure you want to delete all archived workers?</div>
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
          history.push(URL.ACTIVE_WORKERS());
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

  _showDeleteWorkerDialog = worker => {
    const { theme } = this.props;
    const title = 'Permanently delete worker?';
    const description = (
      <div>
        <div>
          You are trying to permanently delete a worker from this account. This
          action is not reversable.
        </div>
        <br />
        <div>Are you sure you want to delete this worker?</div>
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
        title: 'Delete worker',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onRemoveWorker(worker);
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

  _showActivateWorkerDialog = worker => {
    const { theme } = this.props;
    const title = 'Activate worker?';
    const description = (
      <div>
        <div>
          You are trying to activate a worker from the archived list. This will
          add the worker to your workers list.
        </div>
        <br />
        <div>Are you sure you want to activate this worker?</div>
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
        title: 'Activate worker',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onUnarchiveWorker(worker);
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

  _renderWorkers() {
    const {
      classes,
      workers,
      columns,
      onSortRequested,
      workersLoading,
    } = this.props;
    return (
      <div className={classes.workersContainer}>
        <Table
          columnData={columns}
          data={workers}
          sortable={false}
          stripe
          showAddIcon={true}
          onRequestSort={onSortRequested}
          onRemoveClicked={this._showDeleteWorkerDialog}
          onAddClicked={this._showActivateWorkerDialog}
          loading={workersLoading}
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
          {this._renderWorkers()}
        </div>
      </ErrorBoundary>
    );
  }
}

const ArchivedWorkersStyled = withStyles(
  composeStyles(styles, ActiveWorkersStyles)
)(ArchivedWorkers);

const ArchivedWorkersTabContainer = (props: Props) => (
  <TabContainer {...props} type='archived-workers'>
    {childProps => <ArchivedWorkersStyled {...childProps} />}
  </TabContainer>
);

export default ArchivedWorkersTabContainer;
