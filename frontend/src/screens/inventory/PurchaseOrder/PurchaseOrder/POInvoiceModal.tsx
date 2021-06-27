import { Modal, TextField, withStyles } from '@kudoo/components';
import React, { useState } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { showToast } from 'src/helpers/toast';
import { IPOResponse } from 'src/screens/inventory/PurchaseOrder/PbsPurchaseOrderTab/CreatePbsPO/PBSPOtypes';
import {
  APINVOICE,
  POSTATUS,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/types';
import { IReduxState } from 'src/store/reducers';
import { IProfileState } from 'src/store/reducers/profile';
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

const POInvoiceModal: React.FC<IProps> = (props) => {
  const {
    onClose,
    visible,
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
          res.error.forEach((err) => showToast(err));
          onClose();
        }
      } else {
        apInvoiceRes.error.forEach((err) => showToast(err));
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
            onChange={(e) => {
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
  createApInvoice: () => ({} as any),
  updateApInvoice: () => ({} as any),
  updatePurchaseOrder: () => ({} as any),
};

export default compose<IProps, IProps>(
  withStyles(styles),
  // withUpdatePurchaseOrder(),
  // withCreateApInvoice(),
  // withUpdateApInvoice(),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
)(POInvoiceModal);
