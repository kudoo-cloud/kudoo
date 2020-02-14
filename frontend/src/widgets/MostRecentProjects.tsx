import * as React from 'react';
import cx from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  withStyles,
  composeStyles,
  ErrorBoundary,
  Loading,
} from '@kudoo/components';
import { withProjects } from '@kudoo/graphql';
import styles, { MostRecentBlockStyles } from './styles';

type Props = {
  classes: any;
  projects: any;
};

type State = {};

class MostRecentProjects extends React.Component<Props, State> {
  componentDidUpdate(prevProps) {
    if (
      !isEqual(get(this.props, 'contentHash'), get(prevProps, 'contentHash'))
    ) {
      if (get(this.props, 'projects.refetch')) {
        this.props.projects.refetch();
      }
    }
  }

  _isProjectInProgress = project => {
    const startsAt = get(project, 'startsAt');
    const endsAt = get(project, 'endsAt');
    if (startsAt && !endsAt) {
      return true;
    }
    return false;
  };

  _isProjectCompleted = project => {
    if (get(project, 'endsAt')) {
      const date = get(project, 'endsAt');
      return moment(date).format('DD/MM/YYYY');
    }
    return false;
  };

  _getProjectStatus = project => {
    const isStarted = this._isProjectInProgress(project);
    const isCompleted = this._isProjectCompleted(project);
    if (isStarted) {
      return 'In Progress';
    } else if (isCompleted) {
      return 'Completed';
    }
    return '-';
  };

  render() {
    const { classes, projects } = this.props;
    const projectsList = get(projects, 'data', []);
    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Most recent projects</span>
            {get(projects, 'loading') && (
              <span>
                <Loading size={20} color='white' />
              </span>
            )}
          </div>
          <div className={classes.blockContent}>
            <div className={classes.component}>
              {projectsList.length > 0 ? (
                <div className={classes.list}>
                  {projectsList.map(project => (
                    <div className={classes.listItem} key={project.id}>
                      <div className={classes.listItemPrimary}>
                        {project.name}
                      </div>
                      <div className={classes.listItemSecondary}>
                        {this._getProjectStatus(project)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cx(classes.listItem, classes.noRecentItem)}>
                  <div className={classes.listItemPrimary}>
                    No recent projects
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(composeStyles(styles, MostRecentBlockStyles)),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withProjects(props => ({
    variables: {
      first: 3,
      where: {
        isArchived: false,
      },
    },
  }))
)(MostRecentProjects);
