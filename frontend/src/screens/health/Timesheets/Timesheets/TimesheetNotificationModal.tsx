import { EmailInputFields, Modal, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import { TimesheetNotificationModalStyles } from './styles';

type Props = {
  onClose: () => void;
  visible: boolean;
  timesheetId: string;
  timeSheetNotify: Function;
  classes: any;
};
type State = {
  emails: {
    to: Array<any>;
    cc: Array<any>;
    bcc: Array<any>;
  };
  submitting: boolean;
};

class TimesheetNotificationModal extends Component<Props, State> {
  form: any;

  static defaultProps = {
    onClose: () => {},
    timeSheetNotify: () => ({}),
  };

  state = {
    emails: {
      to: [],
      bcc: [],
      cc: [],
    },
    submitting: false,
  };

  _sendTimesheetNotificationEmail = async () => {
    try {
      const { timesheetId } = this.props;
      const { emails } = this.state;
      this.setState({ submitting: true });
      await this.props.timeSheetNotify({
        timeSheetId: timesheetId,
        to: (emails.to || []).map(({ email }) => email),
        bcc: (emails.bcc || []).map(({ email }) => email),
        cc: (emails.cc || []).map(({ email }) => email),
      });
      this.setState({ submitting: false });
      showToast(null, 'Email sent');
      this.props.onClose();
    } catch (e) {
      this.setState({ submitting: false });
      showToast(e.toString());
    }
  };

  render() {
    const { classes, onClose, visible } = this.props;
    const { emails, submitting } = this.state;
    const isSubmitDisabled = emails.to.length <= 0 || submitting;
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        showCloseButton
        title='Send Timesheet Notify Email'
        description={
          <div>
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
          </div>
        }
        buttons={[
          {
            title: submitting ? 'Submitting...' : 'Submit',
            onClick: this._sendTimesheetNotificationEmail,
            isDisabled: isSubmitDisabled,
            loading: submitting,
          },
        ]}
      />
    );
  }
}

export default compose<any, any>(
  withStyles(TimesheetNotificationModalStyles),
  // withTimeSheetNotify(),
)(TimesheetNotificationModal);
