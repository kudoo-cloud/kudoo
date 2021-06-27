import { ErrorBoundary, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import AverageStats from './AverageStats';
import Invoices from './Invoices';
import MostRecentCustomers from './MostRecentCustomers';
import MostRecentProjects from './MostRecentProjects';
import ProfileStats from './ProfileStats';
import RevenueBlock from './RevenueBlock';
import styles from './styles';
import Timesheets from './Timesheets';

type Props = {
  type:
    | 'profile-stats'
    | 'revenue'
    | 'average-stats'
    | 'invoices'
    | 'timesheets'
    | 'recent-projects'
    | 'recent-customers';
  data: any;
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  contentHash: string;
  classes: any;
};

type State = {};

class Widget extends React.Component<Props, State> {
  static defaultProps = {
    xs: 12,
  };

  getComponent() {
    const { type } = this.props;
    if (type === 'profile-stats') {
      return ProfileStats;
    } else if (type === 'revenue') {
      return RevenueBlock;
    } else if (type === 'average-stats') {
      return AverageStats;
    } else if (type === 'invoices') {
      return Invoices;
    } else if (type === 'timesheets') {
      return Timesheets;
    } else if (type === 'recent-projects') {
      return MostRecentProjects;
    } else if (type === 'recent-customers') {
      return MostRecentCustomers;
    }
    return null;
  }

  render() {
    const WidgetComponent: any = this.getComponent();
    const { xs, sm, md, lg, xl, classes, contentHash } = this.props;
    return (
      <ErrorBoundary>
        <Grid
          item
          xs={xs}
          sm={sm}
          md={md}
          lg={lg}
          xl={xl}
          classes={{ item: classes.widgetItem }}
        >
          <WidgetComponent contentHash={contentHash} />
        </Grid>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(Widget);
