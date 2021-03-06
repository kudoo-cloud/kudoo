import { RadioButton, SectionHeader, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import styles from './styles';

type Props = {
  actions: any;
  dao: any;
  updateDao: Function;
  classes: any;
};
type State = {};

class AutomationTab extends Component<Props, State> {
  public static defaultProps = {
    updateDao: () => ({}),
    dao: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  _updateAutoSendInvoice = async (autoSendInvoices) => {
    try {
      const { dao } = this.props;
      const timeSheetSettings = get(dao, 'data.timeSheetSettings', {}) || {};
      const res = await this.props.updateDao({
        where: {
          id: get(dao, 'data.id'),
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
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  render() {
    const { classes, dao = {} } = this.props;
    const autoSendInvoices = get(
      dao,
      'data.timeSheetSettings.autoSendInvoices',
      false,
    );
    return (
      <div className={classes.tabContent}>
        <SelectedDAO onChange={dao.refetch}>
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
        </SelectedDAO>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withDao((props) => ({
  //   id: get(props, 'profile.selectedDAO.id'),
  // })),
  // withUpdateDao(),
)(AutomationTab);
