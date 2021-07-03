import {
  AddressForm,
  Button,
  Checkbox,
  ErrorBoundary,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
// import idx from 'idx';
import clone from 'lodash/clone';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions: Record<string, any>;
  initialData: Record<string, any>;
  updateCompany: Function;
  company: any;
  classes: any;
  theme: any;
};
type State = {};

class DAOGeneralLocation extends Component<Props, State> {
  static defaultProps = {
    company: {},
    updateCompany: () => ({}),
  };

  addressForm: any;
  state = {};

  _isSameAsPrimary = () => {
    const { company } = this.props;
    if (get(company, 'data.addresses', []).length === 1) {
      return true;
    } else if (get(company, 'data.addresses', []).length === 2) {
      const address1 = get(company, 'data.addresses[0]', {});
      const address2 = get(company, 'data.addresses[1]', {});
      return isEqual(address1, address2);
    }
    return false;
  };

  _submitForm = async (values, actions) => {
    try {
      const primaryAddressId = get(values, 'primary.id');
      const primaryAddress = {
        street: get(values, 'primary.street'),
        city: get(values, 'primary.city'),
        state: get(values, 'primary.state'),
        country: get(values, 'primary.country'),
        postCode: get(values, 'primary.postCode'),
      };

      const legalAddressId = get(values, 'legal.id');
      const legalAddress = {
        street: get(values, 'legal.street'),
        city: get(values, 'legal.city'),
        state: get(values, 'legal.state'),
        country: get(values, 'legal.country'),
        postCode: get(values, 'legal.postCode'),
      };

      let addresses: any;
      // if primary address and legal address is same
      if (values.sameAsPrimary) {
        // check whether primary address already exist, if it exists then update that address
        // or else create new address
        if (primaryAddressId) {
          // address is already exist , we will need to update it
          addresses.update = addresses.update || [];
          addresses.update.push({
            where: {
              id: primaryAddressId,
            },
            data: primaryAddress,
          });
        } else {
          // create new address
          addresses = {
            create: [primaryAddress],
          };
        }

        // check whether legal address already exist
        // if it exists then delete that address as now both address will be same
        if (legalAddressId) {
          addresses.delete = addresses.delete || [];
          addresses.delete.push({
            id: legalAddressId,
          });
        }
      } else {
        if (primaryAddressId) {
          // primary address already exist , we will need to update it
          addresses.update = addresses.update || [];
          addresses.update.push({
            where: {
              id: primaryAddressId,
            },
            data: primaryAddress,
          });
        } else {
          // create new address
          addresses.create = addresses.create || [];
          addresses.create.push(primaryAddress);
        }

        if (legalAddressId) {
          // legal address already exist , we will need to update it
          addresses.update = addresses.update || [];
          addresses.update.push({
            where: {
              id: legalAddressId,
            },
            data: legalAddress,
          });
        } else {
          // create new address
          addresses.create = addresses.create || [];
          addresses.create.push(legalAddress);
        }
      }

      const res = await this.props.updateCompany({
        where: {
          id: get(this.props, 'match.params.companyId'),
        },
        data: {
          addresses,
        },
      });
      actions.setSubmitting(false);
      if (res.success) {
        showToast(null, 'Address Updated');
        this.props.company.refetch();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      actions.setSubmitting(false);
      showToast(e.toString());
    }
  };

  _renderFormFields(formProps) {
    const { classes, theme } = this.props;
    const { dirty } = formProps;
    const sameAsPrimary = formProps.values.sameAsPrimary;
    return (
      <form className={classes.form} onSubmit={formProps.handleSubmit}>
        <div className={classes.formsWrapper}>
          <Grid
            container
            spacing={0}
            classes={{ container: classes.formFields }}
          >
            <Grid item xs={12} sm={6} classes={{ item: classes.formSection }}>
              <div className={classes.sectionHeadingWrapper}>
                <SectionHeader
                  title='Primary Address'
                  classes={{ component: classes.sectionHeading }}
                />
              </div>
              <AddressForm
                keys={{
                  street: 'primary.street',
                  city: 'primary.city',
                  state: 'primary.state',
                  country: 'primary.country',
                  postcode: 'primary.postCode',
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={0}
            classes={{ container: classes.formFields }}
          >
            <Grid item xs={12} sm={6} classes={{ item: classes.formSection }}>
              <div className={classes.sectionHeadingWrapper}>
                <SectionHeader
                  title='Legal Address'
                  classes={{ component: classes.sectionHeading }}
                />
                <Checkbox
                  label={'Same as above'}
                  value={sameAsPrimary}
                  onChange={(checked) => {
                    formProps.setFieldValue('sameAsPrimary', checked);
                  }}
                />
              </div>
              {!sameAsPrimary && (
                <AddressForm
                  keys={{
                    street: 'legal.street',
                    city: 'legal.city',
                    state: 'legal.state',
                    country: 'legal.country',
                    postcode: 'legal.postCode',
                  }}
                />
              )}
            </Grid>
          </Grid>
        </div>

        {dirty && (
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Button
                title={'Update'}
                buttonColor={theme.palette.primary.color2}
                type='submit'
                loading={formProps.isSubmitting}
              />
            </Grid>
          </Grid>
        )}
      </form>
    );
  }

  _renderAddressForm() {
    const { company } = this.props;
    const isSameAsPrimary = this._isSameAsPrimary();
    const address1 = get(company, 'data.addresses[0]', {});
    let address2;
    if (isSameAsPrimary) {
      address2 = clone(address1);
      address2.id = '';
    } else {
      address2 = get(company, 'data.addresses[1]', {});
    }
    return (
      <Formik
        enableReinitialize
        initialValues={{
          primary: {
            street: get(address1, 'street', ''),
            city: get(address1, 'city', ''),
            state: get(address1, 'state', ''),
            country: get(address1, 'country', ''),
            postCode: get(address1, 'postCode', ''),
            id: get(address1, 'id', ''),
          },
          legal: {
            street: get(address2, 'street', ''),
            city: get(address2, 'city', ''),
            state: get(address2, 'state', ''),
            country: get(address2, 'country', ''),
            postCode: get(address2, 'postCode', ''),
            id: get(address2, 'id', ''),
          },
          sameAsPrimary: isSameAsPrimary,
        }}
        validationSchema={Yup.object({
          primary: Yup.object({
            street: Yup.string().required('street is required'),
            city: Yup.string().required('city is required'),
            state: Yup.string().required('state is required'),
            country: Yup.string().required('country is required'),
            postCode: Yup.string().required('postcode is required'),
          }),
          sameAsPrimary: Yup.boolean(),
          legal: Yup.mixed().when('sameAsPrimary', (sameAsPrimary) => {
            if (sameAsPrimary) {
              return Yup.object();
            }
            return Yup.object({
              street: Yup.string().required('street is required'),
              city: Yup.string().required('city is required'),
              state: Yup.string().required('state is required'),
              country: Yup.string().required('country is required'),
              postCode: Yup.string().required('postcode is required'),
            });
          }),
        })}
        onSubmit={this._submitForm}
      >
        {this._renderFormFields.bind(this)}
      </Formik>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>{this._renderAddressForm()}</div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
)(DAOGeneralLocation);
