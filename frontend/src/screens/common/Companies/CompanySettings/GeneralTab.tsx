import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import idx from 'idx';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import URL from 'src/helpers/urls';
import CompaniesGeneralBasics from '../CompaniesGeneralBasics';
import CompaniesGeneralContact from '../CompaniesGeneralContact';
import CompaniesGeneralLocation from '../CompaniesGeneralLocation';
import styles from './styles';

type Props = {
  actions: any;
  classes: any;
  match: any;
  history: any;
};
type State = {};

class GeneralTab extends Component<Props, State> {
  state = {};

  _findActiveTertiaryTab = () => {
    let activeTab = 0;
    if (utils.isURLMatching(URL.COMPANY_GENERAL_BASICS({ path: true }))) {
      activeTab = 0;
    } else if (
      utils.isURLMatching(URL.COMPANY_GENERAL_CONTACT_DETAILS({ path: true }))
    ) {
      activeTab = 1;
    } else if (
      utils.isURLMatching(URL.COMPANY_GENERAL_LOCATION({ path: true }))
    ) {
      activeTab = 2;
    }
    return activeTab;
  };

  _renderTertiaryTabs() {
    const { match } = this.props;
    const companyId = idx(match, (_) => _.params.companyId);
    return (
      <Tabs
        tabs={[
          {
            label: 'Basic Details',
            onClick: () => {
              this.props.history.push(
                URL.COMPANY_GENERAL_BASICS({ companyId }),
              );
            },
          },
          {
            label: 'Contact Details',
            onClick: () => {
              this.props.history.push(
                URL.COMPANY_GENERAL_CONTACT_DETAILS({ companyId }),
              );
            },
          },
          {
            label: 'Location Details',
            onClick: () => {
              this.props.history.push(
                URL.COMPANY_GENERAL_LOCATION({ companyId }),
              );
            },
          },
        ]}
        tabTheme='tertiary'
        activeIndex={this._findActiveTertiaryTab()}
      />
    );
  }

  render() {
    const { classes, actions, match } = this.props;
    const companyId = idx(match, (_) => _.params.companyId);
    return (
      <div className={classes.page}>
        {this._renderTertiaryTabs()}

        <Switch>
          <Route
            path={URL.COMPANY_GENERAL_BASICS({ path: true })}
            render={(props) => (
              <CompaniesGeneralBasics actions={actions} {...props} />
            )}
          />
          <Route
            path={URL.COMPANY_GENERAL_CONTACT_DETAILS({ path: true })}
            render={(props) => (
              <CompaniesGeneralContact actions={actions} {...props} />
            )}
          />
          <Route
            path={URL.COMPANY_GENERAL_LOCATION({ path: true })}
            render={(props) => (
              <CompaniesGeneralLocation actions={actions} {...props} />
            )}
          />
          <Redirect
            from={URL.COMPANY_GENERAL({ companyId })}
            to={URL.COMPANY_GENERAL_BASICS({ companyId })}
            exact
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(GeneralTab);
