import {
  FieldLabel,
  FileBlock,
  TimesheetRowDisplay,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import moment from 'moment';
import queryString from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import styles from './styles';

type Props = {
  actions: any;
  timeSheet: any;
  classes: any;
};
type State = {};

class PreviewTimesheet extends Component<Props, State> {
  static defaultProps = {
    timeSheet: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  constructor(props) {
    super(props);
    this.setCompanyAndUserData(props);
  }

  componentDidMount() {
    const props = this.props;
    this.setCompanyAndUserData(props);
  }

  setCompanyAndUserData = (props) => {
    const query = queryString.parse(get(props, 'location.search', ''));
    if (query['company-token'] && query['user-token']) {
      this.props.actions.setUserData({
        token: query['user-token'],
        isLoggedIn: true,
        selectedCompany: {
          ...get(props, 'profile.selectedCompany', {}),
          id: query['company-token'],
        },
      });
    }
  };

  _getTimesheetRows = () => {
    const { timeSheet } = this.props;
    const entries = get(timeSheet, 'data.timeSheetEntries') || [];
    const timesheetRows = {};
    entries.map((entry) => {
      const projectCustomerId =
        get(entry, 'project.id') || get(entry, 'customer.id');
      const serviceId = get(entry, 'service.id');
      const project = entry.project;
      const customer = entry.customer;
      const service = entry.service;
      const rowType = get(entry, 'project.id') ? 'project' : 'customer';
      const rowId = `${projectCustomerId}:${serviceId}`;
      timesheetRows[rowId] = timesheetRows[rowId] || {};
      merge(timesheetRows[rowId], {
        id: rowId,
        rowType,
        project: {
          data: project,
        },
        customer: {
          data: customer,
        },
        service: {
          data: service,
        },
        entries: {
          data: [].concat(get(timesheetRows[rowId], 'entries.data', []), entry),
        },
      });
    });
    return timesheetRows;
  };

  _renderPeriodSelection() {
    const { classes, timeSheet } = this.props;
    const timesheetData = timeSheet.data || {};
    return (
      <div className={classes.periodSelectionWrapper}>
        <Grid container justify='space-between' spacing={0}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <div>
                  <FieldLabel label='Month' />
                  <div className={classes.textValueBox}>
                    {moment(timesheetData.startsAt).format('MMMM')}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <FieldLabel label='Year' />
                  <div className={classes.textValueBox}>
                    {moment(timesheetData.startsAt).format('YYYY')}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container justify='flex-end'>
              <Grid item xs={12} sm={8}>
                <div>
                  <FieldLabel label='Week Period' />
                  <div className={classes.textValueBox}>
                    {moment(timesheetData.startsAt).format('DD MMM')} -{' '}
                    {moment(timesheetData.endsAt).format('DD MMM')}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderInputs() {
    const { classes, timeSheet } = this.props;
    const timesheetData = timeSheet.data || {};
    const timesheetRows = this._getTimesheetRows();
    if (!isEmpty(timesheetRows)) {
      return (
        <div className={classes.inputs} id='timesheet-details'>
          {Object.values(timesheetRows).map((row: any, index) => (
            <TimesheetRowDisplay
              key={row.id}
              hideDaysLabel={index > 0}
              startWeekDay={moment(timesheetData.startsAt).format()}
              endWeekDay={moment(timesheetData.endsAt).format()}
              project={row.project}
              customer={row.customer}
              service={row.service}
              timeSheetEntries={row.entries}
            />
          ))}
        </div>
      );
    }
    return null;
  }

  _renderAttachmentField() {
    const { classes, timeSheet } = this.props;
    const alreadyAttachedFiles = get(timeSheet, 'data.attachments', []);
    if (alreadyAttachedFiles.length <= 0) {
      return null;
    }
    return (
      <div className={classes.attachementWrapper}>
        <FieldLabel label='Attachments' />
        <div className={classes.attachementBlock}>
          <div className={classes.attachedFilesBlock}>
            {alreadyAttachedFiles.map((file, index) => (
              <FileBlock
                key={index}
                file={{ ...file, name: file.fileName }}
                showRemoveButton={false}
                variant='link'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <div className={classes.content}>
          {this._renderPeriodSelection()}
          {this._renderInputs()}
          {this._renderAttachmentField()}
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withTimeSheet((props) => {
  //   return {
  //     id: get(props, 'match.params.id', ''),
  //   };
  // }),
)(PreviewTimesheet);
