import { DatePicker, withStyles } from '@kudoo/components';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import get from 'lodash/get';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import uuid from 'uuid/v4';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { IReduxState } from 'src/store/reducers';
import Widget from 'src/widgets/Widget';
import styles from './styles';

type Props = {
  actions: any;
  profile: any;
  classes: any;
};
type State = {
  contentHash: any;
};

class Dashboard extends Component<Props, State> {
  state = {
    contentHash: uuid(), // this is used to refresh all widget when company change from sidebar
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Dashboard');
  }

  _renderHeaderBar() {
    const { classes } = this.props;
    return (
      <div className={classes.headerBar}>
        <ButtonBase focusRipple classes={{ root: classes.refreshButton }}>
          <i className='fa fa-refresh' />
        </ButtonBase>
        <div className={classes.lastRefreshText}>
          last refresh today 12:34pm
        </div>
        <div className={classes.periodButtons}>
          <ButtonBase focusRipple classes={{ root: classes.periodButton }}>
            Week
          </ButtonBase>
          <ButtonBase focusRipple classes={{ root: classes.periodButton }}>
            Month
          </ButtonBase>
          <ButtonBase
            focusRipple
            classes={{ root: cx(classes.periodButton, 'active') }}
          >
            Year
          </ButtonBase>
        </div>
        <DatePicker
          dateFormat='MMM YYYY'
          classes={{
            textInputWrapper: classes.dateInput,
            calendarButton: classes.calendarBtn,
          }}
        />
      </div>
    );
  }

  render() {
    const { classes, profile } = this.props;
    const { contentHash } = this.state;
    const isCompanyOwner = get(profile, 'selectedCompany.owner');

    return (
      <div className={classes.page}>
        <SelectedCompany
          onChange={() => {
            this.setState({
              contentHash: uuid(),
            });
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12}>
              {/* {this._renderHeaderBar()} */}
              <div className={classes.widgets}>
                {/* <Widget type="profile-stats" contentHash={contentHash} /> */}
                {isCompanyOwner && (
                  <Widget
                    type='revenue'
                    xs={12}
                    md={8}
                    contentHash={contentHash}
                  />
                )}
                {isCompanyOwner && (
                  <Widget
                    type='average-stats'
                    xs={12}
                    md={4}
                    contentHash={contentHash}
                  />
                )}
                {isCompanyOwner && (
                  <Widget type='invoices' contentHash={contentHash} />
                )}
                {!isCompanyOwner && (
                  <Widget type='timesheets' contentHash={contentHash} />
                )}
                <Widget
                  type='recent-customers'
                  contentHash={contentHash}
                  xs={12}
                  md={6}
                />
                <Widget
                  type='recent-projects'
                  contentHash={contentHash}
                  xs={12}
                  md={6}
                />
              </div>
            </Grid>
            {/* <Grid item xs={3}>
            <LatestActivity />
          </Grid> */}
          </Grid>
        </SelectedCompany>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
)(Dashboard as any);
