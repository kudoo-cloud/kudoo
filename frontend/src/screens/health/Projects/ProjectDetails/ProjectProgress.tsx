import React, { Component } from 'react';
import cx from 'classnames';
import { withStyles, SectionHeader, ErrorBoundary } from '@kudoo/components';
import { ProjectProgressStyles } from './styles';

type ProgressFlowTypes = Array<{
  title: string;
  subtitle: string;
  current?: boolean;
  next?: boolean;
  completed?: boolean;
}>;

// export type; { ProgressFlowTypes; }

type Props = {
  steps: ProgressFlowTypes;
  classes: any;
};

type State = {};

class ProjectProgress extends Component<Props, State> {
  state = {};

  render() {
    const { classes, steps } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <SectionHeader title='Project Status' />
          <div className={classes.wrapper}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={cx(classes.step, {
                  completed: step.completed,
                  next: step.next,
                  current: step.current,
                })}>
                <div className={classes.stepInfo}>
                  <div className={classes.stepTitle}>{step.title}</div>
                  <div className={classes.stepDate}>{step.subtitle}</div>
                </div>
                <div className={classes.stepArrow} />
              </div>
            ))}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(ProjectProgressStyles)(ProjectProgress);
