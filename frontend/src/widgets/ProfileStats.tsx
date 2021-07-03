import {
  CircularProgressBar,
  ErrorBoundary,
  LinearProgressBar,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import * as React from 'react';
import styles, { ProfileStatsStyles } from './styles';

type Props = {
  classes: any;
};

type State = {};

class ProfileStats extends React.Component<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>Profile Status</div>
          <div className={cx(classes.blockContent, classes.profileStatusBlock)}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={7}>
                <LinearProgressBar
                  label='Account Profile'
                  value={20}
                  classes={{
                    component: classes.progressBar,
                    label: classes.progressBarLabel,
                  }}
                />
                <LinearProgressBar
                  label='DAO details'
                  value={5}
                  classes={{
                    component: classes.progressBar,
                    label: classes.progressBarLabel,
                  }}
                />
                <LinearProgressBar
                  label='Invoices'
                  value={40}
                  classes={{
                    component: classes.progressBar,
                    label: classes.progressBarLabel,
                  }}
                />
                <LinearProgressBar
                  label='Timesheets'
                  value={60}
                  classes={{
                    component: classes.progressBar,
                    label: classes.progressBarLabel,
                  }}
                />
                <LinearProgressBar
                  label='Customers'
                  value={30}
                  classes={{
                    component: classes.progressBar,
                    label: classes.progressBarLabel,
                  }}
                />
                <LinearProgressBar
                  label='Services'
                  value={5}
                  classes={{
                    component: classes.progressBar,
                    label: classes.progressBarLabel,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <div className={classes.circularProgressWrapper}>
                  <CircularProgressBar value={25} width={180}>
                    <div className={classes.circularProgressPercent}>25 %</div>
                    <div className={classes.circularProgressStatus}>
                      complete
                    </div>
                  </CircularProgressBar>
                  <div className={classes.circularProgressMsg}>
                    Complete your profile to ensure a seamless experience with
                    Kudoo.
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.comingSoonBlock}>
            <div className={classes.comingSoonText}>Coming Soon</div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(composeStyles(styles, ProfileStatsStyles))(
  ProfileStats,
);
