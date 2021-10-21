import { withStyles } from '@kudoo/components';
import { withI18n } from '@lingui/react';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { SERVICE_BILLING_TYPE } from 'src/helpers/constants';
import { ServiceBlockStyles } from './styles';

type Props = {
  name: string;
  type: string;
  price: string;
  classes: any;
  perUnit: string;
  chargeGST: boolean;
  onRemoveClick: Function;
  i18n: any;
};
type State = {};

class ServiceBlock extends Component<Props, State> {
  state = {};

  render() {
    const {
      classes,
      name,
      type,
      price,
      chargeGST,
      perUnit,
      onRemoveClick,
      i18n,
    } = this.props;
    const gstWord = i18n._(`GST`);
    return (
      <div className={classes.serviceBlock} data-test={`added-service-${name}`}>
        <div className={classes.serviceInfo}>
          <div className={classes.serviceName}>{name}</div>
          <div className={classes.serviceTypeWrapper}>
            <div className={classes.serviceType}>
              {type === SERVICE_BILLING_TYPE.FIXED
                ? 'Fixed Payment'
                : 'Time Based Payment'}
            </div>
            <div className={classes.servicePrice}>
              {i18n._(`currency-symbol`)}
              {price}{' '}
              {type === SERVICE_BILLING_TYPE.TIME_BASED && 'per ' + perUnit}{' '}
              {chargeGST ? `incl ${gstWord}` : `excl ${gstWord}`}
            </div>
          </div>
        </div>
        <div
          className={classes.serviceRemoveIcon}
          onClick={onRemoveClick as any}
        >
          <i className='ion-android-close' />
        </div>
      </div>
    );
  }
}

export default compose<any, any>(
  withStyles(ServiceBlockStyles),
  withI18n(),
)(ServiceBlock);
