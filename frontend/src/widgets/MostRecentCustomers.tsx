import * as React from 'react';
import cx from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  withStyles,
  composeStyles,
  ErrorBoundary,
  Loading,
} from '@kudoo/components';
import { withCustomers } from '@kudoo/graphql';
import styles, { MostRecentBlockStyles } from './styles';

type Props = {
  classes: any;
  customers: any;
};

type State = {};

class MostRecentCustomers extends React.Component<Props, State> {
  state = {};

  componentDidUpdate(prevProps) {
    if (
      !isEqual(get(this.props, 'contentHash'), get(prevProps, 'contentHash'))
    ) {
      if (get(this.props, 'customers.refetch')) {
        this.props.customers.refetch();
      }
    }
  }

  render() {
    const { classes, customers } = this.props;
    const customersList = get(customers, 'data', []);
    return (
      <ErrorBoundary>
        <div className={classes.blockWrapper}>
          <div className={classes.blockTitle}>
            <span>Most recent patients</span>
            {get(customers, 'loading') && (
              <span>
                <Loading size={20} color='white' />
              </span>
            )}
          </div>
          <div className={classes.blockContent}>
            <div className={classes.component}>
              {customersList.length > 0 ? (
                <div className={classes.list}>
                  {customersList.map(customer => (
                    <div className={classes.listItem} key={customer.id}>
                      <div className={classes.listItemPrimary}>
                        {customer.name}
                      </div>
                      <div className={classes.listItemSecondary}>-</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cx(classes.listItem, classes.noRecentItem)}>
                  <div className={classes.listItemPrimary}>
                    No recent patients
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(composeStyles(styles, MostRecentBlockStyles)),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withCustomers(props => ({
    variables: {
      first: 3,
      where: {
        isArchived: false,
      },
    },
  }))
)(MostRecentCustomers);
