import React, { Component } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import pluralize from 'pluralize';
import {
  withStyles,
  Dropdown,
  SectionHeader,
  ErrorBoundary,
  withRouterProps,
  withStylesProps,
  Loading,
  ScrollObserver,
} from '@kudoo/components';
import TimesheetBlock from './TimesheetBlock';
import TabContainer from './TabContainer';
import { ActiveTimesheetsStyles } from './styles';

type Props = {
  actions: Record<string, any>;
  timeSheetData: any;
  showUnarchiveDialog: Function;
  users: Array<any>;
  onlyMyTimesheet: boolean;
  addFilteredUser: Function;
  removeFilteredUser: Function;
  timeSheetsLoading: boolean;
  loadMore: Function;
  classes: any;
};
type State = {
  allHide: boolean;
};

class ArchivedTimesheets extends Component<Props, State> {
  state = {
    allHide: false,
  };

  _renderSectionHeading() {
    return (
      <SectionHeader
        title='Timesheets'
        subtitle='Below is a list of all your archived timesheets.'
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
          items={users.map(user => {
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
            There are no archived Timesheets.
          </div>
        </div>
      </div>
    );
  }

  _renderTimesheets() {
    const { classes, timeSheetData, loadMore } = this.props;
    const { allHide } = this.state;
    return (
      <ScrollObserver
        onBottomReached={() => loadMore()}
        onBottomReachedThreshold={500}>
        <div className={classes.timesheetsContainer}>
          <div className={classes.expandHideWrapper}>
            <span
              className={cx(classes.expandHideLabel, { active: allHide })}
              onClick={() => {
                this.setState({ allHide: false });
              }}>
              Expand
            </span>
            <span className={classes.slash}>/</span>
            <span
              className={cx(classes.expandHideLabel, { active: !allHide })}
              onClick={() => {
                this.setState({ allHide: true });
              }}>
              Hide
            </span>
          </div>
          {Object.keys(timeSheetData).map(key => {
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
                  type={!isEmpty(timesheet.project) ? 'project' : 'company'}
                  collapsed={allHide}
                  serviceName={service.name}
                  companyName={customer.name}
                  project={project.name}
                  showEmailIcon={false}
                  showViewIcon={false}
                  showAddIcon
                  rows={Object.keys(timesheet.rows).map(rowKey => {
                    const row = timesheet.rows[rowKey];
                    const user = get(row, 'user') || {};
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
                    };
                  })}
                  onAddClicked={this.props.showUnarchiveDialog}
                />
              </div>
            );
          })}
        </div>
      </ScrollObserver>
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
      </ErrorBoundary>
    );
  }
}

const StyledComponent = withStyles(ActiveTimesheetsStyles)(ArchivedTimesheets);

type IProps = {
  actions: Record<string, any>;
  onlyMyTimesheet: boolean;
};

const ArchivedTimesheetsTab = (props: IProps) => (
  <TabContainer {...props} timesheet_type='archived'>
    {childProps => <StyledComponent {...childProps} />}
  </TabContainer>
);

export default ArchivedTimesheetsTab;
