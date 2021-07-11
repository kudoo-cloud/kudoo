import {
  Button,
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
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  createWareHouse: (data: any) => any;
  updateWareHouse: (data: any) => any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateWarehouse extends Component<IProps, IState> {
  static defaultProps = {
    updateWareHouse: () => ({}),
    createWareHouse: () => ({}),
    initialData: { data: [] },
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
      };
      if (!isEditMode) {
        const res = await this.props.createWareHouse({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Warehouse created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.WAREHOUSE());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateWareHouse({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Warehouse updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.WAREHOUSE());
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
    this.props.actions.updateHeaderTitle('Warehouse');

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
        title={`${isEditMode ? 'Update' : 'Create new'} Warehouse`}
        // subtitle={`${isEditMode ? 'Update' : 'Create a new'} warehouse ${isEditMode ? 'to update information in warehouse. ' : 'to add in warehouse. '}`}
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  public _renderWarehouseForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  }) {
    const keys = {
      name: 'name',
    };
    const labels = {
      name: 'Warehouse Name',
    };
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label={labels.name}
                placeholder={'Warehouse Name'}
                name={keys.name}
                id={keys.name}
                value={values[keys.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[keys.name] && errors[keys.name]}
                showClearIcon={false}
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
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
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
          dirty,
        }) => {
          const isFormDirty = dirty;
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderWarehouseForm({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                  })}
                </Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Warehouse list' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.WAREHOUSE());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${
                        isEditMode ? 'Update' : 'Create new'
                      } Warehouse`}
                      id='submit-warehouse'
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
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.WAREHOUSE());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            {this._renderForm()}
          </div>
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  // withCreateWareHouse(),
  // withUpdateWareHouse(),
  // withWareHouse(
  //   (props) => {
  //     const wareHouseId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: wareHouseId,
  //     };
  //   },
  //   ({ data }) => ({ initialData: idx(data, (_) => _.wareHouse) || {} }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateWarehouse);
