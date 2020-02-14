import React, { Component } from 'react';
import get from 'lodash/get';
import moment from 'moment';
import { Route, Switch } from 'react-router';
import { compose } from 'react-apollo';
import {
  withStyles,
  ErrorBoundary,
  Button,
  Tabs,
  withRouterProps,
  withStylesProps,
  helpers as utils,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { withProject, withUpdateProject } from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import { PROJECT_STATUS } from '@client/helpers/constants';
import SelectedCompany from '@client/helpers/SelectedCompany';
import ProjectDetailsTab from './ProjectDetailsTab';
import ServicesTab from './ServicesTab';
import styles from './styles';

type Props = {
  actions: any;
  classes: any;
  project: any;
  markProjectAsCompleted: Function;
  theme: any;
  history: any;
};

type State = {};

class ProjectDetails extends Component<Props, State> {
  componentDidMount() {
    this.props.actions.updateHeaderTitle('Projects');
  }

  _findActiveSecondaryTab = () => {
    let activeTab = 0;
    if (
      utils.isURLMatching(URL.PROJECT_DETAILS({ path: true }), undefined, true)
    ) {
      activeTab = 0;
    } else if (
      utils.isURLMatching(URL.PROJECT_SERVICES({ path: true }), undefined, true)
    ) {
      activeTab = 1;
    }
    return activeTab;
  };

  _markAsCompleted = async () => {
    try {
      const projectId = get(this.props, 'match.params.id', '');
      const res = await this.props.markProjectAsCompleted({
        where: { id: projectId },
        data: { endsAt: moment().format(), status: PROJECT_STATUS.CLOSED },
      });
      if (res.success) {
        showToast(null, 'Project marked as completed');
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _onMarkAsCompleteClick = () => {
    const { theme } = this.props;
    const title = 'Are you sure this project is complete?';
    const description = (
      <div>
        <div>
          When you mark a project as complete, by default we will send an
          invoice to your customer for the total or remainder amount owed to you
          for the services defined.
        </div>
        <br />
        <div>Are you sure you want to mark this project as complete?</div>
      </div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Mark as Complete',
        onClick: () => {
          this._markAsCompleted();
          this.props.actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.secondary.color1;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _isProjectInProgress = () => {
    const { project } = this.props;
    const startsAt = get(project, 'data.startsAt');
    const endsAt = get(project, 'data.endsAt');
    const isTodayStartDate = moment(moment().format('YYYY-MM-DD')).isSame(
      moment(startsAt).format('YYYY-MM-DD')
    );
    if (startsAt && !isTodayStartDate && !endsAt) {
      return true;
    }
    return false;
  };

  _isProjectCompleted = () => {
    const { project } = this.props;
    if (get(project, 'data.endsAt')) {
      const date = get(project, 'data.endsAt');
      return moment(date).format('DD/MM/YYYY');
    }
    return false;
  };

  _renderTabs = () => {
    const { history } = this.props;
    const id = get(this.props, 'match.params.id');
    return (
      <Tabs
        activeIndex={this._findActiveSecondaryTab()}
        tabs={[
          {
            label: 'Project Details',
            onClick: () => {
              history.push(URL.PROJECT_DETAILS({ id }));
            },
          },
          {
            label: 'Services',
            onClick: () => {
              history.push(URL.PROJECT_SERVICES({ id }));
            },
          },
        ]}
      />
    );
  };

  render() {
    const { classes, theme, project } = this.props;
    const isProjectCompleted = this._isProjectCompleted();
    const isProjectInProgress = this._isProjectInProgress();
    const startsAt = get(project, 'data.startsAt');
    const startDate = moment(startsAt).format('DD/MM/YYYY');
    const isTodayStartDate = moment(moment().format('YYYY-MM-DD')).isSame(
      moment(startsAt).format('YYYY-MM-DD')
    );

    const progressSteps = [
      {
        title: 'Project Started',
        subtitle: startDate,
        current: isTodayStartDate && !isProjectCompleted ? true : false,
        completed: isProjectInProgress || isProjectCompleted ? true : false,
      },
      {
        title: 'In Progress',
        subtitle: isProjectCompleted || isTodayStartDate ? '-' : 'Today',
        current: isProjectInProgress && !isProjectCompleted ? true : false,
        next: isTodayStartDate && !isProjectCompleted ? true : false,
        completed: isProjectCompleted ? true : false,
      },
      {
        title: 'Project Ends',
        subtitle: isProjectCompleted ? isProjectCompleted : 'Undefined',
        current: isProjectCompleted ? true : false,
      },
    ];

    return (
      <ErrorBoundary>
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.PROJECTS());
          }}>
          <div className={classes.page}>
            {this._renderTabs()}

            <Switch>
              <Route
                path={URL.PROJECT_DETAILS({ path: true })}
                exact
                render={routeParams => (
                  <ProjectDetailsTab
                    {...this.props}
                    {...routeParams}
                    onMarkAsComplete={this._onMarkAsCompleteClick}
                    projectCompleted={Boolean(isProjectCompleted)}
                    progressSteps={progressSteps}
                  />
                )}
              />
              <Route
                path={URL.PROJECT_SERVICES({ path: true })}
                render={routeParams => (
                  <ServicesTab
                    {...this.props}
                    {...routeParams}
                    onMarkAsComplete={this._onMarkAsCompleteClick}
                    projectCompleted={Boolean(isProjectCompleted)}
                    progressSteps={progressSteps}
                  />
                )}
              />
            </Switch>
            <Button
              title='Back to project list'
              buttonColor={theme.palette.grey['300']}
              href={URL.PROJECTS()}
            />
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(styles),
  withProject(props => ({
    id: get(props, 'match.params.id', ''),
  })),
  withUpdateProject(() => ({
    name: 'markProjectAsCompleted',
  }))
)(ProjectDetails);
