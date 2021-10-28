import {
  Button,
  FormikDropdown,
  FormikTextField,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { resetManualData } from 'src/store/actions/createNewPatient';
import { IReduxState } from 'src/store/reducers';
import styles, { StyleKeys } from '../styles';

type Props = IRouteProps<StyleKeys> & {
  goToNextStep: Function;
  createPatient?: Function;
  manualPatientData?: any;
  resetManualData?: Function;
};

const ManualStepTwo: React.FC<Props> = (props) => {
  const { classes, theme, manualPatientData, resetManualData, history } = props;
  const [showVeteranDetails, setShowVeteranDetails] = useState(false);
  console.log(props);

  const validateMedicareNumber = (val: string) => {
    const newMedicareNo = (val || '').replace(/[^\d]/g, '');
    const regex = new RegExp('^([2-6]\\d{7})(\\d)');
    const matches = newMedicareNo.match(regex);
    if (matches) {
      const eightDigit = matches[1];
      const checkDigit = matches[2];
      const weights = [1, 3, 7, 9, 1, 3, 7, 9];
      const total = weights.reduce((total, currVal, index) => {
        return total + Number(eightDigit[index]) * Number(currVal);
      }, 0);
      return total % 10 === Number(checkDigit);
    } else {
      return false;
    }
  };

  return (
    <Formik
      initialValues={{
        aboriginalStatus: '',
        healthCareIdentifier: '',
        medicareNumber: '',
        dvaCardType: '',
        DVA: '',
      }}
      validationSchema={Yup.object().shape({
        medicareNumber: Yup.string()
          .required('Required')
          .test(
            'validate-medicare-number',
            'Invalid Medicare Number',
            validateMedicareNumber,
          ),
      })}
      onSubmit={async (values) => {
        const {
          currentAddress,
          birthAddress,
          names = [],
          ...rest
        } = manualPatientData;
        try {
          await props.createPatient({
            data: {
              ...rest,
              address: {
                create: currentAddress,
              },
              birthAddress: {
                create: birthAddress,
              },
              aboriginalStatus: values.aboriginalStatus,
              healthcareConcession: values.healthCareIdentifier,
              medicareNumber: values.medicareNumber,
              dvaCardType: values.dvaCardType,
              DVA: values.DVA,
              names:
                names.length > 0
                  ? {
                      create: names,
                    }
                  : undefined,
            },
          });
          resetManualData();
          showToast(null, 'Patient created successfully');
          history.push(URL.PATIENTS());
        } catch (e) {
          showToast(e.toString());
        }
      }}
    >
      {(formProps) => (
        <form onSubmit={formProps.handleSubmit}>
          <SectionHeader
            title='Step 2'
            subtitle=''
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
                    <FormikDropdown
                      label={'Aboriginal Status'}
                      name='aboriginalStatus'
                      items={[
                        {
                          label: 'ABORIGINAL_NOT_TORRES',
                          value: 'ABORIGINAL_NOT_TORRES',
                        },
                        {
                          label: 'TORRES_NOT_ABORIGINAL',
                          value: 'TORRES_NOT_ABORIGINAL',
                        },
                        { label: 'BOTH', value: 'BOTH' },
                        { label: 'NEITHER', value: 'NEITHER' },
                        { label: 'NOT_STATED', value: 'NOT_STATED' },
                      ]}
                    />
                  </FormControl>
                  <FormControl fullWidth margin='dense'>
                    <FormikTextField
                      label={'Individual HealthCare Identifier'}
                      name='healthCareIdentifier'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='dense'>
                    <FormikTextField
                      label={'Medicare Number'}
                      name='medicareNumber'
                    />
                  </FormControl>
                  {showVeteranDetails && (
                    <>
                      <FormControl fullWidth margin='dense'>
                        <FormikTextField
                          label={'Veteran Card Type'}
                          name='dvaCardType'
                        />
                      </FormControl>
                      <FormControl fullWidth margin='dense'>
                        <FormikTextField label={'Veteran Number'} name='DVA' />
                      </FormControl>
                    </>
                  )}
                  <FormControl margin='dense'>
                    <Button
                      title={
                        !showVeteranDetails
                          ? 'Add Veteran Details'
                          : 'Remove Veteran Details'
                      }
                      id='toggle-veteran-details'
                      applyBorderRadius
                      compactMode
                      buttonColor={
                        !showVeteranDetails
                          ? theme.palette.primary.color2
                          : theme.palette.secondary.color2
                      }
                      onClick={() => {
                        setShowVeteranDetails((val) => !val);
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

ManualStepTwo.defaultProps = {
  createPatient: () => ({}),
};

export default compose<Props, Props>(
  withStyles(styles),
  // withCreatePatient(),
  withRouter,
  connect(
    (state: IReduxState) => ({
      manualPatientData:
        idx(state, (x) => x.sessionData.newPatient.manualPatient) || {},
    }),
    { resetManualData },
  ),
)(ManualStepTwo);
