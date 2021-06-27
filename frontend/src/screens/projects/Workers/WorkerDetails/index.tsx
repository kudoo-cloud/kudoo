import {
  Checkbox,
  SectionHeader,
  Table,
  Tabs,
  withStyles,
} from '@kudoo/components';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
// import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { compose } from 'recompose';
import { TIMESHEET_STATUS } from 'src/helpers/constants';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions: Record<string, any>;
  updateTrader: Function;
  profile: Record<string, any>;
  timeSheets: Record<string, any>;
  user: Record<string, any>;
  approveTimesheet: Function;
  history?: any;
  classes?: any;
};
type State = {
  columnData: Array<Record<string, any>>;
  showingTimesheetType: Record<string, any>;
  approvingTimesheets: any;
};

class WorkerDetails extends Component<Props, State> {
  public static defaultProps = {
    user: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
    approveTimesheet: () => ({}),
    timeSheets: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      columnData: [
        { id: 'timesheetNumber', label: 'Timesheet number' },
        { id: 'service', label: 'Service' },
        { id: 'timesheet_period', label: 'Timesheet period' },
        { id: 'status', label: 'Status' },
        { id: 'duration', label: 'Duration' },
        { id: 'tick', label: '' },
      ],
      showingTimesheetType: {
        [TIMESHEET_STATUS.FINALISED]: true,
        [TIMESHEET_STATUS.APPROVED]: true,
        [TIMESHEET_STATUS.INVOICED]: true,
      },
      approvingTimesheets: {},
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Workers');
  }

