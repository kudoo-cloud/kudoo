import { Button, ErrorBoundary, withStyles } from '@kudoo/components';
import cx from 'classnames';
import idx from 'idx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import URL from 'src/helpers/urls';
import styles, { ClassKeys } from './styles';

type Props = IRouteProps<ClassKeys> & {
  profile?: any;
};

class UpgradeComponent extends Component<Props> {
  public render() {
    const { classes, theme, history, profile } = this.props;
    const companyId = idx(profile, (_) => _.selectedCompany.id) || '';
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <i className={cx('fa fa-lock', classes.upgradeIcon)} />
          <div className={classes.upgradeMessageText}>
            Please upgrade to access this functionality.
          </div>
          <Button
            title='Upgrade'
            buttonColor={theme.palette.primary.color2}
            applyBorderRadius
            width={300}
            onClick={() => {
              history.push(URL.COMPANY_SUBSCRIPTION({ companyId }));
            }}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<Props, Props>(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
)(UpgradeComponent);
