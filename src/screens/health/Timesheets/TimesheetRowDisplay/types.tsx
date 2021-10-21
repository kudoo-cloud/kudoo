export type TimesheetRowDisplayProps = {
  endWeekDay: any;
  startWeekDay: any;
  hideDaysLabel: boolean;
  service: { data: any; loading?: boolean };
  timeSheetEntries: { data: Array<any>; loading?: boolean };
  classes?: any;
  theme?: any;
};
