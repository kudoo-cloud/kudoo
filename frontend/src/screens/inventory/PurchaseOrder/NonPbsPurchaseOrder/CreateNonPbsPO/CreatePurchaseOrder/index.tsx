import * as React from 'react';
import styles, {
  createPurchaseOrderStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import {
  withRouterProps,
  withStyles,
  withStylesProps,
  DatePicker,
  Dropdown,
  SectionHeader,
  Button,
  ErrorBoundary,
  composeStyles,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { withPurchaseOrder, withSuppliers } from '@kudoo/graphql';
import Grid from '@material-ui/core/Grid';
import idx from 'idx';
import { isEqual } from 'lodash';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ICreatePOProps, ICreatePOState } from '../NonPBSPOtypes';

class CreatePurchaseOrder extends React.Component<
  ICreatePOProps,
  ICreatePOState
> {
  public state = {
    suppliersList: [],
    isEditMode: false,
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Purchase Order');

    this.setState({
      isEditMode: Boolean(idx(this.props, _ => _.initialData)),
    });
  }

  public componentDidUpdate(prevProps) {
    const {
      suppliers,
      initialData,
      purchaseOrderData: { defaultData },
    }: any = this.props;
    const { suppliersList, isEditMode }: any = this.state;

    // ===========Supplier List==============//
    if (
      suppliers.data.length &&
      !isEqual(suppliers.data, prevProps.suppliers.data)
    ) {
      suppliers.data.forEach((rec: { id: string; name: string }) => {
        const value = { key: rec.name, value: rec.id };
        suppliersList.push({ value, label: rec.name });
      });
      this.setState({ suppliersList });
    }

    if (isEditMode && !isEqual(initialData.id, prevProps.initialData.id)) {
      const data = {
        id: idx(initialData, _ => _.id) || '',
        date: defaultData.id
          ? idx(defaultData, _ => _.date)
          : idx(initialData, _ => _.date) || '',
        supplier: defaultData.id
          ? idx(defaultData, _ => _.supplier)
          : {
              key: idx(initialData, _ => _.supplier.name) || '',
              value: idx(initialData, _ => _.supplier.id) || '',
            },
        preview: idx(initialData, _ => _.preview) || '',
      };
      this.props.setPurchaseOrderData({
        defaultData: data,
        isEditMode: Boolean(idx(this.props, _ => _.initialData)),
      });
      this.setState({
        isEditMode: Boolean(idx(this.props, _ => _.initialData)),
      });
    }
  }

  public _submitForm = async (values, actions) => {
    try {
      const { initialData, makeStepActive, markedVisited } = this.props;
      const { isEditMode } = this.state;
      const defaultData = {
        id: initialData && initialData.id,
        date: values.date,
        supplier: values.supplier,
        preview: initialData && initialData.preview,
      };
      this.props.setPurchaseOrderData({ defaultData, isEditMode, actions });
      markedVisited(0);
      makeStepActive(1);
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  public _renderFormComponent = ({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  }) => {
    const { suppliersList } = this.state;
    return (
      <ErrorBoundary>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <DatePicker
              label='Purchase Order Date'
              onDateChange={date => setFieldValue('date', date)}
              value={values.date}
              error={touched.date && errors.date}
            />
          </Grid>
          <Grid item xs={12}>
            <Dropdown
              label='Supplier'
              placeholder={'Select Supplier'}
              name={'supplier'}
              id={'supplier'}
              items={
                suppliersList.length
                  ? suppliersList
                  : [
                      {
                        value: '',
                        label:
                          'No Supplier found. Please create new Supplier first',
                      },
                    ]
              }
              value={values.supplier}
              onChange={e => setFieldValue('supplier', e.value)}
              onClose={() => setFieldTouched('supplier')}
              error={
                touched.supplier &&
                touched.supplier.key &&
                errors.supplier &&
                errors.supplier.key
              }
            />
          </Grid>
        </Grid>
      </ErrorBoundary>
    );
  };

  public _renderSectionHeader = (isSubmitting, submitForm) => {
    const { classes } = this.props;
    const { isEditMode } = this.state;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Purchase Order`}
        // subtitle={`${isEditMode ? 'Update' : 'Create a new'} Purchase Order ${isEditMode ? 'to update information in Purchase Order. ' : 'to add in Purchase Order. '}`}
        classes={{ component: classes.sectionHeading }}
        renderLeftPart={() => (
          <div className={classes.prevNextWrapper}>
            <Button
              loading={isSubmitting}
              title='Next'
              id='next-button'
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              buttonColor={'#29a9db'}
              onClick={submitForm}
            />
          </div>
        )}
      />
    );
  };

  public _renderCancelButton = () => {
    const { classes, theme } = this.props;
    const { isEditMode } = this.state;
    return (
      <Button
        title={isEditMode ? 'Back to Purchase Order list' : 'Cancel'}
        onClick={() => {
          this.props.history.replace(URL.NON_PBS_PURCHASE_ORDER());
        }}
        buttonColor={theme.palette.grey['200']}
        classes={{
          text: classes.cancelButtonText,
          component: classes.cancelButtonComponent,
        }}
      />
    );
  };

  public _renderForm = () => {
    const {
      classes,
      purchaseOrderData: { defaultData },
    } = this.props;

    return (
      <Formik
        initialValues={{
          date: idx(defaultData, _ => _.date) || new Date(),
          supplier: idx(defaultData, _ => _.supplier) || '',
        }}
        validationSchema={Yup.object().shape({
          date: Yup.string().required('Purchase Order Date is required'),
          supplier: Yup.object().shape({
            key: Yup.string().required('Supplier is required'),
          }),
        })}
        enableReinitialize
        onSubmit={this._submitForm}>
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          submitForm,
        }) => {
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              {this._renderSectionHeader(isSubmitting, submitForm)}
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderFormComponent({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                  })}
                </Grid>
              </Grid>
              {this._renderCancelButton()}
            </form>
          );
        }}
      </Formik>
    );
  };

  public render() {
    return (
      <React.Fragment>
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.PURCHASE_ORDER());
          }}>
          {this._renderForm()}
        </SelectedCompany>
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(composeStyles(styles, createPurchaseOrderStyles)),
  withSuppliers(({ type }) => {
    let isArchived = false;
    if (type === 'archived-suppliers') {
      isArchived = true;
    }
    return {
      variables: {
        where: {
          isArchived,
        },
        orderBy: 'name_ASC',
      },
    };
  }),
  withPurchaseOrder(
    props => {
      const purchaseOrderId = idx(props, _ => _.match.params.id);
      return {
        id: purchaseOrderId,
      };
    },
    ({ data }) => ({ initialData: idx(data, _ => _.purchaseOrder) || {} })
  ),
  connect((state: { profile: object }) => ({
    profile: state.profile,
  }))
)(CreatePurchaseOrder);
