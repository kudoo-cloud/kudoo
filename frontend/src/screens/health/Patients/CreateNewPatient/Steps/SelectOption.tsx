import {
  Button,
  RadioButton,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import idx from 'idx';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { updatePatientCreationOption } from 'src/store/actions/createNewPatient';
import { IReduxState } from 'src/store/reducers';
import { PatientCreationOption } from 'src/store/types/createNewPatient';
import styles, { StyleKeys } from '../styles';

type Props = IComponentProps<StyleKeys> & {
  updatePatientCreationOption?: Function;
  patientCreationOption?: PatientCreationOption;
  goToNextStep: Function;
};

const SelectOptionStep: React.FC<Props> = (props) => {
  const {
    classes,
    theme,
    patientCreationOption,
    goToNextStep,
    updatePatientCreationOption,
  } = props;

  const onChange = (value) => () => {
    updatePatientCreationOption(value);
  };

  return (
    <div>
      <SectionHeader
        title='Create a new patient'
        subtitle='How would you like to create patient?'
        renderLeftPart={() => (
          <div className={classes.prevNextWrapper}>
            <Button
              title='Next'
              id='next-button'
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              buttonColor={theme.palette.primary.color2}
              onClick={goToNextStep}
            />
          </div>
        )}
      />
      <Grid container classes={{ container: classes.content }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin='dense'>
            <RadioButton
              label={'Bulk upload'}
              name='patientCreationOption'
              value={patientCreationOption === 'BULK_UPLOAD'}
              onChange={onChange('BULK_UPLOAD')}
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <RadioButton
              label={'Search for individual patient'}
              name='patientCreationOption'
              value={patientCreationOption === 'SEARCH'}
              onChange={onChange('SEARCH')}
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <RadioButton
              label={'Manually load patient details'}
              name='patientCreationOption'
              value={patientCreationOption === 'MANUAL'}
              onChange={onChange('MANUAL')}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default compose<Props, Props>(
  withStyles(styles),
  connect(
    (state: IReduxState) => ({
      patientCreationOption: idx(
        state,
        (x) => x.sessionData.newPatient.patientCreationOption,
      ),
    }),
    { updatePatientCreationOption },
  ),
)(SelectOptionStep);
