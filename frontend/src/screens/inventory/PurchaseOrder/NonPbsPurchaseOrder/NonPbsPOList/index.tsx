import { ErrorBoundary, composeStyles, withStyles } from '@kudoo/components';
import cx from 'classnames';
import idx from 'idx';
import filter from 'lodash/filter';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { compose } from 'recompose';
import URL from 'src/helpers/urls';
import useDeepCompareEffect from 'src/helpers/useDeepCompareEffect';
import ListPage from 'src/screens/common/ListPage';
import { IReduxState } from 'src/store/reducers';
import POInvoiceModal from '../../PurchaseOrder/POInvoiceModal';
import PONotificationModal from '../../PurchaseOrder/PONotificationModal';
import POReceiptModal from '../../PurchaseOrder/POReceiptModal';
import styles, { purchaseOrderStyles } from '../../PurchaseOrder/styles';
import { IListProps } from './types';

const PurchaseOrder: React.FC<IListProps> = (props) => {
  const { purchaseOrders, theme, actions, history, classes } = props;

  const purchaseOrdersLoading = idx(purchaseOrders, (x) => x.loading);
  const onLoadMore = idx(purchaseOrders, (x) => x.loadNextPage);

  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [notifiedPO, setNotifiedPO] = useState(null);
  const [isShowingPOModal, setIsShowingPOModal] = useState('');
  const [columns, setColumns] = useState([
    {
      id: 'date',
      label: 'Order Date',
      sorted: true,
      order: 'asc',
      renderCell: (row) => {
        return (
          <Link
            to={
              row.status === 'OPEN'
                ? URL.EDIT_NON_PBS_PURCHASE_ORDER({ id: row.id })
                : URL.PREVIEW_PURCHASE_ORDER({ id: row.id })
            }
            className={classes.borderCell}
          >
            {row['date']}
          </Link>
        );
      },
    },
    {
      id: 'orderer',
      label: 'Orderer',
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (row, cell) => {
        return (
          <div className={cx(classes.borderCell, classes.balanceCell)}>
            {row[cell.id]}
            <div className={classes.iconsWrapper}>
              <Tooltip
                title='Send Email'
                animation='fade'
                position='left'
                arrow
                // arrowType='round'
                trigger={'mouseenter focus' as any}
              >
                <span
                  className={classes.dollarIcon}
                  style={
                    { marginRight: row[cell.id] !== 'INVOICED' && 10 } as any
                  }
                  onClick={() => {
                    showPOModal(row, 'sendEmail');
                  }}
                >
                  <i className='fa fa-envelope-o' />
                </span>
              </Tooltip>
              {row[cell.id] === 'OPEN' && (
                <Tooltip
                  title='Receipt'
                  animation='fade'
                  position='left'
                  arrow
                  // arrowType='round'
                  trigger={'mouseenter focus' as any}
                >
                  <span
                    data-test='invoice-paid-button'
                    className={classes.dollarIcon}
                    onClick={() => {
                      showPOModal(row, 'receipted');
                    }}
                  >
                    <i className='fa fa-arrow-right' />
                  </span>
                </Tooltip>
              )}
              {row[cell.id] === 'RECEIPTED' && (
                <Tooltip
                  title='Invoice'
                  animation='fade'
                  position='left'
                  arrow
                  // arrowType='round'
                  trigger={'mouseenter focus' as any}
                >
                  <span
                    data-test='invoice-paid-button'
                    className={classes.dollarIcon}
                    onClick={() => {
                      showPOModal(row, 'invoiced');
                    }}
                  >
                    <i className='fa fa-usd' />
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
    updatePurchaseOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepCompareEffect(() => {
    updatePurchaseOrders();
  }, [purchaseOrders.data]);

  const updatePurchaseOrders = () => {
    // Filter Non PBS Purchase Order Data
    const purchaseOrderFilterData = filter(
      idx(purchaseOrders, (x) => x.data),
      (_) => !_.isPbsPO,
    );

    // Format Data to display
    const purchaseOrdersData = purchaseOrderFilterData.map((purchaseOrder) => {
      return {
        ...purchaseOrder,
        orderer:
          idx(
            purchaseOrder,
            (_) => _.orderer.firstName + ' ' + _.orderer.lastName,
          ) || '',
        date: moment(purchaseOrder.date as Date).format('DD MMM YYYY'),
      };
    });
    setDisplayedOrders(purchaseOrdersData);
  };

  const showPOModal = (purchaseOrder, modalName) => {
    setNotifiedPO(purchaseOrder);
    setIsShowingPOModal(modalName);
  };

  const closePOModal = () => {
    setNotifiedPO(null);
    setIsShowingPOModal('');
  };

  const onRequestSort = async (newColumns, column, sortDirection) => {
    const variables = {
      orderBy: `${column.id}_${sortDirection.toUpperCase()}`,
    };
    if (column.id !== 'orderer') {
      await purchaseOrders.refetch(variables);
    }

    setColumns(newColumns);
  };

  const extraListProps = {
    showRemoveIcon: false,
  };

  return (
    <ErrorBoundary>
      <ListPage
        noItemsMessage={
          <div>
            There are no Purchase Orders. <br />
            Let’s start by creating a new Purchase Order.
          </div>
        }
        variant={'active'}
        items={displayedOrders}
        columns={columns}
        actions={actions}
        header={{
          title: 'Purchase Order',
          subtitle: 'Below is a list of all Purchase Orders.',
          buttonProps: {
            title: 'Create Purchase Order',
            buttonColor: theme.palette.primary.color2,
            onClick: () => {
              history.push(URL.CREATE_NON_PBS_PURCHASE_ORDER());
            },
          },
          showButton: true,
        }}
        onSortRequested={onRequestSort}
        showSearch={false}
        loading={purchaseOrdersLoading}
        onBottomReached={() => {
          if (!purchaseOrdersLoading) {
            onLoadMore();
          }
        }}
        {...extraListProps}
      />
      <PONotificationModal
        visible={isShowingPOModal === 'sendEmail'}
        purchaseOrder={notifiedPO}
        onClose={closePOModal}
      />
      <POInvoiceModal
        visible={isShowingPOModal === 'invoiced'}
        purchaseOrder={notifiedPO}
        onClose={closePOModal}
      />
      <POReceiptModal
        visible={isShowingPOModal === 'receipted'}
        purchaseOrder={notifiedPO}
        onClose={closePOModal}
      />
    </ErrorBoundary>
  );
};

PurchaseOrder.defaultProps = {
  purchaseOrders: {
    refetch: () => ({}),
    loadNextPage: () => ({}),
    data: [],
    loading: false,
  },
};

export default compose(
  withStyles(composeStyles(styles, purchaseOrderStyles)),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withPurchaseOrders(() => {
  //   return {
  //     variables: {
  //       where: {
  //         isArchived: false,
  //       },
  //       orderBy: 'date_ASC',
  //     },
  //   };
  // }),
)(PurchaseOrder);
