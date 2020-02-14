import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Trans } from '@lingui/react';
import numeral from 'numeral';
import moment from 'moment';
import {
  withStyles,
  composeStyles,
  ErrorBoundary,
  withStylesProps,
  Loading,
} from '@kudoo/components';
import { INVOICE_STATUS } from '@client/helpers/constants';
import { withProjects, withInvoices } from '@kudoo/graphql';
import styles, { AverageStatsStyles as ASStyles } from './styles';

type Props = {
  invoices: any;
  projects: any;
  contentHash: string;
  classes: any;
  theme: any;
};

type State = {};

class AverageStats extends React.Component<Props, State> {
  state = {};

  componentDidUpdate(prevProps) {
    if (
      !isEqual(get(this.props, 'contentHash'), get(prevProps, 'contentHash'))
    ) {
      if (get(this.props, 'projects.refetch')) {
        this.props.projects.refetch();
      }
      if (get(this.props, 'invoices.refetch')) {
        this.props.invoices.refetch();
      }
    }
  }

  render() {
    const { classes, theme, invoices = {}, projects = {} } = this.props;
    const firstInvoice = get(invoices, 'data.0', {});
    const monthDifference =
      moment()
        .startOf('month')
        .diff(moment(firstInvoice.invoiceDate).startOf('month'), 'months') + 1;
    const invoiceTotal = get(invoices, 'data', []).reduce(
      (acc, item) => acc + item.total,
      0
    );
    const showLoader = invoices.loading || projects.loading;

    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Avg per month</span>
            {showLoader && (
              <span>
                <Loading size={20} color='white' />
              </span>
            )}
          </div>
          <div className={classes.blockContent}>
            <Grid container spacing={0} style={{ flex: 1 }}>
              <Grid item xs={12} classes={{ item: classes.rowCell }}>
                <div className={classes.avgSalesBlock}>
                  <div className={classes.avgSalesAmount}>
                    <Trans id='currency-symbol' />
                    {numeral(invoiceTotal / monthDifference).format('0,00')}
                  </div>
                  <div className={classes.avgSalesText}>Sales</div>
                </div>
              </Grid>
              <Grid item xs={6} classes={{ item: classes.rowCell }}>
                <div
                  className={classes.avgValBlock}
                  style={{
                    borderRight: `1px solid ${theme.palette.grey['200']}`,
                  }}>
                  <div className={classes.avgValAmount}>{projects.count}</div>
                  <div className={classes.avgValText}>Projects</div>
                </div>
              </Grid>
              <Grid item xs={6} classes={{ item: classes.rowCell }}>
                <div className={classes.avgValBlock}>
                  <div className={classes.avgValAmount}>{invoices.count}</div>
                  <div className={classes.avgValText}>Invoices</div>
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
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(composeStyles(styles, ASStyles)),
  withProjects(() => ({
    variables: {
      where: {
        isArchived: false,
      },
    },
  })),
  withInvoices(() => ({
    variables: {
      where: {
        status_not: INVOICE_STATUS.ARCHIVED,
      },
      orderBy: 'invoiceDate_ASC',
    },
  }))
)(AverageStats);
