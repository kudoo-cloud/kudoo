import { Button, SectionHeader, Table, withStyles } from '@kudoo/components';
import { I18n } from '@lingui/core';
import { withI18n } from '@lingui/react';
import compact from 'lodash/compact';
import get from 'lodash/get';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import styles, { StyleKeys } from './styles';

type Props = IRouteProps<StyleKeys> & {
  invoices: Record<string, any>;
  i18n?: I18n;
};

const SHOWING_INVOICE_TYPE = {
  UNPAID: 'unpaid',
  PAID: 'paid',
};

const columns = [
  { id: 'invoice_number', label: 'Invoice number' },
  { id: 'date_sent', label: 'Date sent' },
  { id: 'status', label: 'Status' },
  { id: 'due_date', label: 'Due Date' },
  { id: 'total_amount', label: 'Total amount' },
];

const InvoicesTab: React.FC<Props> = (props) => {
  const { classes, theme, invoices, i18n } = props;

  const [showingInvoiceType, setShowingInvoiceType] = useState(
    SHOWING_INVOICE_TYPE.UNPAID,
  );
  const [data, setData] = useState([]);

  const updateDisplayData = () => {
    const invoicesRow = get(invoices, 'data', []);
    let invoicesArr = invoicesRow.map((invoice) => {
      if (
        showingInvoiceType === SHOWING_INVOICE_TYPE.PAID &&
        invoice.status !== 'FULLY_PAID'
      ) {
        return null;
      }
      if (
        showingInvoiceType === SHOWING_INVOICE_TYPE.UNPAID &&
        invoice.status === 'FULLY_PAID'
      ) {
        return null;
      }

      return {
        id: invoice.id,
        invoice_number: get(invoice, 'number'),
        date_sent: moment(invoice.invoiceDate).format('DD MMM YYYY'),
        status: invoice.status === 'FULLY_PAID' ? 'Paid' : 'Unpaid',
        due_date: moment(invoice.dueDate).format('DD MMM YYYY'),
        total_amount: i18n._('currency-symbol') + `${invoice.total}`,
      };
    });
    invoicesArr = compact(invoicesArr);
    setData(invoicesArr);
  };

  useEffect(() => {
    updateDisplayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showingInvoiceType]);

  return (
    <div className={classes.section}>
      <SectionHeader
        title='Invoices'
        subtitle='Below is a list of invoices sent to this customer.'
        renderLeftPart={() => (
          <Button
            title={`View ${
              showingInvoiceType === SHOWING_INVOICE_TYPE.PAID
                ? SHOWING_INVOICE_TYPE.UNPAID
                : SHOWING_INVOICE_TYPE.PAID
            } invoices`}
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              if (showingInvoiceType === SHOWING_INVOICE_TYPE.UNPAID) {
                setShowingInvoiceType(SHOWING_INVOICE_TYPE.PAID);
              } else {
                setShowingInvoiceType(SHOWING_INVOICE_TYPE.UNPAID);
              }
            }}
          />
        )}
      />
      <Table
        columnData={columns}
        data={data}
        sortable={false}
        stripe={false}
        showRemoveIcon={false}
        classes={{ component: classes.invoiceTable }}
      />
    </div>
  );
};

export default compose<Props, Props>(
  withI18n(),
  withStyles(styles),
)(InvoicesTab);
