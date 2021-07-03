import {
  Button,
  Dropdown,
  ErrorBoundary,
  Loading,
  ScrollObserver,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import cx from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pluralize from 'pluralize';
import React, { Component } from 'react';
import URL from 'src/helpers/urls';
import { ActiveTimesheetsStyles } from './styles';
import TabContainer from './TabContainer';
import TimesheetBlock from './TimesheetBlock';
import TimesheetNotificationModal from './TimesheetNotificationModal';
import ViewEntriesModal from './ViewEntriesModal';

type Props = {
  actions: Record<string, any>;
  timeSheetData: any;
  toggleViewEntriesModal: Function;
  showViewEntriesModal: boolean;
  showingEntriesInModal: Array<any>;
  users: Array<any>;
  onlyMyTimesheet: boolean;
  addFilteredUser: Function;
  removeFilteredUser: Function;
  timeSheetsLoading: boolean;
  loadMore: Function;
  history: any;
  theme: any;
  classes: any;
};

type State = {
  allHide: boolean;
  showNotificationModal: boolean;
  notifiedTimesheetId: string | null;
};

class ActiveTimesheets extends Component<Props, State> {
  state: any = {
    allHide: false,
    showNotificationModal: false,
    notifiedTimesheetId: null,
  };

  _showTimesheetNotificationModal = (timesheetId) => {
    this.setState({
      notifiedTimesheetId: timesheetId,
      showNotificationModal: true,
    });
  };

  _closeTimesheetNotificationModal = () => {
    this.setState({
      notifiedTimesheetId: null,
      showNotificationModal: false,
    });
  };

  _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Timesheets'
        subtitle='Below is a list of all your active timesheets.'
        renderLeftPart={() => (
          <Button
            title='Create new timesheet'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_TIMESHEETS());
            }}
          />
        )}
      />
    );
  }

  _renderFilterUserDropdown() {
    const {
      onlyMyTimesheet,
      users,
      addFilteredUser,
      removeFilteredUser,
      classes,
    } = this.props;
    if (onlyMyTimesheet) {
      return null;
    }
    return (
      <div className={classes.dropdownWrapper}>
        <Dropdown
          label='Filter Users'
          items={users.map((user) => {
            const name = user.firstName + ' ' + user.lastName;
            return { label: name, value: user };
          })}
          multiple
          onChange={(item, index, isSelected) => {
            if (isSelected) {
              addFilteredUser(item.value);
            } else {
              removeFilteredUser(item.value);
            }
          }}
        />
      </div>
    );
  }

  _renderNoTimesheets() {
    const { classes } = this.props;
    return (
      <div className={classes.noTimesheetsWrapper}>
        <div className={classes.noTimesheetsMessageWrapper}>
          <div className={classes.noTimesheetsMessage}>
            There are no active Timesheets. <br />
            Let’s start by creating a new Timesheet.
          </div>
        </div>
      </div>
    );
  }

  _renderTimesheets() {
    const {
      classes,
      history,
      timeSheetData,
      toggleViewEntriesModal,
      loadMore,
    } = this.props;
    const { allHide } = this.state;
    return (
      <ScrollObserver
        onBottomReached={() => loadMore()}
        onBottomReachedThreshold={500}
      >
        <div className={classes.timesheetsContainer}>
          <div className={classes.expandHideWrapper}>
            <span
              className={cx(classes.expandHideLabel, { active: allHide })}
              onClick={() => {
                this.setState({ allHide: false });
              }}
            >
              Expand
            </span>
            <span className={classes.slash}>/</span>
            <span
              className={cx(classes.expandHideLabel, { active: !allHide })}
              onClick={() => {
                this.setState({ allHide: true });
              }}
            >
              Hide
            </span>
          </div>
          {Object.keys(timeSheetData).map((key) => {
            const timesheet: any = timeSheetData[key];
            const project = get(timesheet, 'project') || {};
            const service = get(timesheet, 'service') || {};
            const customer = get(timesheet, 'customer') || {};

            let unit = 'hour';
            if (service.timeBasedType === 'DAY') {
              unit = 'day';
            }

            return (
              <div className={classes.timesheet} key={timesheet.id}>
                <TimesheetBlock
                  type={!isEmpty(timesheet.project) ? 'project' : 'dao'}
                  collapsed={allHide}
                  serviceName={service.name}
                  daoName={customer.name}
                  project={project.name}
                  rows={Object.keys(timesheet.rows).map((rowKey) => {
                    const row = timesheet.rows[rowKey];
                    const user = get(row, 'user', {});
                    const firstName = user.firstName;
                    const lastName = user.lastName;
                    return {
                      id: row.id,
                      user: `${firstName} ${lastName}`,
                      period: `${row.startsAt} - ${row.endsAt}`,
                      status: row.status,
                      hours: `${row.hours} ${pluralize(unit, row.hours)}`,
                      totalHours: row.hours,
                      startsAt: row.startsAtFormatted,
                      entries: row.entries,
                    };
                  })}
                  onCellClick={(e, { row, column }) => {
                    if (column.id === 'email') {
                      this._showTimesheetNotificationModal(row.id);
                    } else if (column.id === 'view') {
                      toggleViewEntriesModal(true, row.entries);
                    } else {
                      history.push(URL.REVIEW_TIMESHEET({ id: row.id }));
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </ScrollObserver>
    );
  }

  _renderTimesheetNotificationModal() {
    const { showNotificationModal, notifiedTimesheetId } = this.state;
    return (
      <TimesheetNotificationModal
        visible={showNotificationModal}
        timesheetId={notifiedTimesheetId}
        onClose={this._closeTimesheetNotificationModal}
      />
    );
  }

  _renderViewEntriesModal() {
    const {
      showViewEntriesModal,
      toggleViewEntriesModal,
      showingEntriesInModal,
    } = this.props;
    if (!showViewEntriesModal) {
      return null;
    }
    return (
      <ViewEntriesModal
        visible={showViewEntriesModal}
        onClose={() => {
          toggleViewEntriesModal(false);
        }}
        entries={showingEntriesInModal}
      />
    );
  }

  render() {
    const { classes, timeSheetData, timeSheetsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {this._renderSectionHeading()}
          {this._renderFilterUserDropdown()}
          {timeSheetsLoading && <Loading />}
          {!timeSheetsLoading &&
            isEmpty(timeSheetData) &&
            this._renderNoTimesheets()}
          {!isEmpty(timeSheetData) && this._renderTimesheets()}
        </div>
        {this._renderTimesheetNotificationModal()}
        {this._renderViewEntriesModal()}
      </ErrorBoundary>
    );
  }
}

const StyledComponent = withStyles(ActiveTimesheetsStyles)(ActiveTimesheets);

type IProps = {
  actions: Record<string, any>;
  onlyMyTimesheet: boolean;
};

const ActiveTimesheetsTab = (props: IProps) => (
  <TabContainer {...props} timesheet_type='active'>
    {(childProps) => <StyledComponent {...childProps} />}
  </TabContainer>
);

export default ActiveTimesheetsTab;
