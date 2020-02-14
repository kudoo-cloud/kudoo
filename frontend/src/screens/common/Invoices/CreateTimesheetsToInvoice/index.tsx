import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import queryString from 'query-string';
import {
  withStyles,
  Button,
  ErrorBoundary,
  WizardSteps,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { resetInvoiceData } from '@client/store/actions/createNewInvoice';
import DetailStep from '../CreateInvoice/DetailStep';
import ReviewStep from '../CreateInvoice/ReviewStep';
import CustomerStep from './CustomerStep';
import TimesheetsStep from './TimesheetsStep';
import styles from './styles';

type Props = {
  resetInvoiceData: Function;
  actions: any;
  location: any;
  history: any;
  theme: any;
  classes: any;
};

type State = {
  steps: any;
};

class CreateTimesheetsToInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const parsed: any = queryString.parse(props.location.search);
    let index = 0;
    if (parsed.step) {
      index = parsed.step - 1;
    }
    this.state = {
      steps: [
        {
          label: 'Customer',
          active: index === 0,
          component: (
            <CustomerStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
        {
          label: 'Timesheets',
          active: index === 1,
          component: (
            <TimesheetsStep
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
        {
          label: 'Details',
          active: index === 2,
          component: (
            <DetailStep
              {...this.props}
              createType='timesheet'
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
        {
          label: 'Review',
          active: index === 3,
          component: (
            <ReviewStep
              {...this.props}
              createType='timesheet'
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      const parsed: any = queryString.parse(this.props.location.search);
      if (parsed.step) {
        this._updateSteps(parsed.step - 1);
      } else {
        this._updateSteps(1);
      }
    }
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Invoices');
  }

  _updateSteps = (index: number) => {
    const steps = this.state.steps;
    const pos: number = findIndex(steps, { active: true });
    if (pos > -1) {
      steps[pos] = {
        ...steps[pos],
        active: false,
      };
      steps[index] = {
        ...steps[index],
        active: true,
      };
      this.setState({
        steps,
      });
    }
  };

  _makeStepActive = (index: number) => {
    this.props.history.push(
      URL.CREATE_TIMESHEETS_TO_INVOICES() + `?step=${index + 1}`
    );
  };

  _markedVisited = (index: number) => {
    const steps = this.state.steps;
    steps[index] = {
      ...steps[index],
      visited: true,
    };
    this.setState({
      steps,
    });
  };

  _unmarkedVisited = (index: number) => {
    const steps = this.state.steps;
    steps[index] = {
      ...steps[index],
      visited: false,
    };
    this.setState({
      steps,
    });
  };

  _onStepClick = (step, index: number) => {
    this._makeStepActive(index);
  };

  _cancelInvoice = () => {
    const { theme } = this.props;
    const title = 'Cancel Invoice?';
    const description = (
      <div>
        <div>Are you sure you want to cancel this invoice ?</div>
        <br />
        <div>All your unsaved invoice data will be lost. </div>
      </div>
    );
    const buttons = [
      {
        title: 'Close',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.history.push(URL.INVOICES());
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany
          onChange={() => {
            this.props.resetInvoiceData('timesheet');
            this.props.history.push(URL.CREATE_INVOICES());
          }}>
          <div className={classes.page}>
            <div className={classes.allSteps}>
              <WizardSteps
                steps={this.state.steps}
                onStepClick={this._onStepClick}
              />
            </div>
            <div className={classes.draftButtonWrapper}>
              <Button
                title='Cancel'
                classes={{ text: classes.cancelButtonText }}
                buttonColor='#EAEAEA'
                onClick={this._cancelInvoice}
              />
              <Button title='Save as draft' buttonColor='#29A9DB' />
            </div>
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect(() => ({}), { resetInvoiceData })
)(CreateTimesheetsToInvoice);
