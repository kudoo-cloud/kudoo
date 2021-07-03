import { Button, Modal, withStyles } from '@kudoo/components';
import cx from 'classnames';
import idx from 'idx';
import React, { useState } from 'react';
import { CardElement, Elements, injectStripe } from 'react-stripe-elements';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import styles, { StylesKeys } from './styles';

type Props = IComponentProps<StylesKeys> & {
  onClose?: Function;
  visible: boolean;
  onPaymentComplete: Function;
  selectedPlanName: string;
};

type InternalProps = {
  changeSubscriptionPlan: Function;
  stripe: {
    createToken: Function;
  };
};

const elementsStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#c23d4b',
    },
  },
};

const PaymentForm: React.FC<Props & InternalProps> = (props) => {
  const {
    classes,
    onClose,
    visible,
    theme,
    stripe,
    selectedPlanName,
    changeSubscriptionPlan,
    onPaymentComplete,
  } = props;

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = ({ error }: any) => {
    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (stripe) {
        setSubmitting(true);
        const tokenRes = await stripe.createToken();
        const token = idx(tokenRes, (x) => x.token.id);
        const res = await changeSubscriptionPlan({
          sourceToken: token,
          toPlan: selectedPlanName,
          type: 'PLAN_CHANGE',
        });
        if (res.success) {
          onPaymentComplete();
        } else {
          (idx(res, (x) => x.error) || []).forEach((err) => {
            showToast(err);
          });
        }
        setSubmitting(false);
      } else {
        console.log("Stripe.js hasn't loaded yet.");
      }
    } catch (error) {
      showToast(error.toString());
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton
      classes={{
        contentInnerWrapper: classes.paymentModalInner,
      }}
      title='Payment'
      description={
        <div>
          <form onSubmit={handleSubmit}>
            <div
              className={cx(classes.paymentFormElement, {
                [classes.paymentFormElementError]: !!errorMessage,
              })}
            >
              <label>
                <CardElement onChange={handleChange} {...elementsStyle} />
              </label>
            </div>
            {!!errorMessage && (
              <div className={classes.paymentFormError} role='alert'>
                {errorMessage}
              </div>
            )}
            <Button
              title='Pay'
              isDisabled={submitting}
              loading={submitting}
              buttonColor={theme.palette.primary.color2}
              classes={{ component: classes.paymentPayButton }}
              type='Submit'
              height={50}
            />
          </form>
        </div>
      }
    />
  );
};

PaymentForm.defaultProps = {
  onClose: () => {},
  changeSubscriptionPlan: () => ({}),
};

const EnhancedPaymentForm = compose<Props, Props>(
  withStyles(styles),
  // withChangeSubscriptionPlan(),
  injectStripe,
)(PaymentForm);

const PaymentModal: React.FC<Props> = (props) => {
  return (
    <Elements>
      <EnhancedPaymentForm {...props}></EnhancedPaymentForm>
    </Elements>
  );
};

export default PaymentModal;
