import React, { Component } from 'react';
import cx from 'classnames';
import get from 'lodash/get';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import { withI18n, Trans } from '@lingui/react';
import idx from 'idx';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  composeStyles,
  Table,
  Button,
  SectionHeader,
  FileBlock,
  withStylesProps,
  withRouterProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import {
  withCompany,
  withCreateCustomer,
  withUpdateProject,
  withCreateInvoice,
  withInvoiceNotify,
  withUpdateTimeSheet,
} from '@kudoo/graphql';
import { generatePDF } from '@client/helpers/jsPDF';
import * as actions from '@client/store/actions/createNewInvoice';
import { showToast } from '@client/helpers/toast';
import {
  PROJECT_SERVICE_RULES_TYPE,
  INVOICE_STATUS,
  INVOICE_TYPE,
} from '@client/helpers/constants';
import { IReduxState } from '@client/store/reducers';
import SendInvoiceModal from './SendInvoiceModal';
import styles, { reviewStyles } from './styles';

type Props = {
  actions: Record<string, any>;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  createType: 'timesheet' | 'project' | 'text';
  newInvoice: Record<string, any>;
  createInvoice: Function;
  profile: Record<string, any>;
  createCustomer: Function;
  resetInvoiceData: Function;
  invoiceNotify: Function;
  company: Record<string, any>;
  i18n: any;
  updateProject: Function;
  updateTimeSheet: Function;
  classes: any;
  history: any;
  theme: any;
};
type State = {
  showInvoiceModal: boolean;
  submitting: boolean;
  logo?: string;
  logoIsLoading?: boolean;
};

class ReviewStep extends Component<Props, State> {
  invoiceNumber: number;

  constructor(props) {
    super(props);
    this.invoiceNumber = Math.floor(Math.random() * 90000) + 10000;
    this.state = {
      showInvoiceModal: false,
      submitting: false,
    };
  }

  componentDidMount() {
    // this._loadBase64Image();
  }

