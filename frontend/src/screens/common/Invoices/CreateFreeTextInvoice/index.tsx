import {
  Button,
  ErrorBoundary,
  WizardSteps,
  withStyles,
} from '@kudoo/components';
import findIndex from 'lodash/findIndex';

import queryString from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SelectedCompany from 'src/helpers/SelectedCompany';
import URL from 'src/helpers/urls';
import { resetInvoiceData } from 'src/store/actions/createNewInvoice';
import DetailStep from '../CreateInvoice/DetailStep';
import ReviewStep from '../CreateInvoice/ReviewStep';
import CustomerStep from './CustomerStep';
import ServiceStep from './ServiceStep';
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

class CreateFreeTextInvoice extends Component<Props, State> {
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
          label: 'Customers',
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
          label: 'Services',
          active: index === 1,
          component: (
            <ServiceStep
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
              createType='text'
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
              {...props}
              createType='text'
              actions={this.props.actions}
              makeStepActive={this._makeStepActive}
              markedVisited={this._markedVisited}
              unmarkedVisited={this._unmarkedVisited}
            />
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Invoices');
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
    this.props.history.push(URL.CREATE_TEXT_INVOICES() + `?step=${index + 1}`);
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
            this.props.resetInvoiceData('text');
            this.props.history.push(URL.CREATE_INVOICES());
          }}
        >
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
            </div>
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect(() => ({}), { resetInvoiceData }),
)(CreateFreeTextInvoice);
