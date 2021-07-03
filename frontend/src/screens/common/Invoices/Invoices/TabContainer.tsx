import { ErrorBoundary } from '@kudoo/components';
import { withI18n } from '@lingui/react';
import idx from 'idx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { INVOICE_STATUS } from 'src/helpers/constants';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import InvoiceNotificationModal from './InvoiceNotificationModal';

type Props = {
  actions: any;
  children: Function;
  invoices: any;
  updateInvoice: Function;
  i18n: any;
};
type State = {
  displayedInvoices: Array<any>;
  notifiedInvoice: object | null;
  isShowingInvoiceEmailModal: boolean;
};

class TabContainer extends Component<Props, State> {
  static defaultProps = {
    invoices: {
      data: [],
      refetch: () => {},
    },
    updateInvoice: () => ({}),
  };

  state = {
    displayedInvoices: [],
    notifiedInvoice: null,
    isShowingInvoiceEmailModal: false,
  };

  componentDidMount() {
    this._updateInvoicesData(idx(this.props, (_) => _.invoices.data) || []);
  }

  componentDidUpdate(prevProps) {
    const { invoices } = this.props;
    if (
      !isEqual(
        invoices.data,
        idx(prevProps, (_) => _.invoices.data),
      )
    ) {
      this._updateInvoicesData(idx(this.props, (_) => _.invoices.data) || []);
    }
  }

  _markInvoiceAsPaid = async (invoice) => {
    try {
      const res = await this.props.updateInvoice({
        status: INVOICE_STATUS.FULLY_PAID,
        id: invoice.id,
      });
      if (res.success) {
        this.props.invoices.refetch();
        showToast(null, 'Invoice marked as paid');
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _archiveInvoice = async (invoice) => {
    try {
      const res = await this.props.updateInvoice({
        status: INVOICE_STATUS.ARCHIVED,
        id: invoice.id,
      });
      if (res.success) {
        this.props.invoices.refetch();
        showToast(null, 'Invoice Archived');
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _unArchiveInvoice = async (invoice) => {
    try {
      const res = await this.props.updateInvoice({
        status: INVOICE_STATUS.FULLY_PAID,
        id: invoice.id,
      });
      if (res.success) {
        this.props.invoices.refetch();
        showToast(null, 'Invoice Unarchived');
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _updateInvoicesData = (invoices) => {
    const { i18n } = this.props;
    const invoiceData = invoices.map((invoice) => {
      const dueDate = idx(invoice, (_) => _.dueDate);
      const issueDate = idx(invoice, (_) => _.invoiceDate);
      return {
        ...invoice,
        id: invoice.id,
        hash: idx(invoice, (_) => _.number),
        customer: idx(invoice, (_) => _.buyer.name),
        date: moment(issueDate).format('DD MMM YYYY'),
        due: moment(dueDate).format('DD MMM YYYY'),
        total: i18n._('currency-symbol') + `${invoice.total}`,
        balance: i18n._('currency-symbol') + `${invoice.total}`,
        totalInDecimal: invoice.total,
      };
    });
    this.setState({
      displayedInvoices: invoiceData,
    });
  };

  _showInvoiceEmailModal = (invoice) => {
    this.setState({
      notifiedInvoice: invoice,
      isShowingInvoiceEmailModal: true,
    });
  };

  _closeInvoiceEmailModal = () => {
    this.setState({
      notifiedInvoice: null,
      isShowingInvoiceEmailModal: false,
    });
  };

  _onRequestSort = (column, sortDirection) => {
    const dbColumnMapping = {
      hash: 'number',
      date: 'invoiceDate',
      due: 'dueDate',
      total: 'total',
      balance: 'total',
    };
    if (column !== 'customer') {
      // sorting for customer column is not supported by backend currently
      this.props.invoices.refetch({
        orderBy: `${dbColumnMapping[column.id]}_${sortDirection.toUpperCase()}`,
      });
    }
  };

  render() {
    const { children, ...rest }: any = this.props; // eslint-disable-line
    return (
      <ErrorBoundary>
        <SelectedDAO onChange={this.props.invoices.refetch}>
          {children({
            ...rest,
            ...this.state,
            invoices: this.state.displayedInvoices,
            invoicesLoading: get(this.props, 'invoices.loading'),
            markInvoiceAsPaid: this._markInvoiceAsPaid,
            archiveInvoice: this._archiveInvoice,
            unArchiveInvoice: this._unArchiveInvoice,
            showInvoiceEmailModal: this._showInvoiceEmailModal,
            closeInvoiceEmailModal: this._closeInvoiceEmailModal,
            onRequestSort: this._onRequestSort,
            onLoadMore: get(this.props, 'invoices.loadNextPage'),
          })}
          <InvoiceNotificationModal
            visible={this.state.isShowingInvoiceEmailModal}
            invoice={this.state.notifiedInvoice}
            onClose={this._closeInvoiceEmailModal}
          />
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withUpdateInvoiceStatus(() => ({ name: 'updateInvoice' })),
  // withInvoices((props) => {
  //   let where = {};
  //   if (props.invoiceType === 'unpaid') {
  //     where = {
  //       ...where,
  //       status_in: [INVOICE_STATUS.DRAFT, INVOICE_STATUS.APPROVED],
  //     };
  //   } else if (props.invoiceType === 'paid') {
  //     where = {
  //       ...where,
  //       status: INVOICE_STATUS.FULLY_PAID,
  //     };
  //   } else if (props.invoiceType === 'archived') {
  //     where = {
  //       ...where,
  //       status: INVOICE_STATUS.ARCHIVED,
  //     };
  //   }
  //   return {
  //     variables: {
  //       first: 20,
  //       where,
  //       orderBy: 'invoiceDate_DESC',
  //     },
  //   };
  // }),
)(TabContainer as any);
