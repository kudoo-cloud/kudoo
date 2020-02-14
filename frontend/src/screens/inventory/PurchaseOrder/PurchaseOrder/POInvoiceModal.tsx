import React, { Component, useState } from 'react';
import { compose } from 'react-apollo';
import {
  withStyles,
  Modal,
  TextField,
  withStylesProps,
} from '@kudoo/components';
import { showToast } from '@client/helpers/toast';
import { connect } from 'react-redux';
import {
  withUpdateApInvoice,
  withUpdatePurchaseOrder,
  withCreateApInvoice,
} from '@kudoo/graphql';
import { IPOResponse } from 'src/screens/inventory/PurchaseOrder/PbsPurchaseOrderTab/CreatePbsPO/PBSPOtypes';
import {
  APINVOICE,
  POSTATUS,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/types';
import { IProfileState } from '@client/store/reducers/profile';
import { IReduxState } from '@client/store/reducers';
import styles, { StyleKeys } from './styles';

type IProps = IRouteProps<StyleKeys> & {
  onClose: () => void;
  visible: boolean;
  purchaseOrder: {
    id?: string;
  };
  profile: IProfileState;
  createApInvoice: ({}) => Promise<IPOResponse>;
  updateApInvoice: ({}) => Promise<IPOResponse>;
  updatePurchaseOrder: ({}) => Promise<IPOResponse>;
};

const POInvoiceModal: React.FC<IProps> = props => {
  const {
    onClose,
    visible,
    profile,
    purchaseOrder,
    createApInvoice,
    updatePurchaseOrder,
  } = props;

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSubmitDisabled = !invoiceNumber || submitting;

  const generateApInvoice = async () => {
    try {
      setSubmitting(true);
      const dataToSend = {
        purchaseOrder: {
          connect: {
            id: purchaseOrder.id,
          },
        },
        status: APINVOICE.OPEN,
        invoiceNumber,
      };
      const apInvoiceRes = await createApInvoice({
        data: dataToSend,
      });
      if (apInvoiceRes.success) {
        const res = await updatePurchaseOrder({
          data: {
            status: POSTATUS.INVOICED,
          },
          where: { id: purchaseOrder.id },
        });
        if (res.success) {
          showToast(null, 'Status Updated');
          onClose();
        } else {
          res.error.forEach(err => showToast(err));
          onClose();
        }
      } else {
        apInvoiceRes.error.forEach(err => showToast(err));
        onClose();
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
          <TextField
            label={'Invoice Number'}
            placeholder={'1234'}
            name='invoiceNumber'
            id='invoiceNumber'
            value={String(invoiceNumber)}
            onChange={e => {
              setInvoiceNumber(e.target.value);
            }}
          />
        </div>
      }
      buttons={[
        {
          title: submitting ? 'Submitting...' : 'Submit',
          onClick: generateApInvoice,
          isDisabled: isSubmitDisabled,
          loading: submitting,
        },
      ]}
    />
  );
};

POInvoiceModal.defaultProps = {
  onClose: () => {},
  purchaseOrder: {},
};

export default compose<IProps, IProps>(
  withStyles(styles),
  withUpdatePurchaseOrder(),
  withCreateApInvoice(),
  withUpdateApInvoice(),
  connect((state: IReduxState) => ({
    profile: state.profile,
  }))
)(POInvoiceModal);
