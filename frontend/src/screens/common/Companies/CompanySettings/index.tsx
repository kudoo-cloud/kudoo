import React, { Component } from 'react';
import idx from 'idx';
import { Switch, Redirect } from 'react-router';
import { withStyles, Tabs, helpers as utils } from '@kudoo/components';
import URL from '@client/helpers/urls';
import SelectedCompany from '@client/helpers/SelectedCompany';
import Banking from '../Banking';
import Integrations from '../Integrations';
import Subscription from '../Subscription';
import styles from './styles';
import GeneralTab from './GeneralTab';
import UsersTab from './UsersTab';

type Props = {
  actions: any;
  classes: any;
  match: any;
  history: any;
};
type State = {};

class CompanySettings extends Component<Props, State> {
  state = {};

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Company Settings');
  }

  _findActiveSecondaryTab = () => {
    let activeTab = 0;
    if (utils.isURLMatching(URL.COMPANY_GENERAL({ path: true }))) {
      activeTab = 0;
    } else if (utils.isURLMatching(URL.COMPANY_USERS({ path: true }))) {
      activeTab = 1;
    } else if (utils.isURLMatching(URL.COMPANY_BANKING({ path: true }))) {
      activeTab = 2;
    } else if (utils.isURLMatching(URL.COMPANY_INTEGRATIONS({ path: true }))) {
      activeTab = 3;
    } else if (utils.isURLMatching(URL.COMPANY_SUBSCRIPTION({ path: true }))) {
      activeTab = 4;
    }
    return activeTab;
  };

  _renderSecondaryTabs() {
    const { match } = this.props;
    const companyId = idx(match, _ => _.params.companyId);
    return (
      <Tabs
        tabs={[
          {
            label: 'General',
            onClick: () => {
              this.props.history.push(
                URL.COMPANY_GENERAL_BASICS({ companyId })
              );
            },
          },
          {
            label: 'Users',
            onClick: () => {
              this.props.history.push(URL.COMPANY_USERS({ companyId }));
            },
          },
          {
            label: 'Banking',
            onClick: () => {
              this.props.history.push(URL.COMPANY_BANKING({ companyId }));
            },
          },
          {
            label: 'Integrations',
            onClick: () => {
              this.props.history.push(URL.COMPANY_INTEGRATIONS({ companyId }));
            },
          },
          {
            label: 'Subscription',
            onClick: () => {
              this.props.history.push(URL.COMPANY_SUBSCRIPTION({ companyId }));
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={this._findActiveSecondaryTab()}
      />
    );
  }

  render() {
    const { classes, actions, match } = this.props;
    const activeTab = this._findActiveSecondaryTab();
    const companyId = idx(match, _ => _.params.companyId) || '';
    return (
      <div className={classes.page}>
        <SelectedCompany
          onChange={({ id }) => {
            if (id) {
              this.props.history.push(URL.COMPANY_SETTINGS({ companyId: id }));
            }
          }}>
          {this._renderSecondaryTabs()}
          {activeTab === 0 && <GeneralTab {...this.props} actions={actions} />}
          {activeTab === 1 && <UsersTab {...this.props} />}
          {activeTab === 2 && <Banking {...this.props} />}
          {activeTab === 3 && (
            <Integrations {...this.props} actions={actions} />
          )}
          {activeTab === 4 && (
            // @ts-ignore
            <Subscription {...this.props} actions={actions} />
          )}
          {activeTab === 0 && (
            <Switch>
              <Redirect
                exact
                from={URL.COMPANY_SETTINGS({ companyId })}
                to={URL.COMPANY_GENERAL({ companyId })}
              />
            </Switch>
          )}
        </SelectedCompany>
      </div>
    );
  }
}

export default withStyles(styles)(CompanySettings);
