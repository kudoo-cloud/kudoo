import {
  Button,
  Checkbox,
  DatePicker,
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
  useContributorQuery,
  useCreateContributorMutation,
  usePoliciesQuery,
  useUpdateContributorMutation,
} from 'src/generated/graphql';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions } from 'src/store/hooks';
import { PAYMENT_FREQUENCY } from './paymentFrequency';
import styles from './styles';

interface IProps {
  classes: any;
  theme: any;
}

const keys = {
  firstName: 'firstName',
  lastName: 'lastName',
  telegramHandle: 'telegramHandle',
  discordHandle: 'discordHandle',
  amount: 'amount',
  paymentFrequency: 'paymentFrequency',
  cChainAddress: 'cChainAddress',
  startDate: 'startDate',
  policyIds: 'policyIds',
};
const labels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  telegramHandle: 'Telegram Handle',
  discordHandle: 'Discord Handle',
  amount: 'Yearly Amount in USD',
  cChainAddress: 'C-Chain Address',
  paymentFrequency: 'Payment Frequency',
  startDate: 'Start Date',
  policyIds: 'Applied Policy',
};

const CreateNewContributor: React.FC<IProps> = (props) => {
  const { classes, theme } = props;
  const [isEditMode, setIsEditMode] = useState(false);

  const actions = useAllActions();
  const history = useHistory();

  const match = useRouteMatch<{ id: string }>();
  const contributorId = match?.params?.id;

  const [createContributor] = useCreateContributorMutation();
  const [updateContributor] = useUpdateContributorMutation();
  const { data } = useContributorQuery({
    variables: {
      id: contributorId,
    },
    skip: !contributorId,
  });
  const contributorData = data?.contributor;

  const policy = usePoliciesQuery({
    fetchPolicy: 'network-only',
  });

  const policies = policy?.data?.policies || [];

  useEffect(() => {
    actions.updateHeaderTitle('Contributor');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsEditMode(!!contributorData);
  }, [contributorData]);

  const _submitForm = async (values, actions) => {
    try {
      const dataToSend = {
        firstName: values?.firstName,
        lastName: values?.lastName,
        telegramHandle: values?.telegramHandle,
        discordHandle: values?.discordHandle,
        amount: parseFloat(values?.amount),
        cChainAddress: values?.cChainAddress,
        startDate: values?.startDate,
        paymentFrequency: values?.paymentFrequency,
        policyIds: values?.policyIds || [],
      };

      if (!isEditMode) {
        const res = await createContributor({
          variables: {
            createContributorInput: dataToSend,
          },
        });
        if (res?.data?.createContributor?.id) {
          showToast(null, 'Contributor created successfully');
          history.push(URL.CONTRIBUTORS());
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      } else {
        const res = await updateContributor({
          variables: {
            updateContributorInput: {
              id: contributorId,
              ...dataToSend,
            },
          },
        });
        if (res?.data?.updateContributor?.id) {
          showToast(null, 'Contributor updated successfully');
          history.push(URL.CONTRIBUTORS());
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
          title={`${isEditMode ? 'Update' : 'Create new'} Contributor`}
          subtitle={`${isEditMode ? 'Update' : 'Create a new'} Contributor ${
            isEditMode
              ? 'to update information in your account. '
              : 'to add to your account. '
          }`}
          classes={{ component: classes.sectionHeader }}
        />
      </Grid>
    );
  };

  const _handleOnChange = (checked, value, values, setFieldValue) => {
    const index = values?.indexOf(value);
    const newValues = [...values];
    if (checked && index == -1) {
      (newValues || [])?.push(value);
      setFieldValue('policyIds', newValues);
    } else {
      (newValues || []).splice(index, 1);
      setFieldValue('policyIds', newValues);
    }
  };

  const _renderForm = () => {
    return (
      <Formik
        initialValues={{
          firstName: contributorData?.firstName || '',
          lastName: contributorData?.lastName || '',
          telegramHandle: contributorData?.telegramHandle || '',
          discordHandle: contributorData?.discordHandle || '',
          amount: contributorData?.amount || '0',
          cChainAddress: contributorData?.cChainAddress || '',
          paymentFrequency: contributorData?.paymentFrequency || '',
          startDate: contributorData?.startDate || '',
          policyIds: (contributorData?.policies || []).map((s) => s.id) || [],
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('First Name is required'),
          lastName: Yup.string().required('Last Name is required'),
          telegramHandle: Yup.string().required('Telegram Handle is required'),
          discordHandle: Yup.string().required('Discord Handle is required'),
          amount: Yup.string().required('Amount is required'),
          startDate: Yup.string().required('Start Date is required'),
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
                            label={labels.firstName}
                            placeholder={'E.g: First Name'}
                            name={keys.firstName}
                            id={keys.firstName}
                            value={values[keys.firstName]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.firstName] && errors[keys.firstName]
                            }
                            showClearIcon={false}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={labels.lastName}
                            placeholder={'E.g: Last Name'}
                            name={keys.lastName}
                            id={keys.lastName}
                            value={values[keys.lastName]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.lastName] && errors[keys.lastName]
                            }
                            showClearIcon={false}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label={labels.telegramHandle}
                            placeholder={'E.g: Telegram Handle'}
                            name={keys.telegramHandle}
                            id={keys.telegramHandle}
                            value={values[keys.telegramHandle]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.telegramHandle] &&
                              errors[keys.telegramHandle]
                            }
                            showClearIcon={false}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label={labels.discordHandle}
                            placeholder={'E.g: Discord Handle'}
                            name={keys.discordHandle}
                            id={keys.discordHandle}
                            value={values[keys.discordHandle]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.discordHandle] &&
                              errors[keys.discordHandle]
                            }
                            showClearIcon={false}
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
                            label={labels.cChainAddress}
                            placeholder={
                              '0x93e31CB3B4150AE82cAD1d369a7FddFE999999'
                            }
                            name={keys.cChainAddress}
                            id={keys.cChainAddress}
                            value={values[keys.cChainAddress]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.cChainAddress] &&
                              errors[keys.cChainAddress]
                            }
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

                        <Grid item xs={12}>
                          <DatePicker
                            textFieldProps={{
                              label: labels.startDate,
                              error:
                                touched[keys.startDate] &&
                                errors[keys.startDate],
                              id: keys.startDate,
                            }}
                            value={values[keys.startDate]}
                            onDateChange={(date) => {
                              setFieldValue(keys.startDate, date);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <div className={classes.label}>Policy</div>
                          <div className={classes.policyWrapper}>
                            {(policies || []).map((value, i) => (
                              <div key={i} className={classes.input}>
                                <Checkbox
                                  key={i}
                                  label={value.description}
                                  value={
                                    values?.policyIds?.indexOf(value.id) > -1
                                      ? value.id
                                      : ''
                                  }
                                  classes={{ wrapper: classes.checkbox }}
                                  onChange={(isChecked) => {
                                    setFieldTouched('policyIds');
                                    _handleOnChange(
                                      isChecked,
                                      value?.id,
                                      values?.policyIds,
                                      setFieldValue,
                                    );
                                  }}
                                  size='small'
                                />
                              </div>
                            ))}
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </ErrorBoundary>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Contributor list' : 'Cancel'}
                    onClick={() => {
                      history.replace(URL.CONTRIBUTORS());
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
                      } Contributor`}
                      id='submit-contributor'
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
          history.push(URL.CONTRIBUTORS());
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

export default withStyles(styles)(CreateNewContributor);
