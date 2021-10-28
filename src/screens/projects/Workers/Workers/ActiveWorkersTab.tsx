import {
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import URL from 'src/helpers/urls';
import styles, { ActiveWorkersStyles } from './styles';
import TabContainer from './TabContainer';

type Props = {
  actions: any;
  workers?: Array<any>;
  onSortRequested?: Function;
  onArchiveWorker?: Function;
  workersLoading?: boolean;
  classes?: any;
  theme?: any;
  columns?: any;
};
type State = {};

class ActiveWorkers extends Component<Props, State> {
  data: Array<Record<string, any>>;

  _renderSectionHeading() {
    return (
      <SectionHeader
        title='Workers'
        subtitle='Below is a list of all your workers.'
      />
    );
  }

  _renderNoActiveWorkers() {
    const { classes } = this.props;
    return (
      <div className={classes.noWorkersWrapper}>
        <div className={classes.noWorkerMessageWrapper}>
          <div className={classes.noWorkerMessage}>
            You have not created any workers yet.
            <br />
          </div>
        </div>
      </div>
    );
  }

  _showArchiveDialog = (worker) => {
    const { theme } = this.props;
    const title = `Archive ${worker.name}?`;
    const description = (
      <div>
        <div>Are you sure you want to archive this worker?</div>
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
          this.props.onArchiveWorker(worker);
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
          to={URL.WORKER_DETAILS({ id: row.id })}
          className={classes.workerNameCell}
        >
          {ele}
        </Link>
      );
    }
    return ele;
  };

  _renderWorkers() {
    const { classes, workers, columns, onSortRequested } = this.props;

    return (
      <div className={classes.workersContainer}>
        <Table
          columnData={columns}
          data={workers}
          sortable={false}
          stripe
          onRequestSort={onSortRequested}
          showRemoveIcon={true}
          onRemoveClicked={this._showArchiveDialog}
          cellRenderer={this._renderCell}
        />
      </div>
    );
  }

  render() {
    const { classes, workers, workersLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.tabContent}>
          {this._renderSectionHeading()}
          {workersLoading && <Loading />}
          {!workersLoading && isEmpty(workers) && this._renderNoActiveWorkers()}
          {!isEmpty(workers) && this._renderWorkers()}
        </div>
      </ErrorBoundary>
    );
  }
}

const ActiveWorkersStyled = withStyles(
  composeStyles(styles, ActiveWorkersStyles),
)(ActiveWorkers);

const ActiveWorkersTabContainer = (props: Props) => (
  <TabContainer {...props} type='active-workers'>
    {(childProps) => <ActiveWorkersStyled {...childProps} />}
  </TabContainer>
);

export default ActiveWorkersTabContainer;
