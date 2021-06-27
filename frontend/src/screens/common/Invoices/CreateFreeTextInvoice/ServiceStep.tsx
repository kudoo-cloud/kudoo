import {
  Button,
  SearchInput,
  SectionHeader,
  Table,
  TextField,
  ToggleSwitch,
  withStyles,
} from '@kudoo/components';
import { Trans, withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import idx from 'idx';
import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withState } from 'recompose';
import uuid from 'uuid/v4';
import * as actions from 'src/store/actions/createNewInvoice';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions: any;
  services: any;
  newInvoice: any;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  setSearchText: Function;
  updateTableData: Function;
  i18n: any;
  classes: any;
  profile: any;
  theme: any;
};
type State = {
  columnData: any;
};

class ServiceStep extends Component<Props, State> {
  static defaultProps = {
    services: { data: [] },
  };

  constructor(props) {
    super(props);
    this.state = {
      columnData: [],
    };
  }

  componentDidMount() {
    const { i18n, classes } = this.props;
    this.setState({
      columnData: [
        {
          id: 'service',
          label: 'Service',
          classes: {
            tableHeaderCellWrapper: classes.serviceTabelHeader,
          },
        },
        { id: 'quantity', label: 'Quantity' },
        { id: 'rate', label: 'Rate' },
        {
          id: 'amount',
          label: 'Amount',
        },
        {
          id: 'gst',
          label: i18n._(`GST`),
          classes: {
            tableHeaderCellWrapper: classes.gstTabelHeader,
          },
        },
      ],
    });
  }

  _onSearch = debounce((searchText) => {
    this.props.setSearchText(searchText);
  }, 100);

  _onItemClick = async (item) => {
    const { profile } = this.props;
    const country = get(profile, 'selectedCompany.country');
    const rate = Number(get(item, 'totalAmount', 0));
    const quantity = 0;
    const amount = rate * quantity;
    const gst = country === 'AU' ? amount * 0.1 : 0;
    this._addServiceToTable({
      id: item.id,
      service: item.name,
      quantity,
      rate,
      amount,
      gst,
      includeConsTax: item.includeConsTax,
    });
  };

  _addServiceToTable = (service) => {
    const { newInvoice } = this.props;
    const tableData = get(newInvoice, 'text.tableData', []);
    const pos = findIndex(tableData, { id: service.id });
    if (pos > -1) {
      tableData[pos] = service;
    } else {
      tableData.push(service);
    }
    this.props.updateTableData('text', tableData);
  };

  _addNewEmptyServiceToTable = () => {
    this._addServiceToTable({
      id: uuid(),
      service: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      gst: 0,
      includeConsTax: false,
    });
  };

  _onRemoveRow = (row) => {
    const { newInvoice } = this.props;
    const tableData = get(newInvoice, 'text.tableData', []);
    const pos = findIndex(tableData, { id: row.id });
    if (pos > -1) {
      tableData.splice(pos, 1);
      this.props.updateTableData('text', tableData);
    }
  };

  _updateServiceInTable = (id, key) => (value) => {
    const { newInvoice, profile } = this.props;
    const country = get(profile, 'selectedCompany.country');
    const tableData = get(newInvoice, 'text.tableData', []);
    const pos = findIndex(tableData, { id });
    if (tableData[pos]) {
      let row = tableData[pos];
      if (key === 'service') {
        row.service = value;
      } else if (key === 'quantity') {
        if (isNaN(value)) {
          return;
        }
        const rate = Number(row.rate);
        const quantity = Math.abs(value) || 0;
        const amount = rate * quantity;
        const gst = country === 'AU' ? amount * 0.1 : 0;

        row = {
          ...row,
          quantity,
          amount,
          gst,
        };
      } else if (key === 'rate') {
        if (isNaN(value)) {
          return;
        }

        // const rate = Math.abs(Number(value || 0));
        const rate = value || 0;
        const quantity = row.quantity || 0;
        const amount = rate * quantity;
        const gst = country === 'AU' ? amount * 0.1 : 0;

        row = {
          ...row,
          rate,
          amount,
          gst,
        };
      } else if (key === 'gst') {
        if (isNaN(value)) {
          return;
        }
        row = {
          ...row,
          gst: Number(value) || 0,
        };
      }

      tableData[pos] = row;
    }
    this.props.updateTableData('text', tableData);
  };

  _updateIncludeGstSwitch = (id) => (isChecked) => {
    const { newInvoice } = this.props;
    const tableData = get(newInvoice, 'text.tableData', []);
    const pos = findIndex(tableData, { id });
    if (pos > -1) {
      const row = tableData[pos];
      row.includeConsTax = isChecked;
      this.props.updateTableData('text', tableData);
    }
  };

  _hasInvalidData = () => {
    const { newInvoice } = this.props;
    const tableData = get(newInvoice, 'text.tableData', []);
    if (tableData.length === 0) {
      return true;
    }

    let isInvalid = false;
    for (let index = 0; index < tableData.length; index++) {
      const row = tableData[index];
      if (!row.service) {
        isInvalid = true;
        break;
      }
    }
    return isInvalid;
  };

