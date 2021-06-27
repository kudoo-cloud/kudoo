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
import { MAIN_ACCOUNT_TYPES } from './mainAccountTypes';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  createMainAccount: (data: object) => any;
  updateMainAccount: (data: object) => any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateNewMainAccount extends Component<IProps, IState> {
  public static defaultProps = {
    createMainAccount: () => ({}),
    updateMainAccount: () => ({}),
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  public state = {
    isEditMode: false,
  };

  public _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;

      const dataToSend = {
        name: values.mainAccount_name,
        type: values.mainAccount_type,
        code: values.mainAccount_code,
      };

      if (!isEditMode) {
        const res = await this.props.createMainAccount({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Main Account created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.LEDGER());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateMainAccount({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Main Account updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.LEDGER());
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
    this.props.actions.updateHeaderTitle('Main Account');

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
        title={`${isEditMode ? 'Update' : 'Create new'} Main Account`}
        subtitle={`${isEditMode ? 'Update' : 'Create a new'} main account ${
          isEditMode
            ? 'to update information in your account. '
            : 'to add to your account. '
        }`}
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  public _renderMainAccountForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  }) {
    const keys = {
      mainAccount_name: 'mainAccount_name',
      mainAccount_type: 'mainAccount_type',
      mainAccount_code: 'mainAccount_code',
    };
    const labels = {
      mainAccount_name: 'Main Account Name',
      mainAccount_type: 'Main Account Type',
      mainAccount_code: 'Main Account Code',
    };
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label={labels.mainAccount_name}
                placeholder={'E.g: Revenue'}
                name={keys.mainAccount_name}
                id={keys.mainAccount_name}
                value={values[keys.mainAccount_name]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched[keys.mainAccount_name] &&
                  errors[keys.mainAccount_name]
                }
                showClearIcon={false}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={labels.mainAccount_type}
                placeholder={'Select Type'}
                name={keys.mainAccount_type}
                id={keys.mainAccount_type}
                items={MAIN_ACCOUNT_TYPES}
                value={values[keys.mainAccount_type]}
                onChange={(e) => setFieldValue(keys.mainAccount_type, e.value)}
                onClose={() => setFieldTouched(keys.mainAccount_type)}
                error={
                  touched[keys.mainAccount_type] &&
                  errors[keys.mainAccount_type]
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={labels.mainAccount_code}
                placeholder={'E.g: 1001'}
                name={keys.mainAccount_code}
                id={keys.mainAccount_code}
                value={values[keys.mainAccount_code]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched[keys.mainAccount_code] &&
                  errors[keys.mainAccount_code]
                }
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
          mainAccount_name: idx(initialData, (_) => _.name) || '',
          mainAccount_type: idx(initialData, (_) => _.type) || '',
          mainAccount_code: idx(initialData, (_) => _.code) || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          mainAccount_name: Yup.string().required('Name is required'),
          mainAccount_type: Yup.string().required('Type is required'),
          mainAccount_code: Yup.string().required('Code is required'),
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
                  {this._renderMainAccountForm({
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
                    title={isEditMode ? 'Back to Main Account list' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.LEDGER_MAIN_ACCOUNTS());
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
                      } Main Account`}
                      id='submit-mainAccount'
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
            this.props.history.push(URL.LEDGER());
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
  // withCreateMainAccount(),
  // withUpdateMainAccount(),
  // withMainAccount(
  //   (props) => {
  //     const mainAccountId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: mainAccountId,
  //     };
  //   },
  //   ({ data }) => ({
  //     initialData: idx(data, (_) => _.mainAccount) || {},
  //   }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateNewMainAccount);
