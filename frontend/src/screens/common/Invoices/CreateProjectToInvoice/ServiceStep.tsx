import React, { Component } from 'react';
import { withI18n, Trans } from '@lingui/react';
import get from 'lodash/get';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import Grid from '@material-ui/core/Grid';
import {
  Table,
  withStyles,
  composeStyles,
  Button,
  SectionHeader,
  Checkbox,
  TextField,
  withStylesProps,
} from '@kudoo/components';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { showToast } from '@client/helpers/toast';
import * as actions from '@client/store/actions/createNewInvoice';
import { withProject, withInvoices } from '@kudoo/graphql';
import {
  SERVICE_BILLING_TYPE,
  PROJECT_SERVICE_RULES_TYPE,
} from '@client/helpers/constants';
import { any } from 'prop-types';
import { IReduxState } from '@client/store/reducers';
import idx from 'idx';
import styles, { serviceStepStyles } from './styles';

type Props = {
  actions: any;
  newInvoice: any;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  updateTableData: Function;
  project: Record<string, any>;
  invoices: Record<string, any>;
  i18n: any;
  classes: any;
  theme: any;
};

type State = {
  hookups: any;
  columnData: any;
};

class ServiceStep extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      columnData: [
        {
          id: 'service',
          label: 'Service',
          classes: {
            cellValueText: props.classes.smallTextCell,
          },
        },
        { id: 'status', label: 'Status' },
        {
          id: 'amount_str',
          label: 'Amount',
        },
        {
          id: 'remainder_str',
          label: 'Remainder',
        },
      ],
      hookups: {},
    };
  }

  componentDidMount() {
    this._updateDisplayServices(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        get(prevProps, 'project.data'),
        get(this.props, 'project.data')
      ) ||
      !isEqual(
        get(prevProps, 'invoices.data'),
        get(this.props, 'invoices.data')
      )
    ) {
      this._updateDisplayServices(this.props);
    }
  }

  _updateDisplayServices = props => {
    const { i18n, newInvoice, project, invoices } = props;
    const invoiceItems = get(invoices, 'data', []).reduce(
      (acc, invoice) => [].concat(acc, invoice.items || []),
      []
    );
    let projectServices = get(project, 'data.projectService', []);
    projectServices = projectServices.filter(
      pSer => pSer.service.billingType === SERVICE_BILLING_TYPE.FIXED
    );
    const displayedServices: any = [];
    for (let index = 0; index < projectServices.length; index++) {
      const pService = projectServices[index];
      const service = get(pService, 'service', {});
      let amount = get(pService, 'amount', '');
      const maxAmount = get(pService, 'amount', '');
      const tableData = get(newInvoice, 'project.tableData', []);
      const foundRow = find(tableData, { serviceId: service.id });
      let amountEditable = false;
      let remainder = 0;
      const serviceHookups =
        (invoiceItems || []).filter(item => item.service.id === service.id) ||
        [];
      if (serviceHookups.length >= 2) {
        // if there are 2 hookups means service is invoiced completely
        continue;
      }
      const serviceHookup = get(serviceHookups, '0');
      if (serviceHookup) {
        // if there is one service hookup that means that service is invoiced before , so now we will only consider project ends rule amount if any
        const rules = get(pService, 'rules', []);
        const ends_rule = find(rules, {
          type: PROJECT_SERVICE_RULES_TYPE.PROJECT_ENDS,
        });
        if (ends_rule) {
          amount = Number(get(ends_rule, 'amount', '0'));
          remainder = 0;
        }
      } else {
        // if there is no service hookup that means that service is not invoiced before , so now we will only consider project starts rule amount if any
        const rules = get(pService, 'rules', []);
        const start_rule = find(rules, {
          type: PROJECT_SERVICE_RULES_TYPE.PROJECT_STARTS,
        });
        const ends_rule = find(rules, {
          type: PROJECT_SERVICE_RULES_TYPE.PROJECT_ENDS,
        });
        if (start_rule) {
          amount = Number(get(start_rule, 'amount', '0'));
          remainder = Number(get(ends_rule, 'amount', '0'));
        }
        if (Number(amount) === 0) {
          // if Project STARTS amount is zero then we will give user to ability to edit amount
          amountEditable = true;
        }
      }

      const gst = service.includeConsTax ? Number(amount || 0) * 0.1 : 0;
      displayedServices.push({
        hash: pService.id,
        id: pService.id,
        service: service.name,
        serviceId: service.id,
        status: 'Started',
        amount: Number(amount),
        amount_str: i18n._('currency-symbol') + `${amount}`,
        remainder,
        remainder_str: i18n._('currency-symbol') + `${remainder}`,
        gst,
        gst_str: i18n._('currency-symbol') + `${gst}`,
        select: foundRow ? foundRow.select : true,
        amountEditable,
        maxAmount,
        includeConsTax: service.includeConsTax,
        billingType: service.billingType,
        rules: pService.rules || [],
      });
    }
    this.props.updateTableData('project', displayedServices);
  };

  _updateSelectedServiceSelection = row => {
    const { newInvoice } = this.props;
    const tableData = get(newInvoice, 'project.tableData', []);
    const foundRow = find(tableData, { id: row.id });
    if (foundRow) {
      foundRow.select = !row.select;
      this.props.updateTableData('project', tableData);
    }
  };

  _onUpdateAmount = (row, amount) => {
    const { i18n } = this.props;
    const { newInvoice } = this.props;
    const tableData = get(newInvoice, 'project.tableData', []);
    const foundRow = find(tableData, { id: row.id });

    if (Number(amount) > Number(row.maxAmount)) {
      showToast(
        `You are trying to enter amount which is more than ${row.maxAmount}`
      );
      amount = amount.substr(0, amount.length - 1);
    }

    if (foundRow) {
      const gst = foundRow.includeConsTax ? Number(amount || 0) * 0.1 : 0;
      foundRow.amount = Number(amount);
      foundRow.amount_str = i18n._('currency-symbol') + `${amount}`;
      foundRow.gst = gst;
      foundRow.gst_str = i18n._('currency-symbol') + `${gst}`;
      foundRow.remainder = Number(row.maxAmount) - foundRow.amount;
      foundRow.remainder_str =
        i18n._('currency-symbol') + `${foundRow.remainder}`;
      this.props.updateTableData('project', [...tableData]);
    }
  };

  _renderCell = (row, column, ele) => {
    const { classes } = this.props;
    if (column.id === 'service') {
      return (
        <div className={classes.serviceCell}>
          <Checkbox
            id={`service-select-${row.serviceId}`}
            size='medium'
            value={row.select}
            onChange={() => {
              this._updateSelectedServiceSelection(row);
            }}
            label={row[column.id]}
          />
        </div>
      );
    } else if (column.id === 'amount_str') {
      return (
        <div className={classes.serviceCell}>
          <TextField
            id={`amount-input-${row.serviceId}`}
            placeholder={`0`}
            showClearIcon={false}
            isNumber
            value={String(row.amount)}
            icon={
              <span className={classes.dollarIcon}>
                <Trans id='currency-symbol' />
              </span>
            }
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              leftIcon: classes.inputLeftIcon,
              textInput: classes.gstTextInput,
            }}
            isReadOnly={!row.amountEditable}
            onChangeText={value => {
              this._onUpdateAmount(row, value);
            }}
          />
        </div>
      );
    } else if (column.id === 'remainder_str') {
      return (
        <div className={classes.serviceCell}>
          <TextField
            id={`amount-input-${row.serviceId}`}
            placeholder={`0`}
            isNumber
            showClearIcon={false}
            value={String(row.remainder)}
            icon={
              <span className={classes.dollarIcon}>
                <Trans id='currency-symbol' />
              </span>
            }
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              leftIcon: classes.inputLeftIcon,
              textInput: classes.gstTextInput,
            }}
            isReadOnly
          />
        </div>
      );
    }
    return ele;
  };

  render() {
    const {
      classes,
      makeStepActive,
      markedVisited,
      unmarkedVisited,
      theme,
      newInvoice,
    } = this.props;
    const tableData = get(newInvoice, 'project.tableData', []);
    const customer = get(newInvoice, 'project.customer', {});
    return (
      <div>
        <SectionHeader
          title='Create an invoice using a project'
          subtitle='Creating an invoice from a project is a quick way to easily create an invoice from a project which you have already defined.'
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
                  makeStepActive(0);
                  unmarkedVisited(0);
                }}
              />
              <Button
                title='Next'
                id='next-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  makeStepActive(2);
                  markedVisited(1);
                }}
              />
            </div>
          )}
        />
        <div className={classes.content}>
          <div className={classes.selectedProjectInfo}>
            <div
              className={classes.selectedProjectName}
              data-test='customer-name'>
              {get(customer, 'name', '')}
            </div>
            <div
              className={classes.selectedProjectContact}
              data-test='contact-name'>
              {get(customer, 'contactName', '')}{' '}
              {get(customer, 'contactSurname', '')}
            </div>
            <div
              className={classes.selectedProjectEmail}
              data-test='contact-email'>
              {get(customer, 'email', '')}
            </div>
          </div>
          <SectionHeader title='Project details' />
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Table
                columnData={this.state.columnData}
                data={tableData}
                sortable={false}
                stripe={false}
                showRemoveIcon={false}
                cellRenderer={this._renderCell}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose<any, any>(
  withI18n(),
  withStyles(composeStyles(styles, serviceStepStyles)),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, x => x.sessionData.newInvoice),
    }),
    {
      ...actions,
    }
  ),
  withProject(props => {
    return {
      id: get(props, 'newInvoice.project.project.id', ''),
    };
  }),
  withInvoices(props => {
    return {
      variables: {
        where: {
          items_every: {
            project: {
              id: get(props, 'newInvoice.project.project.id', ''),
            },
          },
        },
      },
    };
  })
)(ServiceStep);
