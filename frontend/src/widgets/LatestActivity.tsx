import * as React from 'react';
import cx from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles, ErrorBoundary } from '@kudoo/components';
import Collapse from '@material-ui/core/Collapse';
import LatestActivityItem from './LatestActivityItem';
import { LatestActivityStyles } from './styles';

type Props = {
  classes: any;
};

type State = {
  latestActivityCollapsed: boolean;
};

class LatestActivity extends React.Component<Props, State> {
  state = {
    latestActivityCollapsed: false,
  };

  render() {
    const { classes } = this.props;
    const { latestActivityCollapsed } = this.state;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <ButtonBase
            classes={{ root: classes.titleWrapper }}
            onClick={() => {
              this.setState({
                latestActivityCollapsed: !latestActivityCollapsed,
              });
            }}>
            <div className={classes.title}>Latest activity</div>
            <div className={classes.icon}>
              <i
                className={cx('fa', {
                  'fa-minus': !latestActivityCollapsed,
                  'fa-plus': latestActivityCollapsed,
                })}
              />
            </div>
          </ButtonBase>
          <Collapse in={!latestActivityCollapsed}>
            <div className={classes.content}>
              <LatestActivityItem
                label='Create a project'
                time='2 hours ago'
                icon={<i className='fa fa-sticky-note' />}
                topBar={false}
              />
              <LatestActivityItem
                label='User account edited'
                time='22 hours ago'
                icon={<i className='fa fa-user' />}
              />
              <LatestActivityItem
                label='Invoice sent'
                time='1 day ago'
                icon={<i className='fa fa-sticky-note' />}
              />
              <LatestActivityItem
                label='Timesheet created'
                time='1 day ago'
                icon={<i className='fa fa-clock-o' />}
              />
              <LatestActivityItem
                label='User account edited'
                time='22 hours ago'
                icon={<i className='fa fa-user' />}
              />
              <LatestActivityItem
                label='Invoice sent'
                time='1 day ago'
                icon={<i className='fa fa-sticky-note' />}
              />
              <LatestActivityItem
                label='Timesheet created'
                time='1 day ago'
                icon={<i className='fa fa-clock-o' />}
              />
              <LatestActivityItem
                label='User account edited'
                time='22 hours ago'
                icon={<i className='fa fa-user' />}
              />
              <LatestActivityItem
                label='Invoice sent'
                time='1 day ago'
                icon={<i className='fa fa-sticky-note' />}
              />
              <LatestActivityItem
                label='Timesheet created'
                time='1 day ago'
                icon={<i className='fa fa-clock-o' />}
              />
              <LatestActivityItem
                label='User account edited'
                time='22 hours ago'
                icon={<i className='fa fa-user' />}
              />
              <LatestActivityItem
                label='Invoice sent'
                time='1 day ago'
                icon={<i className='fa fa-sticky-note' />}
              />
              <LatestActivityItem
                label='Timesheet created'
                time='1 day ago'
                icon={<i className='fa fa-clock-o' />}
                bottomBar={false}
              />
            </div>
          </Collapse>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(LatestActivityStyles)(LatestActivity);
