import * as React from 'react';
import { compose } from 'recompose';
import { Button, withStyles, withStylesProps } from '@kudoo/components';
import { withUpdateTimeSheet } from '@kudoo/graphql';
import uuid from 'uuid';
import { any } from 'prop-types';
import TimesheetInputRow from './TimesheetInputRow';
import styles from './styles';

type Props = {
  onUpdateRows: any;
  actions: any;
};

type State = {};
class InputRows extends React.Component<Props, State> {
  static defaultProps = {
    timesheetRows: {},
  };

  _onAddNewTimesheetRow = () => {
    const { timesheetRows }: any = this.props;
    const newTimeSheetRows = { ...timesheetRows };
    newTimeSheetRows[uuid.v4()] = {};
    this.props.onUpdateRows({ timesheetRows: newTimeSheetRows });
  };

  _onTimeSheetRowUpdate = key => data => {
    const { timesheetRows }: any = this.props;
    const newTimeSheetRows = { ...timesheetRows };
    newTimeSheetRows[key] = {
      ...(newTimeSheetRows[key] || {}),
      ...data,
    };
    this.props.onUpdateRows({ timesheetRows: newTimeSheetRows });
  };

  _onRemoveTimesheetRow = key => () => {
    const {
      timesheetRows,
      theme,
      actions,
      updateTimeSheet,
      timeSheetId,
      onUpdateRows,
    }: any = this.props;
    const newTimeSheetRows = { ...timesheetRows };
    const row = newTimeSheetRows[key] || {};
    if (row.entries) {
      // if there is `entries` i.e. those are already stored in db, then on remove click , ask user for confirmation
      const title = `Remove timesheet row?`;
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
            const deleteRows = Object.values(row.entries).map(
              ({ id }: any) => ({
                id,
              })
            );
            // delete timesheet entries from db
            await updateTimeSheet({
              where: {
                id: timeSheetId,
              },
              data: {
                timeSheetEntries: {
                  delete: deleteRows,
                },
              },
            });
            // delete timesheet row locally
            delete newTimeSheetRows[key];
            onUpdateRows({ timesheetRows: newTimeSheetRows });
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
    } else {
      // if these are new entries which are not yet stored in database
      delete newTimeSheetRows[key];
      onUpdateRows({ timesheetRows: newTimeSheetRows });
    }
  };

  render() {
    const {
      classes,
      theme,
      projects,
      customers,
      services,
      allowedToEdit,
      timesheetRows,
      currentWeekPeriod,
    }: any = this.props;
    const numberOfRows = Object.keys(timesheetRows || {}).length;
    return (
      <div className={classes.inputs}>
        {Object.keys(timesheetRows).map((key, index) => {
          return (
            <TimesheetInputRow
              key={key}
              hideRemoveIcon={numberOfRows === 1}
              hideDaysLabel={index > 0}
              startWeekDay={currentWeekPeriod.startWeekDay}
              endWeekDay={currentWeekPeriod.endWeekDay}
              projects={projects}
              customers={customers}
              services={services}
              initialData={timesheetRows[key]}
              onChange={this._onTimeSheetRowUpdate(key)}
              onRemoveClick={this._onRemoveTimesheetRow(key)}
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
              onClick={this._onAddNewTimesheetRow}
            />
          </span>
        )}
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  withUpdateTimeSheet()
)(InputRows);
