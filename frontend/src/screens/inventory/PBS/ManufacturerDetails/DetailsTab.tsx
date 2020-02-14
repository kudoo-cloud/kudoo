import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import get from 'lodash/get';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  Button,
  AddressForm,
  SectionHeader,
  PhoneNumberField,
  URL,
  withStylesProps,
  helpers as utils,
  TextField,
} from '@kudoo/components';
import styles from './styles';

interface IProps {
  actions?: any;
  data?: any;
  onSubmit?: () => any;
  classes?: any;
  theme?: any;
}

class DetailsTab extends React.Component<IProps, any> {
  public render() {
    const { classes, data } = this.props;
    const { street, city, stateAddress, postCode, phone } = data;
    return (
      <div className={classes.section}>
        <SectionHeader title='Manufacturer Details' />
        <div className={classes.detailsForm}>
          <Grid container spacing={40}>
            <Grid item xs={12} sm={6}>
              <SectionHeader
                title='Address'
                classes={{ component: classes.formHeading }}
              />
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    isReadOnly
                    label='Street Address'
                    value={street}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField disabled isReadOnly label='City' value={city} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled
                    isReadOnly
                    label='State'
                    value={stateAddress}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    isReadOnly
                    label='PostCode'
                    value={postCode}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <SectionHeader
                title='Contact Details'
                classes={{ component: classes.formHeading }}
              />
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <TextField disabled isReadOnly label='Phone' value={phone} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DetailsTab);
