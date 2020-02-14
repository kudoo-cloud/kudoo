import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles, ErrorBoundary, withStylesProps } from '@kudoo/components';
import PurchaseOrder from './PurchaseOrder';

import styles from './styles';

interface IProps {
  type: 'purchase-order';
  data: any;
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  contentHash: any;
  classes: any;
}

class Widget extends React.Component<IProps> {
  public static defaultProps = {
    xs: 12,
  };

  public getComponent() {
    const { type } = this.props;
    if (type === 'purchase-order') {
      return PurchaseOrder;
    }
    return null;
  }

  public render() {
    const WidgetComponent: any = this.getComponent();
    const { xs, sm, md, lg, xl, classes, contentHash } = this.props;
    return (
      <ErrorBoundary>
        <Grid
          item
          xs={xs}
          sm={sm}
          md={md}
          lg={lg}
          xl={xl}
          classes={{ item: classes.widgetItem }}>
          <WidgetComponent contentHash={contentHash} />
        </Grid>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(Widget);
