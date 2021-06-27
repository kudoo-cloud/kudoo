import { Dropdown, WeekPeriod, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import range from 'lodash/range';
import moment from 'moment';

import * as React from 'react';
import { compose } from 'recompose';
import styles from './styles';

class PeriodSelection extends React.Component {
  static defaultProps = {};

  currentYear = moment().year();
  currentMonth = moment().month();
  yearList = range(this.currentYear - 2, this.currentYear + 10).map((yr) => ({
    label: String(yr),
    value: yr,
  }));
  monthList = range(0, 12).map((index) => ({
    label: moment().month(index).format('MMMM'),
    value: index,
  }));

  _getWeekNumberFromMonth = (month, year) => {
    return moment().month(month).year(year).date(1).week();
  };

  render() {
    const {
      classes,
      currentWeekPeriod,
      onWeekPeriodChange,
      onUpdateCurrentWeekPeriod,
    }: any = this.props;
    return (
      <div className={classes.periodSelectionWrapper}>
        <Grid container justify='space-between' spacing={0}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <Dropdown
                  label='Month'
                  items={this.monthList}
                  value={currentWeekPeriod.month}
                  onChange={(item) => {
                    const week = this._getWeekNumberFromMonth(
                      item.value,
                      currentWeekPeriod.year,
                    );
                    onUpdateCurrentWeekPeriod({
                      ...currentWeekPeriod,
                      month: item.value,
                      week,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Dropdown
                  label='Year'
                  items={this.yearList}
                  value={currentWeekPeriod.year}
                  onChange={(item) => {
                    onUpdateCurrentWeekPeriod({
                      ...currentWeekPeriod,
                      year: item.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container justify='flex-end'>
              <Grid item xs={12} sm={8}>
                <WeekPeriod
                  year={currentWeekPeriod.year}
                  week={currentWeekPeriod.week}
                  onWeekChange={onWeekPeriodChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose<any, any>(withStyles(styles))(PeriodSelection);
