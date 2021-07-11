import {
  Button,
  DatePicker,
  ErrorBoundary,
  SectionHeader,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import { isEqual } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import styles, {
  createPurchaseOrderStyles,
} from 'src/screens/inventory/PurchaseOrder/PurchaseOrder/styles';
import { ICreatePBSPOProps, ICreatePBSPOState } from '../PBSPOtypes';

class CreatePBSPurchaseOrder extends React.Component<
  ICreatePBSPOProps,
  ICreatePBSPOState
> {
  public static defaultProps = {
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
      pbsOrganisation: '',
    },
  };

  public state = {
    isEditMode: false,
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('PBS Purchase Order');

    this.setState({
      isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
    });
  }

  public componentDidUpdate(prevProps) {
    const {
      initialData,
      purchaseOrderData: { defaultData },
    } = this.props;
    const { isEditMode } = this.state;

    if (isEditMode && !isEqual(initialData.id, prevProps.initialData.id)) {
      const data = {
        id: defaultData.id
          ? idx(defaultData, (_) => _.id)
          : idx(initialData, (_) => _.id) || '',
        date: defaultData.id
          ? idx(defaultData, (_) => _.date)
          : idx(initialData, (_) => _.date) || '',
        pbsOrganisation: defaultData.id
          ? idx(defaultData, (_) => _.pbsOrganisation)
          : idx(initialData, (_) => _.pbsOrganisation) || '',
      };

      this.props.setPurchaseOrderData({
        defaultData: data,
        isEditMode: Boolean(initialData),
      });
      this.setState({
        isEditMode: Boolean(initialData),
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
        pbsOrganisation: initialData && initialData.pbsOrganisation,
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
  }) => {
    return (
      <ErrorBoundary>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <DatePicker
              label='Purchase Order Date'
              onDateChange={(date) => setFieldValue('date', date)}
              value={values.date}
              error={touched.date && errors.date}
            />
          </Grid>
        </Grid>
      </ErrorBoundary>
    );
  };

  public _renderSectionHeader = (values, isSubmitting, submitForm) => {
    const { classes } = this.props;
    const { isEditMode } = this.state;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} PBS Purchase Order`}
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
          this.props.history.replace(URL.PBS_PURCHASE_ORDER());
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
          date: idx(defaultData, (_) => _.date) || new Date(),
        }}
        validationSchema={Yup.object().shape({
          date: Yup.date().required('Purchase Order Date is required'),
        })}
        enableReinitialize
        onSubmit={this._submitForm}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          submitForm,
        }) => {
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              {this._renderSectionHeader(values, isSubmitting, submitForm)}
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderFormComponent({
                    values,
                    errors,
                    touched,
                    setFieldValue,
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
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.PURCHASE_ORDER());
          }}
        >
          {this._renderForm()}
        </SelectedDAO>
      </React.Fragment>
    );
  }
}

export default compose<any, any>(
  withStyles(composeStyles(styles, createPurchaseOrderStyles)),
  // withPurchaseOrder(
  //   (props) => {
  //     const purchaseOrderId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: purchaseOrderId,
  //     };
  //   },
  //   ({ data }) => ({ initialData: idx(data, (_) => _.purchaseOrder) || {} }),
  // ),
  connect((state: { profile: any }) => ({
    profile: state.profile,
  })),
)(CreatePBSPurchaseOrder);
