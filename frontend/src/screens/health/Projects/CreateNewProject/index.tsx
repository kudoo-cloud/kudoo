import {
  Button,
  ErrorBoundary,
  WizardSteps,
  withStyles,
} from '@kudoo/components';
import findIndex from 'lodash/findIndex';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedCompany from 'src/helpers/SelectedCompany';
import URL from 'src/helpers/urls';
import actions from 'src/store/actions/createNewProject';
import CustomerStep from './CustomerStep';
import ProjectStep from './ProjectStep';
import ReviewStep from './ReviewStep';
import RulesStep from './RulesStep';
import ServiceStep from './ServiceStep';
import styles from './styles';

type Props = {
  actions: any;
  resetNewProjectData: Function;
  history: any;
  classes: any;
  theme: any;
};

type State = {
  steps: any;
  // steps: WizardStepFlowTypes,
};

class CreateNewProject extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      steps: [
        {
          label: 'Project',
          active: true,
          component: (
            <ProjectStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
            />
          ),
        },
        {
          label: 'Customers',
          component: (
            <CustomerStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
        {
          label: 'Services',
          component: (
            <ServiceStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
        {
          label: 'Rules',
          component: (
            <RulesStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
              history={this.props.history}
            />
          ),
        },
        {
          label: 'Review',
          component: (
            <ReviewStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
              history={this.props.history}
            />
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Projects');
  }

  _makeStepActive = (index: number) => {
    const steps = this.state.steps;
    const pos: number = findIndex(steps, { active: true });
    if (pos > -1) {
      steps[pos] = {
        ...steps[pos],
        active: false,
      };
      steps[index] = {
        ...steps[index],
        active: true,
      };
      this.setState({
        steps,
      });
    }
  };

  _markedVisited = (index: number) => {
    const steps = this.state.steps;
    steps[index] = {
      ...steps[index],
      visited: true,
    };
    this.setState({
      steps,
    });
  };

  _unmarkedVisited = (index: number) => {
    const steps = this.state.steps;
    steps[index] = {
      ...steps[index],
      visited: false,
    };
    this.setState({
      steps,
    });
  };

  _onStepClick = (step, index: number) => {
    this._makeStepActive(index);
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany
          onChange={() => {
            // clear new project data from reducer
            // because new selected company will not have selected customer and services
            this.props.resetNewProjectData();
            this.props.history.push(URL.PROJECTS());
          }}
        >
          <div className={classes.page}>
            <div className={classes.allSteps}>
              <WizardSteps
                steps={this.state.steps}
                onStepClick={this._onStepClick}
              />
            </div>
            <div className={classes.draftButtonWrapper}>
              <Button
                title='Cancel'
                buttonColor={theme.palette.grey['200']}
                classes={{ text: classes.cancelButtonText }}
              />
              {/* <Button
                title="Save as draft"
                buttonColor={theme.palette.primary.color2}
              /> */}
            </div>
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect(() => ({}), { resetNewProjectData: actions.resetNewProjectData }),
  withStyles(styles),
)(CreateNewProject);
