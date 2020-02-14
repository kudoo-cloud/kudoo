import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import {
  Button,
  SectionHeader,
  FormikTextField,
  withStyles,
} from '@kudoo/components';
import { Formik } from 'formik';
import styles, { StyleKeys } from '../styles';

type Props = IComponentProps<StyleKeys> & {
  goToNextStep: Function;
};

const PatientSearch: React.FC<Props> = props => {
  const { classes, theme } = props;
  return (
    <Formik
      initialValues={{
        aboriginalStatus: '',
        healthCareIdentifier: '',
        medicareNumber: '',
      }}
      onSubmit={values => {
        console.log(values);
      }}>
      {formProps => (
        <form onSubmit={formProps.handleSubmit}>
          <SectionHeader
            title='Search patients'
            subtitle=''
            renderLeftPart={() => (
              <div className={classes.prevNextWrapper}>
                <Button
                  title='Search Patients'
                  id='search-button'
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin='dense'>
                <FormikTextField
                  label={'Aboriginal Status'}
                  name='aboriginalStatus'
                />
              </FormControl>
              <FormControl fullWidth margin='dense'>
                <FormikTextField
                  label={'Individual Healthcare Identifier'}
                  name='healthCareIdentifier'
                />
              </FormControl>
              <FormControl fullWidth margin='dense'>
                <FormikTextField
                  label={'Medicare Number'}
                  name='medicareNumber'
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default withStyles(styles)(PatientSearch);
