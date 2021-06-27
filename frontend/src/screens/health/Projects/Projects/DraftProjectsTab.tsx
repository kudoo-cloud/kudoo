import {
  ErrorBoundary,
  ProjectCard,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { PROJECT_STATUS } from 'src/helpers/constants';
import URL from 'src/helpers/urls';
import { ActiveProjectsStyles } from './styles';
import TabContainer from './TabContainer';

type Props = {
  actions: any;
  classes: any;
  projects: any;
  history: any;
};
type State = {};

class DraftProjects extends Component<Props, State> {
  _renderSectionHeading() {
    return (
      <SectionHeader
        title='Draft Projects'
        subtitle='Below is a list of all your draft projects.'
      />
    );
  }

  _renderNoProject() {
    const { classes } = this.props;
    return (
      <div className={classes.noActiveProjectsWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no draft Projects.
          </div>
        </div>
      </div>
    );
  }

  _renderProjects() {
    const { classes, history, projects } = this.props;
    return (
      <Grid container classes={{ container: classes.projectsContainer }}>
        {get(projects, 'data', []).map((project, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <ProjectCard
                title={project.name}
                titleColor='green'
                companyName={get(project, 'customer.name') || ''}
                projectStatus={
                  project.status === PROJECT_STATUS.STARTED
                    ? 'Project Started'
                    : 'Project Ended'
                }
                invoiceStatus='Invoice Sent'
                invoiceStatusColor='green'
                invoiceDate='Today'
                onEditClick={() => {
                  history.push(URL.PROJECT_DETAILS({ id: project.id }));
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  render() {
    const { classes, projects } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {this._renderSectionHeading()}
          {isEmpty(projects.data) && this._renderNoProject()}
          {!isEmpty(projects.data) && this._renderProjects()}
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledActiveProjects = withStyles(ActiveProjectsStyles)(DraftProjects);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='draft'>
    {(childProps) => <StyledActiveProjects {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
