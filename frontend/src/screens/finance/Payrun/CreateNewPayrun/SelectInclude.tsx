import {
  Button,
  ErrorBoundary,
  FieldLabel,
  FormikCheckbox,
  FormikDropdown,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import { FormControl, Grid } from '@material-ui/core';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { PAYRUN_TYPE } from 'src/helpers/constants';
import { useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  classes: any;
  theme: any;
}

interface Props {
  setIncluceData: Function;
  selectedIncludeData: any;
  allMultisig: Array<any>;
}

const SelectInclude: React.FC<IProps & Props> = ({
  setIncluceData,
  selectedIncludeData,
  allMultisig,
  ...props
}) => {
  const { classes, theme } = props;

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const _submitForm = async (values) => {
    const dataToSend = {
      daoId: daoId,
      payrunType: values?.payrunType,
      includeCoreContributor: values?.coreContributor,
      includeSuppliers: values?.suppliers,
      includeReoccuringPayments: values?.reoccuringPayments,
      multisig: values?.multisig,
    };

    setIncluceData(dataToSend);
  };

  return (
    <div>
      <Formik
        initialValues={{
          payrunType: selectedIncludeData?.payrunType || '',
          coreContributor: selectedIncludeData?.includeCoreContributor || false,
          suppliers: selectedIncludeData?.includeSuppliers || false,
          reoccuringPayments:
            selectedIncludeData?.includeReoccuringPayments || false,
          multisig: selectedIncludeData?.multisig,
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          payrunType: Yup.string().required('Payrun Type is required'),
          multisig: Yup.string().required('Please select multisig'),
        })}
        onSubmit={_submitForm}
      >
        {(formProps) => {
          const { handleSubmit, values } = formProps;

          return (
            <form className={classes.form}>
              <SectionHeader
                title='Create a payrun'
                subtitle='Lets begin by selecting an option below.'
                renderLeftPart={() => (
                  <div className={classes.prevNextWrapper}>
                    <Button
                      title='Next'
                      id='next-button'
                      classes={{ component: classes.prevNextButton }}
                      applyBorderRadius
                      compactMode
                      buttonColor={theme.palette.primary.color2}
                      onClick={() => handleSubmit()}
                      isDisabled={
                        !values?.coreContributor &&
                        !values?.suppliers &&
                        !values?.reoccuringPayments
                      }
                    />
                  </div>
                )}
              />

              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  <ErrorBoundary>
                    <div className={classes.component}>
                      <Grid container spacing={16}>
                        <Grid item xs={12}>
                          <FieldLabel label='Please Choose' />

                          <Grid item xs={12}>
                            <FormControl margin='dense'>
                              <FormikCheckbox
                                label={'Core Contributor'}
                                id='core-contributor'
                                name='coreContributor'
                                classes={{ component: classes.gstCheckbox }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl margin='dense'>
                              <FormikCheckbox
                                label={'Suppliers'}
                                id='suppliers'
                                name='suppliers'
                                classes={{ component: classes.gstCheckbox }}
                              />
                            </FormControl>
                          </Grid>

                          <FormControl margin='dense'>
                            <FormikCheckbox
                              label={'Reoccuring Payments'}
                              id='reoccuring-payments'
                              name='reoccuringPayments'
                              classes={{ component: classes.gstCheckbox }}
                            />
                          </FormControl>

                          <FormControl fullWidth margin='dense'>
                            <FormikDropdown
                              label='Payrun Type'
                              id='payrun-type'
                              name='payrunType'
                              placeholder={'Select type'}
                              items={[
                                {
                                  label: '1st of the month',
                                  value: PAYRUN_TYPE.FIRST_OF_MONTH,
                                },
                                {
                                  label: '15th of the month',
                                  value: PAYRUN_TYPE.FIFTEEN_OF_MONTH,
                                },
                              ]}
                            />
                          </FormControl>

                          <FormControl fullWidth margin='dense'>
                            <FormikDropdown
                              label='Select Multisig'
                              items={allMultisig}
                              id='multisig'
                              name='multisig'
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>
                  </ErrorBoundary>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withStyles<Props>(styles)(SelectInclude);
