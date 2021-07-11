import { EmailInputFields, Modal, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { TimesheetApproveModalStyles } from './styles';

type Props = {
  onClose: () => void;
  visible: boolean;
  timesheets: Array<any>;
  timeSheetApprove: Function;
  classes: any;
};
type State = {
  emails: Array<any>;
};

class TimesheetApproveModal extends Component<Props, State> {
  form: any;

  static defaultProps = {
    timesheets: [],
    onClose: () => {},
    timeSheetApprove: () => ({}),
  };

  state = {
    emails: [],
  };

  _sendTimesheetApproveEmail = () => {
    const { timesheets } = this.props;
    const { emails } = this.state;
    for (let i = 0; i < timesheets.length; i++) {
      const timeSheetId = timesheets[i];
      this.props.timeSheetApprove({
        timeSheetId,
        to: emails.map(({ email }) => email),
      });
    }
    this.props.onClose();
  };

  render() {
    const { classes, onClose, visible } = this.props;
    const { emails } = this.state;
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        title='Ready to submit for approval'
        description={
          <div>
            <div>
              Your timesheet is now finalised. It will now be submitted for
              Approval.
            </div>
            <br />
            <div>Please add emails</div>
            <EmailInputFields
              classes={{ component: classes.emailInputs }}
              showBCC={false}
              showCC={false}
              onEmailChange={(emails) => {
                this.setState({
                  emails: emails.to,
                });
              }}
            />
          </div>
        }
        buttons={[
          {
            title: 'Submit',
            isDisabled: emails.length <= 0,
            onClick: this._sendTimesheetApproveEmail,
          },
        ]}
      />
    );
  }
}

export default compose<any, any>(
  withStyles(TimesheetApproveModalStyles),
  // withTimeSheetApprove(),
)(TimesheetApproveModal);
