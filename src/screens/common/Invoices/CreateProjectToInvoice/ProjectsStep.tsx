import { Button, Dropdown, SectionHeader, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import idx from 'idx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import * as actions from 'src/store/actions/createNewInvoice';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions?: any;
  projects?: any;
  newInvoice?: any;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  updateProjectInfo?: Function;
  updateCustomerInfo?: Function;
  classes?: any;
  theme?: any;
};
type State = {};

class ProjectsStep extends Component<Props, State> {
  static defaultProps = {
    projects: { data: [] },
  };

  state = {};

  _goToNextStep = () => {
    const { makeStepActive, markedVisited } = this.props;
    makeStepActive(1);
    markedVisited(0);
  };

  _onSelectProject = async (item) => {
    try {
      this.props.updateProjectInfo('project', item.value);
      const customer = item.value.customer;
      if (!isEmpty(customer)) {
        this.props.updateCustomerInfo('project', {
          name: customer.name,
          govNumber: customer.govNumber,
          email: get(customer, 'contacts[0].email', ''),
          contactName: get(customer, 'contacts[0].name', ''),
          contactSurname: get(customer, 'contacts[0].surname', ''),
          id: customer.id,
        });
        this._goToNextStep();
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  render() {
    const { classes, projects, newInvoice, theme } = this.props;
    const selectedProject = get(newInvoice, 'project.project', {});
    return (
      <div>
        <SectionHeader
          title='Create an invoice using a project'
          subtitle='Creating an invoice from a project is a quick way to easily create an invoice from a project which you have already defined.'
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                id='next-button'
                title='Next'
                classes={{ component: classes.sendInvoiceButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={this._goToNextStep}
              />
            </div>
          )}
        />
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <SectionHeader title='Select From Project' />
              <form className={classes.form}>
                <Dropdown
                  id='project-dropdown'
                  label='Projects'
                  value={selectedProject}
                  onChange={this._onSelectProject}
                  items={projects?.data?.map((project) => ({
                    label: project.name,
                    value: project,
                  }))}
                />
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose<Props, Props>(
  withStyles(styles),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, (x) => x.sessionData.newInvoice),
    }),
    {
      ...actions,
    },
  ),
  // withProjects(() => {
  //   return {
  //     variables: {
  //       where: {
  //         isArchived: false,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
)(ProjectsStep);
