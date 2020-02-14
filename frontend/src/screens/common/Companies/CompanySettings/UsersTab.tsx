import React, { Component } from 'react';
import idx from 'idx';
import { Route, Redirect, Switch } from 'react-router';
import {
  withStyles,
  Tabs,
  withRouterProps,
  helpers as utils,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import CompaniesUsers from '../CompaniesUsers';
import InviteUser from '../InviteUser';
import styles from './styles';

type Props = {
  actions: any;
  classes: any;
  match: any;
  history: any;
};
type State = {};

class UsersTab extends Component<Props, State> {
  state = {};

  _findActiveTertiaryTab = () => {
    let activeTab = 0;
    if (utils.isURLMatching(URL.COMPANY_USERS_LIST({ path: true }))) {
      activeTab = 0;
    }
    // else if (utils.isURLMatching(URL.COMPANY_USERS_ROLES({ path: true }))) {
    //   activeTab = 1;
    // }
    return activeTab;
  };

  _renderTertiaryTabs() {
    const { match } = this.props;
    const companyId = idx(match, _ => _.params.companyId);
    return (
      <Tabs
        tabs={[
          {
            label: 'Users List',
            onClick: () => {
              this.props.history.push(URL.COMPANY_USERS_LIST({ companyId }));
            },
          },
          // {
          //   label: 'User Roles',
          //   onClick: () => {
          //     this.props.history.push(URL.COMPANY_USERS_ROLES({ companyId }));
          //   },
          // },
        ]}
        tabTheme='tertiary'
        activeIndex={this._findActiveTertiaryTab()}
      />
    );
  }

  render() {
    const { classes, actions, match } = this.props;
    const companyId = idx(match, _ => _.params.companyId);
    return (
      <div className={classes.page}>
        {this._renderTertiaryTabs()}

        <Switch>
          <Route
            path={URL.COMPANY_USERS_LIST({ path: true })}
            render={props => <CompaniesUsers {...props} actions={actions} />}
          />
          <Route
            path={URL.INVITE_USER({ path: true })}
            render={props => <InviteUser {...props} actions={actions} />}
          />
          <Redirect
            from={URL.COMPANY_USERS({ companyId })}
            to={URL.COMPANY_USERS_LIST({ companyId })}
            exact
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(UsersTab);
