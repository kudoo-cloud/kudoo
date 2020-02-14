import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import clone from 'lodash/clone';
import { Formik } from 'formik';
import * as Yup from 'yup';
import idx from 'idx';
import isEqual from 'lodash/isEqual';
import {
  withStyles,
  ErrorBoundary,
  PhoneNumberField,
  TextField,
  Checkbox,
  SectionHeader,
  Button,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import { withCompany, withUpdateCompany } from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import { any } from 'prop-types';
import styles from './styles';

type Props = {
  actions: any;
  company: any;
  updateCompany: Function;
  classes: any;
  theme: any;
};
type State = {};

class CompaniesGeneralContact extends Component<Props, State> {
  contactForm: any;
  state: any;

  _isSameAsCompanyContact = () => {
    const { company } = this.props;
    if (get(company, 'data.contacts', []).length === 1) {
      return true;
    } else if (get(company, 'data.contacts', []).length === 2) {
      const contact1 = get(company, 'data.contacts[0]', {});
      const contact2 = get(company, 'data.contacts[1]', {});
      return isEqual(contact1, contact2);
    }
    return false;
  };

  _submitForm = async (values, actions) => {
    try {
      const companyContactData = get(values, 'companyContact') || {};
      const companyContact = {
        name: get(companyContactData, 'contact_name'),
        surname: get(companyContactData, 'contact_surname'),
        email: get(companyContactData, 'email'),
        mobileCode: get(companyContactData, 'mobile.countryCode'),
        mobileNumber: get(companyContactData, 'mobile.number'),
        landlineCode: get(companyContactData, 'landline.countryCode'),
        landlineNumber: get(companyContactData, 'landline.number'),
      };

      const supportContactData = get(values, 'supportContact') || {};
      const supportContact = {
        name: get(supportContactData, 'contact_name'),
        surname: get(supportContactData, 'contact_surname'),
        email: get(supportContactData, 'email'),
        mobileCode: get(supportContactData, 'mobile.countryCode'),
        mobileNumber: get(supportContactData, 'mobile.number'),
        landlineCode: get(supportContactData, 'landline.countryCode'),
        landlineNumber: get(supportContactData, 'landline.number'),
      };

      let contacts: any;
      if (values.sameAsCompanyContact) {
        // if company contact and support contact is same

        // check whether company contact already exist, if it exists then update that contact
        // or else create new contact
        if (companyContactData.id) {
          contacts = contacts || {};
          // contact is already exist , we will need to update it
          contacts.update = contacts.update || [];
          contacts.update.push({
            where: {
              id: companyContactData.id,
            },
            data: companyContact,
          });
        } else {
          // create new contact
          contacts = {
            create: [companyContact],
          };
        }

        // check whether support contact already exist
        // if it exists then delete that contact as now both contact will be same
        if (supportContactData.id) {
          contacts.delete = contacts.delete || [];
          contacts.delete.push({
            id: supportContactData.id,
          });
        }
      } else {
        contacts = contacts || {};
        if (companyContactData.id) {
          // contact is already exist , we will need to update it
          contacts.update = contacts.update || [];
          contacts.update.push({
            where: {
              id: companyContactData.id,
            },
            data: companyContact,
          });
        } else {
          // create new contact
          contacts.create = contacts.create || [];
          contacts.create.push(companyContact);
        }

        if (supportContactData.id) {
          // support contact is already exist , we will need to update it
          contacts.update = contacts.update || [];
          contacts.update.push({
            where: {
              id: supportContactData.id,
            },
            data: supportContact,
          });
        } else {
          // create new contact
          contacts.create = contacts.create || [];
          contacts.create.push(supportContact);
        }
      }

      const res = await this.props.updateCompany({
        where: {
          id: get(this.props, 'match.params.companyId'),
        },
        data: {
          contacts,
        },
      });
      actions.setSubmitting(false);
      if (res.success) {
        showToast(null, 'Contact Updated');
        this.props.company.refetch();
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      actions.setSubmitting(false);
      showToast(e.toString());
    }
  };

  _renderContactFormFields(formProps) {
    const {
      values,
      handleSubmit,
      handleChange,
      handleBlur,
      touched,
      errors,
      setFieldValue,
      isSubmitting,
      dirty,
    } = formProps;
    console.log(formProps);
    const { classes, theme } = this.props;
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.formsWrapper}>
          <Grid
            container
            spacing={0}
            classes={{ container: classes.formFields }}>
            <Grid item xs={12} sm={6} classes={{ item: classes.formSection }}>
              <div className={classes.sectionHeadingWrapper}>
                <SectionHeader
                  title='Company Contact Details'
                  classes={{ component: classes.sectionHeading }}
                />
              </div>
              <TextField
                name='companyContact.contact_name'
                id='companyContact.contact_name'
                label='Contact Name'
                placeholder={'Contact Name'}
                value={values.companyContact.contact_name}
                showClearIcon={false}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  get(touched, 'companyContact.contact_name') &&
                  get(errors, 'companyContact.contact_name')
                }
              />
              <TextField
                name='companyContact.contact_surname'
                id='companyContact.contact_surname'
                label='Contact Surname'
                placeholder={'Contact Surname'}
                value={values.companyContact.contact_surname}
                showClearIcon={false}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  get(touched, 'companyContact.contact_surname') &&
                  get(errors, 'companyContact.contact_surname')
                }
              />
              <PhoneNumberField
                areaCodeFieldName='companyContact.mobile.countryCode'
                phoneNumberFieldName='companyContact.mobile.number'
                areaCodeLabel='Area Code'
                phoneNumberLabel={'Mobile Number'}
                showClearIcon={false}
              />
              <PhoneNumberField
                areaCodeFieldName='companyContact.landline.countryCode'
                phoneNumberFieldName='companyContact.landline.number'
                areaCodeLabel='Area Code'
                phoneNumberLabel={'Mobile Number'}
                showClearIcon={false}
              />
              <TextField
                name='companyContact.email'
                id='companyContact.email'
                label='Email'
                placeholder={'Email'}
                value={values.companyContact.email}
                showClearIcon={false}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  get(touched, 'companyContact.email') &&
                  get(errors, 'companyContact.email')
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={0}
            classes={{ container: classes.formFields }}>
            <Grid item xs={12} sm={6} classes={{ item: classes.formSection }}>
              <div className={classes.sectionHeadingWrapper}>
                <SectionHeader
                  title='Support Contact Details'
                  classes={{ component: classes.sectionHeading }}
                />
                <Checkbox
                  label='Same as above'
                  value={values.sameAsCompanyContact}
                  onChange={checked => {
                    setFieldValue('sameAsCompanyContact', checked);
                  }}
                />
              </div>
              {!values.sameAsCompanyContact && (
                <div>
                  <TextField
                    name='supportContact.contact_name'
                    id='supportContact.contact_name'
                    label='Contact Name'
                    placeholder={'Contact Name'}
                    value={values.supportContact.contact_name}
                    showClearIcon={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      get(touched, 'supportContact.contact_name') &&
                      get(errors, 'supportContact.contact_name')
                    }
                  />
                  <TextField
                    name='supportContact.contact_surname'
                    id='supportContact.contact_surname'
                    label='Contact Surname'
                    placeholder={'Contact Surname'}
                    value={values.supportContact.contact_surname}
                    showClearIcon={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      get(touched, 'supportContact.contact_surname') &&
                      get(errors, 'supportContact.contact_surname')
                    }
                  />
                  <PhoneNumberField
                    areaCodeFieldName='supportContact.mobile.countryCode'
                    phoneNumberFieldName='supportContact.mobile.number'
                    areaCodeLabel='Area Code'
                    phoneNumberLabel={'Mobile Number'}
                    showClearIcon={false}
                  />
                  <PhoneNumberField
                    areaCodeFieldName='supportContact.landline.countryCode'
                    phoneNumberFieldName='supportContact.landline.number'
                    areaCodeLabel='Area Code'
                    phoneNumberLabel={'Mobile Number'}
                    showClearIcon={false}
                  />
                  <TextField
                    name='supportContact.email'
                    id='supportContact.email'
                    label='Email'
                    placeholder={'Email'}
                    value={values.supportContact.email}
                    showClearIcon={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      get(touched, 'supportContact.email') &&
                      get(errors, 'supportContact.email')
                    }
                  />
                </div>
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
                loading={isSubmitting}
              />
            </Grid>
          </Grid>
        )}
      </form>
    );
  }

  _renderContactForm() {
    const isSameAsCompanyContact = this._isSameAsCompanyContact();
    const contact1 = get(this.props.company, 'data.contacts[0]', {});
    let contact2;
    if (isSameAsCompanyContact) {
      contact2 = clone(contact1);
      contact2.id = '';
    } else {
      contact2 = get(this.props.company, 'data.contacts[1]', {});
    }
    return (
      <Formik
        enableReinitialize
        initialValues={{
          companyContact: {
            contact_name: get(contact1, 'name', ''),
            contact_surname: get(contact1, 'surname', ''),
            mobile: {
              countryCode: String(get(contact1, 'mobileCode', '')),
              number: String(get(contact1, 'mobileNumber', '')),
            },
            landline: {
              countryCode: String(get(contact1, 'landlineCode', '')),
              number: String(get(contact1, 'landlineNumber', '')),
            },
            email: get(contact1, 'email', ''),
            id: get(contact1, 'id', ''),
          },
          sameAsCompanyContact: isSameAsCompanyContact,
          supportContact: {
            contact_name: get(contact2, 'name', ''),
            contact_surname: get(contact2, 'surname', ''),
            mobile: {
              countryCode: String(get(contact2, 'mobileCode', '')),
              number: String(get(contact2, 'mobileNumber', '')),
            },
            landline: {
              countryCode: String(get(contact2, 'landlineCode', '')),
              number: String(get(contact2, 'landlineNumber', '')),
            },
            email: get(contact2, 'email', ''),
            id: get(contact2, 'id', ''),
          },
        }}
        validationSchema={Yup.object({
          companyContact: Yup.object({
            contact_name: Yup.string().required('Name is required'),
            contact_surname: Yup.string().required('Surname is required'),
            mobile: Yup.object({
              countryCode: Yup.string(),
              number: Yup.string().required('Number is required'),
            }),
            landline: Yup.object({
              countryCode: Yup.string(),
              number: Yup.string().required('Number is required'),
            }),
            email: Yup.string()
              .required('Email is required')
              .email('Email is not valid'),
          }),
          sameAsCompanyContact: Yup.boolean(),
          supportContact: Yup.mixed().when(
            'sameAsCompanyContact',
            sameAsCompanyContact => {
              if (sameAsCompanyContact) {
                return Yup.object();
              }
              return Yup.object({
                contact_name: Yup.string().required('Name is required'),
                contact_surname: Yup.string().required('Surname is required'),
                mobile: Yup.object({
                  countryCode: Yup.string(),
                  number: Yup.string().required('Number is required'),
                }),
                landline: Yup.object({
                  countryCode: Yup.string(),
                  number: Yup.string().required('Number is required'),
                }),
                email: Yup.string()
                  .required('Email is required')
                  .email('Email is not valid'),
              });
            }
          ),
        })}
        onSubmit={this._submitForm}>
        {this._renderContactFormFields.bind(this)}
      </Formik>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>{this._renderContactForm()}</div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect(state => ({
    profile: state.profile,
  })),
  withCompany(props => ({
    id: idx(props, _ => _.match.params.companyId),
  })),
  withUpdateCompany()
)(CompaniesGeneralContact);
