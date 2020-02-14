import * as React from 'react';
import { withStyles, WizardSteps, URL } from '@kudoo/components';
import findIndex from 'lodash/findIndex';
import uuid from 'uuid/v4';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import styles from '../../PurchaseOrder/styles';
import { POSTATUS } from '../../PurchaseOrder/types';
import PreviewPurchaseOrder from './PreviewPurchaseOrder';
import CreatePurchaseOrderLine from './CreatePurchaseOrderLine';
import CreatePurchaseOrder from './CreatePurchaseOrder';
import {
  INONPbsPOProps,
  INONPbsPOState,
  IPurchaseOrderData,
} from './NonPBSPOtypes';

class CreateNonPbsPo extends React.Component<INONPbsPOProps, INONPbsPOState> {
  public isPbsPO = false;

  constructor(props) {
    super(props);
    this.state = {
      wizardStep: this.renderWizardStep(),
      activePage: 0,
      visitedPages: [],
      purchaseOrderData: {
        defaultData: {
          id: '',
          supplier: { key: '', value: '' },
          date: new Date(),
          status: POSTATUS.OPEN,
          orderer: props.profile.id,
          preview: null as any,
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
          item: { key: '', value: '' },
          site: { key: '', value: '' },
          pbsDrug: '',
          unit: 'EA',
          unitPrice: 0,
          tempId: uuid(),
        },
      ],
    };
    this.renderWizardStep = this.renderWizardStep.bind(this);
  }

  public _setPurchaseOrderData = (data: IPurchaseOrderData) => {
    this.setState({
      purchaseOrderData: data,
    });
  };

  public _setPurchaseOrderLineData = (data: object[]) => {
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
            purchaseOrderData={purchaseOrderData}
            makeStepActive={this._makeStepActive}
            markedVisited={this._markedVisited}
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
            isPbsPO={this.isPbsPO}
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
  connect((state: { profile: object }) => ({
    profile: state.profile,
  })),
  withStyles(styles)
)(CreateNonPbsPo);
