import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  SectionHeader,
  ProjectCard,
  ErrorBoundary,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { PROJECT_STATUS } from '@client/helpers/constants';
import TabContainer from './TabContainer';
import { ActiveProjectsStyles } from './styles';

type Props = {
  actions: any;
  classes: any;
  projects: any;
  history: any;
};
type State = {};

class ArchivedProjects extends Component<Props, State> {
  _renderSectionHeading() {
    return (
      <SectionHeader
        title='Archived Projects'
        subtitle='Below is a list of all your archived projects.'
      />
    );
  }

  _renderNoProject() {
    const { classes } = this.props;
    return (
      <div className={classes.noActiveProjectsWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no archived Projects.
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

const StyledActiveProjects = withStyles(ActiveProjectsStyles)(ArchivedProjects);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='archived'>
    {childProps => <StyledActiveProjects {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
