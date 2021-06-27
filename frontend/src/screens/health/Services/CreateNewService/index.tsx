import {
  ErrorBoundary,
  FormikCheckbox,
  FormikDropdown,
  FormikTextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import { FormControl, FormGroup, Grid } from '@material-ui/core';
import idx from 'idx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { SERVICE_BILLING_TYPE } from 'src/helpers/constants';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import SimpleCreatePage, {
  SimpleCreatePageRenderPropFormTypes,
} from 'src/screens/common/SimpleCreatePage';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';
import { Props } from './types';

type State = {
  isEditMode: boolean;
};

class CreateNewService extends Component<Props, State> {
  public static defaultProps = {
    createService: () => ({}),
    updateService: () => ({}),
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  state = {
    isEditMode: false,
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Services');
    this.setState({
      isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.initialData, prevProps.initialData)) {
      this.setState({
        isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
      });
    }
  }

  _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;

      const dataToSend = {
        name: values.name,
        billingType: values.billingType,
        includeConsTax: values.chargeGST,
        isTemplate:
          typeof idx(initialData, (_) => _.isTemplate) !== 'undefined'
            ? idx(initialData, (_) => _.isTemplate)
            : true,
        timeBasedType: values.perUnit,
        totalAmount: Number(values.paymentTotal),
      };

      if (!isEditMode) {
        // If user is creating new company
        const res = await this.props.createService({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Service created');
          actions.setSubmitting(false);
          this.props.history.push(URL.SERVICES());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        // If user is updating company
        const res = await this.props.updateService({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Service updated');
          actions.setSubmitting(false);
          this.props.history.push(URL.SERVICES());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      }
    } catch (err) {
      actions.setSubmitting(false);
      throw new Error(err);
    }
  };

  _renderForm(formProps: SimpleCreatePageRenderPropFormTypes) {
    const { classes, profile, i18n } = this.props;
    const showGST = get(profile, 'selectedCompany.salesTax');
    const values = formProps.values;

    return (
      <Grid
        container
        xs={12}
        sm={5}
        classes={{ container: classes.formFields }}
      >
        <Grid item xs={12}>
          <FormControl fullWidth margin='dense'>
            <FormikTextField
              label={'Service name'}
              placeholder={'E.g: Website development'}
              showClearIcon={false}
              name='name'
              id='name'
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <FormikDropdown
              label='Billing Type'
              id='service-type'
              name='billingType'
              placeholder={'Select type'}
              items={[
                { label: 'Fixed', value: SERVICE_BILLING_TYPE.FIXED },
                {
                  label: 'Time Based',
                  value: SERVICE_BILLING_TYPE.TIME_BASED,
                },
              ]}
            />
          </FormControl>
          {values.billingType === SERVICE_BILLING_TYPE.FIXED && (
            <FormGroup row>
              <FormControl>
                <FormikTextField
                  label={'Payment Total'}
                  placeholder={'E.g: 200'}
                  isNumber
                  showClearIcon={false}
                  name='paymentTotal'
                  id='paymentTotal'
                />
              </FormControl>
              {showGST && (
                <FormControl>
                  <FormikCheckbox
                    label={'Charge ' + i18n._(`GST`)}
                    id='charge-gst'
                    name='chargeGST'
                    classes={{ component: classes.gstCheckbox }}
                  />
                </FormControl>
              )}
            </FormGroup>
          )}
          {values.billingType === SERVICE_BILLING_TYPE.TIME_BASED && (
            <>
              <FormGroup row>
                <FormControl>
                  <FormikTextField
                    label={'Payment Amount'}
                    isNumber
                    placeholder={'E.g: 200'}
                    showClearIcon={false}
                    name='paymentTotal'
                    id='paymentTotal'
                  />
                </FormControl>
                {showGST && (
                  <FormControl>
                    <FormikCheckbox
                      label={'Charge ' + i18n._(`GST`)}
                      id='charge-gst'
                      name='chargeGST'
                      classes={{ component: classes.gstCheckbox }}
                    />
                  </FormControl>
                )}
              </FormGroup>
              <FormControl fullWidth margin='dense'>
                <FormikDropdown
                  id='per-unit'
                  label='Per Unit'
                  name='perUnit'
                  placeholder={'Select Unit'}
                  items={[
                    { label: 'Hour', value: 'HOUR' },
                    { label: 'Half Hour', value: 'HALFHOUR' },
                    { label: 'Quater Hour', value: 'QUARTERHOUR' },
                  ]}
                />
              </FormControl>
            </>
          )}
        </Grid>
      </Grid>
    );
  }

  render() {
    const { initialData, history } = this.props;
    const { isEditMode } = this.state;
    return (
      <ErrorBoundary>
        <SimpleCreatePage
          editMode={isEditMode}
          header={{
            createTitle: 'Create new service',
            createSubtitle:
              'Create a new service template. This service will be a quick template to use for defining projects, invoices and timesheets.',
            updateTitle: 'Update Service',
            updateSubtitle: '',
          }}
          initialValues={{
            name: idx(initialData, (_) => _.name) || '',
            billingType: idx(initialData, (_) => _.billingType) || '',
            paymentTotal: String(idx(initialData, (_) => _.totalAmount) || ''),
            chargeGST: idx(initialData, (_) => _.includeConsTax) || false,
            perUnit: idx(initialData, (_) => _.timeBasedType),
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Service Name is required'),
            billingType: Yup.string().required('Billing Type is required'),
            paymentTotal: Yup.string().required('Payment Total is required'),
            perUnit: Yup.mixed().when('billingType', {
              is: SERVICE_BILLING_TYPE.TIME_BASED,
              then: Yup.string().required('Please select unit'),
              otherwise: Yup.mixed(),
            }),
          })}
          onSubmit={this._submitForm}
          onCancel={() => {
            history.push(URL.SERVICES());
          }}
        >
          {(formProps) => this._renderForm(formProps)}
        </SimpleCreatePage>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  // withCreateService(),
  // withUpdateService(),
  // withService(
  //   (props) => {
  //     const serviceId = idx(props, (_) => _.match.params.id);
  //     return { id: serviceId };
  //   },
  //   ({ data }) => ({ initialData: idx(data, (_) => _.service) || {} }),
  // ),
  connect((state: IReduxState) => ({ profile: state.profile })),
  withStyles(styles),
)(CreateNewService);
