import * as React from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { compose } from 'recompose';
import { Trans } from '@lingui/react';
import moment from 'moment';
import numeral from 'numeral';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  composeStyles,
  ErrorBoundary,
  Loading,
} from '@kudoo/components';
import { withInvoices } from '@kudoo/graphql';
import { INVOICE_STATUS } from '@client/helpers/constants';
import styles, { InvoiceStyles } from './styles';

type Props = {
  classes: any;
  paidInvoices: {
    total: number;
    count: number;
    refetch: Function;
    loading: boolean;
  };
  unpaidInvoices: {
    total: number;
    count: number;
    refetch: Function;
    loading: boolean;
  };
  overdueInvoices: {
    total: number;
    count: number;
    refetch: Function;
    loading: boolean;
  };
  contentHash: string;
};

class Invoices extends React.Component<Props, any> {
  componentDidUpdate(prevProps) {
    if (
      !isEqual(get(this.props, 'contentHash'), get(prevProps, 'contentHash'))
    ) {
      if (get(this.props, 'paidInvoices.refetch')) {
        this.props.paidInvoices.refetch();
      }
      if (get(this.props, 'unpaidInvoices.refetch')) {
        this.props.unpaidInvoices.refetch();
      }
      if (get(this.props, 'overdueInvoices.refetch')) {
        this.props.overdueInvoices.refetch();
      }
    }
  }

  render() {
    const {
      classes,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
    } = this.props;
    const showLoader =
      get(paidInvoices, 'loading') ||
      get(unpaidInvoices, 'loading') ||
      get(overdueInvoices, 'loading');
    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Invoices</span>
            {showLoader && (
              <span>
                <Loading size={20} color='white' />
              </span>
            )}
          </div>
          <div className={cx(classes.blockContent, classes.invoiceBlock)}>
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <div className={cx(classes.invoiceBlockItem, 'green')}>
                  <div className={classes.invoiceAmount}>
                    <Trans id='currency-symbol' />
                    {numeral(paidInvoices.total).format('0,00')}
                  </div>
                  <div className={classes.invoiceNumber}>
                    {paidInvoices.count} Invoices
                  </div>
                  <div className={classes.invoiceTitle}>
                    Total paid invoices
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx(classes.invoiceBlockItem, 'orange')}>
                  <div className={classes.invoiceAmount}>
                    <Trans id='currency-symbol' />
                    {numeral(overdueInvoices.total).format('0,00')}
                  </div>
                  <div className={classes.invoiceNumber}>
                    {overdueInvoices.count} Invoices
                  </div>
                  <div className={classes.invoiceTitle}>
                    Total overdue invoices
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx(classes.invoiceBlockItem, 'green')}>
                  <div className={classes.invoiceAmount}>
                    <Trans id='currency-symbol' />
                    {numeral(unpaidInvoices.total).format('0,00')}
                  </div>
                  <div className={classes.invoiceNumber}>
                    {unpaidInvoices.count} Invoices
                  </div>
                  <div className={classes.invoiceTitle}>
                    Total unpaid invoices
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(composeStyles(styles, InvoiceStyles)),
  withInvoices(
    () => ({
      variables: {
        where: {
          status: INVOICE_STATUS.FULLY_PAID,
        },
      },
    }),
    ({ data }) => {
      const invoices = get(data, 'invoices.edges', []);
      const count = get(data, 'invoices.aggregate.count');
      return {
        paidInvoices: {
          total: invoices.reduce((acc, { node }) => acc + node.total, 0),
          count,
          refetch: data.refetch,
          loading: data.loading,
        },
      };
    }
  ),
  withInvoices(
    () => ({
      variables: {
        where: {
          status_in: [INVOICE_STATUS.DRAFT, INVOICE_STATUS.APPROVED],
        },
      },
    }),
    ({ data }) => {
      const invoices = get(data, 'invoices.edges', []);
      const count = get(data, 'invoices.aggregate.count');
      return {
        unpaidInvoices: {
          total: invoices.reduce((acc, { node }) => acc + node.total, 0),
          count,
          refetch: data.refetch,
          loading: data.loading,
        },
      };
    }
  ),
  withInvoices(
    () => ({
      variables: {
        where: {
          status_in: [INVOICE_STATUS.DRAFT, INVOICE_STATUS.APPROVED],
          dueDate_lt: moment().format('YYYY-MM-DD'),
        },
      },
    }),
    ({ data }) => {
      const invoices = get(data, 'invoices.edges', []);
      const count = get(data, 'invoices.aggregate.count');
      return {
        overdueInvoices: {
          total: invoices.reduce((acc, { node }) => acc + node.total, 0),
          count,
          refetch: data.refetch,
          loading: data.loading,
        },
      };
    }
  )
)(Invoices);
