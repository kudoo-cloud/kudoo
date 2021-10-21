import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import URL from 'src/helpers/urls';
import AutomationTab from './AutomationTab';
import LayoutTab from './LayoutTab';
import styles from './styles';

type Props = {
  actions: any;
  history: any;
  classes: any;
};
type State = {};

class TimesheetSettings extends Component<Props, State> {
  componentDidMount() {
    this.props.actions.updateHeaderTitle('Timesheet Settings');
  }

  _findActiveSecondaryTab = () => {
    let activeTab = 0;
    if (utils.isURLMatching(URL.TIMESHEET_SETTINGS_LAYOUT({ path: true }))) {
      activeTab = 0;
    } else if (
      utils.isURLMatching(URL.TIMESHEET_SETTINGS_AUTOMATION({ path: true }))
    ) {
      activeTab = 1;
    }
    return activeTab;
  };

  _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'Layout',
            onClick: () => {
              this.props.history.push(URL.TIMESHEET_SETTINGS_LAYOUT());
            },
          },
          {
            label: 'Automation',
            onClick: () => {
              this.props.history.push(URL.TIMESHEET_SETTINGS_AUTOMATION());
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={this._findActiveSecondaryTab()}
      />
    );
  }

  render() {
    const { classes, ...rest } = this.props;
    const activeTab = this._findActiveSecondaryTab();
    return (
      <div className={classes.page}>
        {this._renderSecondaryTabs()}
        {activeTab === 0 && <LayoutTab {...rest} />}
        {activeTab === 1 && <AutomationTab {...rest} />}
        {activeTab === 0 && (
          <Switch>
            <Redirect
              exact
              from={URL.TIMESHEET_SETTINGS()}
              to={URL.TIMESHEET_SETTINGS_LAYOUT()}
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(TimesheetSettings);
