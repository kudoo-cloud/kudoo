import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import range from 'lodash/range';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { Formik } from 'formik';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  Button,
  SectionHeader,
  Dropdown,
  Checkbox,
} from '@kudoo/components';
import { showToast } from '@client/helpers/toast';
import { withCompany, withUpdateCompany } from '@kudoo/graphql';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { LayoutTabStyles } from './styles';

type Props = {
  actions: any;
  company: any;
  profile: Record<string, any>;
  updateCompany: Function;
  classes: any;
  theme: any;
};
type State = {};

class LayoutTab extends Component<Props, State> {
  _onSubmit = async (values, actions) => {
    try {
      const { company, profile } = this.props;
      const timeSheetSettings = get(company, 'data.timeSheetSettings') || {};
      const res = await this.props.updateCompany({
        where: {
          id: get(company, 'data.id'),
        },
        data: {
          timeSheetSettings: {
            ...timeSheetSettings,
            groupEvery: values.groupEvery,
            workingHours: values.workingHours,
            approvalsEnabled: values.approvalsEnabled,
          },
        },
      });
      actions.setSubmitting(false);
      if (res.success) {
        showToast(null, 'Settings Updated');
        if (get(profile, 'selectedCompany.id') === res.result.id) {
          this.props.actions.setUserData({
            selectedCompany: { ...res.result, owner: true },
          });
        }
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      actions.setSubmitting(false);
      showToast(e.toString());
    }
  };

  _renderFormFields = formProps => {
    const { classes, theme } = this.props;
    const { values, setFieldValue, dirty } = formProps;
    const isFormDirty = dirty;
    return (
      <form className={classes.form} onSubmit={formProps.handleSubmit}>
        <div className={classes.formContent}>
          <SectionHeader
            title='Layout Settings'
            subtitle='These settings allow you to customise the view of your timesheets in Kudoo. We have configured these options to our default. '
            classes={{ component: classes.layoutSectionHeader }}
          />
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Grid container classes={{ container: classes.field }}>
                <Grid item xs={12} sm={9}>
                  <Dropdown
                    value={values.groupEvery}
                    label='View for timesheet list'
                    items={[
                      { label: 'By Month', value: 'MONTHLY' },
                      { label: 'By Year', value: 'ANNUALLY' },
                    ]}
                    onChange={item => {
                      setFieldValue('groupEvery', item.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  classes={{ item: classes.defaultTextWrapper }}>
                  <div>Default</div>
                </Grid>
              </Grid>

              {/* <Grid container classes={{ container: classes.field }}>
                <Grid item xs={12} sm={9}>
                  <Dropdown
                    value={values.archiveEvery}
                    label="Archive inactive timesheets"
                    items={[
                      { label: 'After 6 months', value: 'SEMIANNUALLY' },
                      { label: 'After year', value: 'ANNUALLY' },
                    ]}
                    onChange={item => {
                      setFieldValue('archiveEvery', item.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  classes={{ item: classes.defaultTextWrapper }}>
                  <div>Default</div>
                </Grid>
              </Grid> */}

              <Grid
                container
                classes={{
                  container: cx(classes.field, classes.approvalField),
                }}>
                <Grid item xs={12}>
                  <Checkbox
                    label='Approval Enabled'
                    value={values.approvalsEnabled}
                    onChange={isChecked => {
                      setFieldValue('approvalsEnabled', isChecked);
                    }}
                  />
                </Grid>
              </Grid>

              <SectionHeader
                title='How many hours is a work day'
                classes={{ component: classes.workDaySectionHeader }}
              />

              <Grid container classes={{ container: classes.field }}>
                <Grid item xs={12} sm={9}>
                  <Dropdown
                    value={values.workingHours}
                    label='Work day Hours'
                    items={range(1, 9).map(index => ({
                      label: `${index}`,
                      value: index,
                    }))}
                    onChange={item => {
                      setFieldValue('workingHours', item.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  classes={{ item: classes.defaultTextWrapper }}>
                  <div>Default</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        {isFormDirty && (
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Button
                title={'Update'}
                buttonColor={theme.palette.primary.color2}
                loading={formProps.isSubmitting}
                type='submit'
              />
            </Grid>
          </Grid>
        )}
      </form>
    );
  };

  render() {
    const { classes, company = {} } = this.props;
    const timeSheetSettings = get(company, 'data.timeSheetSettings', {}) || {};
    return (
      <div className={classes.tabContent}>
        <SelectedCompany onChange={company.refetch}>
          <Formik
            onSubmit={this._onSubmit}
            enableReinitialize
            initialValues={{
              archiveEvery: get(timeSheetSettings, 'archiveEvery', ''),
              groupEvery: get(timeSheetSettings, 'groupEvery', ''),
              workingHours: get(timeSheetSettings, 'workingHours', ''),
              approvalsEnabled: get(
                timeSheetSettings,
                'approvalsEnabled',
                false
              ),
            }}>
            {this._renderFormFields.bind(this)}
          </Formik>
        </SelectedCompany>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(LayoutTabStyles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withCompany(props => ({
    id: get(props, 'profile.selectedCompany.id'),
  })),
  withUpdateCompany()
)(LayoutTab);
