import {
  Button,
  Checkbox,
  ErrorBoundary,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { filter, find, findIndex, get, includes, uniqBy } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { generatePDF } from 'src/helpers/jsPDF';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles, {
  createPurchaseOrderStyles,
  reviewStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import { POSTATUS } from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/types';
import { IPOResponse, IPreviewPOProps, IPreviewPOState } from '../PBSPOtypes';
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
    expanded: '',
    confirmPO: [],
    previewPDF: [{ key: '', value: {} }],
    showError: false,
  };

  public componentDidMount() {
    const {
      purchaseOrderData: { defaultData },
    } = this.props;
    if (defaultData.pbsOrganisation) {
      this._handleCheckBox(JSON.parse(defaultData.pbsOrganisation).value);
    }
  }

  public handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  public _generatePDF = async () => {
    return await generatePDF('pdf-content');
  };

  public _submitForm = async () => {
    this.setState({ submitting: true });
    const {
      purchaseOrderData: { defaultData, isEditMode = false, actions },
      purchaseOrderLineData,
    } = this.props;
    const { confirmPO } = this.state;

    const purchaseOrderLineFilterData = filter(
      purchaseOrderLineData,
      (filterData) => filterData.qty >= 0 && filterData.pbsDrug,
    );

    let poLineFlag = 0;
    if (!isEditMode) {
      purchaseOrderLineFilterData.forEach((_: any) => {
        if (!includes(confirmPO, _.pbsOrganisation.value)) {
          const poIndex = findIndex(
            purchaseOrderLineData,
            (pol) => pol.pbsOrganisation.value === _.pbsOrganisation.value,
          );
          purchaseOrderLineFilterData.splice(poIndex, 1);
        }
      });

      uniqBy(
        purchaseOrderLineFilterData,
        (_: any) => _.pbsOrganisation.value,
      ).forEach(async (_) => {
        if (!_.id) {
          const res = (await this._createUpdatePurchaseOrder(
            _.pbsOrganisation,
          )) as IPOResponse;
          if (res.success) {
            filter(
              purchaseOrderLineFilterData,
              (pol: any) =>
                pol.pbsOrganisation.value === _.pbsOrganisation.value,
            ).forEach(async (poLine: any) => {
              const purchaseOrderLineResponse =
                (await this._createUpdatePurchaseOrderLine(
                  poLine,
                  res,
                )) as IPOResponse;
              if (purchaseOrderLineResponse.error) {
                if (poLineFlag === 0) {
                  poLineFlag = 1;
                  showToast(purchaseOrderLineResponse.error as any);
                  actions.setSubmitting(false);
                }
              }
            });
            if (poLineFlag === 0) {
              this.setState({ submitting: false });
              showToast(null, 'Purchase Order created successfully');
              actions.setSubmitting(false);
              this.props.history.push(URL.PBS_PURCHASE_ORDER());
            }
          } else {
            showToast(res.error as any);
            actions.setSubmitting(false);
          }
        }
      });
    } else {
      const res = (await this._createUpdatePurchaseOrder(
        JSON.parse(defaultData.pbsOrganisation),
      )) as IPOResponse;
      if (res.success) {
        purchaseOrderLineFilterData.forEach(async (_) => {
          const polResponse = await this._createUpdatePurchaseOrderLine(_, res);
          if (polResponse.error) {
            if (poLineFlag === 0) {
              poLineFlag = 1;
              showToast(polResponse.error);
              actions.setSubmitting(false);
            }
          }
        });
        if (poLineFlag === 0) {
          this.setState({ submitting: false });
          showToast(null, 'Purchase Order updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.PBS_PURCHASE_ORDER());
        }
      } else {
        showToast(res.error as any);
        actions.setSubmitting(false);
      }
    }
  };

  public _createUpdatePurchaseOrder = async (pbsOrganisation) => {
    const {
      purchaseOrderData: { defaultData, isEditMode = false },
      profile: { id = '' } = {},
    } = this.props;
    const { previewPDF } = this.state;
    const dataToSend = {
      date: defaultData.date,
      orderer: {
        connect: {
          id,
        },
      },
      status: POSTATUS.OPEN,
      isPbsPO: true,
      pbsOrganisation: `{\"key\": \"${pbsOrganisation.key}\", \"value\": \"${pbsOrganisation.value}\"}`,
      preview: find(previewPDF, (_) => _.key === pbsOrganisation.value).value,
    };
    if (!isEditMode) {
      const createPO = this.props
        .createPurchaseOrder({ data: { ...dataToSend } })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return { error: err };
        });
      return createPO;
    } else {
      const updatePO = this.props
        .updatePurchaseOrder({
          data: dataToSend,
          where: { id: defaultData.id },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return { error: err };
        });
      return updatePO;
    }
  };

  public _createUpdatePurchaseOrderLine = async (poLine, res) => {
    const {
      purchaseOrderData: { isEditMode = false },
    } = this.props;
    const purchaseOrderLineDataToSend = {
      pbsDrug: `{\"key\": \"${poLine.pbsDrug.key}\", \"value\": \"${poLine.pbsDrug.value}\"}`,
      qty: poLine.qty,
      site: {
        connect: {
          id: poLine.site.value,
        },
      },
    };
    if (!isEditMode || (isEditMode && !poLine.id)) {
      const createPOL = this.props
        .createPurchaseOrderLine({
          data: {
            ...purchaseOrderLineDataToSend,
            purchaseOrder: {
              connect: {
                id: res.result.id,
              },
            },
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return { error: err };
        });
      return createPOL;
    } else {
      const updatePol = this.props
        .updatePurchaseOrderLine({
          data: {
            ...purchaseOrderLineDataToSend,
            purchaseOrder: {
              connect: {
                id: poLine.purchaseOrder,
              },
            },
          },
          where: { id: poLine.id },
        })
        .then((polResponse) => {
          return polResponse;
        })
        .catch((err) => {
          return { error: err };
        });
      return updatePol;
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
          this.props.history.replace(URL.PBS_PURCHASE_ORDER());
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
    const { showError, submitting, confirmPO } = this.state;
    return (
      <SectionHeader
        title={'Confirm your purchase order'}
        subtitle={`Confirm your ${
          isEditMode ? 'updated' : 'newly created'
        } purchase order below.`}
        classes={{ component: classes.sectionHeading }}
        renderLeftPart={() => (
          <div>
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
                onClick={
                  confirmPO.length
                    ? this._submitForm
                    : () => {
                        this.setState({ showError: true });
                      }
                }
              />
            </div>
            {showError && (
              <div className={classes.errorLabel}>
                Please confirm your order.
              </div>
            )}
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

  private _renderServices(pbsOrg) {
    const { classes, purchaseOrderLineData } = this.props;
    const headerData = [
      {
        id: 'pbsDrug',
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
    ];
    const purchaseOrderLineFilterData = filter(
      purchaseOrderLineData,
      (filterData) => filterData.qty >= 0 && filterData.pbsDrug,
    );
    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={headerData}
          data={filter(
            purchaseOrderLineFilterData,
            (_: any) => pbsOrg.value === _.pbsOrganisation.value,
          )}
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
    if (column.id === 'pbsDrug') {
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
    return ele;
  };

  public _handleCheckBox = async (pbsOrg) => {
    const { confirmPO, previewPDF }: any = this.state;
    const {
      purchaseOrderData: { isEditMode },
    } = this.props;
    const pdfBlob = await this._generatePDF();
    const pdfFile = new File([pdfBlob], 'purchaseOrder.pdf');
    previewPDF.push({ key: pbsOrg, value: pdfFile });
    if (!isEditMode) {
      const poIndex = findIndex(confirmPO, (_) => _ === pbsOrg);
      if (poIndex <= -1) {
        confirmPO.push(pbsOrg);
      } else {
        confirmPO.splice(poIndex, 1);
      }
    }
    this.setState({ confirmPO, previewPDF });
  };

  public render() {
    const {
      classes,
      profile,
      purchaseOrderData: { defaultData, isEditMode },
      purchaseOrderLineData,
    } = this.props;
    const { expanded, confirmPO } = this.state;
    const daoName = get(profile, 'selectedDAO.name');
    const logo = get(profile, 'selectedDAO.logo.url', '');
    const purchaseOrderLineFilterData = filter(
      purchaseOrderLineData,
      (filterData) => filterData.qty >= 0 && filterData.pbsDrug.key,
    );
    const uniqPO = uniqBy(purchaseOrderLineFilterData, 'pbsOrganisation.value');
    return (
      <ErrorBoundary>
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.PURCHASE_ORDER());
          }}
        >
          <div className={classes.pbsPage}>
            {this._renderSectionHeading()}

            <div className={classes.content}>
              {uniqPO.map((_: any, index) => (
                <ExpansionPanel
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={this.handleChange(`panel${index}`)}
                >
                  <ExpansionPanelSummary
                    className={classes.customExpansion}
                    expandIcon={
                      <ExpandMoreIcon className={classes.customExpansion} />
                    }
                  >
                    <div className={classes.expHeader}>
                      {_.pbsOrganisation.key}
                    </div>
                    <div className={classes.expSecondHeader}>
                      Click Here to expansion your order
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.detailBox}>
                    {!isEditMode && (
                      <div>
                        <Checkbox
                          value={includes(confirmPO, _.pbsOrganisation.value)}
                          label={'Confirm Your Order'}
                          onChange={() =>
                            this._handleCheckBox(_.pbsOrganisation.value)
                          }
                        />
                      </div>
                    )}
                    <div className={classes.pbsContent} id='pdf-content'>
                      <div className={classes.purchaseOrderHeader}>
                        <Grid container>
                          <Grid item xs={12} sm={12}>
                            {this._renderLogo()}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            classes={{
                              item: classes.purchaseOrderTitleRightPart,
                            }}
                          >
                            {logo && (
                              <div className={classes.purchaseOrderName}>
                                {daoName}
                              </div>
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
                          <div className={classes.purchaseOrderDateLabel}>
                            PBS Organisation
                          </div>
                          <div
                            className={classes.purchaseOrderDateValue}
                            data-test='due-date'
                          >
                            {_.pbsOrganisation.key}
                          </div>
                        </div>
                      </div>
                      {/* Purchase Order Services */}
                      <div className={classes.purchaseOrderService}>
                        <div className={classes.purchaseOrderSectionTitle}>
                          Purchase Order Lines
                        </div>
                        {this._renderServices(_.pbsOrganisation)}
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
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
  withStyles(composeStyles(styles, reviewStyles, createPurchaseOrderStyles)),
)(PreviewPurchaseOrder);
