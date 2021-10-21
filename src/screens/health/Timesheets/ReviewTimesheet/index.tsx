import {
  Button,
  ErrorBoundary,
  FieldLabel,
  FileBlock,
  Loading,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import {
  useTimesheetQuery,
  useUpdateTimesheetMutation,
} from 'src/generated/graphql';
import { TIMESHEET_STATUS } from 'src/helpers/constants';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import TimesheetRowDisplay from '../TimesheetRowDisplay';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  timeSheet: any;
  loading: boolean;
  classes: any;
  theme: any;
}

const ReviewTimesheet: React.FC<IProps> = (props) => {
  const { theme, classes } = props;
  const actions = useAllActions();
  const profile = useProfile();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const timesheetId = match?.params?.id;

  const [updateTimesheet] = useUpdateTimesheetMutation();
  const { data, loading } = useTimesheetQuery({
    variables: {
      id: timesheetId,
    },
    skip: !timesheetId,
  });
  const timeSheet = data?.timesheet || ({} as any);

  useEffect(() => {
    actions.updateHeaderTitle('Timesheet');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _approveTimesheet = async () => {
    try {
      const res = await updateTimesheet({
        variables: {
          data: {
            id: timeSheet?.id,
            status: TIMESHEET_STATUS.APPROVED as any,
          },
        },
      });
      if (res?.data?.updateTimesheet?.id) {
        showToast(null, 'Timesheet Approved');
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _unApproveTimesheet = async () => {
    try {
      const res = await updateTimesheet({
        variables: {
          data: {
            id: timeSheet?.id,
            status: TIMESHEET_STATUS.FINALISED as any,
          },
        },
      });
      if (res?.data?.updateTimesheet?.id) {
        showToast(null, 'Timesheet UnApproved');
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _renderSectionHeading = () => {
    const isOwner = get(profile, 'selectedDAO.owner');

    const isTimesheetApproved =
      get(timeSheet, 'status') === TIMESHEET_STATUS.APPROVED;
    let button = null;
    if (isOwner) {
      if (isTimesheetApproved) {
        button = (
          <Button
            title={'Unapprove Timesheet'}
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={_unApproveTimesheet}
          />
        );
      } else {
        button = (
          <Button
            title={'Approve Timesheet'}
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={_approveTimesheet}
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
  };

  const _renderPeriodSelection = () => {
    return (
      <div className={classes.periodSelectionWrapper}>
        <Grid container justify='space-between' spacing={0}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <div>
                  <FieldLabel label='Month' />
                  <div className={classes.textValueBox}>
                    {moment(timeSheet?.startsAt).format('MMMM')}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <FieldLabel label='Year' />
                  <div className={classes.textValueBox}>
                    {moment(timeSheet?.startsAt).format('YYYY')}
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
                    {moment(timeSheet.startsAt).format('DD MMM')} -{' '}
                    {moment(timeSheet.endsAt).format('DD MMM')}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  const _getTimesheetRows = () => {
    const entries = get(timeSheet, 'timeSheetEntries') || [];
    const timesheetRows = {};
    entries.forEach((entry) => {
      const serviceId = get(entry, 'service.id');
      const service = entry.service;
      const rowId = `${serviceId}`;
      timesheetRows[rowId] = timesheetRows[rowId] || {};
      merge(timesheetRows[rowId], {
        id: rowId,
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

  const _renderInputs = () => {
    const timesheetRows = _getTimesheetRows();

    if (!isEmpty(timesheetRows)) {
      return (
        <div className={classes.inputs}>
          {Object.values(timesheetRows).map((row: any, index) => (
            <TimesheetRowDisplay
              key={row?.id}
              hideDaysLabel={index > 0}
              startWeekDay={moment(timeSheet?.startsAt).format()}
              endWeekDay={moment(timeSheet?.endsAt).format()}
              service={row.service}
              timeSheetEntries={row.entries}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  const _renderAttachmentField = () => {
    const alreadyAttachedFiles = get(timeSheet, 'attachments', []);
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
                onRemoveClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const _showInvoiceAlert = () => {
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
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Send invoice',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  const _renderBottomButtons = () => {
    const isOwner = get(profile, 'selectedDAO.owner');
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
              onClick={_showInvoiceAlert}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  const _renderNoTimesheet = () => {
    return (
      <div className={classes.noTimesheetsWrapper}>
        <div className={classes.noTimesheetsMessageWrapper}>
          <div className={classes.noTimesheetsMessage}>
            {`There are no Timesheet data.`} <br />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <SelectedDAO
        onChange={() => {
          history.push(URL.TIMESHEETS());
        }}
      >
        <div className={classes.page}>
          <div className={classes.content}>
            {_renderSectionHeading()}

            {loading && <Loading />}

            {!loading && isEmpty(timeSheet) && _renderNoTimesheet()}

            {_renderPeriodSelection()}
            {_renderInputs()}
            {_renderAttachmentField()}
          </div>
          {_renderBottomButtons()}
        </div>
      </SelectedDAO>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(ReviewTimesheet);
