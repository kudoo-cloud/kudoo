import { ErrorBoundary, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import idx from 'idx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import URL from 'src/helpers/urls';
import styles from './styles';

interface IProps {
  actions: any;
  classes: any;
  profile: any;
  configToShow: any;
}

class Config extends Component<IProps, {}> {
  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Configuration');
  }

  public render() {
    const { classes, profile, configToShow } = this.props;
    const daoId = idx(profile, (_) => _.selectedDAO.id) || '';
    const isOwner = idx(profile, (_) => _.selectedDAO.owner) || '';
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <Link className={classes.closeIconWrapper} to={URL.DASHBOARD()}>
            <i className={cx('icon icon-close')} />
          </Link>
          <Grid container classes={{ container: classes.aboveRow }}>
            {configToShow.includes('UserAccountSettings') && (
              <Grid item xs={12} sm={6}>
                <div className={classes.greyHeading}>User Account Settings</div>
                <div className={classes.linksWrapper}>
                  <Link
                    className={classes.whiteLink}
                    to={URL.ACCOUNT_BASIC_DETAILS()}
                  >
                    Basic Details
                  </Link>
                  <Link
                    className={classes.whiteLink}
                    to={URL.ACCOUNT_USER_SECURITY()}
                  >
                    Security
                  </Link>
                </div>
              </Grid>
            )}
            {isOwner && configToShow.includes('DAOSettings') && (
              <Grid item xs={12} sm={6}>
                <div className={classes.greyHeading}>DAO Settings</div>
                <div className={classes.linksWrapper}>
                  <Link
                    className={classes.whiteLink}
                    to={
                      daoId
                        ? URL.DAO_GENERAL_BASICS({
                            daoId,
                          })
                        : ''
                    }
                  >
                    General
                  </Link>
                  <Link
                    className={classes.whiteLink}
                    to={daoId ? URL.DAO_USERS({ daoId }) : ''}
                  >
                    Users
                  </Link>
                  <Link
                    className={classes.whiteLink}
                    to={daoId ? URL.DAO_BANKING({ daoId }) : ''}
                  >
                    Banking
                  </Link>
                  <Link
                    className={classes.whiteLink}
                    to={daoId ? URL.DAO_INTEGRATIONS({ daoId }) : ''}
                  >
                    Integrations
                  </Link>
                  <Link
                    className={classes.whiteLink}
                    to={daoId ? URL.DAO_SUBSCRIPTION({ daoId }) : ''}
                  >
                    Subscription
                  </Link>
                </div>
              </Grid>
            )}
          </Grid>
          {isOwner && configToShow.includes('TimesheetSettings') && (
            <Grid container classes={{ container: cx(classes.aboveRow) }}>
              <Grid item xs={12} sm={6}>
                <div className={classes.greenHeading}>Timesheet Settings</div>
                <div className={classes.linksWrapper}>
                  <Link
                    className={classes.whiteLink}
                    to={URL.TIMESHEET_SETTINGS_LAYOUT()}
                  >
                    Layout
                  </Link>
                  <Link
                    className={classes.whiteLink}
                    to={URL.TIMESHEET_SETTINGS_AUTOMATION()}
                  >
                    Automation
                  </Link>
                </div>
              </Grid>
            </Grid>
          )}
          {/* {isOwner && (
            <Grid container classes={{ container: classes.rowContainer }}>
              <Grid item xs={12} sm={6}>
                <div className={classes.greenHeading}>Integrations</div>
                <div className={classes.linksWrapper}>
                  <div className={classes.whiteLink}>Paypal</div>
                  <div className={classes.whiteLink}>Stripe</div>
                </div>
              </Grid>
            </Grid>
          )} */}
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
)(Config);
