import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  Table,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
// import idx from 'idx';
import { filter } from 'lodash';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import uuid from 'uuid/v4';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import styles from '../styles';
interface IProps {
  classes?: any;
  history?: any;
  i18n?: any;
  makeStepActive?: any;
  markedVisited?: any;
  unmarkedVisited?: any;
  theme?: any;
  inventories?: any;
  salesOrderData?: any;
  salesOrderLines?: any; // Query response
  salesOrderLineData?: any;
  setSalesOrderLineData?: (data: any) => any;
  submitForm?: () => any;
  deleteSalesOrderLine?: (data: any) => any;
}

interface IState {
  columnData: any;
  inventoryList: any;
}

class CreateSalesOrder extends Component<IProps, IState> {
  static defaultProps = {
    inventories: { data: [] },
    salesOrderLines: { data: [] },
    deleteSalesOrderLine: () => ({}),
  };

  public state = {
    columnData: [],
    inventoryList: [],
    salesOrderLineData: [],
  };

  public componentDidMount() {
    const { classes } = this.props;
    this.setState({
      columnData: [
        {
          id: 'inventory',
          label: 'Inventory',
          classes: {
            tableHeaderCellWrapper: classes.rowTabelHeader,
          },
        },
        { id: 'qty', label: 'Quantity' },
      ],
    });
  }

  public componentDidUpdate(prevProps) {
    let {
      inventories: { data = {} } = {},
      salesOrderLines, // Query Response
      salesOrderData: { isEditMode = false },
      salesOrderLineData, // New added record
    } = this.props;
    const { inventoryList }: any = this.state;

    if (data.length && !isEqual(data, prevProps.inventories.data)) {
      data.forEach((rec: any) => {
        inventoryList.push({ value: rec.id, label: rec.name });
      });
      this.setState({ inventoryList });
    }

    if (
      isEditMode &&
      !isEqual(salesOrderLines.data, prevProps.salesOrderLines.data)
    ) {
      salesOrderLineData = filter(
        salesOrderLineData,
        (_) => _.id && !_.inventory,
      );
      salesOrderLines.data.forEach((salesOrderLineRec: any) => {
        const record = {
          id: salesOrderLineRec.id,
          inventory: salesOrderLineRec.inventory.id,
          qty: salesOrderLineRec.qty,
          tempId: uuid(),
        };
        salesOrderLineData.push(record);
      });
      this.props.setSalesOrderLineData(salesOrderLineData);
    }
  }

  public _renderSectionHeading() {
    const {
      classes,
      theme,
      makeStepActive,
      unmarkedVisited,
      markedVisited,
      salesOrderData: { isEditMode = false },
    } = this.props;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Sales Order Line`}
        classes={{ component: classes.sectionHeader }}
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
                markedVisited(1);
              }}
            />
            <Button
              id='submit-salesOrder'
              title={isEditMode ? 'Update' : 'Save'}
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              buttonColor={theme.palette.primary.color2}
              onClick={this.props.submitForm}
            />
          </div>
        )}
      />
    );
  }

  public _addNewEmptyRowToTable() {
    this._addRowToTable({
      id: '',
      inventory: '',
      qty: 0,
      tempId: uuid(),
    });
  }

  public _addRowToTable = (row) => {
    const { salesOrderLineData = [] } = this.props;
    const pos = findIndex(salesOrderLineData, { tempId: row.tempId });
    if (pos > -1) {
      salesOrderLineData[pos] = row;
    } else {
      salesOrderLineData.push(row);
    }
    this.props.setSalesOrderLineData(salesOrderLineData);
  };

  public _onRemoveRow = async (row) => {
    const { salesOrderLineData = [] } = this.props;
    const pos = findIndex(salesOrderLineData, { tempId: row.tempId });
    if (pos > -1) {
      const id = salesOrderLineData[pos].id;
      salesOrderLineData.splice(pos, 1);
      const res = await this.props.deleteSalesOrderLine({ where: { id } });
      if (res.success) {
        this.props.setSalesOrderLineData(salesOrderLineData);
      }
    }
  };

  public _updateSalesOrderInTable = (tempId, key) => (value) => {
    const { salesOrderLineData = [] } = this.props;
    const pos = findIndex(salesOrderLineData, { tempId });
    if (salesOrderLineData[pos]) {
      const row = salesOrderLineData[pos];
      if (key === 'inventory') {
        row.inventory = value.value;
      } else if (key === 'qty') {
        if (isNaN(value)) {
          return;
        }
        row.qty = Math.abs(value) || 0;
        salesOrderLineData[pos] = row;
      }
      this.props.setSalesOrderLineData(salesOrderLineData);
    }
  };

  public _renderCell(row, cell, ele) {
    const { classes } = this.props;
    const { inventoryList } = this.state;
    if (cell.id === 'inventory') {
      return (
        <div>
          <Dropdown
            placeholder={`Select  ${cell.label}`}
            name={cell.id}
            id={cell.id}
            items={
              inventoryList.length
                ? inventoryList
                : [
                    {
                      value: '',
                      label:
                        'No Inventory found. Please create Inventory first',
                    },
                  ]
            }
            value={String(row[cell.id])}
            onChange={this._updateSalesOrderInTable(row.tempId, 'inventory')}
          />
        </div>
      );
    } else if (cell.id === 'qty') {
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
            }}
            onChangeText={this._updateSalesOrderInTable(row.tempId, 'qty')}
          />
        </div>
      );
    }
    return ele;
  }

  public _renderForm() {
    const {
      classes,
      theme,
      salesOrderData: { isEditMode = false },
      salesOrderLineData = [],
    } = this.props;
    return (
      <div>
        <div className={classes.mainDivSalesOrderLine}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <Table
                columnData={this.state.columnData}
                data={salesOrderLineData}
                sortable={false}
                stripe={false}
                showRemoveIcon={true}
                cellRenderer={this._renderCell.bind(this)}
                onRemoveClicked={this._onRemoveRow.bind(this)}
              />
              <div />
              <div className={classes.addRowButton}>
                <Button
                  id='add-sales-order-line'
                  title='Add Sales Order Line'
                  applyBorderRadius
                  compactMode
                  buttonColor={theme.palette.primary.color2}
                  width={300}
                  onClick={this._addNewEmptyRowToTable.bind(this)}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12}>
            <Button
              title={isEditMode ? 'Back to SalesOrder list' : 'Cancel'}
              onClick={() => {
                this.props.history.replace(URL.SALES_ORDER());
              }}
              buttonColor={theme.palette.grey['200']}
              classes={{ text: classes.cancelButtonText }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.SALES_ORDER());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            {this._renderForm()}
          </div>
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose<IProps, IProps>(
  withI18n(),
  // withDeleteSalesOrderLine(),
  // withInventories(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-inventories') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
  // withSalesOrderLines((props, type) => {
  //   let isArchived = false;
  //   if (type === 'archived-saleOrderLines') {
  //     isArchived = true;
  //   }
  //   const salesOrderId = idx(props, (_) => _.match.params.id);
  //   return {
  //     variables: {
  //       where: {
  //         salesOrder: {
  //           id: salesOrderId,
  //         },
  //         isArchived,
  //       },
  //       orderBy: 'id_ASC',
  //     },
  //   };
  // }),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateSalesOrder);
