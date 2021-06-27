import {
  Button,
  Dropdown,
  ErrorBoundary,
  Loading,
  SearchInput,
  SectionHeader,
  Table,
  TextField,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
// import idx from 'idx';
import { debounce, filter, find, findIndex } from 'lodash';
import isEqual from 'lodash/isEqual';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withState } from 'recompose';
import uuid from 'uuid/v4';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { IPBSDrug } from 'src/screens/inventory/PurchaseOrder/NonPbsPurchaseOrder/CreateNonPbsPO/NonPBSPOtypes';
import styles, {
  createPurchaseOrderStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import {
  ICreatePBSPOLineProps,
  ICreatePBSPOLineState,
  IPBSPOLine,
  IPurchaseOrderLineData,
} from '../PBSPOtypes';

class CreatePBSPurchaseOrderLine extends React.Component<
  ICreatePBSPOLineProps,
  ICreatePBSPOLineState
> {
  public static defaultProps = {
    wareHouses: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    pbsTPPs: {
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
  };

  public state = {
    columnData: [],
    drugsList: [],
    wareHouseList: [],
    showDrugMenu: false,
    showError: false,
  };

  public componentDidMount() {
    const { classes } = this.props;
    this.setState({
      columnData: [
        {
          id: 'pbsDrug',
          label: 'Item',
          classes: {
            tableHeaderCellWrapper: classes.rowTableHeader,
          },
        },
        {
          id: 'site',
          label: 'Site',
          classes: {
            tableHeaderCellWrapper: classes.rowTableHeader,
          },
        },
        { id: 'qty', label: 'Quantity' },
      ],
    });
  }

  public componentDidUpdate(prevProps) {
    let {
      pbsTPPs,
      wareHouses,
      purchaseOrderLines, // Query Response
      purchaseOrderData: { defaultData, isEditMode = false },
      purchaseOrderLineData, // New added record
    }: any = this.props;
    let { drugsList, wareHouseList }: any = this.state;

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

    // =================Drug List=======================//
    if (!isEqual(pbsTPPs.data, prevProps.pbsTPPs.data)) {
      drugsList = [];
      pbsTPPs.data.length &&
        pbsTPPs.data.forEach((rec: IPBSDrug) => {
          const value = { key: rec.brandName, value: rec.id };
          drugsList.push({
            value,
            label: rec.brandName,
            pbsOrganisation: {
              key: rec.organisation_id.title,
              value: rec.organisation_id.id,
            },
          });
        });
      purchaseOrderLineData = filter(
        purchaseOrderLineData,
        (_) => _.pbsDrug.key,
      );
      purchaseOrderLineData.forEach((_: IPurchaseOrderLineData) => {
        this._setDrugList(_);
      });
      this.setState({ drugsList });
    }

    // ===================Initialize Data on edit mode===============//
    if (
      isEditMode &&
      !isEqual(purchaseOrderLines.data, prevProps.purchaseOrderLines.data)
    ) {
      purchaseOrderLineData = filter(
        purchaseOrderLineData,
        (_) => _.pbsDrug.key,
      );
      purchaseOrderLines.data.forEach(
        async (purchaseOrderLineRec: IPBSPOLine) => {
          const polRec = find(
            purchaseOrderLineData,
            (_) => _.id === purchaseOrderLineRec.id,
          );
          let record = {} as IPurchaseOrderLineData;
          if (polRec) {
            record = {
              id: polRec.id,
              pbsDrug: polRec.pbsDrug || '',
              qty: polRec.qty || '',
              site: polRec.site || '',
              tempId: uuid(),
              purchaseOrder: polRec.purchaseOrder.id || '',
              pbsOrganisation: polRec.pbsOrganisation || '',
            };
          } else {
            const pbsDrugRec = JSON.parse(purchaseOrderLineRec.pbsDrug);
            const pbsOrgRec = JSON.parse(defaultData.pbsOrganisation);
            record = {
              id: purchaseOrderLineRec.id,
              pbsDrug: { key: pbsDrugRec.key, value: pbsDrugRec.value },
              qty: purchaseOrderLineRec.qty || 0,
              site: {
                key: purchaseOrderLineRec.site.name,
                value: purchaseOrderLineRec.site.id,
              },
              tempId: uuid() || '',
              purchaseOrder: purchaseOrderLineRec.purchaseOrder.id || '',
              pbsOrganisation: { key: pbsOrgRec.key, value: pbsOrgRec.value },
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
          this._setDrugList(record);
        },
      );
      this.props.setPurchaseOrderLineData(purchaseOrderLineData);
      this.setState({ drugsList });
    }
  }

  public _setDrugList = (pbs) => {
    const { drugsList = [] }: any = this.state;
    const drugIndex = find(drugsList, (_) => _.value === pbs.pbsDrug.value);
    if (drugIndex < 0 || !drugIndex) {
      drugsList.push({
        value: { key: pbs.pbsDrug.key, value: pbs.pbsDrug.value },
        label: pbs.pbsDrug.key,
        pbsOrganisation: {
          key: pbs.pbsOrganisation.key,
          value: pbs.pbsOrganisation.value,
        },
      });
    }
    this.setState({ drugsList });
  };

  public _onSearchDrug = debounce((searchText) => {
    const {
      pbsTPPs,
      setSearchText,
      purchaseOrderData: { defaultData, isEditMode },
    } = this.props;
    if (searchText) {
      setSearchText(searchText);
      if (isEditMode) {
        pbsTPPs.refetch({
          where: {
            brandName: searchText,
            organisation_id: JSON.parse(defaultData.pbsOrganisation).value,
          },
        });
      } else {
        pbsTPPs.refetch({
          where: {
            brandName: searchText,
          },
        });
      }
    }
  }, 100);

  public _submitForm = () => {
    const { makeStepActive, markedVisited, purchaseOrderLineData } = this.props;
    let flag = 0;
    purchaseOrderLineData.forEach((_) => {
      if (flag === 0 && _.pbsDrug && _.site.key && _.qty >= 0) {
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
        title={`${
          isEditMode ? 'Update' : 'Create new'
        } PBS Purchase Order Line`}
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
      pbsDrug: '',
      qty: 0,
      site: { key: '', value: '' },
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
    this.setState({ showDrugMenu: true });
  };

  public _onRemoveRow = async (row) => {
    const { purchaseOrderLineData = [] } = this.props;
    const pos = findIndex(purchaseOrderLineData, { tempId: row.tempId });
    if (pos > -1) {
      const id = purchaseOrderLineData[pos].id;
      purchaseOrderLineData.splice(pos, 1);
      if (id) {
        this.props
          .deletePurchaseOrderLine({ where: { id } })
          .then((res) => {
            if (res.success) {
              this.props.setPurchaseOrderLineData(purchaseOrderLineData);
            }
          })
          .catch((err) => {
            showToast(err);
          });
      } else {
        this.props.setPurchaseOrderLineData(purchaseOrderLineData);
      }
    }
  };

  public _updatePurchaseOrderInTable = (tempId, key) => (value) => {
    const { purchaseOrderLineData = [] } = this.props;
    const pos = findIndex(purchaseOrderLineData, { tempId });
    if (purchaseOrderLineData[pos]) {
      const row: any = purchaseOrderLineData[pos];
      if (key === 'pbsDrug') {
        row.pbsDrug = value
          ? { key: value.value.key, value: value.value.value }
          : '';
        row.pbsOrganisation = value
          ? {
              key: value.pbsOrganisation.key,
              value: value.pbsOrganisation.value,
            }
          : '';
      } else if (key === 'site') {
        row.site = { key: value.value.key, value: value.value.value };
      } else if (key === 'qty') {
        if (isNaN(value)) {
          return;
        }
        row.qty = Math.abs(value) || 0;
        purchaseOrderLineData[pos] = row;
      }
      this.props.setPurchaseOrderLineData(purchaseOrderLineData);
    }
  };

  public _renderCell(row, cell, ele) {
    const {
      classes,
      purchaseOrderData: { isEditMode },
    } = this.props;
    const { drugsList, wareHouseList, showDrugMenu } = this.state;
    if (cell.id === 'pbsDrug') {
      if (row[cell.id] || showDrugMenu || !isEditMode) {
        return (
          <div>
            <SearchInput
              placeholder={'Type and Select item'}
              showClearIcon={false}
              showSearchIcon={false}
              items={drugsList}
              defaultInputValue={row[cell.id] ? String(row[cell.id].key) : ''}
              onInputChange={this._onSearchDrug}
              onItemClick={this._updatePurchaseOrderInTable(
                row.tempId,
                'pbsDrug',
              )}
            />
          </div>
        );
      } else {
        return (
          <div>
            <Loading size={40} color='black' />
          </div>
        );
      }
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
        <div>
          <Dropdown
            placeholder={'Select Site'}
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
    }
    return ele;
  }

  public _renderForm() {
    const {
      classes,
      theme,
      purchaseOrderData: { isEditMode = false },
      purchaseOrderLineData,
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
                this.props.history.replace(URL.PBS_PURCHASE_ORDER());
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
  withState('searchText', 'setSearchText', ''),
  // withDeletePurchaseOrderLine(),
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
  // withPbsTPPs(() => {
  //   return {
  //     variables: {
  //       orderBy: 'id_ASC',
  //       first: 20,
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
  connect((state: { profile: any }) => ({
    profile: state.profile,
  })),
  withStyles(composeStyles(styles, createPurchaseOrderStyles)),
)(CreatePBSPurchaseOrderLine);
