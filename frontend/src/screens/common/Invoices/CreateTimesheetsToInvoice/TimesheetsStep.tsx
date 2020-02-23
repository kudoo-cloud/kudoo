import React, { Component } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { withI18n, Trans } from '@lingui/react';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import get from 'lodash/get';
import idx from 'idx';
import moment from 'moment';
import { compose, withStateHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {
  Tooltip,
  withStyles,
  composeStyles,
  Button,
  SectionHeader,
  Table,
  ToggleSwitch,
  TextField,
  Checkbox,
  Dropdown,
  DatePicker,
  withStylesProps,
} from '@kudoo/components';
import { withTimeSheets, withCompany } from '@kudoo/graphql';
import * as actions from '@client/store/actions/createNewInvoice';
import { TIMESHEET_STATUS } from '@client/helpers/constants';
import { IReduxState } from '@client/store/reducers';
import styles, { timesheetsStepsStyle } from './styles';

type Props = {
  actions: Record<string, any>;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  newInvoice: Record<string, any>;
  timeSheets: Record<string, any>;
  timeSheetEntries: Record<string, any>;
  updateTableData: Function;
  updateShowTimesheetDetailsSelection: Function;
  i18n: any;
  profile: Record<string, any>;
  addSelectedUser: Function;
  removeSelectedUser: Function;
  filteredUsers: Array<any>;
  dropdownUsers: Array<any>;
  filteredFromDate: string;
  setFilteredFromDate: Function;
  filteredToDate: string;
  setFilteredToDate: Function;
  classes: any;
  theme: any;
};
type State = {
  timesheetsById: Record<string, any>;
  headerData: any;
};

class TimesheetsStep extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      headerData: [],
      timesheetsById: {},
    };
  }

  componentDidMount() {
    const { classes, i18n, newInvoice } = this.props;
    this.setState({
      headerData: [
        {
          id: 'service',
          label: 'Service',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'time_period',
          label: 'Time Period',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'status',
          label: 'Status',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'username',
          label: 'Username',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'quantity',
          label: 'Quantity',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'rate_str',
          label: 'Rate',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'amount_str',
          label: 'Amount',
          classes: {
            cellValueText: classes.smallTextCell,
          },
        },
        {
          id: 'gst_str',
          label: i18n._(`GST`),
          classes: {
            cellValueText: classes.smallTextCell,
            tableHeaderCellWrapper: classes.gstHeader,
          },
        },
      ],
    });
    const showTimesheetDetails = get(
      newInvoice,
      'timesheet.showTimesheetDetails',
      false
    );
    this._updateTimesheetsData(this.props, showTimesheetDetails);
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        idx(this.props, (_: any) => _.timeSheets.data),
        idx(prevProps, _ => _.timeSheets.data)
      )
    ) {
      const showTimesheetDetails = get(
        this.props,
        'newInvoice.timesheet.showTimesheetDetails',
        false
      );
      this._updateTimesheetsData(this.props, showTimesheetDetails);
    }
  }

  _getTimesheet = (props, id) => {
    const { timeSheets } = props;
    return find(idx(timeSheets, _ => _.data) || [], { id });
  };

  _updateTimesheetsData = (props, showTimesheetDetails) => {
    const { i18n, profile } = props;
    const country = get(profile, 'selectedCompany.country');
    const timeSheets = get(props.timeSheets, 'data', []);
    const data = {};
    const entries = timeSheets.reduce(
      (acc, ts) => [].concat(acc, ts.timeSheetEntries || []),
      []
    );

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      const timesheetData = this._getTimesheet(props, entry.timeSheet.id) || {};
      const id = `${entry.timeSheet.id}:${entry.service.id}`;
      let timesheet = data[id] || {};
      const hours = (timesheet.hours || 0) + parseFloat(entry.duration || 0);
      timesheet.entriesId = timesheet.entriesId || [];
      timesheet.entriesId = [...timesheet.entriesId, entry.id];
      const startsAt = moment(timesheetData.startsAt).format('DD MMM YYYY');
      const endsAt = moment(timesheetData.endsAt).format('DD MMM YYYY');
      const rows = timesheet.rows || [];
      rows.push(entry);

      timesheet = {
        ...timesheet,
        timeSheetId: entry.timeSheet.id,
        hours,
        period: `${startsAt} - ${endsAt}`,
        service: entry.service,
        user: timesheetData.user,
        status: timesheetData.status,
        rows,
      };

      data[id] = timesheet;
    }

    const tableData: any = [];
    if (showTimesheetDetails) {
      // we are showing timesheet entry listing
      Object.keys(data).map(key => {
        const value = data[key];
        const entries = value.rows || [];
        for (let index = 0; index < entries.length; index++) {
          const entry = entries[index];
          let amount_str = '-';
          let rate_str = '-';
          let gst_str = i18n._('currency-symbol') + '0';
          let amount = 0;
          let rate = 0;
          let gst = 0;
          const serviceType = get(value, 'service.timeBasedType');
          if (serviceType === 'HOUR' || serviceType === 'DAY') {
            rate = get(value, 'service.totalAmount', 0);
            amount = rate * Number(entry.duration || 0);
            gst = country === 'AU' ? amount * 0.1 : 0;
            gst_str = i18n._('currency-symbol') + `${gst}`;
            rate_str = i18n._('currency-symbol') + `${rate}`;
            amount_str = i18n._('currency-symbol') + `${amount}`;
          }
          const formattedEntryDate = moment(entry.date).format('DD MMM YYYY');
          tableData.push({
            id: entry.id,
            timeSheetId: value.timeSheetId,
            entriesId: value.entriesId,
            entryId: entry.id,
            serviceId: idx(value, _ => _.service.id),
            service: idx(value, _ => _.service.name),
            time_period: formattedEntryDate,
            entry_date: moment(entry.date).format('YYYY-MM-DD'),
            quantity: entry.duration,
            rate: rate,
            amount: amount,
            gst: gst,
            rate_str: rate_str,
            amount_str: amount_str,
            gst_str: gst_str,
            includeConsTax: idx(value, _ => _.service.includeConsTax),
            user: value.user,
            username: `${get(value, 'user.firstName')} ${get(
              value,
              'user.lastName'
            )}`,
            status: value.status,
            select: true,
          });
        }
      });
    } else {
      // we are showing timesheet listing
      const keys = Object.keys(data);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = data[key];
        if (!value.hours || Number(value.hours) <= 0) {
          continue;
        }
        let amount_str = '-';
        let rate_str = '-';
        let gst_str = i18n._('currency-symbol') + '0';
        let amount = 0;
        let rate = 0;
        let gst = 0;
        const serviceType = get(value, 'service.timeBasedType');
        if (serviceType === 'HOUR' || serviceType === 'DAY') {
          rate = get(value, 'service.totalAmount', 0);
          amount = rate * value.hours;
          gst = country === 'AU' ? amount * 0.1 : 0;
          gst_str = i18n._('currency-symbol') + `${gst}`;
          rate_str = i18n._('currency-symbol') + `${rate}`;
          amount_str = i18n._('currency-symbol') + `${amount}`;
        }

        tableData.push({
          id: key,
          timeSheetId: value.timeSheetId,
          entriesId: value.entriesId,
          serviceId: idx(value, _ => _.service.id),
          service: idx(value, _ => _.service.name),
          time_period: value.period,
          quantity: value.hours,
          rate: rate,
          amount: amount,
          gst: gst,
          rate_str: rate_str,
          amount_str: amount_str,
          gst_str: gst_str,
          includeConsTax: idx(value, _ => _.service.includeConsTax),
          user: value.user,
          username: `${get(value, 'user.firstName')} ${get(
            value,
            'user.lastName'
          )}`,
          status: value.status,
          select: true,
        });
      }
    }
    this.props.updateTableData('timesheet', tableData);
    this.setState({
      timesheetsById: data,
    });
  };

  _updateIncludeGst = row => e => {
    const { newInvoice } = this.props;
    const data = idx(newInvoice, (_: any) => _.timesheet);
    const tableData = idx(data, (_: any) => _.tableData) || [];
    const foundRow = find(tableData, { id: row.id });
    foundRow.includeConsTax = !row.includeConsTax;
    this.props.updateTableData('timesheet', [...tableData]);
  };

  _updateGstValue = row => value => {
    const { newInvoice, i18n } = this.props;
    const data = idx(newInvoice, (_: any) => _.timesheet);
    const tableData = idx(data, _ => _.tableData) || [];
    const foundRow: any = find(tableData, { id: row.id });
    foundRow.gst = Number(value) || 0;
    foundRow.gst_str = i18n._('currency-symbol') + `${value}`;
    this.props.updateTableData('timesheet', [...tableData]);
  };

  _updateSelectedTimesheet = row => e => {
    const { newInvoice } = this.props;
    const data = idx(newInvoice, (_: any) => _.timesheet);
    const tableData = idx(data, _ => _.tableData) || [];
    const foundRow = find(tableData, { id: row.id });
    foundRow.select = !row.select;
    this.props.updateTableData('timesheet', [...tableData]);
  };

  _onChangeTimesheetDetailsCheckbox = checked => {
    const { headerData } = this.state;
    if (checked) {
      headerData[1].id = 'entry_date';
      headerData[1].label = 'Entry date';
    } else {
      headerData[1].id = 'time_period';
      headerData[1].label = 'Time Period';
    }
    this.props.updateShowTimesheetDetailsSelection('timesheet', checked);
    this._updateTimesheetsData(this.props, checked);
    this.setState({ headerData });
  };

  _renderFilterUserDropdown() {
    const {
      addSelectedUser,
      removeSelectedUser,
      classes,
      dropdownUsers,
    } = this.props;
    return (
      <Grid item xs={6}>
        <div className={classes.dropdownWrapper} style={{ paddingRight: 10 }}>
          <Dropdown
            label='Filter Users'
            items={dropdownUsers}
            multiple
            onChange={(item, index, isSelected) => {
              if (isSelected) {
                addSelectedUser(item.value);
              } else {
                removeSelectedUser(item.value);
              }
            }}
          />
        </div>
      </Grid>
    );
  }

  _renderFilterDatePicker() {
    const {
      classes,
      setFilteredFromDate,
      setFilteredToDate,
      filteredFromDate,
      filteredToDate,
    } = this.props;
    return (
      <Grid item xs={6} classes={{ item: classes.dropdownWrapper }}>
        <Grid container>
          <Grid item xs={6}>
            <DatePicker
              label='From Date'
              onDateChange={date => {
                if (date) {
                  setFilteredFromDate(moment(date).format('YYYY-MM-DD'));
                } else {
                  setFilteredFromDate(null);
                }
              }}
              value={filteredFromDate}
              classes={{ component: classes.fromDatePicker }}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label='To Date'
              onDateChange={date => {
                if (date) {
                  setFilteredToDate(moment(date).format('YYYY-MM-DD'));
                } else {
                  setFilteredToDate(null);
                }
              }}
              calendarProps={{
                minDate: new Date(filteredFromDate),
              }}
              value={filteredToDate}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }

  _renderCell = (row, column, ele) => {
    const { classes, theme, profile } = this.props;
    const country = get(profile, 'selectedCompany.country');
    if (column.id === 'service') {
      return (
        <div
          className={classes.serviceCell}
          data-test={row.select ? `timesheet-selected` : ''}>
          <Checkbox
            id={`timesheet-select-${row.id}`}
            size='medium'
            value={row.select}
            onChange={this._updateSelectedTimesheet(row)}
          />
          <span className={classes.serviceLabel}>{row[column.id]}</span>
        </div>
      );
    }
    if (column.id === 'gst_str') {
      return (
        <div className={cx(classes.gstCell, classes.borderCell)}>
          <TextField
            id={`gst-input-${row.id}`}
            placeholder={`0`}
            showClearIcon={false}
            value={row.includeConsTax ? String(row.gst) : '0'}
            icon={
              <span className={classes.dollarIcon}>
                <Trans id='currency-symbol' />
              </span>
            }
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              component: classes.smallInputComponent,
              leftIcon: classes.inputLeftIcon,
              textInput: classes.gstTextInput,
            }}
            isReadOnly={country === 'AU' || !row.includeConsTax}
            onChangeText={this._updateGstValue(row)}
          />
          <ToggleSwitch
            onColor={theme.palette.primary.color1}
            compact
            value={row.includeConsTax}
            onChange={this._updateIncludeGst(row)}
          />
        </div>
      );
    }
    if (
      column.id === 'quantity' ||
      column.id === 'rate' ||
      column.id === 'amount'
    ) {
      return <div className={classes.borderCell}>{row[column.id]}</div>;
    }
    return ele;
  };

  render() {
    const {
      classes,
      makeStepActive,
      markedVisited,
      theme,
      unmarkedVisited,
      newInvoice,
    } = this.props;
    const data = idx(newInvoice, (_: any) => _.timesheet);
    const customer = idx(data, _ => _.customer) || {};
    const tableData = idx(data, _ => _.tableData) || [];
    const showTimesheetDetails =
      idx(data, _ => _.showTimesheetDetails) || false;
    return (
      <div>
        <SectionHeader
          title='Create an invoice using a timesheet'
          subtitle='Creating an invoice from a timesheet is a quick way to easily create an invoice from a timesheet which you have already defined.'
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Prev'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                withoutBackground
                onClick={() => {
                  makeStepActive(0);
                  unmarkedVisited(0);
                }}
              />
              <Button
                id='next-button'
                title='Next'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  if (tableData.length > 0) {
                    makeStepActive(2);
                    markedVisited(1);
                  }
                }}
              />
            </div>
          )}
        />
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={12}>
              <div className={classes.customerTitle} data-test='customer-name'>
                {customer.name}
              </div>
              <div className={classes.customerAttr} data-test='contact-name'>
                {customer.contactName} {customer.contactSurname}
              </div>
              <div className={classes.customerAttr} data-test='contact-email'>
                {customer.email}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.timesheetDetailsCheckbox}>
                <Checkbox
                  label='Timesheet Details'
                  onChange={this._onChangeTimesheetDetailsCheckbox}
                  value={showTimesheetDetails}
                />
                <Tooltip
                  classes={{ component: classes.timesheetDetailsTooltip }}
                  title={`Timesheet details allows you to select individual entries within a Timesheet that you would like to invoice. This allows you the flexibility to partly invoice a timesheet that flows over into the next month.`}>
                  {({ isVisible }) => (
                    <i
                      className={cx(classes.questionIcon, {
                        'ion-ios-help-outline': !isVisible,
                        'ion-help-circled': isVisible,
                      })}
                    />
                  )}
                </Tooltip>
              </div>
            </Grid>
            {this._renderFilterUserDropdown()}
            {this._renderFilterDatePicker()}
            <Grid item xs={12}>
              <SectionHeader
                title='Timesheets'
                classes={{ component: classes.timesheetHeading }}
              />
              <div className={classes.timesheetsTable}>
                <Table
                  columnData={this.state.headerData}
                  data={tableData || []}
                  stripe={false}
                  showRemoveIcon={false}
                  sortable={false}
                  cellRenderer={this._renderCell}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(composeStyles(styles, timesheetsStepsStyle)),
  withState('filteredFromDate', 'setFilteredFromDate', null),
  withState('filteredToDate', 'setFilteredToDate', null),
  withStateHandlers(
    () => ({
      filteredUsers: [],
    }),
    {
      addSelectedUser: ({ filteredUsers }) => userId => {
        if (filteredUsers.indexOf(userId) <= -1) {
          return { filteredUsers: [...filteredUsers, userId] };
        }
        return { filteredUsers: [...filteredUsers, userId] };
      },
      removeSelectedUser: ({ filteredUsers }) => userId => {
        const pos = filteredUsers.indexOf(userId);
        if (pos > -1) {
          filteredUsers.splice(pos, 1);
        }
        return { filteredUsers: [...filteredUsers] };
      },
    }
  ),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, x => x.sessionData.newInvoice),
    }),
    {
      ...actions,
    }
  ),
  withTimeSheets(props => {
    const project = get(props, 'newInvoice.timesheet.project', {});
    const customer = get(props, 'newInvoice.timesheet.customer', {});
    const entryQuery: any = {
      isArchived: false,
      isInvoiced: false,
    };
    if (!isEmpty(project)) {
      entryQuery.project = { id: project.id };
    } else {
      entryQuery.customer = { id: customer.id };
    }

    if (props.filteredFromDate && props.filteredToDate) {
      // if user has selected both from and to date , then use between filter
      entryQuery.date_gte = props.filteredFromDate;
      entryQuery.date_lte = props.filteredToDate;
    } else if (props.filteredFromDate) {
      // if user has selected only from date , then find entries which is greater or equal to that date
      entryQuery.date_gte = props.filteredFromDate;
    } else if (props.filteredToDate) {
      // if user has selected only to date , then find entries which is less or equal to that date
      entryQuery.date_lte = props.filteredToDate;
    }

    const where: any = {
      status_not: TIMESHEET_STATUS.DRAFT,
      isArchived: false,
      timeSheetEntries_some: entryQuery,
    };
    if (props.filteredUsers.length > 0) {
      // filter timesheet based on filtered users
      where.user = { id_in: uniq(props.filteredUsers) };
    }
    return {
      variables: {
        where,
        timeSheetEntryWhere: entryQuery,
        orderBy: 'startsAt_ASC',
      },
    };
  }),
  withCompany(
    props => {
      return {
        id: get(props, 'profile.selectedCompany.id'),
      };
    },
    ({ data }) => {
      const companyMembers = get(data, 'company.companyMembers', []);
      const users = companyMembers.map(({ user }) => user);
      return {
        dropdownUsers: users
          .filter(user => user.isActive && user.firstName && user.lastName)
          .map(user => {
            const name = user.firstName + ' ' + user.lastName;
            return { label: name, value: user.id };
          }),
      };
    }
  )
)(TimesheetsStep);
