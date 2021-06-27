import { WizardSteps, withStyles } from '@kudoo/components';
import { findIndex } from 'lodash';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { IProfile } from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/purchaseOrderTypes';
import styles from '../../PurchaseOrder/styles';
import { POSTATUS } from '../../PurchaseOrder/types';
import CreatePurchaseOrder from './CreatePBSPurchaseOrder';
import CreatePurchaseOrderLine from './CreatePBSPurchaseOrderLine';
import {
  IPBSPurchaseOrderData,
  IPbsPOProps,
  IPbsPOState,
  IPurchaseOrderLineData,
} from './PBSPOtypes';
import PreviewPurchaseOrder from './PreviewPurchaseOrder';

class CreatePbsPo extends React.Component<IPbsPOProps, IPbsPOState> {
  constructor(props) {
    super(props);
    this.state = {
      wizardStep: this.renderWizardStep(),
      activePage: 0,
      visitedPages: [],
      purchaseOrderData: {
        defaultData: {
          id: '',
          date: new Date(),
          pbsOrganisation: '',
          status: POSTATUS.OPEN,
          orderer: props.profile.id,
        },
        actions: {
          setSubmitting: ({}: {}) => {},
        },
        isEditMode: false,
      },
      purchaseOrderLineData: [
        {
          qty: 0,
          id: '',
          pbsDrug: '',
          site: '',
          tempId: uuid(),
        },
      ],
    };
    this.renderWizardStep = this.renderWizardStep.bind(this);
  }

  public _setPurchaseOrderData = (data: IPBSPurchaseOrderData) => {
    this.setState({
      purchaseOrderData: data,
    });
    return true;
  };

  public _setPurchaseOrderLineData = (data: [IPurchaseOrderLineData]) => {
    this.setState({
      purchaseOrderLineData: [...data],
    });
  };

  public _makeStepActive = (index: number) => {
    const { wizardStep } = this.state;
    const pos: number = findIndex(wizardStep, { active: true });
    if (pos > -1) {
      wizardStep[pos] = {
        ...wizardStep[pos],
        active: false,
      };
      wizardStep[index] = {
        ...wizardStep[index],
        active: true,
      };
      this.setState({ wizardStep, activePage: index });
    }
  };

  public _markedVisited = (index: number) => {
    const { wizardStep, visitedPages = [] } = this.state;
    wizardStep[index] = {
      ...wizardStep[index],
      visited: true,
    };
    if (!visitedPages.includes(index)) {
      visitedPages.push(index);
    }
    this.setState({
      wizardStep,
      visitedPages,
    });
  };

  public _unmarkedVisited = (index: number) => {
    const { wizardStep } = this.state;
    wizardStep[index] = {
      ...wizardStep[index],
      visited: false,
    };
    this.setState({
      wizardStep,
    });
  };

  public _onStepClick = (step, index: number) => {
    this._makeStepActive(index);
  };

  public renderWizardStep = () => {
    const { classes } = this.props;
    const {
      activePage = 0,
      visitedPages = [],
      purchaseOrderData = {},
      purchaseOrderLineData = [],
    } = this.state || {};

    const wizardStep = [
      {
        label: 'Purchase Order',
        active: activePage === 0,
        visited: visitedPages.includes(0) && activePage !== 0,
        component: (
          <CreatePurchaseOrder
            {...this.props}
            classes={classes}
            makeStepActive={this._makeStepActive}
            markedVisited={this._markedVisited}
            purchaseOrderData={purchaseOrderData}
            setPurchaseOrderData={this._setPurchaseOrderData}
          />
        ),
      },
      {
        label: 'PO Line',
        active: activePage === 1,
        visited: visitedPages.includes(1) && activePage !== 1,
        component: (
          <CreatePurchaseOrderLine
            {...this.props}
            classes={classes}
            makeStepActive={this._makeStepActive}
            markedVisited={this._markedVisited}
            unmarkedVisited={this._unmarkedVisited}
            purchaseOrderData={purchaseOrderData}
            purchaseOrderLineData={purchaseOrderLineData}
            setPurchaseOrderLineData={this._setPurchaseOrderLineData}
          />
        ),
      },
      {
        label: 'Review Order',
        active: activePage === 2,
        visited: visitedPages.includes(2) && activePage !== 2,
        component: (
          <PreviewPurchaseOrder
            {...this.props}
            makeStepActive={this._makeStepActive}
            markedVisited={this._markedVisited}
            unmarkedVisited={this._unmarkedVisited}
            purchaseOrderData={purchaseOrderData}
            purchaseOrderLineData={purchaseOrderLineData}
          />
        ),
      },
    ];
    return wizardStep;
  };

  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.wizardComponent}>
          <WizardSteps
            steps={this.renderWizardStep()}
            onStepClick={this._onStepClick}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  connect((state: { profile: IProfile }) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreatePbsPo);
