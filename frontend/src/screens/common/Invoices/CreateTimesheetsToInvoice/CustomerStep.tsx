import {
  Button,
  SearchInput,
  SectionHeader,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import idx from 'idx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { showToast } from 'src/helpers/toast';
import * as actions from 'src/store/actions/createNewInvoice';
import { IReduxState } from 'src/store/reducers';
import styles, { customerStepsStyle } from './styles';

type Props = {
  actions: Record<string, any>;
  projects: Record<string, any>;
  customers: Record<string, any>;
  newInvoice: Record<string, any>;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  updateCustomerInfo: Function;
  updateProjectInfo: Function;
  setSearchCustomerText: any;
  classes: any;
  theme: any;
};
type State = {};

class CustomerStep extends Component<Props, State> {
  static defaultProps = {
    customers: { data: [] },
    projects: { data: {} },
  };

  _onSearchCustomer = (searchText) => {
    this.props.setSearchCustomerText(searchText);
    if (!searchText) {
      this.props.updateCustomerInfo('timesheet', {});
      return;
    }
  };

  _goToNextStep = () => {
    const { makeStepActive, markedVisited } = this.props;
    makeStepActive(1);
    markedVisited(0);
  };

  _onSelectProject = async (project) => {
    this.props.updateProjectInfo('timesheet', project);
    this._updateCustomer(project.customer || {});
    this._goToNextStep();
  };

  _onSelectCustomer = async (customer) => {
    this.props.updateProjectInfo('timesheet', {});
    this._updateCustomer(customer);
    this._goToNextStep();
  };

  _updateCustomer = (customer) => {
    try {
      if (customer) {
        this.props.updateCustomerInfo('timesheet', {
          name: customer.name,
          govNumber: customer.govNumber,
          email: get(customer, 'contacts[0].email', ''),
          contactName: get(customer, 'contacts[0].name', ''),
          contactSurname: get(customer, 'contacts[0].surname', ''),
          id: customer.id,
        });
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  render() {
    const { classes, projects, newInvoice, theme, customers } = this.props;
    const selectedProject = get(newInvoice, 'timesheet.project', {});
    const customer = get(newInvoice, 'timesheet.customer', {});
    return (
      <div>
        <SectionHeader
          title='Create an invoice using a timesheet'
          subtitle='Creating an invoice from a timesheet is a quick way to easily create an invoice from a timesheet which you have already defined.'
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Next'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                isDisabled={isEmpty(customer)}
                buttonColor={theme.palette.primary.color2}
                onClick={this._goToNextStep}
              />
            </div>
          )}
        />
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <SectionHeader
                title='Search for customer'
                classes={{ component: classes.sectionHeading }}
              />
              <SearchInput
                placeholder='Search by typing the company name'
                items={get(customers, 'data', []).map((customer) => ({
                  ...customer,
                  label: customer.name,
                }))}
                defaultInputValue={
                  isEmpty(selectedProject) ? customer.name : ''
                }
                onSearch={this._onSearchCustomer}
                onInputChange={this._onSearchCustomer}
                onItemClick={this._onSelectCustomer}
              />
              <SectionHeader
                title='Select a project'
                classes={{ component: classes.sectionHeading }}
              />
              <Grid container spacing={16}>
                {get(projects, 'data', []).map((project) => (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    key={project.id}
                    onClick={() => {
                      this._onSelectProject(project);
                    }}
                    data-test={`project-${project.name}`}
                  >
                    <div
                      className={cx(classes.project, {
                        selected: project.id === selectedProject.id,
                      })}
                    >
                      {project.name}
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(composeStyles(styles, customerStepsStyle)),
  withState('searchCustomerText', 'setSearchCustomerText', ''),
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
  // withCustomers((props: any) => {
  //   return {
  //     variables: {
  //       where: {
  //         isArchived: false,
  //         name_contains: props.searchCustomerText || undefined,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
)(CustomerStep);
