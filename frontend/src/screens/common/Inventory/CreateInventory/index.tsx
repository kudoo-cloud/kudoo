import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';
import { INVENTORY_MODEL, UOM } from './types';

interface IProps {
  actions: any;
  profile: any;
  createInventory: (data: any) => any;
  updateInventory: (data: any) => any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateInventory extends Component<IProps, IState> {
  static defaultProps = {
    initialData: {},
    createInventory: () => ({}),
    updateInventory: () => ({}),
  };

  public state = {
    isEditMode: false,
  };

  public _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;

      const dataToSend = {
        name: values.name,
        inventoryModel: values.inventoryModel,
        uom: values.uom,
      };
      if (!isEditMode) {
        const res = await this.props.createInventory({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Inventory created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.INVENTORY());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateInventory({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Inventory updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.INVENTORY());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Inventory');

    this.setState({
      isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
    });
  }

  public componentDidUpdate(prevProps) {
    if (!isEqual(this.props.initialData, prevProps.initialData)) {
      this.setState({
        isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
      });
    }
  }

  public _renderSectionHeading() {
    const { isEditMode } = this.state;
    const { classes } = this.props;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Inventory`}
        // subtitle={`${isEditMode ? 'Update' : 'Create a new'} inventory ${isEditMode ? 'to update information in inventory. ' : 'to add in inventory. '}`}
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  public _renderInventoryForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  }) {
    const keys = {
      name: 'name',
      inventoryModel: 'inventoryModel',
      uom: 'uom',
    };
    const labels = {
      name: 'Inventory Name',
      inventoryModel: 'Inventory Costing Model',
      uom: 'Unit Of Measure',
    };
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label={labels.name}
                placeholder={'Inventory Name'}
                name={keys.name}
                id={keys.name}
                value={values[keys.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[keys.name] && errors[keys.name]}
                showClearIcon={false}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={labels.inventoryModel}
                placeholder={'Select Inventory Model'}
                name={keys.inventoryModel}
                id={keys.inventoryModel}
                items={INVENTORY_MODEL}
                value={values[keys.inventoryModel]}
                onChange={(e) => setFieldValue(keys.inventoryModel, e.value)}
                onClose={() => setFieldTouched(keys.inventoryModel)}
                error={
                  touched[keys.inventoryModel] && errors[keys.inventoryModel]
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={labels.uom}
                placeholder={'Select Unit of measure'}
                name={keys.uom}
                id={keys.uom}
                items={UOM}
                value={values[keys.uom]}
                onChange={(e) => {
                  setFieldValue(keys.uom, e.value);
                }}
                onClose={() => setFieldTouched(keys.uom)}
                error={touched[keys.uom] && errors[keys.uom]}
              />
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }

  public _renderForm() {
    const { initialData, classes, theme } = this.props;
    const { isEditMode } = this.state;
    return (
      <Formik
        initialValues={{
          name: idx(initialData, (_) => _.name) || '',
          inventoryModel: idx(initialData, (_) => _.inventoryModel) || '',
          uom: idx(initialData, (_) => _.uom) || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          inventoryModel: Yup.string().required('Inventory Model is required'),
          uom: Yup.string().required('Unit of Measure is required'),
        })}
        onSubmit={this._submitForm}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          dirty,
        }) => {
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderInventoryForm({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                  })}
                </Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={dirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Inventory list' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.INVENTORY());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {dirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${
                        isEditMode ? 'Update' : 'Create new'
                      } Inventory`}
                      id='submit-inventory'
                      buttonColor={theme.palette.primary.color2}
                      type='submit'
                    />
                  </Grid>
                )}
              </Grid>
            </form>
          );
        }}
      </Formik>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.INVENTORY());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            {this._renderForm()}
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  // withCreateInventory(),
  // withUpdateInventory(),
  // withInventory(
  //   (props) => {
  //     const inventoryId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: inventoryId,
  //     };
  //   },
  //   ({ data }) => ({ initialData: idx(data, (_) => _.inventory) || {} }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateInventory);
