import { WizardSteps, withStyles } from '@kudoo/components';
import { filter, get } from 'lodash';
import findIndex from 'lodash/findIndex';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import CreateSalesOrder from './CreateSalesOrder';
import CreateSalesOrderLine from './CreateSalesOrderLine';
import styles from './styles';

interface IProps {
  classes: any;
  createSalesOrder: (data: any) => any;
  updateSalesOrder: (data: any) => any;
  createSalesOrderLine: (data: any) => any;
  updateSalesOrderLine: (data: any) => any;
  history: any;
  profile: any;
}

interface IState {
  wizardStep: any;
  salesOrderData: any;
  salesOrderLineData: any;
  activePage: number;
  visitedPages: any;
}

class SalesOrderWizard extends React.Component<IProps, IState> {
  static defaultProps = {
    createSalesOrder: () => ({}),
    updateSalesOrder: () => ({}),
    createSalesOrderLine: () => ({}),
    updateSalesOrderLine: () => ({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      salesOrderData: {},
      wizardStep: this.renderWizardStep(),
      activePage: 0,
      visitedPages: [],
      salesOrderLineData: [
        {
          id: '',
          inventory: '',
          qty: 0,
          tempId: uuid(),
        },
      ],
    };
    this.renderWizardStep = this.renderWizardStep.bind(this);
  }

  public _setSalesOrderData = (data) => {
    this.setState({
      salesOrderData: data,
    });
    return true;
  };

  public _setSalesOrderLineData = (data) => {
    this.setState({
      salesOrderLineData: [...data],
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
      salesOrderData = {},
      activePage = 0,
      salesOrderLineData = {},
      visitedPages = [],
    } = this.state || {};
    const wizardStep = [
      {
        label: 'Sales Order',
        active: activePage === 0,
        visited: visitedPages.includes(0) && activePage !== 0,
        component: (
          <CreateSalesOrder
            {...this.props}
            classes={classes}
            makeStepActive={this._makeStepActive}
            markedVisited={this._markedVisited}
            setSalesOrderData={this._setSalesOrderData}
            salesOrderData={salesOrderData}
          />
        ),
      },
      {
        label: 'Sales OrderLine',
        active: activePage === 1,
        visited: visitedPages.includes(1) && activePage !== 1,
        component: (
          <CreateSalesOrderLine
            {...this.props}
            classes={classes}
            makeStepActive={this._makeStepActive}
            markedVisited={this._markedVisited}
            unmarkedVisited={this._unmarkedVisited}
            setSalesOrderLineData={this._setSalesOrderLineData}
            salesOrderData={salesOrderData}
            salesOrderLineData={salesOrderLineData}
            submitForm={this._submitForm}
          />
        ),
      },
    ];
    return wizardStep;
  };

  public _submitForm = async () => {
    const {
      salesOrderData: { data = {}, isEditMode = false, actions },
      salesOrderLineData = {},
    } = this.state;
    const { profile: { selectedDAO: { currency = 'USD' } = {} } = {} } =
      this.props;
    const dataToSend = {
      transactionDate: data.transactionDate,
      customer: {
        connect: {
          id: data.customer,
        },
      },
      currency,
    };
    const salesOrderLineFilterData = filter(
      salesOrderLineData,
      (filterData) => filterData.qty >= 0 && filterData.inventory,
    );
    let flag = 0;

    if (!isEditMode) {
      const res = await this.props.createSalesOrder({ data: dataToSend });
      if (res.success) {
        salesOrderLineFilterData.forEach(async (_) => {
          const salesOrderLineDataToSend = {
            salesOrder: {
              connect: {
                id: res.result.id,
              },
            },
            inventory: {
              connect: {
                id: _.inventory,
              },
            },
            qty: _.qty,
          };
          const salesOrderLineResponse = await this.props.createSalesOrderLine({
            data: salesOrderLineDataToSend,
          });
          if (!salesOrderLineResponse.success && flag === 0) {
            flag = 1;
            res.error.map((err) => showToast(err));
            actions.setSubmitting(false);
          }
        });
        if (flag === 0) {
          showToast(null, 'SalesOrder created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.SALES_ORDER());
        }
      } else {
        res.error.map((err) => showToast(err));
        actions.setSubmitting(false);
      }
    } else {
      const res = await this.props.updateSalesOrder({
        data: dataToSend,
        where: { id: data.id },
      });
      if (res.success) {
        let salesOrderLineResponse = null;
        salesOrderLineFilterData.forEach(async (_) => {
          let salesOrderLineDataToSend = {};
          if (_.id) {
            salesOrderLineDataToSend = {
              salesOrder: {
                connect: {
                  id: res.result.id,
                },
              },
              inventory: {
                connect: {
                  id: _.inventory,
                },
              },
              qty: _.qty,
            };
            salesOrderLineResponse = await this.props.updateSalesOrderLine({
              data: salesOrderLineDataToSend,
              where: { id: _.id },
            });
          } else {
            salesOrderLineDataToSend = {
              salesOrder: {
                connect: {
                  id: res.result.id,
                },
              },
              inventory: {
                connect: {
                  id: _.inventory,
                },
              },
              qty: _.qty,
            };
            salesOrderLineResponse = await this.props.createSalesOrderLine({
              data: salesOrderLineDataToSend,
            });
          }
          if (!get(salesOrderLineResponse, 'success') && flag === 0) {
            flag = 1;
            res.error.map((err) => showToast(err));
            actions.setSubmitting(false);
          }
        });
        if (flag === 0) {
          showToast(null, 'SalesOrder updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.SALES_ORDER());
        }
      } else {
        res.error.map((err) => showToast(err));
        actions.setSubmitting(false);
      }
    }
  };

  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.salesOrderWizardPage}>
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
  // withCreateSalesOrder(),
  // withUpdateSalesOrder(),
  // withCreateSalesOrderLine(),
  // withUpdateSalesOrderLine(),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(SalesOrderWizard);
