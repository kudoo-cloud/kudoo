import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import * as Yup from 'yup';
import {
  useCreateSupplierMutation,
  useSupplierQuery,
  useUpdateSupplierMutation,
} from 'src/generated/graphql';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import styles from './styles';
import { TERMS_OF_PAYMENT } from './termsOfPaymentType';

interface IProps {
  classes: any;
  theme: any;
}

const keys = {
  name: 'name',
  termsOfPayment: 'termsOfPayment',
  emailAddressForRemittance: 'emailAddressForRemittance',
  cChainAddress: 'cChainAddress',
};
const labels = {
  name: 'Supplier Name',
  termsOfPayment: 'Terms Of Payment',
  emailAddressForRemittance: 'Email address for remittance',
  cChainAddress: 'C-Chain Address',
};

const CreateNewSupplier: React.FC<IProps> = (props) => {
  const { classes, theme } = props;
  const [isEditMode, setIsEditMode] = useState(false);

  const actions = useAllActions();
  const history = useHistory();
  const profile = useProfile();
  const match = useRouteMatch<{ id: string }>();
  const supplierId = match?.params?.id;

  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const { data } = useSupplierQuery({
    variables: {
      id: supplierId,
    },
    skip: !supplierId,
  });
  const supplierData = data?.supplier;

  useEffect(() => {
    actions.updateHeaderTitle('Supplier');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsEditMode(!!supplierData);
  }, [supplierData]);

  const _submitForm = async (values, actions) => {
    try {
      const dataToSend = {
        daoId: profile?.selectedDAO?.id,
        name: values?.name,
        termsOfPayment: values?.termsOfPayment,
        cChainAddress: values?.cChainAddress,
        emailAddressForRemittance: values?.emailAddressForRemittance,
      };

      if (!isEditMode) {
        const res = await createSupplier({
          variables: {
            createSupplierInput: dataToSend,
          },
        });
        if (res?.data?.createSupplier?.id) {
          showToast(null, 'Supplier created successfully');
          history.push(URL.SUPPLIERS());
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      } else {
        const res = await updateSupplier({
          variables: {
            updateSupplierInput: {
              id: supplierId,
              ...dataToSend,
            },
          },
        });
        if (res?.data?.updateSupplier?.id) {
          showToast(null, 'Supplier updated successfully');
          history.push(URL.SUPPLIERS());
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
          title={`${isEditMode ? 'Update' : 'Create new'} Supplier`}
          subtitle={`${isEditMode ? 'Update' : 'Create a new'} Supplier ${
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
          name: supplierData?.name || '',
          termsOfPayment: supplierData?.termsOfPayment || '',
          emailAddressForRemittance:
            supplierData?.emailAddressForRemittance || '',
          cChainAddress: supplierData?.cChainAddress || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          termsOfPayment: Yup.string().required('Terms of payment is required'),
          emailAddressForRemittance: Yup.string()
            .email('Invalid Email')
            .required('Email address is required'),
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
                            label={labels.name}
                            placeholder={'E.g: Supplier Name'}
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
                            label={labels.termsOfPayment}
                            placeholder={'Select Terms Of Payment'}
                            name={keys.termsOfPayment}
                            id={keys.termsOfPayment}
                            items={TERMS_OF_PAYMENT}
                            value={values[keys.termsOfPayment]}
                            onChange={(e) =>
                              setFieldValue(keys.termsOfPayment, e.value)
                            }
                            onClose={() => setFieldTouched(keys.termsOfPayment)}
                            error={
                              touched[keys.termsOfPayment] &&
                              errors[keys.termsOfPayment]
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={labels.emailAddressForRemittance}
                            placeholder={'E.g: Jode@gmail.com'}
                            name={keys.emailAddressForRemittance}
                            id={keys.emailAddressForRemittance}
                            value={values[keys.emailAddressForRemittance]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched[keys.emailAddressForRemittance] &&
                              errors[keys.emailAddressForRemittance]
                            }
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
                      </Grid>
                    </div>
                  </ErrorBoundary>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Supplier list' : 'Cancel'}
                    onClick={() => {
                      history.replace(URL.SUPPLIERS());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create new'} Supplier`}
                      id='submit-supplier'
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
          history.push(URL.SUPPLIERS());
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

export default withStyles(styles)(CreateNewSupplier);
