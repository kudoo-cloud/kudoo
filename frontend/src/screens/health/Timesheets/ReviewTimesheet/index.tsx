import {
  Button,
  FieldLabel,
  FileBlock,
  SectionHeader,
  TimesheetRowDisplay,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import moment from 'moment';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { TIMESHEET_STATUS } from 'src/helpers/constants';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';

type Props = {
  actions: any;
  timeSheet: any;
  updateTimeSheet: Function;
  theme: any;
  profile: any;
  classes: any;
  history: any;
};
type State = {};

class ReviewTimesheet extends Component<Props, State> {
  static defaultProps = {
    updateTimeSheet: () => ({}),
    timeSheet: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Timesheets');
  }

  _getTimesheetRows = () => {
    const { timeSheet } = this.props;
    const entries = get(timeSheet, 'data.timeSheetEntries') || [];
    const timesheetRows = {};
    entries.forEach((entry) => {
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

  _approveTimesheet = async () => {
    try {
      const id = get(this.props, 'match.params.id');
      const res = await this.props.updateTimeSheet({
        where: {
          id,
        },
        data: {
          status: TIMESHEET_STATUS.APPROVED,
        },
      });
      if (res.success) {
        showToast(null, 'Timesheet Approved');
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (error) {
      showToast(error.toString());
    }
  };

  _unApproveTimesheet = async () => {
    try {
      const id = get(this.props, 'match.params.id');
      const res = await this.props.updateTimeSheet({
        where: {
          id,
        },
        data: {
          status: TIMESHEET_STATUS.FINALISED,
        },
      });
      if (res.success) {
        showToast(null, 'Timesheet UnApproved');
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (error) {
      showToast(error.toString());
    }
  };

  _renderSectionHeading() {
    const { theme, profile, timeSheet } = this.props;
    const isOwner = get(profile, 'selectedCompany.owner');
    const isTimesheetApproved =
      get(timeSheet, 'data.status') === TIMESHEET_STATUS.APPROVED;
    let button = null;
    if (isOwner) {
      if (isTimesheetApproved) {
        button = (
          <Button
            title={'Unapprove Timesheet'}
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={this._unApproveTimesheet}
          />
        );
      } else {
        button = (
          <Button
            title={'Approve Timesheet'}
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={this._approveTimesheet}
          />
        );
      }
    }

    return (
      <SectionHeader
        title='Review timesheet'
        subtitle='This is a finalised timesheet. Review the details below and click Invoice Customer when you are ready to send an invoice for this work.'
        renderLeftPart={() => button}
      />
    );
  }

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
        <div className={classes.inputs}>
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

  _showInvoiceAlert = () => {
    const { theme } = this.props;
    const title = 'Send Invoice to customer?';
    const description = (
      <div>
        <div>
          We will generate an invoice using the information defined in this
          timesheet.
        </div>
        <br />
        <div>Are you sure you want us to send an invoice to your customer?</div>
      </div>
    );
    const buttons = [
      {
        title: 'No, don’t send',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Send invoice',
        onClick: () => {
          this.props.actions.closeAlertDialog();
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
                variant='interactive'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  _renderBottomButtons = () => {
    const { classes, theme, profile } = this.props;
    const isOwner = get(profile, 'selectedCompany.owner');
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={isOwner ? 6 : 12}>
          <Button
            title='Back to timesheets'
            href={URL.TIMESHEETS()}
            buttonColor={theme.palette.grey['200']}
            classes={{ text: classes.cancelButtonText }}
          />
        </Grid>
        {isOwner && (
          <Grid item xs={12} sm={6}>
            <Button
              title='Invoice to customer'
              buttonColor={theme.palette.primary.color2}
              onClick={this._showInvoiceAlert}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <SelectedCompany
        onChange={() => {
          this.props.history.push(URL.TIMESHEETS());
        }}
      >
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {this._renderPeriodSelection()}
            {this._renderInputs()}
            {this._renderAttachmentField()}
          </div>
          {this._renderBottomButtons()}
        </div>
      </SelectedCompany>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withTimeSheet((props) => ({
  //   id: get(props, 'match.params.id'),
  // })),
  // withUpdateTimeSheet(),
)(ReviewTimesheet);
