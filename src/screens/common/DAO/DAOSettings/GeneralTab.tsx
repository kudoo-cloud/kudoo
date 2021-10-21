import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import idx from 'idx';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import URL from 'src/helpers/urls';
import DAOGeneralBasics from '../DAOGeneralBasics';
import DAOGeneralContact from '../DAOGeneralContact';
import DAOGeneralLocation from '../DAOGeneralLocation';
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
    if (utils.isURLMatching(URL.DAO_GENERAL_BASICS({ path: true }))) {
      activeTab = 0;
    } else if (
      utils.isURLMatching(URL.DAO_GENERAL_CONTACT_DETAILS({ path: true }))
    ) {
      activeTab = 1;
    } else if (utils.isURLMatching(URL.DAO_GENERAL_LOCATION({ path: true }))) {
      activeTab = 2;
    }
    return activeTab;
  };

  _renderTertiaryTabs() {
    const { match } = this.props;
    const daoId = idx(match, (_) => _.params.daoId);
    return (
      <Tabs
        tabs={[
          {
            label: 'Basic Details',
            onClick: () => {
              this.props.history.push(URL.DAO_GENERAL_BASICS({ daoId }));
            },
          },
          {
            label: 'Contact Details',
            onClick: () => {
              this.props.history.push(
                URL.DAO_GENERAL_CONTACT_DETAILS({ daoId }),
              );
            },
          },
          {
            label: 'Location Details',
            onClick: () => {
              this.props.history.push(URL.DAO_GENERAL_LOCATION({ daoId }));
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
    const daoId = idx(match, (_) => _.params.daoId);
    return (
      <div className={classes.page}>
        {this._renderTertiaryTabs()}

        <Switch>
          <Route
            path={URL.DAO_GENERAL_BASICS({ path: true })}
            render={(props) => (
              <DAOGeneralBasics actions={actions} {...props} />
            )}
          />
          <Route
            path={URL.DAO_GENERAL_CONTACT_DETAILS({ path: true })}
            render={(props) => (
              <DAOGeneralContact actions={actions} {...props} />
            )}
          />
          <Route
            path={URL.DAO_GENERAL_LOCATION({ path: true })}
            render={(props) => (
              <DAOGeneralLocation actions={actions} {...props} />
            )}
          />
          <Redirect
            from={URL.DAO_GENERAL({ daoId })}
            to={URL.DAO_GENERAL_BASICS({ daoId })}
            exact
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles<Props>(styles)(GeneralTab);