  _loadBase64Image() {
    const { company } = this.props;
    const logoUrl = get(company, 'data.logo.url');
    const self = this;
    if (logoUrl) {
      this.setState({
        logoIsLoading: true,
      });
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx: any = canvas.getContext('2d');
        let dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL('image/png');
        self.setState({
          logo: dataURL,
          logoIsLoading: false,
        });
      };
      img.src = logoUrl;
      if (img.complete || img.complete === undefined) {
        img.src =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        img.src = logoUrl;
      }
    } else {
      this.setState({
        logoIsLoading: false,
        logo: '',
      });
    }
  }

  _renderTextInvoiceServices() {
    const { classes, newInvoice, createType, i18n } = this.props;
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
        label: 'Qty.',
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
    const data = get(newInvoice, `${createType}.tableData`, []);

    let subtotal = 0;
    let gst = 0;
    let total = 0;
    data.map(row => {
      subtotal = subtotal + row.amount;
      if (row.includeConsTax) {
        gst = gst + row.gst;
      }
    });
    total = gst + subtotal;

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={data}
          stripe={false}
          sortable={false}
          showRemoveIcon={false}
          cellRenderer={(row, column, ele) => {
            const { classes } = this.props;
            if (column.id === 'gst') {
              return (
                <div className={cx(classes.gstCell, classes.borderCell)}>
                  <span className={classes.gstLabel}>
                    {row.includeConsTax
                      ? i18n._('currency-symbol') + `${row[column.id]}`
                      : i18n._('currency-symbol') + '0'}
                  </span>
                  <span className={classes.gstStatus}>
                    <span>{row.includeConsTax ? 'Incl ' : 'Excl '}</span>{' '}
                    {i18n._('GST')}
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
                  {i18n._('currency-symbol')}
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
                {i18n._('currency-symbol')}
                {subtotal}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>{i18n._('GST')}</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Total</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {total}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.balanceDueWrapper}>
              <div className={classes.balanceDueText}>Balance Due</div>
              <div className={classes.balanceDueText} data-test='balance-due'>
                {i18n._('currency-symbol')}
                {total}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderProjectInvoiceServices() {
    const { classes, newInvoice, createType, i18n } = this.props;
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
    let data = get(newInvoice, `${createType}.tableData`, []);
    data = data.filter(row => row.select);

    let subtotal = 0;
    let gst = 0;
    data.map(row => {
      subtotal = subtotal + row.amount;
      if (row.includeConsTax) {
        gst = gst + row.gst;
      }
    });

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={data}
          stripe={false}
          sortable={false}
          showRemoveIcon={false}
          cellRenderer={(row, column, ele) => {
            const { classes } = this.props;
            if (column.id === 'gst_str') {
              return (
                <div className={cx(classes.gstCell, classes.borderCell)}>
                  <span className={classes.gstLabel}>
                    {row.includeConsTax
                      ? row[column.id]
                      : i18n._('currency-symbol') + '0'}
                  </span>
                  <span className={classes.gstStatus}>
                    <span>{row.includeConsTax ? 'Incl ' : 'Excl '}</span>{' '}
                    {i18n._('GST')}
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
                {i18n._('currency-symbol')}
                0.00
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Sub Total</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {subtotal}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>{i18n._('GST')}</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Total</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {subtotal + gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.balanceDueWrapper}>
              <div className={classes.balanceDueText}>Balance Due</div>
              <div className={classes.balanceDueText}>
                {i18n._('currency-symbol')}
                {subtotal + gst}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderTimesheetsInvoiceServices() {
    const { classes, newInvoice, createType, i18n } = this.props;
    const data = idx(newInvoice, _ => _[createType]);
    let tableData = idx(data, _ => _.tableData) || [];
    const showTimesheetDetails =
      idx(data, _ => _.showTimesheetDetails) || false;
    tableData = tableData.filter(row => row.select);

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
        id: showTimesheetDetails ? 'entry_date' : 'time_period',
        label: showTimesheetDetails ? 'Entry Date' : 'Time Period',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'status',
        label: 'Status',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'username',
        label: 'Username',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'quantity',
        label: 'Qty.',
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
          tableHeaderCellWrapper: classes.gstHeaderCell,
        },
      },
    ];

    let subtotal = 0;
    let gst = 0;
    tableData.map(row => {
      subtotal = subtotal + row.amount;
      if (row.includeConsTax) {
        gst = gst + row.gst;
      }
    });

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
                    {row.includeConsTax
                      ? row[column.id]
                      : i18n._('currency-symbol') + '0'}
                  </span>
                  <span className={classes.gstStatus}>
                    <span>{row.includeConsTax ? 'Incl' : 'Excl'}</span>{' '}
                    {i18n._('GST')}
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
                {i18n._('currency-symbol')}
                0.00
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Sub Total</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {subtotal}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>{i18n._('GST')}</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.subtotalWrapper}>
              <div className={classes.subtotalText}>Total</div>
              <div className={classes.subtotalText}>
                {i18n._('currency-symbol')}
                {subtotal + gst}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.balanceDueWrapper}>
              <div className={classes.balanceDueText}>Balance Due</div>
              <div className={classes.balanceDueText}>
                {i18n._('currency-symbol')}
                {subtotal + gst}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  _renderServices() {
    const { createType } = this.props;
    return (
      <div>
        {createType === 'text' && this._renderTextInvoiceServices()}
        {createType === 'project' && this._renderProjectInvoiceServices()}
        {createType === 'timesheet' && this._renderTimesheetsInvoiceServices()}
      </div>
    );
  }

  _generatePDF = async () => {
    return await generatePDF('pdf-content');
  };

  _getTitle = () => {
    const { createType } = this.props;
    if (createType === 'text') {
      return {
        title: 'Create a free text invoice',
        subtitle:
          'Review your newly created invoice below. If you need to make changes then select the given step above. This invoice is a true representation of what your customer will see.',
      };
    } else if (createType === 'project') {
      return {
        title: 'Create an invoice using a project',
        subtitle:
          'Creating an invoice from a project is a quick way to easily create an invoice from a project which you have already defined.',
      };
    } else if (createType === 'timesheet') {
      return {
        title: 'Create an invoice using a timesheet',
        subtitle:
          'Creating an invoice from a timesheet is a quick way to easily create an invoice from a timesheet which you have already defined.',
      };
    }
    return {};
  };

  _getTextInvoiceItems = () => {
    const { newInvoice, createType } = this.props;
    const tableData = get(newInvoice, `${createType}.tableData`, []);
    const items = tableData.map((row, index) => ({
      order: index + 1,
      description: '',
      name: row.service,
      price: Number(row.rate),
      quantity: Number(row.quantity),
      tax: row.includeConsTax ? Number(row.gst) : 0,
    }));
    return items;
  };

  _getProjectInvoiceItems = () => {
    const { newInvoice, createType } = this.props;
    let tableData = get(newInvoice, `${createType}.tableData`, []);
    tableData = tableData.filter(row => row.select);
    const project = get(newInvoice, `${createType}.project`, []);

    const items = tableData.map((row, index) => ({
      order: index + 1,
      description: '',
      name: row.service,
      price: Number(row.amount),
      quantity: Number(1),
      tax: row.includeConsTax ? Number(row.gst) : 0,
      project: {
        connect: {
          id: project.id,
        },
      },
      service: {
        connect: {
          id: row.serviceId,
        },
      },
    }));
    return items;
  };

  _getTimesheetInvoiceItems = () => {
    const { newInvoice, createType } = this.props;
    const showTimesheetDetails = get(
      newInvoice,
      `${createType}.showTimesheetDetails`,
      false
    );
    let tableData = get(newInvoice, `${createType}.tableData`, []);
    tableData = tableData.filter(row => row.select);

    const items = tableData.map((row, index) => ({
      order: index + 1,
      description: row.time_period,
      name: row.service,
      price: Number(row.rate),
      quantity: Number(row.quantity),
      tax: row.includeConsTax ? Number(row.gst) : 0,
      service: {
        connect: {
          id: row.serviceId,
        },
      },
      [showTimesheetDetails ? 'timeSheetEntry' : 'timeSheet']: {
        connect: {
          id: showTimesheetDetails ? row.entryId : row.timeSheetId,
        },
      },
    }));
    return items;
  };

  _updateServiceRules = async () => {
    const { newInvoice, createType } = this.props;
    let tableData = get(newInvoice, `${createType}.tableData`, []);
    const project = get(newInvoice, `${createType}.project`, {});
    tableData = tableData.filter(row => row.select);
    const updateProjectServices: any = [];
    for (let index = 0; index < tableData.length; index++) {
      const row = tableData[index];
      if (row.amountEditable) {
        const rules = row.rules || [];
        const maxAmount = Number(row.maxAmount);
        const startAmount = Number(row.amount);
        const endAmount = maxAmount - Number(row.amount);

        const startRule = find(rules, {
          type: PROJECT_SERVICE_RULES_TYPE.PROJECT_STARTS,
        });
        const endRule = find(rules, {
          type: PROJECT_SERVICE_RULES_TYPE.PROJECT_ENDS,
        });
        const updateRules = [
          {
            where: {
              id: startRule.id,
            },
            data: {
              amount: startAmount,
              percent: (startAmount * 100) / maxAmount,
              isPercent: false,
            },
          },
          {
            where: {
              id: endRule.id,
            },
            data: {
              amount: endAmount,
              percent: (endAmount * 100) / maxAmount,
              isPercent: false,
            },
          },
        ];
        updateProjectServices.push({
          where: {
            id: row.id,
          },
          data: {
            rules: {
              update: updateRules,
            },
          },
        });
      }
    }
    if (updateProjectServices.length > 0) {
      await this.props.updateProject({
        where: {
          id: project.id,
        },
        data: {
          projectService: {
            update: updateProjectServices,
          },
        },
      });
    }
  };

  _markTimeSheetEntriesInvoiced = async () => {
    const { newInvoice, createType } = this.props;
    const showTimesheetDetails = get(
      newInvoice,
      `${createType}.showTimesheetDetails`,
      false
    );
    let tableData = get(newInvoice, `${createType}.tableData`, []);
    tableData = tableData.filter(row => row.select);
    const timeSheetGroup = groupBy(tableData, 'timeSheetId');
    const keys = Object.keys(timeSheetGroup);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = timeSheetGroup[key];
      let entries = [];
      if (!showTimesheetDetails) {
        entries = value.reduce(
          (acc, item) => [].concat(acc, item.entriesId),
          []
        );
      } else {
        entries = value.reduce((acc, item) => [].concat(acc, item.entryId), []);
      }

      const dataToUpdate = {
        where: {
          id: key,
        },
        data: {
          timeSheetEntries: {
            update: (entries || []).map(entryId => ({
              where: {
                id: entryId,
              },
              data: {
                isInvoiced: true,
              },
            })),
          },
        },
      };

      await this.props.updateTimeSheet(dataToUpdate);
    }
  };

  _createInvoice = async emails => {
    try {
      const { newInvoice, createType, history } = this.props;
      this.setState({ submitting: true });
      const payment = get(newInvoice, `${createType}.payment`, {});
      const customer = get(newInvoice, `${createType}.customer`, {});
      const attachments = get(payment, `attachments`, []).filter(
        attch => attch instanceof File
      );
      const showTimesheetDetails = get(
        newInvoice,
        `${createType}.showTimesheetDetails`,
        false
      );
      const pdfBlob = await this._generatePDF();
      const pdfFile = new File([pdfBlob], 'invoice.pdf');

      let invoiceType = INVOICE_TYPE.FREE_TEXT;
      if (createType === 'project') {
        invoiceType = INVOICE_TYPE.PROJECT;
      } else if (createType === 'timesheet') {
        if (showTimesheetDetails) {
          invoiceType = INVOICE_TYPE.TIMESHEET_WITH_DETAILS;
        } else {
          invoiceType = INVOICE_TYPE.TIMESHEET;
        }
      }

      const submitData: any = {
        title: 'Invoice',
        description: payment.message || '',
        invoiceDate: moment(payment.invoiceDate).format('YYYY-MM-DD'),
        dueDate: moment(payment.dueDate).format('YYYY-MM-DD'),
        status: INVOICE_STATUS.DRAFT,
        type: invoiceType,
        attachments: attachments,
        buyer: {
          connect: {
            id: customer.id,
          },
        },
        preview: pdfFile,
      };

      // get invoice items based on type
      let items = [];
      if (
        invoiceType === INVOICE_TYPE.TIMESHEET ||
        invoiceType === INVOICE_TYPE.TIMESHEET_WITH_DETAILS
      ) {
        items = this._getTimesheetInvoiceItems();
      } else if (invoiceType === INVOICE_TYPE.PROJECT) {
        items = this._getProjectInvoiceItems();
      } else if (invoiceType === INVOICE_TYPE.FREE_TEXT) {
        items = this._getTextInvoiceItems();
        if (!customer.isAlreadySaved) {
          // if customer is not already saved then create customer
          const customerRes = await this.props.createCustomer({
            data: {
              name: customer.name,
              govNumber: customer.govNumber,
              contacts: {
                create: [
                  {
                    name: customer.contactName,
                    surname: customer.contactSurname,
                    email: customer.email,
                  },
                ],
              },
            },
          });
          if (customerRes.success) {
            submitData.buyer = {
              connect: {
                id: customerRes.result.id,
              },
            };
          } else {
            customerRes.error.map(err => showToast(err));
          }
        }
      }

      submitData.items = items.length > 0 ? { create: items } : undefined;

      const res = await this.props.createInvoice({ data: submitData });
      if (res.success) {
        const invoiceId = get(res, 'result.id');
        if (
          invoiceType === INVOICE_TYPE.TIMESHEET ||
          invoiceType === INVOICE_TYPE.TIMESHEET_WITH_DETAILS
        ) {
          // mark all timesheet entries as invoiced
          await this._markTimeSheetEntriesInvoiced();
        } else if (invoiceType === INVOICE_TYPE.PROJECT) {
          // update project service rules in case of user has edited it
          await this._updateServiceRules();
        }

        if (emails.to || emails.bcc || emails.cc) {
          await this.props.invoiceNotify({
            data: {
              invoiceId,
              to: (emails.to || []).map(({ email }) => email),
              bcc: (emails.bcc || []).map(({ email }) => email),
              cc: (emails.cc || []).map(({ email }) => email),
            },
          });
        }
        this.setState({ submitting: false });
        this.props.resetInvoiceData(createType);
        showToast(null, 'Invoice created successfully');
        history.push(URL.INVOICES());
      } else {
        this.setState({ submitting: false });
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      this.setState({ submitting: false });
      showToast(e.toString());
    }
  };

  _showSendInvoiceDialog = () => {
    this.setState({
      showInvoiceModal: true,
    });
  };

  _finaliseInvoice = async () => {
    try {
      this._createInvoice({});
    } catch (error) {
      showToast(error.toString());
    }
  };

  _renderLogo = () => {
    const { classes, profile, company } = this.props;
    const logo = get(company, 'data.logo.url', '');
    const companyName = get(profile, 'selectedCompany.name');
    if (!logo) {
      return (
        <div className={classes.invoiceName} style={{ marginTop: 0 }}>
          {companyName}
        </div>
      );
    } else if (logo) {
      return (
        <div
          className={classes.companyLogo}
          style={{ backgroundImage: `url(${logo})` }}
        />
      );
    }
    return null;
  };

  render() {
    const {
      classes,
      theme,
      createType,
      newInvoice,
      profile,
      makeStepActive,
      unmarkedVisited,
      company,
      i18n,
    } = this.props;
    // const { logo, logoIsLoading } = this.state;
    const { title, subtitle } = this._getTitle();
    // const companyLogo = get(profile, 'selectedCompany.logo.url');
    const companyName = get(profile, 'selectedCompany.name');
    const data = idx(newInvoice, _ => _[createType]);
    const payment = idx(data, _ => _.payment) || {};
    const customer = idx(data, _ => _.customer) || {};
    const attachments = get(data, 'payment.attachments', []).filter(
      attch => attch instanceof File
    );
    const sellerAddress = get(company, 'data.addresses.0', {});
    const sellerABN = get(profile, 'selectedCompany.govNumber');
    const logo = get(company, 'data.logo.url', '');

    return (
      <div>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Prev'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                withoutBackground
                onClick={() => {
                  makeStepActive(2);
                  unmarkedVisited(3);
                }}
              />
              <Button
                id='finalise-invoice-button'
                title='Finalise Invoice'
                classes={{ component: classes.sendInvoiceButton }}
                loading={this.state.submitting}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={this._finaliseInvoice}
              />
            </div>
          )}
        />
        <div className={classes.content} id='pdf-content'>
          <span data-html2canvas-ignore>
            <SectionHeader title='Review your invoice' />
          </span>

          <div className={classes.invoiceHeader}>
            <Grid container>
              <Grid item xs={6}>
                {this._renderLogo()}
              </Grid>
              <Grid
                item
                xs={6}
                classes={{ item: classes.invoiceTitleRightPart }}>
                <div className={classes.invoiceNumber}>
                  <div>Invoice #{this.invoiceNumber}</div>
                </div>
                {logo && (
                  <div className={classes.invoiceName}>{companyName}</div>
                )}
              </Grid>
            </Grid>
          </div>
          {/* Invoice Date Block */}
          <div className={classes.invoiceDateWrapper}>
            <div className={classes.invoiceDateBlock}>
              <div className={classes.invoiceDateLabel}>Invoice Date</div>
              <div
                className={classes.invoiceDateValue}
                data-test='invoice-date'>
                {moment(payment.invoiceDate).format('DD MMM YYYY')}
              </div>
            </div>
            <div
              className={classes.invoiceDateBlock}
              style={{ textAlign: 'right' }}>
              <div className={classes.invoiceDateLabel}>Due Date</div>
              <div className={classes.invoiceDateValue} data-test='due-date'>
                {moment(payment.dueDate).format('DD MMM YYYY')}
              </div>
              <div
                className={classes.invoiceDatePeriod}
                data-test='number-of-days'>
                {`(${payment.numberOfDays}days to pay)`}
              </div>
            </div>
          </div>
          {/* Invoice Bill Block */}
          <div className={classes.invoiceCustomer}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <div className={classes.invoiceSectionTitle}>
                  Bill to Customer
                </div>
                <div
                  className={classes.invoiceTextValue}
                  data-test='customer-name'>
                  {customer.name}
                </div>
                <div
                  className={classes.invoiceTextValue}
                  data-test='customer-contact-name'>
                  {get(customer, 'contactName')}{' '}
                  {get(customer, 'contactSurname')}
                </div>
                {Boolean(customer.govNumber) && (
                  <div className={classes.invoiceTextValue}>
                    {i18n._(`ABN`)} : {customer.govNumber}
                  </div>
                )}
                <div
                  className={classes.invoiceTextValue}
                  data-test='customer-email'>
                  {get(customer, 'email')}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
                <div className={classes.invoiceSectionTitle}>Company</div>
                {sellerAddress && (
                  <div className={classes.invoiceTextValue}>
                    {sellerAddress.street}, {sellerAddress.city}{' '}
                    {sellerAddress.state} {sellerAddress.country}{' '}
                    {sellerAddress.postCode}
                  </div>
                )}
                {Boolean(sellerABN) && (
                  <div className={classes.invoiceTextValue}>
                    {i18n._(`ABN`)} : {sellerABN}
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
          {createType === 'timesheet' && (
            <div className={classes.invoiceMessage}>
              <div className={classes.invoiceSectionTitle}>Timesheets</div>
              <div className={classes.invoiceTextValue}>
                This invoice is based on aproved timesheets. Please see other
                attachment for proof of timesheets.
              </div>
            </div>
          )}
          {/* Invoice Message */}
          {Boolean(payment.message) && (
            <div className={classes.invoiceMessage}>
              <div className={classes.invoiceSectionTitle}>Message</div>
              <div className={classes.invoiceTextValue}>{payment.message}</div>
            </div>
          )}
          {/* Invoice Attachments */}
          {attachments.length > 0 && (
            <div className={classes.invoiceAttachments}>
              <div className={classes.invoiceSectionTitle}>Attachments</div>
              <div className={classes.invoiceAttachedFiles}>
                {attachments.map((attachment, index) => (
                  <FileBlock key={index} file={attachment} variant='none' />
                ))}
              </div>
            </div>
          )}
          {/* Invoice Pay Block */}
          <div className={classes.payWrapper}>
            <div className={classes.payNowSection}>
              <div className={classes.payNowText}>Pay now</div>
              <div className={classes.invoiceTextValue}>
                Pay for this invoice now by selecting a payment option.
              </div>
            </div>
            <div className={classes.secureWrapper}>
              <div>
                <div className={classes.invoiceSectionTitle}>
                  Secure Payments
                </div>
                <div className={classes.secureBtns}>
                  <div
                    className={classes.invoiceTextValue}
                    style={{ marginRight: 10 }}>
                    Please make payment into the following bank account
                  </div>
                </div>
              </div>
              <div>
                <div className={classes.invoiceSectionTitle}>EFT</div>
                <div className={classes.invoiceTextValue} data-test='bank-name'>
                  {get(company, 'data.bankAccount.name')}
                </div>
                <div className={classes.invoiceTextValue} data-test='bsb'>
                  {i18n._(`BSB`)} : {get(company, 'data.bankAccount.code')}
                </div>
                <div
                  className={classes.invoiceTextValue}
                  data-test='accountNumber'>
                  {i18n._(`Account Number`)} :{' '}
                  {get(company, 'data.bankAccount.accountNumber')}
                </div>
              </div>
            </div>
          </div>
          {/* Invoice Note */}
          <div className={classes.invoiceNote} data-html2canvas-ignore>
            If you are happy with this invoice then continue to send the invoice
            to this customer by selecting the ‘Send Invoice’ button above.
            <br />
            If you want to make changes then select the step at the top of this
            page.
          </div>
        </div>
        <SendInvoiceModal
          visible={this.state.showInvoiceModal}
          onSubmit={this._createInvoice}
          submitting={this.state.submitting}
          onClose={() => {
            this.setState({ showInvoiceModal: false });
          }}
        />
      </div>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(composeStyles(styles, reviewStyles)),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, x => x.sessionData.newInvoice),
    }),
    {
      ...actions,
    }
  ),
  withCompany(props => ({
    id: get(props, 'profile.selectedCompany.id'),
  })),
  withCreateInvoice(),
  withCreateCustomer(),
  withUpdateProject(),
  withInvoiceNotify(),
  withUpdateTimeSheet()
)(ReviewStep);
