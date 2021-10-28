import {
  ErrorBoundary,
  SectionHeader,
  Tooltip,
  withStyles,
} from '@kudoo/components';
import cx from 'classnames';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import URL from 'src/helpers/urls';
import styles from './styles';

type Props = {
  actions: any;
  classes: any;
};

type State = {
  activeToolTip: number | null;
};

class CreateInvoice extends Component<Props, State> {
  state = {
    activeToolTip: null,
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Invoices');
  }

  _renderTooltipIcon = (index, title) => {
    const { classes } = this.props;
    return (
      <Tooltip title={title} position='bottom'>
        {({ isVisible }) => (
          <i
            className={cx(classes.questionIcon, {
              'ion-ios-help-outline': !isVisible,
              'ion-help-circled': isVisible,
            })}
          />
        )}
      </Tooltip>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <SectionHeader
            title='Create a new invoice'
            subtitle='lets begin by selecting an option below. If you are unsure select the question mark provided.'
          />
          <div className={classes.createInvoiceBox}>
            <div className={classes.createInvoiceTitle}>
              How do you want to create this invoice?
            </div>
            <div className={classes.ways}>
              <div
                className={classes.invoiceWayWrapper}
                data-test='free-text-invoice'
              >
                <Link
                  className={classes.invoiceWay}
                  to={URL.CREATE_TEXT_INVOICES()}
                >
                  <i className={cx('icon icon-invoicing', classes.wayIcon)} />
                  <div className={classes.wayTitle}>
                    Free text <br /> invoice
                  </div>
                </Link>
                {this._renderTooltipIcon(
                  0,
                  'A free text invoice is an invoice which has no predefined information.This type of invoice allows you to create an invoice from scratch or using templates provided.',
                )}
              </div>
              <div
                className={classes.invoiceWayWrapper}
                data-test='project-invoice'
              >
                <Link
                  className={classes.invoiceWay}
                  to={URL.CREATE_PROJECT_TO_INVOICES()}
                >
                  <i className={cx('icon icon-invoicing', classes.wayIcon)} />
                  <div className={classes.wayTitle}>
                    Project <br /> invoice
                  </div>
                </Link>
                {this._renderTooltipIcon(
                  0,
                  'A project invoice is an invoice which can be created using project',
                )}
              </div>
              <div
                className={classes.invoiceWayWrapper}
                data-test='project-invoice'
              >
                <Link
                  className={classes.invoiceWay}
                  to={URL.CREATE_TIMESHEETS_TO_INVOICES()}
                >
                  <i className={cx('icon icon-invoicing', classes.wayIcon)} />
                  <div className={classes.wayTitle}>
                    Convert timesheet to <br /> invoice
                  </div>
                </Link>
                {this._renderTooltipIcon(
                  0,
                  'You can convert timesheet into invoices.',
                )}
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(CreateInvoice);
