import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { compose } from 'recompose';
import { isFeatureAvailable, needsLicenseUpgrade } from 'src/helpers/security';
import UpgradeComponent from 'src/screens/common/UpgradeComponent';
import { ITab } from 'src/store/types/security';
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
    // TODO: For now we will hsow all tabs
    const filteredAvailableTabs = tabs.filter(
      (tab) =>
        true || isFeatureAvailable(profile.selectedCompany, tab.availability!),
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
    // TODO: For now we will hsow all tabs
    const filteredAvailableTabs = tabs.filter(
      (tab) =>
        true || isFeatureAvailable(profile.selectedCompany, tab.availability!),
    );
    return (
      <Tabs
        tabs={filteredAvailableTabs.map((tab) => ({
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

    // TODO: For now we will hsow all tabs
    const filteredAvailableTabs = tabs.filter(
      (tab) =>
        true || isFeatureAvailable(profile.selectedCompany, tab.availability!),
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
              availability, // eslint-disable-line
              licenseRequired,
              ...rest
            } = tab;
            return (
              <Route
                key={index}
                path={url!({ path: true })}
                render={(routeParams) => {
                  let requireLicenseUpgrade = needsLicenseUpgrade(
                    profile.selectedCompany,
                    licenseRequired!,
                  );
                  // TODO: for now we will show content to user
                  requireLicenseUpgrade = false;

                  if (requireLicenseUpgrade) {
                    return <UpgradeComponent history={history} />;
                  } else {
                    return (
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
  })),
)(SecondaryTabs);
