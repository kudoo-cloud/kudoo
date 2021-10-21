import { Tabs, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import DAOGeneralBasics from '../DAOGeneralBasics';
import DAOGeneralContact from '../DAOGeneralContact';
import DAOGeneralLocation from '../DAOGeneralLocation';
import styles from './styles';

type Props = {
  actions: any;
  createDao: Function;
  classes: any;
};
type State = {
  activeTab: 0;
};

class CreateDAO extends Component<Props, State> {
  state: any = {
    activeTab: 0,
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Create DAO');
  }

  _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[{ label: 'General' }]}
        tabTheme='secondary'
        activeIndex={0}
      />
    );
  }

  _renderTertiaryTabs() {
    return (
      <Tabs
        tabs={[
          { label: 'Basic Details' },
          // { label: 'Contact Details' },
          // { label: 'Location Details' },
        ]}
        tabTheme='tertiary'
        activeIndex={this.state.activeTab}
        onChange={(value) => {
          this.setState({
            activeTab: value,
          });
        }}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { activeTab } = this.state;
    return (
      <div className={classes.page}>
        {this._renderSecondaryTabs()}
        {this._renderTertiaryTabs()}
        {activeTab === 0 && <DAOGeneralBasics {...this.props} isCreateNewDAO />}
        {activeTab === 1 && (
          <DAOGeneralContact {...this.props} isCreateNewDAO />
        )}
        {activeTab === 2 && (
          <DAOGeneralLocation {...this.props} isCreateNewDAO />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CreateDAO);
