import { withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import uuid from 'uuid/v4';
import SelectedCompany from 'src/helpers/SelectedCompany';
import WarehouseTab from 'src/screens/common/Warehouse/WarehouseTab';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  classes: any;
}
interface IState {
  contentHash: any;
}

class Warehouse extends Component<IProps, IState> {
  public state = {
    contentHash: uuid(), // this is used to refresh all widget when company change from sidebar
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Warehouse');
  }

  public render() {
    const { classes } = this.props;

    return (
      <div>
        <SelectedCompany
          onChange={() => {
            this.setState({
              contentHash: uuid(),
            });
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <div className={classes.page}>
                <WarehouseTab {...this.props} />
              </div>
            </Grid>
          </Grid>
        </SelectedCompany>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
)(Warehouse);
