import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import {
  withStyles,
  DatePicker,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import SelectedCompany from '@client/helpers/SelectedCompany';
import InventoryTab from '@client/common_screens/Inventory/InventoryTab';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  classes: any;
}
interface IState {
  contentHash: any;
}

class Inventory extends Component<IProps, IState> {
  public state = {
    contentHash: uuid(), // this is used to refresh all widget when company change from sidebar
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Inventory');
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
          }}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <div className={classes.page}>
                <InventoryTab {...this.props} />
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
  }))
)(Inventory);
