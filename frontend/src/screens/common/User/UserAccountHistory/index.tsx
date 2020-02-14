import React, { Component } from 'react';
import {
  withStyles,
  ErrorBoundary,
  Table,
  SectionHeader,
  withRouterProps,
} from '@kudoo/components';
// import { type ColumnFlowType } from 'components/Table/types';
import styles from './styles';

interface IProps {
  actions: object;
  classes: any;
}
interface IState {
  headerData: object[];
  historyData: object[];
}

class UserAccountHistory extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    const data = [
      {
        company: 'Ace Powder Coating',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '12/06/2017 - 04:40 AEDT',
      },
      {
        company: 'Bitesize Gear',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '05/11/2017 - 12:32 AEDT',
      },
      {
        company: 'Ace Powder Coating',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '12/06/2017 - 04:40 AEDT',
      },
      {
        company: 'Bitesize Gear',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '05/11/2017 - 12:32 AEDT',
      },
      {
        company: 'Ace Powder Coating',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '12/06/2017 - 04:40 AEDT',
      },
      {
        company: 'Bitesize Gear',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '05/11/2017 - 12:32 AEDT',
      },
    ];

    this.state = {
      headerData: [
        { id: 'company', label: 'Company' },
        { id: 'device', label: 'Device' },
        { id: 'when', label: 'When' },
        { id: 'where', label: 'Where' },
      ],
      historyData: data,
    };
  }

  public _renderFormSection() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <SectionHeader
          title='Account Activity'
          subtitle='See anything unusual? Try resetting your password!'
          classes={{ component: classes.sectionHeading }}
        />
        <Table
          columnData={this.state.headerData}
          data={this.state.historyData}
          sortable={false}
          showRemoveIcon={false}
        />
      </React.Fragment>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>{this._renderFormSection()}</div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(UserAccountHistory);