  _getTimesheetRows = () => {
    const data = {};
    const props = this.props;
    const timeSheets = get(props, 'timeSheets.data', []);
    for (let index = 0; index < timeSheets.length; index++) {
      const timesheetData = timeSheets[index];
      const entries = get(timesheetData, 'timeSheetEntries', []);
      for (let j = 0; j < entries.length; j++) {
        const entry = entries[j];
        const id = `${timesheetData.id}:${entry.service.id}`;
        let timesheet = data[id] || {};
        const hours = (timesheet.hours || 0) + Number(entry.duration || 0);
        timesheet.entriesId = timesheet.entriesId || [];
        timesheet.entriesId = [...timesheet.entriesId, entry.id];
        const startsAt = moment(timesheetData.startsAt).format('DD MMM YYYY');
        const endsAt = moment(timesheetData.endsAt).format('DD MMM YYYY');
        timesheet = {
          ...timesheet,
          timeSheetId: timesheetData.id,
          hours,
          period: `${startsAt} - ${endsAt}`,
          service: entry.service,
          status: entry.isInvoiced ? 'INVOICED' : timesheetData.status,
          timesheetNumber: timesheetData.id,
        };

        data[id] = timesheet;
      }
    }

    const tableData = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        const serviceType = get(value, 'service.timeBasedType');
        let durationType = 'hours';
        if (serviceType === 'DAY') {
          durationType = 'days';
        }
        const row = {
          id: key,
          status: value.status,
          timeSheetId: value.timeSheetId,
          timesheetNumber: value.timesheetNumber,
          entriesId: value.entriesId,
          serviceId: get(value, 'service.id'),
          service: get(value, 'service.name'),
          timesheet_period: value.period,
          duration: `${value.hours} ${durationType}`,
        };
        if (
          this.state.showingTimesheetType[TIMESHEET_STATUS.FINALISED] &&
          row.status === TIMESHEET_STATUS.FINALISED
        ) {
          tableData.push(row);
        } else if (
          this.state.showingTimesheetType[TIMESHEET_STATUS.APPROVED] &&
          row.status === TIMESHEET_STATUS.APPROVED
        ) {
          tableData.push(row);
        } else if (
          this.state.showingTimesheetType[TIMESHEET_STATUS.INVOICED] &&
          row.status === TIMESHEET_STATUS.INVOICED
        ) {
          tableData.push(row);
        }
      }
    }
    return tableData;
  };

  _approveTimesheet = (row) => async () => {
    try {
      this.setState((prevState) => ({
        approvingTimesheets: {
          ...prevState.approvingTimesheets,
          [row.id]: true,
        },
      }));
      await this.props.approveTimesheet({
        where: { id: row.timeSheetId },
        data: {
          status: TIMESHEET_STATUS.APPROVED,
        },
      });
      showToast(null, 'Timesheet Approved');
    } catch (error) {
      showToast(error.toString());
    } finally {
      this.setState((prevState) => ({
        approvingTimesheets: {
          ...prevState.approvingTimesheets,
          [row.id]: false,
        },
      }));
    }
  };

  _toggleShowingTimesheetType = (type) => (checked) => {
    this.setState((prevState) => ({
      showingTimesheetType: {
        ...prevState.showingTimesheetType,
        [type]: checked,
      },
    }));
  };

  _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'All Workers',
            onClick: () => {
              this.props.history.push(URL.ACTIVE_WORKERS());
            },
          },
          {
            label: 'Archived',
            onClick: () => {
              this.props.history.push(URL.ARCHIVED_WORKERS());
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={false}
      />
    );
  }

  _renderDetailsCards() {
    const { classes, user } = this.props;
    return (
      <div className={classes.detailsCardsWrapper}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'green h1')}>
                {get(user, 'data.firstName')} {get(user, 'data.lastName')}
              </div>
              <div className={cx(classes.detailCardContent, 'withBG h2')}>
                <div className={classes.keyValue} style={{ marginTop: 0 }}>
                  {get(user, 'data.email')}
                </div>
                <div className={classes.keyValue}>
                  {get(user, 'data.phone')}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={3}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'blue h2')}>
                Uninvoiced Timesheets
              </div>
              <div className={cx(classes.detailCardContent, 'h1')}>-</div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderCell = (row, column, ele) => {
    const { classes } = this.props;
    const { approvingTimesheets } = this.state;
    if (column.id === 'tick') {
      if (row.status === TIMESHEET_STATUS.APPROVED) {
        return null;
      }
      if (row.status === TIMESHEET_STATUS.INVOICED) {
        return null;
      }
      return (
        <div className={classes.tickCell}>
          <ButtonBase
            onClick={this._approveTimesheet(row)}
            disabled={approvingTimesheets[row.id]}
          >
            <Tooltip
              title='Mark as approved'
              animation='fade'
              position='top'
              arrow
              // arrowType="round"
              trigger={'mouseenter focus' as any}
            >
              <span className={classes.tickIcon}>
                <i
                  className={cx('fa', {
                    'fa-check': !approvingTimesheets[row.id],
                    'fa-spinner fa-spin': approvingTimesheets[row.id],
                  })}
                />
              </span>
            </Tooltip>
          </ButtonBase>
        </div>
      );
    }
    return ele;
  };

  _renderTimesheetSection() {
    const { classes, timeSheets = {} } = this.props;
    const { showingTimesheetType } = this.state;
    const rows = this._getTimesheetRows();

    return (
      <div className={classes.section}>
        <SectionHeader
          title='Timesheets'
          subtitle={`Below is a list of all selected timesheets.`}
          renderLeftPart={() => (
            <div className={classes.checkboxWrapper}>
              <Checkbox
                label='Finalised'
                classes={{ component: classes.checkbox }}
                onChange={this._toggleShowingTimesheetType(
                  TIMESHEET_STATUS.FINALISED,
                )}
                value={showingTimesheetType[TIMESHEET_STATUS.FINALISED]}
              />
              <Checkbox
                label='Approved'
                classes={{ component: classes.checkbox }}
                onChange={this._toggleShowingTimesheetType(
                  TIMESHEET_STATUS.APPROVED,
                )}
                value={showingTimesheetType[TIMESHEET_STATUS.APPROVED]}
              />
              <Checkbox
                label='Invoiced'
                classes={{ component: classes.checkbox }}
                onChange={this._toggleShowingTimesheetType(
                  TIMESHEET_STATUS.INVOICED,
                )}
                value={showingTimesheetType[TIMESHEET_STATUS.INVOICED]}
              />
            </div>
          )}
        />
        <Table
          columnData={this.state.columnData}
          data={rows}
          sortable={false}
          stripe={false}
          showRemoveIcon={false}
          classes={{ component: classes.timesheetTable }}
          cellRenderer={this._renderCell}
          loading={timeSheets.loading}
          onBottomReachedThreshold={100}
          onBottomReached={() => {
            if (!timeSheets.loading) {
              timeSheets.loadNextPage();
            }
          }}
        />
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <SelectedCompany
        onChange={() => {
          this.props.history.push(URL.WORKERS());
        }}
      >
        <div className={classes.page}>
          {this._renderSecondaryTabs()}
          <div className={classes.content}>
            {this._renderDetailsCards()}
            {this._renderTimesheetSection()}
          </div>
        </div>
      </SelectedCompany>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withCompany(
  //   ({ profile }) => ({
  //     id: get(profile, 'selectedCompany.id', ''),
  //   }),
  //   ({ data, ownProps }) => {
  //     const companyMemebers = get(data, 'company.companyMembers') || [];
  //     const userId = get(ownProps, 'match.params.id');
  //     const member = find(companyMemebers, ({ user }) => user.id === userId);
  //     return {
  //       user: {
  //         data: get(member, 'user', {}),
  //         loading: data.loading,
  //       },
  //     };
  //   },
  // ),
  // withTimeSheets((props) => {
  //   return {
  //     variables: {
  //       first: 10,
  //       where: {
  //         isArchived: false,
  //         status_not: TIMESHEET_STATUS.DRAFT,
  //         user: {
  //           id: get(props, 'match.params.id'),
  //         },
  //       },
  //       orderBy: 'startsAt_DESC',
  //     },
  //   };
  // }),
  // withUpdateTimeSheet(() => ({ name: 'approveTimesheet' })),
)(WorkerDetails);
