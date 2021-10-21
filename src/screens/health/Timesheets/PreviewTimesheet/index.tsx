import {
  ErrorBoundary,
  FieldLabel,
  FileBlock,
  Loading,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useTimesheetQuery } from 'src/generated/graphql';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import { useAllActions } from 'src/store/hooks';
import TimesheetRowDisplay from '../TimesheetRowDisplay';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  timeSheet: any;
  loading: boolean;
  classes: any;
  theme: any;
}

const PreviewTimesheet: React.FC<IProps> = (props) => {
  const { classes } = props;
  const actions = useAllActions();

  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const timesheetId = match?.params?.id;

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

  return (
    <ErrorBoundary>
      <SelectedDAO
        onChange={() => {
          history.push(URL.TIMESHEETS());
        }}
      >
        <div className={classes.page}>
          <div className={classes.content}>
            {loading && <Loading />}
            {_renderPeriodSelection()}
            {_renderInputs()}
            {_renderAttachmentField()}
          </div>
        </div>
      </SelectedDAO>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(PreviewTimesheet);
