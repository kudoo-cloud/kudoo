import { withStyles } from '@kudoo/components';
import cx from 'classnames';
import idx from 'idx';
import get from 'lodash/get';
import moment from 'moment';
import React, { Component } from 'react';
import styles from './styles';
import { TimesheetRowDisplayProps } from './types';

type State = {
  dates: Array<string>;
};

class TimesheetRowDisplay extends Component<TimesheetRowDisplayProps, State> {
  static defaultProps = {
    onRemoveClick: () => {},
    hideRemoveIcon: false,
    hideDaysLabel: false,
  };

  state = {
    dates: [],
  };

  componentDidMount() {
    const { startWeekDay, endWeekDay } = this.props;
    if (startWeekDay && endWeekDay) {
      this._calculateRangeOfDates(startWeekDay, endWeekDay);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.startWeekDay !== prevProps.startWeekDay ||
      this.props.endWeekDay !== prevProps.endWeekDay
    ) {
      this._calculateRangeOfDates(
        this.props.startWeekDay,
        this.props.endWeekDay,
      );
    }
  }

  getRangeDates = (startDate: string, endDate: string) => {
    let dates = [],
      currentDate = startDate,
      addDays = (date, days) => {
        return moment(date).add(days, 'days').format();
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  };

  _calculateRangeOfDates = (startWeekDay, endWeekDay) => {
    const dates = this.getRangeDates(startWeekDay, endWeekDay);
    this.setState({ dates });
  };

  _getDayHour = (date) => {
    const { timeSheetEntries } = this.props;
    let item: any =
      timeSheetEntries.data.filter((entry) =>
        moment(entry.date).isSame(date),
      ) || [];
    item = item[0] || {};
    return parseFloat(item.duration || 0);
  };

  _getTotalHours = () => {
    const { timeSheetEntries } = this.props;
    let sum = 0;
    timeSheetEntries.data.map((entry) => {
      sum += parseFloat(entry.duration || 0);
    });
    return sum;
  };

  _renderInputWrapper() {
    const { classes, hideDaysLabel, service } = this.props;
    const { dates } = this.state;
    let displayUnit = 'h';
    if (get(service, 'data.timeBasedType') === 'DAY') {
      displayUnit = 'd';
    }
    return (
      <div className={classes.inputWrapper}>
        {dates.map((date, index) => (
          <div className={classes.dayWrapper} key={index}>
            {!hideDaysLabel && (
              <div className={classes.dayInitial}>
                {moment(date).format('dd')}
              </div>
            )}
            {!hideDaysLabel && (
              <div className={classes.dayNumber}>
                {moment(date).format('DD')}
              </div>
            )}
            <div className={classes.dayInput}>
              <div className={cx(classes.textValueBox, classes.dayInputWapper)}>
                {this._getDayHour(date)}
              </div>
            </div>
          </div>
        ))}
        <div className={classes.dayWrapper}>
          {!hideDaysLabel && <div className={classes.totalLabel}>Total</div>}
          <div className={classes.totalHoursWrapper}>
            <div className={classes.totalHours}>{this._getTotalHours()}</div>
            <div className={classes.hoursSymbol}>{displayUnit}</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { classes, service } = this.props;

    return (
      <div className={classes.wrapper}>
        <div className={classes.selectionWrapper}>
          <div className={cx(classes.textValueBox, classes.sDropdown)}>
            {idx(service, (_) => _.data.name)}
          </div>
        </div>
        {this._renderInputWrapper()}
      </div>
    );
  }
}

export default withStyles<TimesheetRowDisplayProps>(styles)(
  TimesheetRowDisplay,
);