  _renderCell = (row, cell, ele) => {
    const { classes, theme, profile } = this.props;
    const country = get(profile, 'selectedCompany.country');

    if (cell.id === 'service') {
      return (
        <div>
          <TextField
            id={`service-input-${row.id}`}
            placeholder={`Enter ${cell.label}`}
            showClearIcon={false}
            value={String(row[cell.id])}
            classes={{
              textInputWrapper: classes.tableInputWrapper,
            }}
            onChangeText={this._updateServiceInTable(row.id, 'service')}
          />
        </div>
      );
    } else if (cell.id === 'quantity') {
      return (
        <div className={classes.tableInputCell}>
          <TextField
            id={`quantity-input-${row.id}`}
            placeholder={`0`}
            showClearIcon={false}
            value={String(row[cell.id])}
            isNumber
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              component: classes.smallInputComponent,
            }}
            onChangeText={this._updateServiceInTable(row.id, 'quantity')}
          />
        </div>
      );
    } else if (cell.id === 'rate') {
      return (
        <div className={classes.tableInputCell}>
          <TextField
            id={`rate-input-${row.id}`}
            placeholder={`0`}
            showClearIcon={false}
            value={String(row[cell.id])}
            isNumber
            icon={
              <span className={classes.dollarIcon}>
                <Trans id='currency-symbol' />
              </span>
            }
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              component: classes.smallInputComponent,
              leftIcon: classes.inputLeftIcon,
            }}
            onChangeText={this._updateServiceInTable(row.id, 'rate')}
          />
        </div>
      );
    } else if (cell.id === 'amount') {
      return (
        <div className={classes.tableInputCell}>
          <TextField
            id={`amount-input-${row.id}`}
            placeholder={`0`}
            showClearIcon={false}
            value={String(row[cell.id])}
            isNumber
            icon={
              <span className={classes.dollarIcon}>
                <Trans id='currency-symbol' />
              </span>
            }
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              component: classes.smallInputComponent,
              leftIcon: classes.inputLeftIcon,
            }}
            isReadOnly
          />
        </div>
      );
    } else if (cell.id === 'gst') {
      return (
        <div className={classes.tableInputCell}>
          <TextField
            id={`gst-input-${row.id}`}
            placeholder={`0`}
            showClearIcon={false}
            value={row.includeConsTax ? String(row[cell.id]) : '0'}
            icon={
              <span className={classes.dollarIcon}>
                <Trans id='currency-symbol' />
              </span>
            }
            classes={{
              textInputWrapper: classes.tableInputWrapper,
              component: classes.smallInputComponent,
              leftIcon: classes.inputLeftIcon,
            }}
            isReadOnly={country === 'AU' || !row.includeConsTax}
            onChangeText={this._updateServiceInTable(row.id, 'gst')}
          />
          <ToggleSwitch
            onColor={theme.palette.primary.color1}
            compact
            value={row.includeConsTax}
            onChange={this._updateIncludeGstSwitch(row.id)}
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
      services,
      newInvoice,
      i18n,
    } = this.props;
    let tableData = get(newInvoice, 'text.tableData', []);
    let total = 0;
    tableData = tableData.map((row) => {
      const amount = row.amount || 0;
      const gst = row.includeConsTax ? row.gst || 0 : 0;
      total += amount + gst;
      return row;
    });

    return (
      <div>
        <SectionHeader
          title='Create a free text invoice'
          subtitle='Lets begin by selecting an option below. If you are unsure select the question mark provided.'
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
                isDisabled={this._hasInvalidData()}
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  makeStepActive(2);
                  markedVisited(1);
                }}
              />
            </div>
          )}
        />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <SectionHeader
              title='Search for service template'
              classes={{ component: classes.formHeading }}
            />
            <form className={classes.form}>
              <SearchInput
                placeholder={'Search by typing a service name'}
                showClearIcon={false}
                items={get(services, 'data', []).map((service) => ({
                  ...service,
                  label: service.name,
                }))}
                onSearch={this._onSearch}
                onInputChange={this._onSearch}
                onItemClick={this._onItemClick}
              />
            </form>
          </Grid>
          <Grid item xs={12} sm={12}>
            <SectionHeader
              title='Define service/s'
              classes={{ component: classes.formHeading }}
            />
            <Table
              columnData={this.state.columnData}
              data={tableData}
              sortable={false}
              stripe={false}
              showRemoveIcon={true}
              cellRenderer={this._renderCell}
              onRemoveClicked={this._onRemoveRow}
            />
            <div className={classes.addServiceButton}>
              <Button
                id='add-service'
                title='Add Service'
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                width={150}
                onClick={this._addNewEmptyServiceToTable}
              />
            </div>
            <div className={classes.totalWrapper}>
              <div className={classes.totalLabel}>Total</div>
              <div
                className={classes.totalValue}
                data-test={`total-amount-${total}`}
              >
                {i18n._('currency-symbol')} {total}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withI18n(),
  withState('searchText', 'setSearchText', ''),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, (x) => x.sessionData.newInvoice),
    }),
    {
      ...actions,
    },
  ),
  // withServices((props) => {
  //   let where: any = {
  //     isArchived: false,
  //     isTemplate: true,
  //   };
  //   if (props.searchText) {
  //     where = {
  //       ...where,
  //       name_contains: props.searchText,
  //     };
  //   }
  //   return {
  //     variables: {
  //       where,
  //     },
  //   };
  // }),
)(ServiceStep);
