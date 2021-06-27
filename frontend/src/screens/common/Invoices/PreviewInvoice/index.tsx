import { FileBlock, Table, withStyles } from '@kudoo/components';
import { Trans, withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import get from 'lodash/get';
import moment from 'moment';
import queryString from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { INVOICE_TYPE, SERVICE_BILLING_TYPE } from 'src/helpers/constants';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions: any;
  profile: any;
  invoice: any;
  i18n: any;
  classes: any;
};
type State = {};

class PreviewInvoice extends Component<Props, State> {
  static defaultProps = {
    invoice: { data: {}, refetch: () => {} },
  };

  componentDidMount() {
    const props = this.props;
    this.setCompanyAndUserData(props);
  }

  setCompanyAndUserData = async (props) => {
    const query = queryString.parse(get(props, 'location.search', ''));
    if (query['company-token'] && query['user-token']) {
      await this.props.actions.setUserData({
        token: query['user-token'],
        isLoggedIn: true,
        selectedCompany: {
          ...get(props, 'profile.selectedCompany', {}),
          id: query['company-token'],
        },
      });
      setTimeout(() => {
        this.props.invoice && this.props.invoice.refetch();
      }, 100);
    }
  };

  _renderTextInvoiceServices() {
    const { classes, invoice, i18n } = this.props;
    const headerData = [
      {
        id: 'service',
        label: 'Service',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'quantity',
        label: 'Quantity',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'rate',
        label: 'Rate',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'amount',
        label: 'Amount',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'gst',
        label: i18n._(`GST`),
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
    ];
    const data = get(invoice, 'data.items', []);

    let subtotal = 0;
    let gst = 0;
    let total = 0;
    const tableData = data.map((row) => {
      subtotal = subtotal + Number(row.quantity) * Number(row.price);
      gst = gst + Number(row.tax);

      return {
        service: row.name,
        quantity: row.quantity,
        rate: Number(row.price),
        amount: Number(row.quantity) * Number(row.price),
        gst: Number(row.tax),
      };
    });
    total = gst + subtotal;

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={tableData}
          stripe={false}
          sortable={false}
          showRemoveIcon={false}
          cellRenderer={(row, column, ele) => {
            const { classes } = this.props;
            if (column.id === 'gst') {
              return (
                <div className={cx(classes.gstCell, classes.borderCell)}>
                  <span className={classes.gstLabel}>
                    <Trans id='currency-symbol' />
                    {row[column.id]}
                  </span>
                </div>
              );
            }
            if (column.id === 'quantity') {
              return <div className={classes.borderCell}>{row[column.id]}</div>;
            }
            if (column.id === 'rate' || column.id === 'amount') {
              return (
                <div className={classes.borderCell}>
                  <Trans id='currency-symbol' />
                  {`${row[column.id]}`}
                </div>
              );
            }
            return ele;
          }}
        />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Sub Total</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {subtotal}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>
                <Trans>GST</Trans>
              </div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Total</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {total}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.balanceDueWrapper}>
              <div className={classes.balanceDueText}>Balance Due</div>
              <div className={classes.balanceDueText}>
                <Trans id='currency-symbol' />
                {total}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderProjectInvoiceServices() {
    const { classes, invoice, i18n } = this.props;
    const headerData = [
      {
        id: 'service',
        label: 'Service',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'billingType',
        label: 'Type',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'amount_str',
        label: 'Amount',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'gst_str',
        label: i18n._(`GST`),
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
    ];
    const data = get(invoice, 'data.items', []);

    let subtotal = 0;
    let gst = 0;
    let total = 0;
    const tableData = data.map((row) => {
      subtotal = subtotal + Number(row.price);
      gst = gst + Number(row.tax);

      return {
        service: row.name,
        billingType: SERVICE_BILLING_TYPE.FIXED,
        amount_str: Number(row.price),
        gst_str: Number(row.tax),
      };
    });
    total = gst + subtotal;

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={tableData}
          stripe={false}
          sortable={false}
          showRemoveIcon={false}
          cellRenderer={(row, column, ele) => {
            const { classes } = this.props;
            if (column.id === 'gst_str') {
              return (
                <div className={cx(classes.gstCell, classes.borderCell)}>
                  <span className={classes.gstLabel}>
                    <Trans id='currency-symbol' />
                    {row[column.id]}
                  </span>
                </div>
              );
            }
            if (column.id === 'billingType' || column.id === 'amount_str') {
              return <div className={classes.borderCell}>{row[column.id]}</div>;
            }
            return ele;
          }}
        />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Paid</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                0.00
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Sub Total</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {subtotal}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>
                <Trans>GST</Trans>
              </div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Total</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {total}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.balanceDueWrapper}>
              <div className={classes.balanceDueText}>Balance Due</div>
              <div className={classes.balanceDueText}>
                <Trans id='currency-symbol' />
                {total}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderTimesheetsInvoiceServices() {
    const { classes, invoice, i18n } = this.props;
    const headerData = [
      {
        id: 'service',
        label: 'Service',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'time_period',
        label: 'Time Period',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'quantity',
        label: 'Quantity',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'rate_str',
        label: 'Rate',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'amount_str',
        label: 'Amount',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'gst_str',
        label: i18n._(`GST`),
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
    ];

    const data = get(invoice, 'data.items', []);

    let subtotal = 0;
    let gst = 0;
    let total = 0;
    const tableData = data.map((row) => {
      subtotal = subtotal + Number(row.quantity) * Number(row.price);
      gst = gst + Number(row.tax);

      return {
        service: row.name,
        time_period: row.description,
        quantity: row.quantity,
        rate_str: Number(row.price),
        amount_str: Number(row.quantity) * Number(row.price),
        gst_str: Number(row.tax),
      };
    });
    total = gst + subtotal;

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={tableData}
          stripe={false}
          sortable={false}
          showRemoveIcon={false}
          cellRenderer={(row, column, ele) => {
            const { classes } = this.props;
            if (column.id === 'gst_str') {
              return (
                <div className={cx(classes.gstCell, classes.borderCell)}>
                  <span className={classes.gstLabel}>
                    <Trans id='currency-symbol' />
                    {row[column.id]}
                  </span>
                </div>
              );
            }
            if (
              column.id === 'quantity' ||
              column.id === 'rate' ||
              column.id === 'amount'
            ) {
              return <div className={classes.borderCell}>{row[column.id]}</div>;
            }
            return ele;
          }}
        />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Paid</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                0.00
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Sub Total</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {subtotal}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>
                <Trans>GST</Trans>
              </div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Total</div>
              <div className={classes.subtotalText}>
                <Trans id='currency-symbol' />
                {total}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.balanceDueWrapper}>
              <div className={classes.balanceDueText}>Balance Due</div>
              <div className={classes.balanceDueText}>
                <Trans id='currency-symbol' />
                {total}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderServices() {
    const { invoice } = this.props;
    const type = get(invoice, 'data.type');
    return (
      <div>
        {type === INVOICE_TYPE.FREE_TEXT && this._renderTextInvoiceServices()}
        {type === INVOICE_TYPE.PROJECT && this._renderProjectInvoiceServices()}
        {(type === INVOICE_TYPE.TIMESHEET ||
          type === INVOICE_TYPE.TIMESHEET_WITH_DETAILS) &&
          this._renderTimesheetsInvoiceServices()}
      </div>
    );
  }

  render() {
    const { classes, invoice, i18n } = this.props;
    const customer = get(invoice, 'data.buyer');
    const sellerCompany = get(invoice, 'data.seller');
    const companyLogo = get(invoice, 'data.seller.logo.url');
    const companyName = get(invoice, 'data.seller.name');
    const invoiceNumber = get(invoice, 'data.number');
    const issueDate = get(invoice, 'data.invoiceDate');
    const attachments = get(invoice, 'data.attachments', []);
    const dueDate = get(invoice, 'data.dueDate');
    const numberOfDays = moment(dueDate).diff(moment(issueDate), 'days');
    const description = get(invoice, 'data.description');
    const sellerAddress = get(invoice, 'data.seller.addresses.0', {});

    if (!get(invoice, 'data')) {
      return null;
    }
    return (
      <div id='invoice-details'>
        <div className={classes.content}>
          <div className={classes.invoiceHeader}>
            <Grid container>
              <Grid item xs={6}>
                {!companyLogo && (
                  <div className={classes.invoiceName} style={{ marginTop: 0 }}>
                    {companyName}
                  </div>
                )}
                {companyLogo && (
                  <div
                    className={classes.companyLogo}
                    style={{ backgroundImage: `url(${companyLogo})` }}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={6}
                classes={{ item: classes.invoiceTitleRightPart }}
              >
                <div className={classes.invoiceNumber}>
                  <div>Invoice #{invoiceNumber}</div>
                </div>
                {companyLogo && (
                  <div className={classes.invoiceName}>{companyName}</div>
                )}
              </Grid>
            </Grid>
          </div>
          {/* Invoice Date Block */}
          <div className={classes.invoiceDateWrapper}>
            <div className={classes.invoiceDateBlock}>
              <div className={classes.invoiceDateLabel}>Invoice Date</div>
              <div className={classes.invoiceDateValue}>
                {moment(issueDate).format('DD MMM YYYY')}
              </div>
            </div>
            <div
              className={classes.invoiceDateBlock}
              style={{ textAlign: 'right' }}
            >
              <div className={classes.invoiceDateLabel}>Due Date</div>
              <div className={classes.invoiceDateValue}>
                {moment(dueDate).format('DD MMM YYYY')}
              </div>
              <div
                className={classes.invoiceDatePeriod}
              >{`(${numberOfDays}days to pay)`}</div>
            </div>
          </div>
          {/* Invoice Bill Block */}
          <div className={classes.invoiceCustomer}>
            <Grid container>
              <Grid item xs={6} sm={6}>
                <div className={classes.invoiceSectionTitle}>
                  Bill to Customer
                </div>
                <div className={classes.invoiceTextValue}>
                  {get(customer, 'name')}
                </div>
                <div className={classes.invoiceTextValue}>
                  {get(customer, 'contacts[0].name')}{' '}
                  {get(customer, 'contacts[0].surname')}
                </div>
                {Boolean(get(customer, 'data.govNumber')) && (
                  <div className={classes.invoiceTextValue}>
                    {i18n._(`ABN`)} : {get(customer, 'govNumber')}
                  </div>
                )}
                <div className={classes.invoiceTextValue}>
                  {get(customer, 'contacts[0].email')}
                </div>
              </Grid>
              <Grid item xs={6} sm={6} style={{ textAlign: 'right' }}>
                <div className={classes.invoiceSectionTitle}>Company</div>
                {sellerAddress && (
                  <div className={classes.invoiceTextValue}>
                    {sellerAddress.street} {sellerAddress.city}{' '}
                    {sellerAddress.state} {sellerAddress.country}{' '}
                    {sellerAddress.postCode}
                  </div>
                )}
                {Boolean(get(sellerCompany, 'govNumber')) && (
                  <div className={classes.invoiceTextValue}>
                    {i18n._(`ABN`)} : {get(sellerCompany, 'govNumber')}
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
          {/* Invoice Services */}
          <div className={classes.invoiceService}>
            <div className={classes.invoiceSectionTitle}>Services</div>
            {this._renderServices()}
          </div>
          {/* Invoice Message */}
          {Boolean(description) && (
            <div className={classes.invoiceMessage}>
              <div className={classes.invoiceSectionTitle}>Message</div>
              <div className={classes.invoiceTextValue}>{description}</div>
            </div>
          )}
          {/* Invoice Attachments */}
          {attachments.length > 0 && (
            <div className={classes.invoiceAttachments}>
              <div className={classes.invoiceSectionTitle}>Attachments</div>
              <div className={classes.invoiceAttachedFiles}>
                {attachments.map((attachment, index) => (
                  <FileBlock
                    key={index}
                    file={{ ...attachment, name: attachment.fileName }}
                    variant='link'
                  />
                ))}
              </div>
            </div>
          )}
          {/* Invoice Pay Block */}
          <div className={classes.payWrapper}>
            <div className={classes.secureWrapper}>
              <div>
                <div className={classes.invoiceSectionTitle}>
                  Secure Payments
                </div>
                <div className={classes.secureBtns}>
                  <div
                    className={classes.invoiceTextValue}
                    style={{ marginRight: 10 }}
                  >
                    Please make payment into the following bank account
                  </div>
                </div>
              </div>
              <div>
                <div className={classes.invoiceSectionTitle}>EFT</div>
                <div className={classes.invoiceTextValue}>
                  {get(sellerCompany, 'bankAccount.name')}
                </div>
                <div className={classes.invoiceTextValue}>
                  {i18n._(`BSB`)} : {get(sellerCompany, 'bankAccount.code')}
                </div>
                <div className={classes.invoiceTextValue}>
                  {i18n._(`Account Number`)} :{' '}
                  {get(sellerCompany, 'bankAccount.accountNumber')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withI18n(),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withInvoice((props) => {
  //   return {
  //     id: get(props, 'match.params.id'),
  //   };
  // }),
)(PreviewInvoice);
