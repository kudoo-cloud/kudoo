import { EmailInputFields, Modal, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { sendInvoiceModalStyles } from './styles';

type Props = {
  onClose?: () => void;
  onSubmit: Function;
  visible?: boolean;
  submitting?: boolean;
  classes?: any;
};
type State = {
  emails: {
    to: Array<any>;
    cc: Array<any>;
    bcc: Array<any>;
  };
};

class SendInvoiceModal extends Component<Props, State> {
  form: any;

  static defaultProps = {
    onClose: () => {},
    submitting: false,
  };

  state = {
    emails: {
      to: [],
      bcc: [],
      cc: [],
    },
  };

  render() {
    const { classes, onClose, visible, submitting } = this.props;
    const { emails } = this.state;
    const isSubmitDisabled = emails.to.length <= 0 || submitting;
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        title='Send invoice to customer?'
        description={
          <div>
            <div>
              If you proceed we will send this invoice to your customer. If you
              are unsure then rather cancel and save it as a draft.
            </div>
            <br />
            <div>Please add emails</div>
            <EmailInputFields
              classes={{ component: classes.emailInputs }}
              onEmailChange={(value) => {
                const { emails } = this.state;
                this.setState({
                  emails: {
                    ...emails,
                    ...value,
                  },
                });
              }}
            />
            <br />
            <div>
              Are you sure you want to send this invoice to your customer?
            </div>
          </div>
        }
        buttons={[
          { title: 'Cancel', type: 'cancel', onClick: onClose },
          {
            title: submitting ? 'Submitting...' : 'Submit',
            isDisabled: isSubmitDisabled,
            loading: submitting,
            onClick: () => this.props.onSubmit(emails),
          },
        ]}
      />
    );
  }
}

export default withStyles<Props>(sendInvoiceModalStyles)(SendInvoiceModal);
