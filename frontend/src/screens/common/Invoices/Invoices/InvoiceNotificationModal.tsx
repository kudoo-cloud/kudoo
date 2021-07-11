import {
  Checkbox,
  EmailInputFields,
  Modal,
  withStyles,
} from '@kudoo/components';
import get from 'lodash/get';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { INVOICE_TYPE } from 'src/helpers/constants';
import { showToast } from 'src/helpers/toast';
import styles from './styles';

type Props = {
  onClose: () => void;
  visible: boolean;
  invoice: any;
  invoiceNotify: Function;
  classes: any;
};
type State = {
  emails: {
    to: Array<any>;
    cc: Array<any>;
    bcc: Array<any>;
  };
  submitting: boolean;
  includeTimesheet: boolean;
  includeTimesheetAttachments: boolean;
};

class InvoiceNotificationModal extends Component<Props, State> {
  form: any;

  static defaultProps = {
    onClose: () => {},
    invoice: {},
    invoiceNotify: () => ({}),
  };

  state = {
    emails: {
      to: [],
      bcc: [],
      cc: [],
    },
    submitting: false,
    includeTimesheet: false,
    includeTimesheetAttachments: false,
  };

  _sendInvoiceNotificationEmail = async () => {
    try {
      const { invoice } = this.props;
      const { emails, includeTimesheet, includeTimesheetAttachments } =
        this.state;
      this.setState({ submitting: true });
      const res = await this.props.invoiceNotify({
        data: {
          invoiceId: invoice.id,
          to: (emails.to || []).map(({ email }) => email),
          bcc: (emails.bcc || []).map(({ email }) => email),
          cc: (emails.cc || []).map(({ email }) => email),
          opts: {
            includeTimesheet,
            includeTimesheetAttachments,
          },
        },
      });
      if (res.success) {
        showToast(null, 'Email sent');
        this.props.onClose();
        this.setState({
          includeTimesheet: false,
          includeTimesheetAttachments: false,
        });
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { onClose, visible, classes, invoice } = this.props;
    const {
      emails,
      submitting,
      includeTimesheet,
      includeTimesheetAttachments,
    } = this.state;
    const isSubmitDisabled = emails.to.length <= 0 || submitting;
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        showCloseButton
        title='Send Invoice Email'
        description={
          <div>
            <div>Please add emails</div>
            <EmailInputFields
              onEmailChange={(value) => {
                this.setState((prevState) => ({
                  emails: {
                    ...prevState.emails,
                    ...value,
                  },
                }));
              }}
            />
            {(get(invoice, 'type') === INVOICE_TYPE.TIMESHEET ||
              get(invoice, 'type') === INVOICE_TYPE.TIMESHEET_WITH_DETAILS) && (
              <React.Fragment>
                <div className={classes.includeCheckboxWrapper}>
                  <Checkbox
                    label='Include Timesheets'
                    value={includeTimesheet}
                    onChange={(checked) => {
                      this.setState({
                        includeTimesheet: checked,
                      });
                      if (!checked) {
                        this.setState({
                          includeTimesheetAttachments: false,
                        });
                      }
                    }}
                  />
                </div>
                <div className={classes.includeCheckboxWrapper}>
                  <Checkbox
                    label='Include Timesheets Attachments'
                    value={includeTimesheetAttachments}
                    onChange={(checked) => {
                      this.setState({
                        includeTimesheetAttachments: checked,
                      });
                    }}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        }
        buttons={[
          {
            title: submitting ? 'Submitting...' : 'Submit',
            onClick: this._sendInvoiceNotificationEmail,
            isDisabled: isSubmitDisabled,
            loading: submitting,
          },
        ]}
      />
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  // withInvoiceNotify(),
)(InvoiceNotificationModal);
