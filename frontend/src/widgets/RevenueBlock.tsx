import * as React from 'react';
import cx from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import range from 'lodash/range';
import reverse from 'lodash/reverse';
import pluralize from 'pluralize';
import { Trans, withI18n } from '@lingui/react';
import { ResponsiveBar } from '@nivo/bar';
import numeral from 'numeral';
import moment from 'moment';
import { compose } from 'recompose';
import {
  withStyles,
  composeStyles,
  ErrorBoundary,
  withStylesProps,
  Loading,
} from '@kudoo/components';
import { withInvoices } from '@kudoo/graphql';
import styles, { RevenueStyles } from './styles';

type Props = {
  invoiceTotal: number;
  chartData: object;
  contentHash: string;
  refetch: Function;
  i18n: any;
  loading: boolean;
  classes: any;
  theme: any;
};

type State = {};

class RevenueBlock extends React.Component<Props, State> {
  static defauptProps = {
    chartData: {},
  };

  componentDidUpdate(prevProps) {
    if (
      !isEqual(get(this.props, 'contentHash'), get(prevProps, 'contentHash'))
    ) {
      if (this.props.refetch) {
        this.props.refetch();
      }
    }
  }

  render() {
    const {
      classes,
      theme,
      invoiceTotal,
      chartData,
      i18n,
      loading,
    } = this.props;

    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Revenue By Year</span>
            {loading && (
              <span>
                <Loading size={20} color='white' />
              </span>
            )}
          </div>
          <div className={cx(classes.blockContent, classes.revenueStatsBlock)}>
            <div className={classes.revenueStatsWrapper}>
              <div className={classes.revenueStatsItem}>
                <div className={classes.revenueTotalLabel}>Total</div>
                <div className={classes.revenueTotalValue}>
                  <Trans id='currency-symbol' />
                  {numeral(invoiceTotal).format('0,00')}
                </div>
              </div>
            </div>
            <div className={classes.revenueChart}>
              <ResponsiveBar
                data={reverse(Object.values(chartData))}
                groupMode='grouped'
                keys={['total']}
                indexBy='key'
                enableLabel={false}
                margin={{
                  top: 10,
                  right: 0,
                  bottom: 10,
                  left: 50,
                }}
                axisLeft={{
                  format: value =>
                    i18n._('currency-symbol') +
                    `${numeral(value).format('(0,00a)')}`,
                }}
                axisBottom={{
                  format: value => ``,
                }}
                padding={0.3}
                colors={[theme.palette.primary.color1]}
                tooltip={(e): any => {
                  return (
                    <div className={classes.chartTooltip}>
                      <div className={classes.chartTooltipText}>
                        {e.data.month} {e.data.year}
                      </div>
                      <div className={classes.chartTooltipText}>
                        {e.data.count}{' '}
                        {pluralize('invoice', e.data.count as number)}
                      </div>
                      <div className={classes.chartTooltipText}>
                        Total: {numeral(e.data.total).format('$0,00')}
                      </div>
                    </div>
                  );
                }}
                animate={true}
                theme={{
                  tooltip: {
                    container: {
                      fontSize: '13px',
                      background: '#333944',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(composeStyles(styles, RevenueStyles)),
  withInvoices(
    () => ({
      variables: {
        where: {
          invoiceDate_gt: moment()
            .subtract(12, 'months')
            .startOf('month')
            .format('YYYY-MM-DD'),
        },
      },
    }),
    ({ data }) => {
      const chartData = {};
      range(0, 13).map(index => {
        const newMonth = moment().subtract(index, 'months');
        const formattedMonth = newMonth.format('MMM');
        const formattedYear = newMonth.format('YYYY');
        const key = `${formattedMonth}-${formattedYear}`;
        chartData[key] = {
          month: formattedMonth,
          year: formattedYear,
          key,
          total: 0,
          count: 0,
        };
      });
      const invoices = get(data, 'invoices.edges', []);
      let invoiceTotal = 0;
      invoices.map(({ node }) => {
        invoiceTotal += Number(node.total);
        const formattedMonth = moment(node.invoiceDate).format('MMM');
        const formattedYear = moment(node.invoiceDate).format('YYYY');
        const key = `${formattedMonth}-${formattedYear}`;
        const chartItem = chartData[key] || {
          month: formattedMonth,
          year: formattedYear,
          key,
          total: 0,
          count: 0,
        };

        chartData[key] = {
          ...chartItem,
          total: chartItem.total + Number(node.total),
          count: chartItem.count + 1,
        };
      });

      return {
        chartData,
        invoiceTotal,
        refetch: data.refetch,
        loading: data.loading,
      };
    }
  )
)(RevenueBlock as any);
