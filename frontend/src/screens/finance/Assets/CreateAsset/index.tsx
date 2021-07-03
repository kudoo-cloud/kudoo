import {
  Button,
  DatePicker,
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
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  createAsset: (data: object) => any;
  updateAsset: (data: object) => any;
  initialData: any;
  assetGroups: any;
  i18n: any;
  history: H.History;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateAsset extends Component<IProps, IState> {
  public static defaultProps = {
    createAsset: () => ({}),
    updateAsset: () => ({}),
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    assetGroups: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  public state = {
    isEditMode: false,
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Asset');
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
        dateOfAquisition: values.dateOfAquisition
          ? values.dateOfAquisition
          : undefined,
        aquisitionPrice: values.aquisitionPrice
          ? Number(values.aquisitionPrice)
          : undefined,
        netBookValue: values.netBookValue
          ? Number(values.netBookValue)
          : undefined,
        depreciation: values.depreciation
          ? Number(values.depreciation)
          : undefined,
        salvageValue: values.salvageValue
          ? Number(values.salvageValue)
          : undefined,
        assetGroup: {
          connect: {
            id: values.assetGroup,
          },
        },
      };

      if (!isEditMode) {
        const res = await this.props.createAsset({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Asset created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.ASSETS());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateAsset({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Asset updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.ASSETS());
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
        title={`${isEditMode ? 'Update' : 'Create'} Asset`}
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
    const { classes, assetGroups } = this.props;
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
                label={'Asset Group'}
                placeholder={'Select Asset Group'}
                name={'assetGroup'}
                id={'assetGroup'}
                items={get(assetGroups, 'data', []).map((group) => ({
                  label: group.name,
                  value: group.id,
                }))}
                value={values.assetGroup}
                onChange={(e) => setFieldValue('assetGroup', e.value)}
                onClose={() => setFieldTouched('assetGroup')}
                error={touched.assetGroup && errors.assetGroup}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label='Date Of Aquisition'
                value={values.dateOfAquisition}
                onDateChange={(date) => {
                  setFieldValue('dateOfAquisition', date);
                  setFieldTouched('dateOfAquisition');
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Aquisition Price'}
                placeholder={'Enter aquisition price'}
                name={'aquisitionPrice'}
                id={'aquisitionPrice'}
                value={String(values.aquisitionPrice)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.aquisitionPrice && errors.aquisitionPrice}
                showClearIcon={false}
                isNumber
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Netbook Value'}
                placeholder={'Enter netbook value'}
                name={'netBookValue'}
                id={'netBookValue'}
                value={String(values.netBookValue)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.netBookValue && errors.netBookValue}
                showClearIcon={false}
                isNumber
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Salvage Value'}
                placeholder={'Enter salvage value'}
                name={'salvageValue'}
                id={'salvageValue'}
                value={String(values.salvageValue)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.salvageValue && errors.salvageValue}
                showClearIcon={false}
                isNumber
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'depreciation'}
                placeholder={'Enter depreciation'}
                name={'depreciation'}
                id={'depreciation'}
                value={String(values.depreciation)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.depreciation && errors.depreciation}
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
          dateOfAquisition: initialData.dateOfAquisition || '',
          aquisitionPrice: initialData.aquisitionPrice || '',
          netBookValue: initialData.netBookValue || '',
          depreciation: initialData.depreciation || '',
          salvageValue: initialData.salvageValue || '',
          assetGroup: get(initialData, 'assetGroup.id') || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          assetGroup: Yup.string().required('Please select Asset Group'),
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
                    title={isEditMode ? 'Back to Assets' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.ASSETS());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create'} Asset`}
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
            this.props.history.push(URL.ASSETS());
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
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withI18n(),
  // withCreateAsset(),
  // withUpdateAsset(),
  // withAssetGroups(({ profile }) => ({
  //   variables: {
  //     where: {
  //       isArchived: false,
  //       dao: {
  //         id: profile.selectedDAO.id,
  //       },
  //     },
  //     orderBy: 'name_ASC',
  //   },
  // })),
  // withAsset(
  //   (props) => {
  //     const id = get(props, 'match.params.id');
  //     return {
  //       id,
  //     };
  //   },
  //   ({ data }) => ({
  //     initialData: get(data, 'asset') || {},
  //   }),
  // ),
)(CreateAsset);
