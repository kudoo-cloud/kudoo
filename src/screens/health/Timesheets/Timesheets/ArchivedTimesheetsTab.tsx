import { ScrollObserver, withStyles } from '@kudoo/components';
import cx from 'classnames';
import get from 'lodash/get';
import pluralize from 'pluralize';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import URL from 'src/helpers/urls';
import { ActiveTimesheetsStyles } from './styles';
import TimesheetBlock from './TimesheetBlock';
interface IProps {
  classes: any;
}

interface Props {
  timeSheetData: any;
  showUnarchiveDialog: Function;
}

const ArchivedTimesheetsTab: React.FC<Props & IProps> = ({
  timeSheetData,
  showUnarchiveDialog,
  ...props
}) => {
  const { classes } = props;

  const [allHide, setAllHide] = useState(false);

  const history = useHistory();

  return (
    <ScrollObserver onBottomReached={() => {}} onBottomReachedThreshold={500}>
      <div className={classes.timesheetsContainer}>
        <div className={classes.expandHideWrapper}>
          <span
            className={cx(classes.expandHideLabel, { active: allHide })}
            onClick={() => {
              setAllHide(false);
            }}
          >
            Expand
          </span>
          <span className={classes.slash}>/</span>
          <span
            className={cx(classes.expandHideLabel, { active: !allHide })}
            onClick={() => {
              setAllHide(true);
            }}
          >
            Hide
          </span>
        </div>
        {Object.keys(timeSheetData).map((key) => {
          const timesheet: any = timeSheetData[key];
          const service = get(timesheet, 'service') || {};
          let unit = 'hour';
          if (service.timeBasedType === 'DAY') {
            unit = 'day';
          }

          return (
            <div className={classes.timesheet} key={timesheet.id}>
              <TimesheetBlock
                collapsed={allHide}
                serviceName={service.name}
                showEmailIcon={false}
                showViewIcon={false}
                showAddIcon
                rows={Object.keys(timesheet.rows).map((rowKey) => {
                  const row = timesheet.rows[rowKey];
                  const supplier = get(row, 'supplier', {});
                  const name = supplier.name;
                  return {
                    id: row.id,
                    supplier: `${name}`,
                    period: `${row.startsAt} - ${row.endsAt}`,
                    status: row.status,
                    hours: `${row.hours} ${pluralize(unit, row.hours)}`,
                    totalHours: row.hours,
                    startsAt: row.startsAtFormatted,
                  };
                })}
                onCellClick={(e, { row }) => {
                  history.push(URL.EDIT_TIMESHEETS({ id: row.id }));
                }}
                onAddClicked={showUnarchiveDialog}
              />
            </div>
          );
        })}
      </div>
    </ScrollObserver>
  );
};

export default withStyles<Props>(ActiveTimesheetsStyles)(ArchivedTimesheetsTab);
