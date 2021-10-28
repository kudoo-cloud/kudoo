import {
  ErrorBoundary,
  Loading,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import styles, { InvoiceStyles as TimesheetStyles } from './styles';

type Props = {
  classes: any;
  approvedTimesheets: {
    count: number;
    refetch: Function;
    loading: boolean;
  };
  finalisedTimesheets: {
    count: number;
    refetch: Function;
    loading: boolean;
  };
  draftTimesheets: {
    count: number;
    refetch: Function;
    loading: boolean;
  };
};

class Timesheets extends React.Component<Props, any> {
  componentDidUpdate(prevProps) {
    if (
      !isEqual(get(this.props, 'contentHash'), get(prevProps, 'contentHash'))
    ) {
      if (get(this.props, 'approvedTimesheets.refetch')) {
        this.props.approvedTimesheets.refetch();
      }
      if (get(this.props, 'finalisedTimesheets.refetch')) {
        this.props.finalisedTimesheets.refetch();
      }
      if (get(this.props, 'draftTimesheets.refetch')) {
        this.props.draftTimesheets.refetch();
      }
    }
  }

  render() {
    const {
      classes,
      approvedTimesheets = { total: 0, count: 0 },
      finalisedTimesheets = { total: 0, count: 0 },
      draftTimesheets = { total: 0, count: 0 },
    } = this.props;
    const showLoader =
      get(approvedTimesheets, 'loading') ||
      get(finalisedTimesheets, 'loading') ||
      get(draftTimesheets, 'loading');

    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Timesheets</span>
            {showLoader && (
              <span>
                <Loading size={20} color='white' />
              </span>
            )}
          </div>
          <div className={cx(classes.blockContent, classes.invoiceBlock)}>
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <div className={cx(classes.invoiceBlockItem, 'green')}>
                  <div className={classes.invoiceAmount}>
                    {draftTimesheets.count}
                  </div>
                  <div className={classes.invoiceTitle}>
                    Total drafts timesheets
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx(classes.invoiceBlockItem, 'orange')}>
                  <div className={classes.invoiceAmount}>
                    {finalisedTimesheets.count}
                  </div>
                  <div className={classes.invoiceTitle}>
                    Total finalised timesheets
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx(classes.invoiceBlockItem, 'green')}>
                  <div className={classes.invoiceAmount}>
                    {approvedTimesheets.count}
                  </div>
                  <div className={classes.invoiceTitle}>
                    Total approved timesheets
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(composeStyles(styles, TimesheetStyles)),
)(Timesheets);
