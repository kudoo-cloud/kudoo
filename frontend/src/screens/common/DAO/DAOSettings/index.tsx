import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import idx from 'idx';
import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import Banking from '../Banking';
import Integrations from '../Integrations';
import Multisig from '../Multisig';
import Subscription from '../Subscription';
import GeneralTab from './GeneralTab';
import styles from './styles';
import UsersTab from './UsersTab';

type Props = {
  actions: any;
  classes: any;
  match: any;
  history: any;
};
type State = {};

class DAOSettings extends Component<Props, State> {
  state = {};

  componentDidMount() {
    this.props.actions.updateHeaderTitle('DAO Settings');
  }

  _findActiveSecondaryTab = () => {
    let activeTab = 0;
    if (utils.isURLMatching(URL.DAO_GENERAL({ path: true }))) {
      activeTab = 0;
    } else if (utils.isURLMatching(URL.DAO_Multisig({ path: true }))) {
      activeTab = 1;
    } else if (utils.isURLMatching(URL.DAO_USERS({ path: true }))) {
      activeTab = 2;
    } else if (utils.isURLMatching(URL.DAO_BANKING({ path: true }))) {
      activeTab = 3;
    } else if (utils.isURLMatching(URL.DAO_INTEGRATIONS({ path: true }))) {
      activeTab = 4;
    } else if (utils.isURLMatching(URL.DAO_SUBSCRIPTION({ path: true }))) {
      activeTab = 5;
    }
    return activeTab;
  };

  _renderSecondaryTabs() {
    const { match } = this.props;
    const daoId = idx(match, (_) => _.params.daoId);
    return (
      <Tabs
        tabs={[
          {
            label: 'General',
            onClick: () => {
              this.props.history.push(URL.DAO_GENERAL_BASICS({ daoId }));
            },
          },

          {
            label: 'Multisig',
            onClick: () => {
              this.props.history.push(URL.DAO_Multisig({ daoId }));
            },
          },

          {
            label: 'Users',
            onClick: () => {
              this.props.history.push(URL.DAO_USERS({ daoId }));
            },
          },
          {
            label: 'Banking',
            onClick: () => {
              this.props.history.push(URL.DAO_BANKING({ daoId }));
            },
          },
          {
            label: 'Integrations',
            onClick: () => {
              this.props.history.push(URL.DAO_INTEGRATIONS({ daoId }));
            },
          },
          {
            label: 'Subscription',
            onClick: () => {
              this.props.history.push(URL.DAO_SUBSCRIPTION({ daoId }));
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
    const daoId = idx(match, (_) => _.params.daoId) || '';
    return (
      <div className={classes.page}>
        <SelectedDAO
          onChange={(changedDao) => {
            if (changedDao?.id) {
              this.props.history.push(
                URL.DAO_SETTINGS({ daoId: changedDao?.id }),
              );
            }
          }}
        >
          {this._renderSecondaryTabs()}
          {activeTab === 0 && <GeneralTab {...this.props} actions={actions} />}
          {activeTab === 1 && <Multisig {...this.props} />}
          {activeTab === 2 && <UsersTab {...this.props} />}
          {activeTab === 3 && <Banking {...this.props} />}
          {activeTab === 4 && (
            <Integrations {...this.props} actions={actions} />
          )}
          {activeTab === 5 && (
            <Subscription {...this.props} actions={actions} />
          )}
          {activeTab === 0 && (
            <Switch>
              <Redirect
                exact
                from={URL.DAO_SETTINGS({ daoId })}
                to={URL.DAO_GENERAL({ daoId })}
              />
            </Switch>
          )}
        </SelectedDAO>
      </div>
    );
  }
}

export default withStyles(styles)(DAOSettings);
