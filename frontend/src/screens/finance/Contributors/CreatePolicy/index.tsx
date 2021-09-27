import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { Trans } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import * as Yup from 'yup';
import {
  useCreatePolicyMutation,
  usePolicyQuery,
  useUpdatePolicyMutation,
} from 'src/generated/graphql';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions } from 'src/store/hooks';
import styles from './styles';
import { PAYMENT_FREQUENCY } from './paymentFrequency';

interface IProps {
  classes: any;
  theme: any;
}

const keys = {
  description: 'description',
  amount: 'amount',
  paymentFrequency: 'paymentFrequency',
  token: 'token',
};
const labels = {
  description: 'Description',
  amount: 'Amount',
  paymentFrequency: 'Payment Frequency',
  token: 'Token',
};

const CreateNewPolicy: React.FC<IProps> = (props) => {
  const { classes, theme } = props;
  const [isEditMode, setIsEditMode] = useState(false);

  const actions = useAllActions();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const policyId = match?.params?.id;

  const [createPolicy] = useCreatePolicyMutation();
  const [updatePolicy] = useUpdatePolicyMutation();
  const { data } = usePolicyQuery({
    variables: {
      id: policyId,
    },
    skip: !policyId,
  });
  const policyData = data?.policy;

  useEffect(() => {
    actions.updateHeaderTitle('Policy');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsEditMode(!!policyData);
  }, [policyData]);

  const _submitForm = async (values, actions) => {
    try {
      const dataToSend = {
        description: values?.description,
        paymentFrequency: values?.paymentFrequency,
        token: values?.token,
        amount: parseFloat(values?.amount),
      };

      if (!isEditMode) {
        const res = await createPolicy({
          variables: {
            createPolicyInput: dataToSend,
          },
        });
        if (res?.data?.createPolicy?.id) {
          showToast(null, 'Policy created successfully');
          history.push(URL.POLICIES());
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      } else {
        const res = await updatePolicy({
          variables: {
            updatePolicyInput: {
              id: policyId,
              ...dataToSend,
            },
          },
        });
        if (res?.data?.updatePolicy?.id) {
          showToast(null, 'Policy updated successfully');
          history.push(URL.POLICIES());
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  const _renderSectionHeading = () => {
    return (
      <Grid container item xs={12} sm={6}>
        <SectionHeader
          title={`${isEditMode ? 'Update' : 'Create new'} Policy`}
          subtitle={`${isEditMode ? 'Update' : 'Create a new'} Policy ${
            isEditMode
              ? 'to update information in your account. '
              : 'to add to your account. '
          }`}
          classes={{ component: classes.sectionHeader }}
        />
      </Grid>
    );
  };

  const _renderForm = () => {
    return (
      <Formik
        initialValues={{
          description: policyData?.description || '',
          amount: policyData?.amount || '0',
          token: policyData?.token || '',
          paymentFrequency: policyData?.paymentFrequency || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          description: Yup.string().required('Description is required'),
          amount: Yup.number().required('Amount is required'),
          paymentFrequency: Yup.string().required(
            'Payment Frequency is required',
          ),
        })}
        onSubmit={_submitForm}
      >
        {(formProps) => {
          const {
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
          } = formProps;
          const isFormDirty = dirty;
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  <ErrorBoundary>
                    <div className={classes.component}>
                      <Grid container spacing={16}>
                        <Grid item xs={12}>
                          <TextField
                            label={labels.description}
                            placeholder={'E.g: Description'}
                            name={keys.description}
                            id={keys.description}
                            value={values[keys.description]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.description] &&
                              errors[keys.description]
                            }
                            showClearIcon={false}
                            multiline={true}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label={labels.amount}
                            id={keys.amount}
                            placeholder={`0`}
                            value={values[keys.amount]}
                            icon={
                              <span className={classes.dollarIcon}>
                                <Trans id='currency-symbol' />
                              </span>
                            }
                            classes={{
                              leftIcon: classes.inputLeftIcon,
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched[keys.amount] && errors[keys.amount]}
                            showClearIcon={false}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label={labels.token}
                            placeholder={
                              '0x93e31CB3B4150AE82cAD1d369a7FddFE999999'
                            }
                            name={keys.token}
                            id={keys.token}
                            value={values[keys.token]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched[keys.token] && errors[keys.token]}
                            showClearIcon={false}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Dropdown
                            label={labels.paymentFrequency}
                            placeholder={'Select Payment Frquency'}
                            name={keys.paymentFrequency}
                            id={keys.paymentFrequency}
                            items={PAYMENT_FREQUENCY}
                            value={values[keys.paymentFrequency]}
                            onChange={(e) =>
                              setFieldValue(keys.paymentFrequency, e.value)
                            }
                            onClose={() =>
                              setFieldTouched(keys.paymentFrequency)
                            }
                            error={
                              touched[keys.paymentFrequency] &&
                              errors[keys.paymentFrequency]
                            }
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </ErrorBoundary>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Policy list' : 'Cancel'}
                    onClick={() => {
                      history.replace(URL.POLICIES());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create new'} Policy`}
                      id='submit-policy'
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
  };

  return (
    <ErrorBoundary>
      <SelectedDAO
        onChange={() => {
          history.push(URL.POLICIES());
        }}
      >
        <div className={classes.page}>
          {_renderSectionHeading()}
          {_renderForm()}
        </div>
      </SelectedDAO>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(CreateNewPolicy);
