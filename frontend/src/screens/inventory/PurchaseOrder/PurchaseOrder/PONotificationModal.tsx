import React, { Component, useState } from 'react';
import { compose } from 'react-apollo';
import {
  withStyles,
  Modal,
  EmailInputFields,
  Checkbox,
} from '@kudoo/components';
import { withPurchaseOrderMailSend } from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import { connect } from 'react-redux';
import { IProfileState } from '@client/store/reducers/profile';
import idx from 'idx';
import styles, { StyleKeys } from './styles';

type IProps = IComponentProps<StyleKeys> & {
  onClose: () => void;
  visible: boolean;
  purchaseOrder: {
    supplier: {
      id: string;
      name: string;
    };
    pbsOrganisation: string;
    preview: object;
    isPbsPO: boolean;
    poNumber: number;
  };
  sendPurchaseOrderMail: ({}) => {
    success: object;
    error: [];
  };
  profile: IProfileState;
};

const PONotificationModal: React.FC<IProps> = props => {
  const {
    onClose,
    visible,
    classes,
    purchaseOrder,
    sendPurchaseOrderMail,
  } = props;

  const [emails, setEmails] = useState({
    to: [],
    bcc: [],
    cc: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [sendViaEdi, setSendViaEdi] = useState(false);

  const isSubmitDisabled = emails.to.length <= 0 || submitting;

  const sendPONotificationEmail = async () => {
    try {
      setSubmitting(true);
      const res = sendPurchaseOrderMail({
        data: {
          poNumber: purchaseOrder.poNumber,
          name: purchaseOrder.isPbsPO
            ? JSON.parse(purchaseOrder.pbsOrganisation).key
            : idx(purchaseOrder, x => x.supplier.name),
          preview: purchaseOrder.preview,
          companyName: name,
          to: (emails.to || []).map(({ email }) => email),
          bcc: (emails.bcc || []).map(({ email }) => email),
          cc: (emails.cc || []).map(({ email }) => email),
          opts: {
            sendViaEdi,
          },
        },
      });
      if (res.success) {
        showToast(null, 'Email sent');
        onClose();
        setSendViaEdi(false);
      } else {
        res.error.forEach(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton
      title='Send Purchase Order Email'
      description={
        <div>
          <div>Please add emails</div>
          <EmailInputFields
            onEmailChange={value => {
              setEmails(prev => ({
                ...prev,
                ...value,
              }));
            }}
          />
          <React.Fragment>
            <div className={classes.includeCheckboxWrapper}>
              <Checkbox
                label='Send Via EDI'
                value={sendViaEdi}
                onChange={checked => {
                  setSendViaEdi(checked);
                }}
              />
            </div>
          </React.Fragment>
        </div>
      }
      buttons={[
        {
          title: submitting ? 'Submitting...' : 'Submit',
          onClick: sendPONotificationEmail,
          isDisabled: isSubmitDisabled,
          loading: submitting,
        },
      ]}
    />
  );
};

PONotificationModal.defaultProps = {
  onClose: () => {},
};

export default compose<IProps, IProps>(
  withStyles(styles),
  withPurchaseOrderMailSend(),
  connect((state: { profile: object }) => ({
    profile: state.profile,
  }))
)(PONotificationModal);
