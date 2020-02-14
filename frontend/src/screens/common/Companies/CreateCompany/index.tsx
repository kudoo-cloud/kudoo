import React, { Component } from 'react';
import {
  withStyles,
  Tabs,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import CompaniesGeneralBasics from '../CompaniesGeneralBasics';
import CompaniesGeneralLocation from '../CompaniesGeneralLocation';
import CompaniesGeneralContact from '../CompaniesGeneralContact';
import styles from './styles';

type Props = {
  actions: any;
  createCompany: Function;
  classes: any;
};
type State = {
  activeTab: 0;
};

class CreateCompany extends Component<Props, State> {
  state: any = {
    activeTab: 0,
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Create Company');
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
        onChange={value => {
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
        {activeTab === 0 && (
          <CompaniesGeneralBasics {...this.props} isCreateNewCompany />
        )}
        {activeTab === 1 && (
          <CompaniesGeneralContact {...this.props} isCreateNewCompany />
        )}
        {activeTab === 2 && (
          <CompaniesGeneralLocation {...this.props} isCreateNewCompany />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CreateCompany);
