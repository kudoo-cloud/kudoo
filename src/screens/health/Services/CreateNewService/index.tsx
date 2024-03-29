import {
  Button,
  ErrorBoundary,
  FormikDropdown,
  FormikTextField,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import { FormControl, Grid } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import * as Yup from 'yup';
import {
  CreateRegisteredServiceInput,
  Currency,
  useCreateRegisteredServiceMutation,
  useRegisteredServiceQuery,
  useUpdateRegisteredServiceMutation,
} from 'src/generated/graphql';
import { SERVICE_BILLING_TYPE } from 'src/helpers/constants';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  classes: any;
  theme: any;
}

const CreateNewService: React.FC<IProps> = (props) => {
  const { classes, theme } = props;
  const [isEditMode, setIsEditMode] = useState(false);

  const actions = useAllActions();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const serviceId = match?.params?.id;

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [createRegisteredService] = useCreateRegisteredServiceMutation();
  const [updateRegisteredService] = useUpdateRegisteredServiceMutation();
  const { data } = useRegisteredServiceQuery({
    variables: {
      id: serviceId,
    },
    skip: !serviceId,
  });
  const registeredServiceData = data?.registeredService;

  useEffect(() => {
    actions.updateHeaderTitle('Service');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsEditMode(!!registeredServiceData);
  }, [registeredServiceData]);

  const _submitForm = async (values, actions) => {
    try {
      let dataToSend = {
        daoId: daoId,
        name: values.name,
        billingType: values?.billingType,
        IsTemplate: values?.IsTemplate,
      } as CreateRegisteredServiceInput;

      if (values?.billingType === SERVICE_BILLING_TYPE.FIXED) {
        dataToSend = {
          ...dataToSend,
          currency: values?.currency,
          totalAmount: Number(values?.paymentTotal),
        };
      }

      if (!isEditMode) {
        const res = await createRegisteredService({
          variables: {
            data: dataToSend,
          },
        });
        if (res?.data?.createRegisteredService?.id) {
          showToast(null, 'Service created successfully');
          history.push(URL.SERVICES());
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      } else {
        const res = await updateRegisteredService({
          variables: {
            data: {
              id: serviceId,
              ...dataToSend,
            },
          },
        });
        if (res?.data?.updateRegisteredService?.id) {
          showToast(null, 'Service updated successfully');
          history.push(URL.SERVICES());
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
          title={`${isEditMode ? 'Update' : 'Create new'} Service`}
          subtitle={`${isEditMode ? 'Update' : 'Create a new'} Service ${
            isEditMode
              ? 'to update information in your account. '
              : 'template. This service will be a quick template to use for defining projects, invoices and timesheets.'
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
          name: registeredServiceData?.name || '',
          billingType: registeredServiceData?.billingType || '',
          paymentTotal: registeredServiceData?.totalAmount || '',
          currency: registeredServiceData?.currency || '',
          IsTemplate: registeredServiceData?.IsTemplate || true,
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Service Name is required'),
          billingType: Yup.string().required('Billing Type is required'),

          paymentTotal: Yup.mixed().when('billingType', {
            is: SERVICE_BILLING_TYPE.FIXED,
            then: Yup.string().required('Payment Total is required'),
            otherwise: Yup.mixed(),
          }),

          currency: Yup.mixed().when('billingType', {
            is: SERVICE_BILLING_TYPE.FIXED,
            then: Yup.string().required('Please select currency'),
            otherwise: Yup.mixed(),
          }),
        })}
        onSubmit={_submitForm}
      >
        {(formProps) => {
          const { values, handleSubmit, isSubmitting, dirty } = formProps;
          const isFormDirty = dirty;
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  <ErrorBoundary>
                    <div className={classes.component}>
                      <Grid container spacing={16}>
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
                                {
                                  label: 'Fixed',
                                  value: SERVICE_BILLING_TYPE.FIXED,
                                },
                                {
                                  label: 'Time Based',
                                  value: SERVICE_BILLING_TYPE.TIME_BASED,
                                },
                              ]}
                            />
                          </FormControl>
                          {values.billingType ===
                            SERVICE_BILLING_TYPE.FIXED && (
                            <>
                              <FormControl fullWidth margin='dense'>
                                <FormikTextField
                                  label={'Payment Total'}
                                  placeholder={'E.g: 200'}
                                  isNumber
                                  showClearIcon={false}
                                  name='paymentTotal'
                                  id='paymentTotal'
                                />
                              </FormControl>

                              <FormControl fullWidth margin='dense'>
                                <FormikDropdown
                                  label='Select Currency'
                                  items={[
                                    {
                                      label: Currency.Avax,
                                      value: Currency.Avax,
                                    },
                                    {
                                      label: Currency.Png,
                                      value: Currency.Png,
                                    },
                                    {
                                      label: Currency.Sherpa,
                                      value: Currency.Sherpa,
                                    },
                                  ]}
                                  id='currency'
                                  name='currency'
                                />
                              </FormControl>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  </ErrorBoundary>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Service list' : 'Cancel'}
                    onClick={() => {
                      history.replace(URL.SERVICES());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create new'} Service`}
                      id='submit-service'
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
          history.push(URL.SERVICES());
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

export default withStyles(styles)(CreateNewService);
