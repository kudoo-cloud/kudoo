import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  SectionHeader,
  RadioButton,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import { showToast } from '@client/helpers/toast';
import { withCompany, withUpdateCompany } from '@kudoo/graphql';
import SelectedCompany from '@client/helpers/SelectedCompany';
import styles from './styles';

type Props = {
  actions: any;
  company: any;
  updateCompany: Function;
  classes: any;
};
type State = {};

class AutomationTab extends Component<Props, State> {
  _updateAutoSendInvoice = async autoSendInvoices => {
    try {
      const { company } = this.props;
      const timeSheetSettings =
        get(company, 'data.timeSheetSettings', {}) || {};
      const res = await this.props.updateCompany({
        where: {
          id: get(company, 'data.id'),
        },
        data: {
          timeSheetSettings: {
            ...timeSheetSettings,
            autoSendInvoices: autoSendInvoices,
          },
        },
      });
      if (res.success) {
        showToast(null, 'Settings Updated');
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  render() {
    const { classes, company = {} } = this.props;
    const autoSendInvoices = get(
      company,
      'data.timeSheetSettings.autoSendInvoices',
      false
    );
    return (
      <div className={classes.tabContent}>
        <SelectedCompany onChange={company.refetch}>
          <SectionHeader
            title='Automation settings'
            subtitle='These settings allow you to customise the automation of your timesheets in Kudoo. We have configured these options to our default. '
          />
          <div>
            <SectionHeader
              title='Send invoice after a timesheet is finalised'
              classes={{ component: classes.sendInvoiceSectionHeader }}
            />
            <Grid container>
              <Grid item xs={12} sm={3}>
                <RadioButton
                  label='Manually send invoices'
                  value={!autoSendInvoices}
                  onChange={() => {
                    this._updateAutoSendInvoice(false);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <RadioButton
                  label='Automatically send invoices'
                  value={autoSendInvoices}
                  onChange={() => {
                    this._updateAutoSendInvoice(true);
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </SelectedCompany>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withCompany(props => ({
    id: get(props, 'profile.selectedCompany.id'),
  })),
  withUpdateCompany()
)(AutomationTab);
