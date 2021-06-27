import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  Table,
  TextField,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
// import idx from 'idx';
import { filter, find, findIndex, isEqual } from 'lodash';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import SelectedCompany from 'src/helpers/SelectedCompany';
import URL from 'src/helpers/urls';
import styles, {
  createPurchaseOrderStyles,
  reviewStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import { UOM } from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/types';
import {
  ICreatePOLineProps,
  ICreatePOLineState,
  IPOLine,
  IPOResponse,
  IPurchaseOrderLineData,
} from '../NonPBSPOtypes';

class CreateNonPbsPO extends React.Component<
  ICreatePOLineProps,
  ICreatePOLineState
> {
  public static defaultProps = {
    wareHouses: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    inventories: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    purchaseOrderLines: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    deletePurchaseOrderLine: () => ({}),
    purchaseOrderLineData: [],
  };

  public state = {
    columnData: [],
    inventoryList: [],
    wareHouseList: [],
    showError: false,
  };

  public componentDidMount() {
    const { classes } = this.props;
    this.setState({
      columnData: [
        {
          id: 'item',
          label: 'Item',
          classes: {
            tableHeaderCellWrapper: classes.mediumWidthCell,
          },
        },
        {
          id: 'site',
          label: 'Site',
          classes: {
            tableHeaderCellWrapper: classes.mediumWidthCell,
          },
        },
        {
          id: 'qty',
          label: 'Quantity',
          classes: {
            tableHeaderCellWrapper: classes.mediumWidthCell,
          },
        },
        {
          id: 'unit',
          label: 'Unit',
          classes: {
            tableHeaderCellWrapper: classes.mediumWidthCell,
          },
        },
        {
          id: 'unitPrice',
          label: 'Unit Price',
          classes: {
            tableHeaderCellWrapper: classes.mediumWidthCell,
          },
        },
      ],
    });
  }

  public componentDidUpdate(prevProps) {
    let {
      inventories,
      wareHouses,
      purchaseOrderLines, // Query Response
      purchaseOrderData: { isEditMode = false },
      purchaseOrderLineData, // New added record
    }: any = this.props;
    let { inventoryList, wareHouseList }: any = this.state;

    // ===============Site List==========================//
    if (
      wareHouses.data.length &&
      !isEqual(wareHouses.data, prevProps.wareHouses.data)
    ) {
      wareHouseList = [];
      wareHouses.data.forEach((rec: { id: string; name: string }) => {
        const value = { key: rec.name, value: rec.id };
        wareHouseList.push({ value, label: rec.name });
      });
      this.setState({ wareHouseList });
    }

    // =================Inventory List=======================//
    if (
      inventories.data.length &&
      !isEqual(inventories.data, prevProps.inventories.data)
    ) {
      inventoryList = [];
      inventories.data.forEach((rec: { id: string; name: string }) => {
        const value = { key: rec.name, value: rec.id };
        inventoryList.push({ value, label: rec.name });
      });
      this.setState({ inventoryList });
    }

    // ===================Initialize Data on edit mode===============//
    if (
      isEditMode &&
      !isEqual(purchaseOrderLines.data, prevProps.purchaseOrderLines.data)
    ) {
      purchaseOrderLineData = filter(
        purchaseOrderLineData,
        (_) => _.item && _.id,
      );
      purchaseOrderLines.data.forEach((purchaseOrderLineRec: IPOLine) => {
        // For Navigation
        const polRec = find(
          purchaseOrderLineData,
          (_) => _.id === purchaseOrderLineRec.id,
        );
        let record = {} as IPurchaseOrderLineData;
        if (polRec) {
          record = {
            id: polRec.id,
            item: polRec.item,
            qty: polRec.qty,
            site: polRec.site,
            unit: polRec.unit,
            unitPrice: polRec.unitPrice,
            tempId: uuid(),
          };
        } else {
          record = {
            id: purchaseOrderLineRec.id,
            item: {
              key: purchaseOrderLineRec.item.name,
              value: purchaseOrderLineRec.item.id,
            },
            qty: purchaseOrderLineRec.qty,
            site: {
              key: purchaseOrderLineRec.site.name,
              value: purchaseOrderLineRec.site.id,
            },
            unit: purchaseOrderLineRec.unit,
            unitPrice: purchaseOrderLineRec.unitPrice,
            tempId: uuid(),
          };
        }
        const recIndex = findIndex(
          purchaseOrderLineData,
          (_: any) => _.id === record.id,
        );
        if (recIndex >= 0) {
          purchaseOrderLineData.splice(recIndex, 1, record);
        } else {
          purchaseOrderLineData.push(record);
        }
      });
      this.props.setPurchaseOrderLineData(purchaseOrderLineData);
    }
  }

  public _submitForm = () => {
    const { makeStepActive, markedVisited, purchaseOrderLineData } = this.props;
    let flag = 0;
    purchaseOrderLineData.forEach((_) => {
      if (flag === 0 && _.item.key && _.site.key && _.qty >= 0) {
        flag++;
      }
    });
    if (flag >= 1) {
      this.setState({ showError: false });
      markedVisited(1);
      makeStepActive(2);
    } else {
      this.setState({ showError: true });
    }
  };

  public _renderSectionHeading() {
    const {
      classes,
      theme,
      makeStepActive,
      unmarkedVisited,
      markedVisited,
      purchaseOrderData: { isEditMode = false } = {},
    } = this.props;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Purchase Order Line`}
        classes={{ component: classes.sectionHeading }}
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
              title='Next'
              id='next-button'
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              buttonColor={'#29a9db'}
              onClick={this._submitForm}
            />
          </div>
        )}
      />
    );
  }

  public _addNewEmptyRowToTable() {
    this._addRowToTable({
      id: '',
      item: { key: '', value: '' },
      qty: 0,
      site: { key: '', value: '' },
      unit: 'EA',
      unitPrice: 0,
      tempId: uuid(),
    });
  }

  public _addRowToTable = (row) => {
    const { purchaseOrderLineData = [] }: any = this.props;
    const pos = findIndex(purchaseOrderLineData, { tempId: row.tempId });
    if (pos > -1) {
      purchaseOrderLineData[pos] = row;
    } else {
      purchaseOrderLineData.push(row);
    }
    this.props.setPurchaseOrderLineData(purchaseOrderLineData);
  };

  public _onRemoveRow = async (row) => {
    const { purchaseOrderLineData } = this.props;
    const pos = findIndex(purchaseOrderLineData, { tempId: row.tempId });
    if (pos > -1) {
      const id = purchaseOrderLineData[pos].id;
      purchaseOrderLineData.splice(pos, 1);
      if (id) {
        const res = this.props.deletePurchaseOrderLine({
          where: { id },
        }) as IPOResponse;
        if (res.success) {
          this.props.setPurchaseOrderLineData(purchaseOrderLineData);
        }
      } else {
        this.props.setPurchaseOrderLineData(purchaseOrderLineData);
      }
    }
  };

  public _updatePurchaseOrderInTable = (tempId, key) => (value) => {
    const { purchaseOrderLineData = [] } = this.props;
    const pos = findIndex(purchaseOrderLineData, { tempId });
    if (purchaseOrderLineData[pos]) {
      const row = purchaseOrderLineData[pos];
      if (key === 'item') {
        row.item = value.value;
      } else if (key === 'site') {
        row.site = value.value;
      } else if (key === 'unit') {
        row.unit = value.value;
      } else if (key === 'qty') {
        if (isNaN(value)) {
          return;
        }
        row.qty = Math.abs(value) || 0;
        purchaseOrderLineData[pos] = row;
      } else if (key === 'unitPrice') {
        if (!isFinite(value)) {
          return;
        }
        row.unitPrice = value;
      }
      this.props.setPurchaseOrderLineData(purchaseOrderLineData);
    }
  };

  public _renderCell(row, cell, ele) {
    const { classes } = this.props;
    const { inventoryList, wareHouseList } = this.state;
    if (cell.id === 'item') {
      return (
        <div className={classes.tableInputCell}>
          <Dropdown
            placeholder={`Select  ${cell.label}`}
            name={cell.id}
            id={cell.id}
            classes={{
              component: classes.pDropDown,
              select: classes.pDropdownSelect,
            }}
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
            value={row[cell.id]}
            onChange={this._updatePurchaseOrderInTable(row.tempId, 'item')}
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
            onChangeText={this._updatePurchaseOrderInTable(row.tempId, 'qty')}
          />
        </div>
      );
    } else if (cell.id === 'site') {
      return (
        <div className={classes.tableInputCell}>
          <Dropdown
            placeholder={`Select  ${cell.label}`}
            name={cell.id}
            id={cell.id}
            items={
              wareHouseList.length
                ? wareHouseList
                : [
                    {
                      value: '',
                      label:
                        'No Warehouse found. Please create Warehouse first',
                    },
                  ]
            }
            value={row[cell.id]}
            classes={{
              component: classes.pDropDown,
              select: classes.pDropdownSelect,
            }}
            onChange={this._updatePurchaseOrderInTable(row.tempId, 'site')}
          />
        </div>
      );
    } else if (cell.id === 'unit') {
      return (
        <div className={classes.tableInputCell}>
          <Dropdown
            placeholder={`Select  ${cell.label}`}
            name={cell.id}
            id={cell.id}
            items={UOM}
            value={String(row[cell.id])}
            classes={{
              component: classes.pDropDown,
              select: classes.pDropdownSelect,
            }}
            onChange={this._updatePurchaseOrderInTable(row.tempId, 'unit')}
          />
        </div>
      );
    } else if (cell.id === 'unitPrice') {
      return (
        <div className={classes.tableInputCell}>
          <TextField
            id={`unitPrice-input-${row.id}`}
            placeholder={`0`}
            showClearIcon={false}
            value={String(row[cell.id])}
            classes={{
              textInputWrapper: classes.tableInputWrapper,
            }}
            onChangeText={this._updatePurchaseOrderInTable(
              row.tempId,
              'unitPrice',
            )}
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
      purchaseOrderData: { isEditMode = false } = {},
      purchaseOrderLineData = [],
    } = this.props;
    const { showError } = this.state;
    return (
      <div>
        <div className={classes.purchaseOrderLineTable}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              {showError && (
                <div className={classes.errorLabel}>
                  Please enter proper record.
                </div>
              )}
              <Table
                columnData={this.state.columnData}
                data={purchaseOrderLineData}
                sortable={false}
                stripe={false}
                showRemoveIcon={true}
                cellRenderer={this._renderCell.bind(this)}
                onRemoveClicked={this._onRemoveRow.bind(this)}
              />
              <div />
              <div className={classes.addRowButton}>
                <Button
                  id='add-purchase-order-line'
                  title='Add Purchase Order Line'
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
              title={isEditMode ? 'Back to PurchaseOrder list' : 'Cancel'}
              onClick={() => {
                this.props.history.replace(URL.NON_PBS_PURCHASE_ORDER());
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
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.PURCHASE_ORDER());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            {this._renderForm()}
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  // withDeletePurchaseOrderLine(),
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
  // withWareHouses(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-wareHouses') {
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
  // withPurchaseOrderLines((props, type) => {
  //   let isArchived = false;
  //   if (type === 'archived-purchaseOrderLines') {
  //     isArchived = true;
  //   }
  //   const purchaseOrderId = idx(props, (_) => _.match.params.id);
  //   return {
  //     variables: {
  //       where: {
  //         purchaseOrder: {
  //           id: purchaseOrderId,
  //         },
  //         isArchived,
  //       },
  //       orderBy: 'id_ASC',
  //     },
  //   };
  // }),
  connect((state: { profile: object }) => ({
    profile: state.profile,
  })),
  withStyles(composeStyles(styles, createPurchaseOrderStyles, reviewStyles)),
)(CreateNonPbsPO);
