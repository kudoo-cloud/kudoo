import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
// import idx from 'idx';
import { get } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import styles, {
  reviewStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import { IPurchaseOrderPreviewProps } from './purchaseOrderTypes';

class PreviewPO extends React.Component<IPurchaseOrderPreviewProps> {
  public static defaultProps = {
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    purchaseOrderLines: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Purchase Order');
  }

  public _renderSectionHeading() {
    const { classes } = this.props;
    return (
      <SectionHeader
        title={'Purchase order'}
        subtitle={'Below is the preview of your Purchase Order.'}
        classes={{ component: classes.sectionHeading }}
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

  public _renderCancelButton = () => {
    const {
      classes,
      theme,
      initialData: { isPbsPO },
    } = this.props;
    return (
      <Button
        title={'Cancel'}
        onClick={() => {
          this.props.history.replace(
            isPbsPO ? URL.PBS_PURCHASE_ORDER() : URL.NON_PBS_PURCHASE_ORDER(),
          );
        }}
        buttonColor={theme.palette.grey['200']}
        classes={{
          text: classes.cancelButtonText,
          component: classes.cancelButtonComponent,
        }}
      />
    );
  };

  private _renderServices() {
    const {
      classes,
      initialData: { isPbsPO },
      purchaseOrderLines: { data = [] },
    } = this.props;
    const pbsHeaderData = [
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
    const headerData = [
      {
        id: !isPbsPO ? 'item' : 'pbsDrug',
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

    return (
      <div>
        <Table
          classes={{ component: classes.serviceTable }}
          columnData={isPbsPO ? headerData : [...headerData, ...pbsHeaderData]}
          data={data}
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
        <div className={classes.borderCell}>{`${row[column.id].name}`}</div>
      );
    }
    if (column.id === 'pbsDrug') {
      return (
        <div className={classes.borderCell}>{`${
          JSON.parse(row[column.id]).key
        }`}</div>
      );
    }
    if (column.id === 'site') {
      return (
        <div className={classes.borderCell}>{`${row[column.id].name}`}</div>
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
      initialData: {
        date = new Date(),
        isPbsPO = false,
        pbsOrganisation = '{}',
        supplier = { name: '' },
      } = {},
    } = this.props;
    const daoName = get(profile, 'selectedDAO.name');
    const logo = get(profile, 'selectedDAO.logo.url', '');
    const { name: supplierName = '' } = supplier || {};
    const name = isPbsPO ? JSON.parse(pbsOrganisation).key : supplierName;
    return (
      <ErrorBoundary>
        <ErrorBoundary>
          <SelectedDAO
            onChange={() => {
              this.props.history.push(URL.PURCHASE_ORDER());
            }}
          >
            <div className={classes.page}>
              {this._renderSectionHeading()}
              <div className={classes.content}>
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
                        <div className={classes.purchaseOrderName}>
                          {daoName}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </div>
                {/*Purchase Order Date Block*/}
                <div className={classes.purchaseOrderDateWrapper}>
                  <div className={classes.purchaseOrderDateBlock}>
                    <div className={classes.purchaseOrderDateLabel}>
                      Purchase Order Date
                    </div>
                    <div className={classes.purchaseOrderDateValue}>
                      {moment(date).format('DD MMM YYYY')}
                    </div>
                  </div>
                  <div
                    className={classes.purchaseOrderDateBlock}
                    style={{ textAlign: 'right' }}
                  >
                    <div className={classes.purchaseOrderDateLabel}>
                      {isPbsPO ? 'PBS Organisation' : 'Supplier'}
                    </div>
                    <div className={classes.purchaseOrderDateValue}>{name}</div>
                  </div>
                </div>
                {/*Purchase Order Services*/}
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
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(composeStyles(styles, reviewStyles)),
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
  // withPurchaseOrder(
  //   (props) => {
  //     const purchaseOrderId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: purchaseOrderId,
  //     };
  //   },
  //   ({ data }) => ({ initialData: idx(data, (_) => _.purchaseOrder) || {} }),
  // ),
  connect((state: { profile: object }) => ({
    profile: state.profile,
  })),
)(PreviewPO);
