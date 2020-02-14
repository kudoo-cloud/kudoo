import * as React from 'react';
import { compose } from 'recompose';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles, composeStyles, ErrorBoundary } from '@kudoo/components';
import { withInventory } from '@kudoo/graphql';
import styles, { PurchaseOrderStyles } from './styles';

interface IProps {
  classes: any;
  purchaseOrder: {
    total: number;
    count: number;
    refetch: () => any;
    loading: boolean;
  };
  outstandingPurchaseOrder: {
    total: number;
    count: number;
    refetch: () => any;
    loading: boolean;
  };
  purchaseOrderdPurchaseOrder: {
    total: number;
    count: number;
    refetch: () => any;
    loading: boolean;
  };
  contentHash: string;
}

class PurchaseOrder extends React.Component<IProps, any> {
  public componentDidUpdate(prevProps) {
    // refetch code
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Purchase Order</span>
          </div>
          <div className={cx(classes.blockContent, classes.purchaseOrderBlock)}>
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <div className={cx(classes.purchaseOrderBlockItem, 'green')}>
                  <div className={classes.purchaseOrderAmount}>15</div>
                  <div className={classes.purchaseOrderTitle}>
                    Total purchase order
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx(classes.purchaseOrderBlockItem, 'orange')}>
                  <div className={classes.purchaseOrderAmount}>10</div>
                  <div className={classes.purchaseOrderTitle}>
                    Total outstanding purchase order
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx(classes.purchaseOrderBlockItem, 'green')}>
                  <div className={classes.purchaseOrderAmount}>20</div>
                  <div className={classes.purchaseOrderTitle}>
                    Total Invoiced purchase order
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(composeStyles(styles, PurchaseOrderStyles))
)(PurchaseOrder);
