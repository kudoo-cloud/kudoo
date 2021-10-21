import {
  AddressForm,
  Button,
  Checkbox,
  FieldLabel,
  FormikCheckbox,
  FormikDatePicker,
  FormikDropdown,
  FormikTextField,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import find from 'lodash/find';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { setManualStep1 } from 'src/store/actions/createNewPatient';
import { IReduxState } from 'src/store/reducers';
import styles, { StyleKeys } from '../styles';

type Props = IComponentProps<StyleKeys> & {
  goToNextStep: Function;
  setManualStep1?: Function;
  manualPatientData?: any;
};

const ManualStepOne: React.FC<Props> = (props) => {
  const { classes, theme, manualPatientData } = props;

  return (
    <Formik
      initialValues={{
        title: manualPatientData.title || '',
        firstName: manualPatientData.firstName || '',
        lastName: manualPatientData.lastName || '',
        dateOfBirth: manualPatientData.dateOfBirth || '',
        gender: manualPatientData.gender || '',
        oneName: manualPatientData.oneName || false,
        currentAddress: manualPatientData.currentAddress || {
          street: '',
          city: '',
          state: '',
          country: '',
          postCode: '',
        },
        birthAddress: manualPatientData.birthAddress || {
          street: '',
          city: '',
          state: '',
          country: '',
          postCode: '',
        },
        names: manualPatientData.names || [],
      }}
      onSubmit={async (values) => {
        props.setManualStep1(values);
        props.goToNextStep();
      }}
    >
      {(formProps) => (
        <form onSubmit={formProps.handleSubmit}>
          <SectionHeader
            title='Create Patient'
            subtitle='Manually create patient'
            renderLeftPart={() => (
              <div className={classes.prevNextWrapper}>
                <Button
                  title='Next'
                  id='next-button'
                  classes={{ component: classes.prevNextButton }}
                  applyBorderRadius
                  compactMode
                  buttonColor={theme.palette.primary.color2}
                  type='submit'
                />
              </div>
            )}
          />
          <Grid container classes={{ container: classes.content }}>
            <Grid item xs={12}>
              <Grid container spacing={40}>
                <Grid item xs={6}>
                  <FormControl fullWidth margin='dense'>
                    <FormikTextField label={'Title'} name='title' />
                  </FormControl>
                  <FormControl fullWidth margin='dense'>
                    <FormikTextField label={'Given Name'} name='firstName' />
                  </FormControl>
                  {!formProps.values.oneName && (
                    <FormControl fullWidth margin='dense'>
                      <FormikTextField label={'Family Name'} name='lastName' />
                    </FormControl>
                  )}
                  <FormControl fullWidth margin='dense'>
                    <FormikDatePicker
                      label={'Date of Birth'}
                      name='dateOfBirth'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='dense'>
                    <FormikDropdown
                      label={'Gender'}
                      name='gender'
                      items={[
                        { label: 'Male', value: 'MALE' },
                        { label: 'Female', value: 'FEMALE' },
                        { label: 'InterSex', value: 'INTERSEX' },
                        { label: 'Unspecified', value: 'UNSPECIFIED' },
                      ]}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin='dense'>
                    <FormikCheckbox
                      label='Single Name'
                      name='oneName'
                      classes={{
                        component: classes.checkbox,
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth margin='dense'>
                    {formProps.values.names.length > 0 && (
                      <Grid container spacing={16}>
                        {formProps.values.names.map((nameObj, index) => {
                          return (
                            <React.Fragment key={index}>
                              <Grid item xs={7}>
                                <FormikTextField
                                  label={`Given Name ${index + 1}`}
                                  name={`names.${index}.name`}
                                  autoComplete={'off'}
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <Checkbox
                                  label='Primary'
                                  name={`names.${index}.isPrimary`}
                                  classes={{
                                    component: classes.checkbox,
                                  }}
                                  value={nameObj.isPrimary}
                                  onChange={() => {
                                    const names = [...formProps.values.names];
                                    const prevPrimaryName = find(names, {
                                      isPrimary: true,
                                    });
                                    if (prevPrimaryName) {
                                      prevPrimaryName.isPrimary = false;
                                    }
                                    names[index].isPrimary = true;
                                    formProps.setFieldValue('names', names);
                                  }}
                                />
                              </Grid>
                              {formProps.values.names.length > 0 && (
                                <Grid item xs={1}>
                                  <Button
                                    title={'X'}
                                    applyBorderRadius
                                    compactMode
                                    buttonColor={theme.palette.secondary.color2}
                                    classes={{
                                      component: classes.removeNameButton,
                                    }}
                                    onClick={() => {
                                      const names = [...formProps.values.names];
                                      names.splice(index, 1);
                                      formProps.setFieldValue('names', names);
                                    }}
                                  />
                                </Grid>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </Grid>
                    )}
                  </FormControl>
                  <FormControl margin='dense'>
                    <Button
                      title={'Add Another Name'}
                      id='toggle-veteran-details'
                      applyBorderRadius
                      compactMode
                      buttonColor={theme.palette.primary.color2}
                      onClick={() => {
                        const names = [...formProps.values.names];
                        formProps.setFieldValue('names', [
                          ...names,
                          { name: '', isPrimary: false },
                        ]);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={40}>
                <Grid item xs={6}>
                  <FormControl fullWidth margin='dense'>
                    <FieldLabel label='Current Address' />
                    <AddressForm
                      keys={{
                        street: 'currentAddress.street',
                        city: 'currentAddress.city',
                        state: 'currentAddress.state',
                        country: 'currentAddress.country',
                        postcode: 'currentAddress.postCode',
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin='dense'>
                    <FieldLabel label='Birth Address' />
                    <AddressForm
                      keys={{
                        street: 'birthAddress.street',
                        city: 'birthAddress.city',
                        state: 'birthAddress.state',
                        country: 'birthAddress.country',
                        postcode: 'birthAddress.postCode',
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default compose<Props, Props>(
  withStyles(styles),
  connect(
    (state: IReduxState) => ({
      manualPatientData:
        idx(state, (x) => x.sessionData.newPatient.manualPatient) || {},
    }),
    { setManualStep1 },
  ),
)(ManualStepOne);
