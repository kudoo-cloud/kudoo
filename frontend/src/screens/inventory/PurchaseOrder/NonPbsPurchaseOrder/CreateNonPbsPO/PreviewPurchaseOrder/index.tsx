import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import { Grid } from '@material-ui/core';
import idx from 'idx';
import { filter, get } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { generatePDF } from 'src/helpers/jsPDF';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles, {
  reviewStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import { POSTATUS } from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/types';
import {
  IPOResponse,
  IPreviewPOProps,
  IPreviewPOState,
} from '../NonPBSPOtypes';

class PreviewPurchaseOrder extends React.Component<
  IPreviewPOProps,
  IPreviewPOState
> {
  public static defaultProps = {
    purchaseOrders: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    createPurchaseOrder: () => ({}),
    updatePurchaseOrder: () => ({}),
    createPurchaseOrderLine: () => ({}),
    updatePurchaseOrderLine: () => ({}),
  };

  public state = {
    submitting: false,
  };

  public _generatePDF = async () => {
    return await generatePDF('pdf-content');
  };

  public _submitForm = async () => {
    this.setState({ submitting: true });
    const {
      purchaseOrderData: { defaultData, isEditMode = false, actions },
      purchaseOrderLineData = {},
      profile: { id = '' } = {},
    } = this.props;

    const pdfBlob = await this._generatePDF();
    const pdfFile = new File([pdfBlob], 'purchaseOrder.pdf');

    const dataToSend = {
      date: defaultData.date,
      supplier: {
        connect: {
          id: defaultData.supplier.value || '',
        },
      },
      orderer: {
        connect: {
          id,
        },
      },
      status: POSTATUS.OPEN,
      isPbsPO: false,
      preview: pdfFile,
    };

    const purchaseOrderLineFilterData = filter(
      purchaseOrderLineData,
      (filterData: any) => filterData.qty >= 0 && filterData.item.key,
    );
    let flag = 0;

    if (!isEditMode) {
      const res: IPOResponse | any = await this.props.createPurchaseOrder({
        data: { ...dataToSend },
      });
      if (res.success) {
        purchaseOrderLineFilterData.forEach(async (_: any) => {
          const purchaseOrderLineDataToSend = {
            purchaseOrder: {
              connect: {
                id: res.result.id,
              },
            },
            item: {
              connect: {
                id: _.item.value,
              },
            },
            qty: _.qty,
            site: {
              connect: {
                id: _.site.value,
              },
            },
            unit: _.unit || 'EA',
            unitPrice: parseFloat(_.unitPrice) || 0,
          };
          const purchaseOrderLineResponse: IPOResponse =
            await this.props.createPurchaseOrderLine({
              data: purchaseOrderLineDataToSend,
            });
          if (!purchaseOrderLineResponse.success && flag === 0) {
            flag = 1;
            (idx(purchaseOrderLineResponse, (x) => x.error) || []).forEach(
              (err) => showToast(err),
            );
            actions.setSubmitting(false);
          }
        });
        if (flag === 0) {
          this.setState({ submitting: false });
          showToast(null, 'Purchase Order created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.PURCHASE_ORDER());
        }
      } else {
        (idx(res, (x) => x.error) || []).forEach((err) => showToast(err));
        actions.setSubmitting(false);
      }
    } else {
      const res: IPOResponse | any = await this.props.updatePurchaseOrder({
        data: dataToSend,
        where: { id: defaultData.id },
      });
      if (res.success) {
        let purchaseOrderLineResponse: IPOResponse | null = null;
        purchaseOrderLineFilterData.forEach(async (_: any) => {
          const purchaseOrderLineDataToSend = {
            purchaseOrder: {
              connect: {
                id: res.result.id,
              },
            },
            item: {
              connect: {
                id: _.item.value,
              },
            },
            qty: _.qty,
            site: {
              connect: {
                id: _.site.value,
              },
            },
            unit: _.unit || 'EA',
            unitPrice: parseFloat(_.unitPrice) || 0,
          };
          if (_.id) {
            purchaseOrderLineResponse =
              (await this.props.updatePurchaseOrderLine({
                data: purchaseOrderLineDataToSend,
                where: { id: _.id },
              })) as IPOResponse;
          } else {
            purchaseOrderLineResponse =
              (await this.props.createPurchaseOrderLine({
                data: purchaseOrderLineDataToSend,
              })) as IPOResponse;
          }
          if (!purchaseOrderLineResponse.success && flag === 0) {
            flag = 1;
            (idx(res, (x) => x.error) || []).forEach((err) => showToast(err));
            actions.setSubmitting(false);
          }
        });
        if (flag === 0) {
          this.setState({ submitting: false });
          showToast(null, 'Purchase Order updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.PURCHASE_ORDER());
        }
      } else {
        (idx(res, (x) => x.error) || []).forEach((err) => showToast(err));
        actions.setSubmitting(false);
      }
    }
  };

  public _renderCancelButton = () => {
    const {
      purchaseOrderData: { isEditMode },
      classes,
      theme,
    } = this.props;
    return (
      <Button
        title={isEditMode ? 'Back to Purchase Order list' : 'Cancel'}
        onClick={() => {
          this.props.history.replace(URL.NON_PBS_PURCHASE_ORDER());
        }}
        buttonColor={theme.palette.grey['200']}
        classes={{
          text: classes.cancelButtonText,
          component: classes.cancelButtonComponent,
        }}
      />
    );
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
    const { submitting } = this.state;
    return (
      <SectionHeader
        title={'Review your purchase order'}
        subtitle={`Review your ${
          isEditMode ? 'updated' : 'newly created'
        } purchase order below. If you need to make changes then select the given step.`}
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
                makeStepActive(1);
                unmarkedVisited(1);
                markedVisited(2);
              }}
            />
            <Button
              loading={submitting}
              id='submit-purchaseOrder'
              title={'Submit'}
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              buttonColor={theme.palette.primary.color2}
              onClick={this._submitForm}
            />
          </div>
        )}
      />
    );
  }

  public _renderLogo = () => {
    const { classes, profile } = this.props;
    const logo = get(profile, 'selectedDAO.logo.url', '');
    const daoName = get(profile, 'selectedDAO.name');
    if (!logo) {
      return (
        <div className={classes.purchaseOrderName} style={{ marginTop: 0 }}>
          {daoName}
        </div>
      );
    } else if (logo) {
      return (
        <div
          className={classes.daoLogo}
          style={{ backgroundImage: `url(${logo})` }}
        />
      );
    }
    return null;
  };

  private _renderServices() {
    const { classes, purchaseOrderLineData } = this.props;
    const headerData = [
      {
        id: 'item',
        label: 'Item',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'site',
        label: 'Site',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.mediumWidthCell,
        },
      },
      {
        id: 'qty',
        label: 'Quantity',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'unit',
        label: 'Unit',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
      {
        id: 'unitPrice',
        label: 'Unit Price',
        classes: {
          cellValueText: classes.smallTextCell,
          tableHeaderCellWrapper: classes.smallWidthCell,
        },
      },
    ];

    const purchaseOrderLineFilterData = filter(
      purchaseOrderLineData,
      (filterData) => filterData.qty >= 0 && filterData.item.key,
    );

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={purchaseOrderLineFilterData}
          stripe={false}
          sortable={false}
          showRemoveIcon={false}
          cellRenderer={this._renderCell}
        />
      </div>
    );
  }

  public _renderCell = (row, column, ele) => {
    const { classes } = this.props;
    if (column.id === 'item') {
      return (
        <div className={classes.borderCell}>{`${row[column.id].key}`}</div>
      );
    }
    if (column.id === 'site') {
      return (
        <div className={classes.borderCell}>{`${row[column.id].key}`}</div>
      );
    }
    if (column.id === 'qty') {
      return <div className={classes.borderCell}>{`${row[column.id]}`}</div>;
    }
    if (column.id === 'unit') {
      return <div className={classes.borderCell}>{`${row[column.id]}`}</div>;
    }
    if (column.id === 'unitPrice') {
      return <div className={classes.borderCell}>{`${row[column.id]}`}</div>;
    }
    return ele;
  };

  public render() {
    const {
      classes,
      profile,
      purchaseOrderData: { defaultData },
    } = this.props;
    const daoName = get(profile, 'selectedDAO.name');
    const logo = get(profile, 'selectedDAO.logo.url', '');

    return (
      <ErrorBoundary>
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.PURCHASE_ORDER());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            <div className={classes.content} id='pdf-content'>
              <div className={classes.purchaseOrderHeader}>
                <Grid container>
                  <Grid item xs={6}>
                    {this._renderLogo()}
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    classes={{ item: classes.purchaseOrderTitleRightPart }}
                  >
                    {logo && (
                      <div className={classes.purchaseOrderName}>{daoName}</div>
                    )}
                  </Grid>
                </Grid>
              </div>
              {/* Purchase Order Date Block */}
              <div className={classes.purchaseOrderDateWrapper}>
                <div className={classes.purchaseOrderDateBlock}>
                  <div className={classes.purchaseOrderDateLabel}>
                    Purchase Order Date
                  </div>
                  <div
                    className={classes.purchaseOrderDateValue}
                    data-test='purchaseOrder-date'
                  >
                    {moment(defaultData.date).format('DD MMM YYYY')}
                  </div>
                </div>
                <div
                  className={classes.purchaseOrderDateBlock}
                  style={{ textAlign: 'right' }}
                >
                  <div className={classes.purchaseOrderDateLabel}>Supplier</div>
                  <div
                    className={classes.purchaseOrderDateValue}
                    data-test='due-date'
                  >
                    {defaultData.supplier.key}
                  </div>
                </div>
              </div>
              {/* Purchase Order Services */}
              <div className={classes.purchaseOrderService}>
                <div className={classes.purchaseOrderSectionTitle}>
                  Purchase Order Lines
                </div>
                {this._renderServices()}
              </div>
            </div>
          </div>
          {this._renderCancelButton()}
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withI18n(),
  // withPurchaseOrders(),
  // withCreatePurchaseOrder(),
  // withUpdatePurchaseOrder(),
  // withCreatePurchaseOrderLine(),
  // withUpdatePurchaseOrderLine(),
  connect((state: { profile: object }) => ({
    profile: state.profile,
  })),
  withStyles(composeStyles(styles, reviewStyles)),
)(PreviewPurchaseOrder);
