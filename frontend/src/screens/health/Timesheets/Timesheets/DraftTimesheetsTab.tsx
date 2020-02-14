import React, { Component } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import pluralize from 'pluralize';
import {
  withStyles,
  Button,
  Dropdown,
  SectionHeader,
  ErrorBoundary,
  withRouterProps,
  withStylesProps,
  Loading,
  ScrollObserver,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import TimesheetBlock from './TimesheetBlock';
import TabContainer from './TabContainer';
import { ActiveTimesheetsStyles } from './styles';

type Props = {
  actions: any;
  timeSheetData: any;
  showArchiveDialog: Function;
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
};

class DraftTimesheets extends Component<Props, State> {
  state = {
    allHide: false,
  };

  _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Timesheets'
        subtitle='Below is a list of all your draft timesheets.'
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
            There are no draft Timesheets. <br />
            Let’s start by creating a new Timesheet.
          </div>
        </div>
      </div>
    );
  }

  _renderTimesheets() {
    const { classes, history, timeSheetData, loadMore } = this.props;
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
                  showRemoveIcon
                  showViewIcon={false}
                  rows={Object.keys(timesheet.rows).map(rowKey => {
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
                    };
                  })}
                  onCellClick={(e, { row, column }) => {
                    history.push(URL.EDIT_TIMESHEETS({ id: row.id }));
                  }}
                  onRemoveClicked={this.props.showArchiveDialog}
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

const StyledComponent = withStyles(ActiveTimesheetsStyles)(DraftTimesheets);

type IProps = {
  actions: Record<string, any>;
  onlyMyTimesheet: boolean;
};

const DraftTimesheetsTab = (props: IProps) => (
  <TabContainer {...props} timesheet_type='draft'>
    {childProps => <StyledComponent {...childProps} />}
  </TabContainer>
);

export default DraftTimesheetsTab;
