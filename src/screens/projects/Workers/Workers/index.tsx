import { Tabs, helpers as utils, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import URL from 'src/helpers/urls';
import ActiveWorkersTab from './ActiveWorkersTab';
import ArchivedWorkersTab from './ArchivedWorkersTab';
import styles from './styles';

type Props = {
  actions: any;
  history: any;
  classes: any;
};
type State = {};

class Workers extends Component<Props, State> {
  state = {};

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Workers');
  }

  _findActiveSecondaryTab = () => {
    let activeTab = 0;
    if (utils.isURLMatching(URL.ACTIVE_WORKERS())) {
      activeTab = 0;
    } else if (utils.isURLMatching(URL.ARCHIVED_WORKERS())) {
      activeTab = 1;
    }
    return activeTab;
  };

  _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'All Workers',
            onClick: () => {
              this.props.history.push(URL.ACTIVE_WORKERS());
            },
          },
          {
            label: 'Archived',
            onClick: () => {
              this.props.history.push(URL.ARCHIVED_WORKERS());
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={this._findActiveSecondaryTab()}
      />
    );
  }

  render() {
    const { classes, actions } = this.props;
    return (
      <div className={classes.page}>
        {this._renderSecondaryTabs()}
        <Switch>
          <Route
            path={URL.ACTIVE_WORKERS()}
            render={(props) => (
              <ActiveWorkersTab {...props} actions={actions} />
            )}
          />
          <Route
            path={URL.ARCHIVED_WORKERS()}
            render={(props) => (
              <ArchivedWorkersTab {...props} actions={actions} />
            )}
          />
          <Redirect from={URL.WORKERS()} to={URL.ACTIVE_WORKERS()} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(Workers);
