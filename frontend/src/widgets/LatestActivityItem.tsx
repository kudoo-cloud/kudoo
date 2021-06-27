import { ErrorBoundary, withStyles } from '@kudoo/components';
import cx from 'classnames';
import * as React from 'react';
import { LatestActivityItemStyles } from './styles';

type Props = {
  label: string;
  time: string;
  icon: any;
  topBar: boolean;
  bottomBar: boolean;
  classes: any;
};

type State = {};

class LatestActivityItem extends React.Component<Props, State> {
  static defaultProps = {
    topBar: true,
    bottomBar: true,
  };

  render() {
    const { classes, label, time, icon } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <div className={classes.right}>
            <div className={cx(classes.bar, classes.topBar)} />
            <div className={classes.icon}>{icon}</div>
            <div className={cx(classes.bar, classes.bottomBar)} />
          </div>
          <div className={classes.left}>
            <div className={classes.label}>{label}</div>
            <div className={classes.time}>{time}</div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(LatestActivityItemStyles)(LatestActivityItem);
