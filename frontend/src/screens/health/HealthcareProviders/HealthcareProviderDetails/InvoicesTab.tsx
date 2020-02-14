import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { withI18n } from '@lingui/react';
import get from 'lodash/get';
import compact from 'lodash/compact';
import moment from 'moment';
import {
  withStyles,
  Button,
  Table,
  SectionHeader,
  withStylesProps,
} from '@kudoo/components';
import { any } from 'prop-types';
import styles from './styles';

type Props = {
  actions: Record<string, any>;
  invoices: Record<string, any>;
  showingInvoiceType: string;
  setShowingInvoiceType: Function;
  columnData: Array<any>;
  i18n: any;
  classes: any;
  theme: any;
};

const SHOWING_INVOICE_TYPE = {
  UNPAID: 'unpaid',
  PAID: 'paid',
};

class InvoicesTab extends React.Component<Props, any> {
  render() {
    const {
      classes,
      theme,
      invoices,
      showingInvoiceType,
      setShowingInvoiceType,
      i18n,
    } = this.props;
    const invoicesRow = get(invoices, 'data', []);
    let data = invoicesRow.map(invoice => {
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
        total_amount: i18n._('currency-symbol')`` + `${invoice.total}`,
      };
    });

    data = compact(data);

    return (
      <div className={classes.section}>
        <SectionHeader
          title='Invoices'
          subtitle='Below is a list of invoices sent to this healthcareProvider.'
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
          columnData={this.props.columnData}
          data={data}
          sortable={false}
          stripe={false}
          showRemoveIcon={false}
          classes={{ component: classes.invoiceTable }}
        />
      </div>
    );
  }
}

export default compose<any, any>(
  withI18n(),
  withStyles(styles),
  withProps({
    columnData: [
      { id: 'invoice_number', label: 'Invoice number' },
      { id: 'date_sent', label: 'Date sent' },
      { id: 'status', label: 'Status' },
      { id: 'due_date', label: 'Due Date' },
      { id: 'total_amount', label: 'Total amount' },
    ],
  }),
  withState(
    'showingInvoiceType',
    'setShowingInvoiceType',
    SHOWING_INVOICE_TYPE.UNPAID
  )
)(InvoicesTab);
