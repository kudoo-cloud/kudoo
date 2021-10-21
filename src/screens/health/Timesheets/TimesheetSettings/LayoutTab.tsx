import {
  Button,
  Checkbox,
  Dropdown,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import get from 'lodash/get';
import range from 'lodash/range';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import { LayoutTabStyles } from './styles';

type Props = {
  actions: any;
  dao: any;
  profile: Record<string, any>;
  updateDao: Function;
  classes: any;
  theme: any;
};
type State = {};

class LayoutTab extends Component<Props, State> {
  public static defaultProps = {
    updateDao: () => ({}),
    dao: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  _onSubmit = async (values, actions) => {
    try {
      const { dao, profile } = this.props;
      const timeSheetSettings = get(dao, 'data.timeSheetSettings') || {};
      const res = await this.props.updateDao({
        where: {
          id: get(dao, 'data.id'),
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
        if (get(profile, 'selectedDAO.id') === res.result.id) {
          this.props.actions.setUserData({
            selectedDAO: { ...res.result, owner: true },
          });
        }
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      actions.setSubmitting(false);
      showToast(e.toString());
    }
  };

  _renderFormFields = (formProps) => {
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
                    onChange={(item) => {
                      setFieldValue('groupEvery', item.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  classes={{ item: classes.defaultTextWrapper }}
                >
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
                }}
              >
                <Grid item xs={12}>
                  <Checkbox
                    label='Approval Enabled'
                    value={values.approvalsEnabled}
                    onChange={(isChecked) => {
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
                    items={range(1, 9).map((index) => ({
                      label: `${index}`,
                      value: index,
                    }))}
                    onChange={(item) => {
                      setFieldValue('workingHours', item.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  classes={{ item: classes.defaultTextWrapper }}
                >
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
    const { classes, dao = {} } = this.props;
    const timeSheetSettings = get(dao, 'data.timeSheetSettings', {}) || {};
    return (
      <div className={classes.tabContent}>
        <SelectedDAO onChange={dao.refetch}>
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
                false,
              ),
            }}
          >
            {this._renderFormFields.bind(this)}
          </Formik>
        </SelectedDAO>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(LayoutTabStyles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withDao((props) => ({
  //   id: get(props, 'profile.selectedDAO.id'),
  // })),
  // withUpdateDao(),
)(LayoutTab);
