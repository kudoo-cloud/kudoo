import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withStyles, Tabs, helpers as utils } from '@kudoo/components';
import UpgradeComponent from '@client/common_screens/UpgradeComponent';
import { ITab } from '@client/security/types';
import {
  isFeatureAvailable,
  needsLicenseUpgrade,
} from '@client/security/helper';
import styles from './styles';

interface IProps {
  name: string;
  actions: any;
  classes: any;
  history: any;
  theme: any;
  tabs: ITab[];
  profile: any;
  isTertiaryTab?: boolean;
}

class SecondaryTabs extends Component<IProps> {
  public componentDidMount() {
    this.props.actions.updateHeaderTitle(this.props.name || '');
  }

  public _findActiveSecondaryTab = () => {
    const { tabs, profile } = this.props;
    const filteredAvailableTabs = tabs.filter(tab =>
      isFeatureAvailable(profile.selectedCompany, tab.availability!)
    );
    let activeTab = 0;
    filteredAvailableTabs.forEach((tab, index) => {
      if (utils.isURLMatching(tab.url!({ path: true }))) {
        activeTab = index;
      }
    });
    return activeTab;
  };

  public _renderSecondaryTabs() {
    const { tabs, history, profile, isTertiaryTab } = this.props;
    const filteredAvailableTabs = tabs.filter(tab =>
      isFeatureAvailable(profile.selectedCompany, tab.availability!)
    );
    return (
      <Tabs
        tabs={filteredAvailableTabs.map(tab => ({
          label: tab.name,
          onClick: () => {
            history.push(tab.url!());
          },
        }))}
        tabTheme={isTertiaryTab ? 'tertiary' : 'secondary'}
        activeIndex={this._findActiveSecondaryTab()}
      />
    );
  }

  public render() {
    const { classes, actions, profile, history, tabs } = this.props;

    const filteredAvailableTabs = tabs.filter(tab =>
      isFeatureAvailable(profile.selectedCompany, tab.availability!)
    );

    if (filteredAvailableTabs.length <= 0) {
      // Here if there is no filtered tab that means there is nothing to render
      // no tabs are available to render that means there is some problem with the security configuration
      return null;
    }

    return (
      <div className={classes.page}>
        {this._renderSecondaryTabs()}

        <Switch>
          {filteredAvailableTabs.map((tab, index) => {
            const {
              reactComponent: TabComponent,
              name,
              url,
              tabs,
              isTertiaryTab,
              availability,
              licenseRequired,
              ...rest
            } = tab;
            return (
              <Route
                key={index}
                path={url!({ path: true })}
                render={routeParams => {
                  const requireLicenseUpgrade = needsLicenseUpgrade(
                    profile.selectedCompany,
                    licenseRequired!
                  );
                  if (requireLicenseUpgrade) {
                    return <UpgradeComponent history={history} />;
                  } else {
                    return (
                      // @ts-ignore
                      <TabComponent
                        actions={actions}
                        {...routeParams}
                        tabs={tabs}
                        isTertiaryTab={isTertiaryTab}
                        name={name}
                        {...rest}
                      />
                    );
                  }
                }}
              />
            );
          })}
          {/* In case there is no route match , then we are redirecting user to first available tab */}
          <Redirect to={filteredAvailableTabs[0].url!()} />
        </Switch>
      </div>
    );
  }
}

export default compose<IProps, IProps>(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  }))
)(SecondaryTabs);
