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
import * as H from 'history';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  createAssetGroup: (data: object) => any;
  updateAssetGroup: (data: object) => any;
  initialData: any;
  i18n: any;
  history: H.History;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateAssetGroup extends Component<IProps, IState> {
  public static defaultProps = {
    createAssetGroup: () => ({}),
    updateAssetGroup: () => ({}),
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  public state = {
    isEditMode: false,
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Asset Group');
    this.setState({
      isEditMode: Boolean(get(this.props, 'initialData')),
    });
  }

  public componentDidUpdate(prevProps) {
    if (!isEqual(this.props.initialData, prevProps.initialData)) {
      this.setState({
        isEditMode: Boolean(get(this.props, 'initialData')),
      });
    }
  }

  public _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;

      const dataToSend = {
        name: values.name,
        depreciationType: values.depreciationType,
        usefulLife: Number(values.usefulLife),
      };

      if (!isEditMode) {
        const res = await this.props.createAssetGroup({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Asset Group created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.ASSET_GROUPS());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateAssetGroup({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Asset Group updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.ASSET_GROUPS());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  public _renderSectionHeading() {
    const { isEditMode } = this.state;
    const { classes } = this.props;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Asset Group`}
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  public _renderFormFields({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  }) {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label={'Name'}
                placeholder={'Enter name'}
                name={'name'}
                id={'name'}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                showClearIcon={false}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={'Depreciation Type'}
                placeholder={'Select Depreciation Type'}
                name={'depreciationType'}
                id={'depreciationType'}
                items={[
                  {
                    label: 'Straight Line',
                    value: 'STRAIGHT_LINE',
                  },
                  {
                    label: 'Reducing Balance',
                    value: 'REDUCING_BALANCE',
                  },
                ]}
                value={values.depreciationType}
                onChange={(e) => setFieldValue('depreciationType', e.value)}
                onClose={() => setFieldTouched('depreciationType')}
                error={touched.depreciationType && errors.depreciationType}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Useful Life (in months)'}
                placeholder={'Enter Useful Life'}
                name={'usefulLife'}
                id={'usefulLife'}
                value={String(values.usefulLife)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.usefulLife && errors.usefulLife}
                showClearIcon={false}
                isNumber
              />
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }

  public _renderForm() {
    const { initialData = {}, classes, theme } = this.props;
    const { isEditMode } = this.state;
    return (
      <Formik
        initialValues={{
          name: initialData.name || '',
          depreciationType: initialData.depreciationType || '',
          usefulLife: initialData.usefulLife || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          depreciationType: Yup.string().required('Depreciation Type required'),
          usefulLife: Yup.number().required('Useful Life required'),
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
          const isFormDirty = dirty;
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderFormFields({
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
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Asset Groups' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.ASSET_GROUPS());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create '} Asset Group`}
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
            this.props.history.push(URL.ASSET_GROUPS());
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
  // withCreateAssetGroup(),
  // withUpdateAssetGroup(),
  // withAssetGroup(
  //   (props) => {
  //     const id = get(props, 'match.params.id');
  //     return {
  //       id,
  //     };
  //   },
  //   ({ data }) => ({
  //     initialData: get(data, 'assetGroup') || {},
  //   }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateAssetGroup);
