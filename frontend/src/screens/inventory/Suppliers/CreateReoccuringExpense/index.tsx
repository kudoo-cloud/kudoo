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
  useCreateReoccuringExpenseMutation,
  useReoccuringExpenseQuery,
  useUpdateReoccuringExpenseMutation,
  useSuppliersByDaoQuery,
} from 'src/generated/graphql';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useProfile } from 'src/store/hooks';
import { useAllActions } from 'src/store/hooks';
import styles from './styles';
import { REOCCURING_FREQUENCY } from './reoccuringFrequency';

interface IProps {
  classes: any;
  theme: any;
}

const keys = {
  supplierId: 'supplierId',
  amount: 'amount',
  reoccuringFrequency: 'reoccuringFrequency',
};
const labels = {
  supplierId: 'Supplier',
  amount: 'Amount',
  reoccuringFrequency: 'Reoccuring Frequency',
};

const CreateReoccuringExpense: React.FC<IProps> = (props) => {
  const { classes, theme } = props;
  const [isEditMode, setIsEditMode] = useState(false);

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const actions = useAllActions();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const reoccuringExpenseId = match?.params?.id;

  const [createReoccuringExpense] = useCreateReoccuringExpenseMutation();
  const [updateReoccuringExpense] = useUpdateReoccuringExpenseMutation();
  const { data } = useReoccuringExpenseQuery({
    variables: {
      id: reoccuringExpenseId,
    },
    skip: !reoccuringExpenseId,
  });
  const reoccuringExpenseData = data?.reoccuringExpense;

  const suppliers = useSuppliersByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });

  const allSuppliers = (suppliers?.data?.suppliersByDao || []).map((item) => {
    let container = {};

    container['value'] = item?.id;
    container['label'] = item?.name;

    return container;
  });

  useEffect(() => {
    actions.updateHeaderTitle('Reoccuring Expense');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsEditMode(!!reoccuringExpenseData);
  }, [reoccuringExpenseData]);

  const _submitForm = async (values, actions) => {
    try {
      const dataToSend = {
        supplierId: values?.supplierId,
        reoccuringFrequency: values?.reoccuringFrequency,
        amount: parseFloat(values?.amount),
      };

      if (!isEditMode) {
        const res = await createReoccuringExpense({
          variables: {
            createReoccuringExpenseInput: dataToSend,
          },
        });
        if (res?.data?.createReoccuringExpense?.id) {
          showToast(null, 'Reoccuring Expense created successfully');
          history.push(URL.REOCCURING_EXPENSES());
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      } else {
        const res = await updateReoccuringExpense({
          variables: {
            updateReoccuringExpenseInput: {
              id: reoccuringExpenseId,
              ...dataToSend,
            },
          },
        });
        if (res?.data?.updateReoccuringExpense?.id) {
          showToast(null, 'Reoccuring Expense updated successfully');
          history.push(URL.REOCCURING_EXPENSES());
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
          title={`${isEditMode ? 'Update' : 'Create new'} Reoccuring Expense`}
          subtitle={`${
            isEditMode ? 'Update' : 'Create a new'
          } Reoccuring Expense ${
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
          supplierId: reoccuringExpenseData?.supplier?.id || '',
          amount: reoccuringExpenseData?.amount || '0',
          reoccuringFrequency: reoccuringExpenseData?.reoccuringFrequency || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          supplierId: Yup.string().required('Supplier is required'),
          amount: Yup.number().required('Amount is required'),
          reoccuringFrequency: Yup.string().required(
            'Reoccuring Frequency is required',
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
                          <Dropdown
                            label={labels.supplierId}
                            placeholder={'Select supplier'}
                            name={keys.supplierId}
                            id={keys.supplierId}
                            items={allSuppliers}
                            value={values[keys.supplierId]}
                            onChange={(e) =>
                              setFieldValue(keys.supplierId, e.value)
                            }
                            onClose={() => setFieldTouched(keys.supplierId)}
                            error={
                              touched[keys.supplierId] &&
                              errors[keys.supplierId]
                            }
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label={labels.amount}
                            id={keys.amount}
                            placeholder={`0`}
                            value={values[keys.amount]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched[keys.amount] && errors[keys.amount]}
                            showClearIcon={false}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Dropdown
                            label={labels.reoccuringFrequency}
                            placeholder={'Select Reoccuring Frquency'}
                            name={keys.reoccuringFrequency}
                            id={keys.reoccuringFrequency}
                            items={REOCCURING_FREQUENCY}
                            value={values[keys.reoccuringFrequency]}
                            onChange={(e) =>
                              setFieldValue(keys.reoccuringFrequency, e.value)
                            }
                            onClose={() =>
                              setFieldTouched(keys.reoccuringFrequency)
                            }
                            error={
                              touched[keys.reoccuringFrequency] &&
                              errors[keys.reoccuringFrequency]
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
                    title={
                      isEditMode ? 'Back to Reoccuring Expense list' : 'Cancel'
                    }
                    onClick={() => {
                      history.replace(URL.REOCCURING_EXPENSES());
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
                      } Reoccuring Expense`}
                      id='submit-reoccuring-expense'
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
          history.push(URL.REOCCURING_EXPENSES());
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

export default withStyles(styles)(CreateReoccuringExpense);
