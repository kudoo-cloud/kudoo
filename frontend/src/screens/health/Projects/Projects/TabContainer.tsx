import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ErrorBoundary, withRouterProps } from '@kudoo/components';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { withProjects } from '@kudoo/graphql';

type Props = {
  actions: any;
  children: Function;
  projects: any;
};
type State = {};

class TabContainer extends Component<Props, State> {
  state = {};

  render() {
    const { children, projects = {} }: any = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={projects.refetch}>
          {children({ ...this.props, ...this.state })}
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect((state: any) => ({
    profile: state.profile,
  })),
  withProjects(props => {
    let isArchived = false;
    if (props.type === 'active') {
      isArchived = false;
    } else if (props.type === 'archived') {
      isArchived = true;
    } else if (props.type === 'draft') {
      isArchived = true;
    }
    return {
      variables: {
        where: {
          isArchived,
        },
        orderBy: 'name_ASC',
      },
    };
  })
)(TabContainer);
