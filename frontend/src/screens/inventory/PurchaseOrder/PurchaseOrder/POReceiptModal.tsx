import { Modal, withStyles } from '@kudoo/components';
// import idx from 'idx';
import React, { useState } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { showToast } from 'src/helpers/toast';
import { IReduxState } from 'src/store/reducers';
import { IProfileState } from 'src/store/reducers/profile';
import { IPOResponse } from '../PbsPurchaseOrderTab/CreatePbsPO/PBSPOtypes';
import styles, { StyleKeys } from './styles';
import { POSTATUS } from './types';

type IProps = IRouteProps<StyleKeys> & {
  onClose: () => void;
  visible: boolean;
  purchaseOrder: {
    id: string;
    isPbsPO: boolean;
  };
  purchaseOrderLines: {
    data: [
      {
        date: string;
        item: { id: string };
        site: { id: string };
        pbsDrug: string;
        qty: number;
        purchaseOrder: { id: string };
      },
    ];
  };
  generateApInvoice: ({}) => {
    success: object;
    error: [];
  };
  profile: IProfileState;
  createInventoryOnHand: ({}) => Promise<IPOResponse>;
  updateApInvoice: ({}) => Promise<IPOResponse>;
  updatePurchaseOrder: ({}) => Promise<IPOResponse>;
};

const POInvoiceModal: React.FC<IProps> = (props) => {
  const {
    onClose,
    visible,
    updatePurchaseOrder,
    createInventoryOnHand,
    purchaseOrder,
    purchaseOrderLines,
  } = props;

  const [submitting, setSubmitting] = useState(false);
  const isSubmitDisabled = submitting;

  const generateApInvoice = async () => {
    try {
      setSubmitting(true);
      let flag = 0;
      purchaseOrderLines.data.forEach(async (_) => {
        const dataToSend = {
          date: _.date || new Date(),
          item:
            (!purchaseOrder.isPbsPO && { connect: { id: _.item.id } }) || null,
          warehouse: { connect: { id: _.site.id } } || null,
          pbsDrug: (purchaseOrder.isPbsPO && _.pbsDrug) || null,
          purchaseOrder: { connect: { id: _.purchaseOrder.id } } || null,
          onHandQty: _.qty || 0,
        };
        const inventoryOnHandRes = await createInventoryOnHand({
          data: dataToSend,
        });
        if (inventoryOnHandRes.error && flag === 0) {
          flag = 1;
          showToast(null, 'Try Again!');
          onClose();
        }
      });
      if (flag === 0) {
        const res = await updatePurchaseOrder({
          data: {
            status: POSTATUS.RECEIPTED,
          },
          where: { id: purchaseOrder.id },
        });
        if (res.success) {
          setSubmitting(false);
          showToast(null, 'Status Updated.');
          onClose();
        } else {
          res.error.forEach((err) => showToast(err));
          onClose();
        }
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
      title='Confirm Receipt of Purchase Order'
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
  createInventoryOnHand: () => ({} as any),
  updateApInvoice: () => ({} as any),
  updatePurchaseOrder: () => ({} as any),
};

export default compose<IProps, IProps>(
  withStyles(styles),
  // withUpdatePurchaseOrder(),
  // withCreateInventoryOnHand(),
  // withPurchaseOrderLines((props, type) => {
  //   let isArchived = false;
  //   if (type === 'archived-purchaseOrderLines') {
  //     isArchived = true;
  //   }
  //   const purchaseOrderId = idx(props, (_) => _.purchaseOrder.id);
  //   return {
  //     variables: {
  //       where: {
  //         purchaseOrder: {
  //           id: purchaseOrderId,
  //         },
  //         isArchived,
  //       },
  //       orderBy: 'id_ASC',
  //     },
  //   };
  // }),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
)(POInvoiceModal);
