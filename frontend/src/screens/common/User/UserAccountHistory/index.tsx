import {
  ErrorBoundary,
  SectionHeader,
  Table,
  withStyles,
} from '@kudoo/components';
import React, { Component } from 'react';
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
        dao: 'Ace Powder Coating',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '12/06/2017 - 04:40 AEDT',
      },
      {
        dao: 'Bitesize Gear',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '05/11/2017 - 12:32 AEDT',
      },
      {
        dao: 'Ace Powder Coating',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '12/06/2017 - 04:40 AEDT',
      },
      {
        dao: 'Bitesize Gear',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '05/11/2017 - 12:32 AEDT',
      },
      {
        dao: 'Ace Powder Coating',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '12/06/2017 - 04:40 AEDT',
      },
      {
        dao: 'Bitesize Gear',
        device: 'Mac using Chrome',
        when: 'Victoria, Australia',
        where: '05/11/2017 - 12:32 AEDT',
      },
    ];

    this.state = {
      headerData: [
        { id: 'dao', label: 'DAO' },
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
