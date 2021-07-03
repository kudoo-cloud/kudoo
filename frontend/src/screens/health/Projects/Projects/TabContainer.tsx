import { ErrorBoundary } from '@kudoo/components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';

type Props = {
  actions: any;
  children: Function;
  projects: any;
};
type State = {};

class TabContainer extends Component<Props, State> {
  public static defaultProps = {
    projects: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  state = {};

  render() {
    const { children, projects = {} }: any = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO onChange={projects.refetch}>
          {children({ ...this.props, ...this.state })}
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withProjects((props) => {
  //   let isArchived = false;
  //   if (props.type === 'active') {
  //     isArchived = false;
  //   } else if (props.type === 'archived') {
  //     isArchived = true;
  //   } else if (props.type === 'draft') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
)(TabContainer);
