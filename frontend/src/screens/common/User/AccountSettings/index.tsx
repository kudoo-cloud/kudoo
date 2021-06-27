import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import URL from 'src/helpers/urls';
import UserAccountHistory from '../UserAccountHistory/index';
import UserDetails from '../UserDetails/index';
import UserSecurity from '../UserSecurity/index';
import styles from './styles';

interface IProps {
  actions: any;
  history: any;
  classes: any;
}

class AccountSettings extends Component<IProps, {}> {
  public state = {};

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Account Settings');
  }

  public _findActiveSecondaryTab = () => {
    let activeTab;
    if (utils.isURLMatching(URL.ACCOUNT_BASIC_DETAILS({ path: true }))) {
      activeTab = 0;
    } else if (utils.isURLMatching(URL.ACCOUNT_USER_SECURITY({ path: true }))) {
      activeTab = 2;
    }
    return activeTab;
  };

  public _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'Basic Details',
            onClick: () => {
              this.props.history.push(URL.ACCOUNT_BASIC_DETAILS());
            },
          },
          {
            label: 'Security',
            onClick: () => {
              this.props.history.push(URL.ACCOUNT_USER_SECURITY());
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={this._findActiveSecondaryTab()}
      />
    );
  }

  public render() {
    const { classes, actions } = this.props;
    return (
      <div className={classes.page}>
        {this._renderSecondaryTabs()}

        <Switch>
          <Route
            path={URL.ACCOUNT_BASIC_DETAILS({ path: true })}
            render={(props) => <UserDetails {...props} actions={actions} />}
          />
          <Route
            path={URL.ACCOUNT_USER_SECURITY({ path: true })}
            render={(props) => <UserSecurity {...props} actions={actions} />}
          />
          <Route
            path={URL.ACCOUNT_USER_HISTORY({ path: true })}
            render={(props) => (
              <UserAccountHistory {...props} actions={actions} />
            )}
          />
          <Redirect
            from={URL.ACCOUNT_SETTINGS()}
            to={URL.ACCOUNT_BASIC_DETAILS()}
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(AccountSettings);
