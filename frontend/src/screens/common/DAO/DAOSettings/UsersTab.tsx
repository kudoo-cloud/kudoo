import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import idx from 'idx';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import URL from 'src/helpers/urls';
import DAOUsers from '../DAOUsers';
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
    if (utils.isURLMatching(URL.DAO_USERS_LIST({ path: true }))) {
      activeTab = 0;
    }
    // else if (utils.isURLMatching(URL.DAO_USERS_ROLES({ path: true }))) {
    //   activeTab = 1;
    // }
    return activeTab;
  };

  _renderTertiaryTabs() {
    const { match } = this.props;
    const daoId = idx(match, (_) => _.params.daoId);
    return (
      <Tabs
        tabs={[
          {
            label: 'Users List',
            onClick: () => {
              this.props.history.push(URL.DAO_USERS_LIST({ daoId }));
            },
          },
          // {
          //   label: 'User Roles',
          //   onClick: () => {
          //     this.props.history.push(URL.DAO_USERS_ROLES({ daoId }));
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
    const daoId = idx(match, (_) => _.params.daoId);
    return (
      <div className={classes.page}>
        {this._renderTertiaryTabs()}

        <Switch>
          <Route
            path={URL.DAO_USERS_LIST({ path: true })}
            render={(props) => <DAOUsers {...props} actions={actions} />}
          />
          <Route
            path={URL.INVITE_USER({ path: true })}
            render={(props) => <InviteUser {...props} actions={actions} />}
          />
          <Redirect
            from={URL.DAO_USERS({ daoId })}
            to={URL.DAO_USERS_LIST({ daoId })}
            exact
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(UsersTab);
