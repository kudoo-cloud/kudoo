import { Button, withStyles } from '@kudoo/components';
import React from 'react';
import uuid from 'uuid';
import { useDeleteTimesheetEntryMutation } from 'src/generated/graphql';
import { useAllActions } from 'src/store/hooks';
import styles from './styles';
import TimesheetInputRow from './TimesheetInputRow';

interface IProps {
  classes: any;
  theme: any;
}

interface Props {
  allowedToEdit: boolean;
  timesheetRows: any;
  services: any;
  currentWeekPeriod: any;
  onUpdateRows: (data: any) => void;
  // timeSheetId: any;
}

const InputRows: React.FC<Props & IProps> = ({
  timesheetRows,
  allowedToEdit,
  services,
  currentWeekPeriod,
  onUpdateRows,
  // timeSheetId,
  ...props
}) => {
  const { classes, theme } = props;
  const actions = useAllActions();

  const [deleteTimesheetEntry] = useDeleteTimesheetEntryMutation();

  const _onAddNewTimesheetRow = () => {
    const newTimeSheetRows = { ...timesheetRows };
    newTimeSheetRows[uuid.v4()] = {};
    onUpdateRows({ timesheetRows: newTimeSheetRows });
  };

  const _onTimeSheetRowUpdate = (key) => (data) => {
    const newTimeSheetRows = { ...timesheetRows };
    newTimeSheetRows[key] = {
      ...(newTimeSheetRows[key] || {}),
      ...data,
    };
    onUpdateRows({ timesheetRows: newTimeSheetRows });
  };

  const _onRemoveTimesheetRow = (key) => () => {
    const newTimeSheetRows = { ...timesheetRows };
    const row = newTimeSheetRows[key] || {};
    if (row.entries) {
      // if there is `entries` i.e. those are already stored in db, then on remove click , ask user for confirmation
      const title = `Remove timesheet entry row?`;
      const description = (
        <div>
          <div>Are you sure you want to remove this entries?</div>
        </div>
      );
      const buttons = [
        {
          title: 'Cancel',
          type: 'cancel',
          onClick: () => {
            actions.closeAlertDialog();
          },
        },
        {
          title: 'Remove',
          buttonColor: theme.palette.secondary.color2,
          onClick: async () => {
            actions.closeAlertDialog();
            // const deleteRows = Object.values(row.entries).map(
            //   ({ id }: any) => ({
            //     id,
            //   }),
            // );
            // delete timesheet entries from db
            removeTimesheetEntry(key);

            // delete timesheet row locally
            delete newTimeSheetRows[key];
            onUpdateRows({ timesheetRows: newTimeSheetRows });
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
    } else {
      // if these are new entries which are not yet stored in database
      delete newTimeSheetRows[key];
      onUpdateRows({ timesheetRows: newTimeSheetRows });
    }
  };

  const removeTimesheetEntry = async (entryId) => {
    try {
      const res = await deleteTimesheetEntry({
        variables: { id: entryId },
      });
      if (res?.data?.deleteTimesheetEntry?.id) {
      }
    } catch (e) {
    } finally {
      actions.closeAlertDialog();
    }
  };

  const numberOfRows = Object.keys(timesheetRows || {}).length;

  return (
    <div className={classes.inputs}>
      {(Object.keys(timesheetRows || {}) || []).map((key, index) => {
        return (
          <TimesheetInputRow
            key={key}
            hideRemoveIcon={numberOfRows === 1}
            hideDaysLabel={index > 0}
            startWeekDay={currentWeekPeriod.startWeekDay}
            endWeekDay={currentWeekPeriod.endWeekDay}
            services={services}
            initialData={timesheetRows[key]}
            onChange={_onTimeSheetRowUpdate(key)}
            onRemoveClick={_onRemoveTimesheetRow(key)}
            allowedToEdit={allowedToEdit}
          />
        );
      })}
      {allowedToEdit && (
        <span data-html2canvas-ignore>
          <Button
            title='New Row'
            applyBorderRadius
            width={200}
            compactMode
            buttonColor={theme.palette.primary.color2}
            classes={{ component: classes.newRowButton }}
            onClick={_onAddNewTimesheetRow}
          />
        </span>
      )}
    </div>
  );
};

export default withStyles<Props>(styles)(InputRows);
