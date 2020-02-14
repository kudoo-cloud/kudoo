import React, { Component } from 'react';
import {
  withStyles,
  Tabs,
  Button,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import styles from './styles';

type Props = {
  actions: any;
  classes: any;
  history: any;
  theme: any;
};
type State = {};

class InvoiceSent extends Component<Props, State> {
  state = {};

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Invoices');
  }

  _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'Unpaid',
            onClick: () => {
              this.props.history.push(URL.UNPAID_INVOICES());
            },
          },
          {
            label: 'Paid',
            onClick: () => {
              this.props.history.push(URL.PAID_INVOICES());
            },
          },
          {
            label: 'Archived',
            onClick: () => {
              this.props.history.push(URL.ARCHIVED_INVOICES());
            },
          },
        ]}
        tabTheme='secondary'
      />
    );
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.page}>
        {this._renderSecondaryTabs()}
        <div className={classes.invoiceSentWrapper}>
          <div className={classes.invoiceSentMessageWrapper}>
            <div className={classes.invoiceSentMessage}>
              Your invoice to Juicy Pulp Co. Has been sent!
            </div>
          </div>
        </div>
        <Button
          href={URL.UNPAID_INVOICES()}
          title='Back to invoices list'
          buttonColor={theme.palette.primary.color1}
        />
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceSent);
