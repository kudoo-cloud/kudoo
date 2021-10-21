import {
  Button,
  Checkbox,
  ErrorBoundary,
  PhoneNumberField,
  SectionHeader,
  TextField,
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
  actions: any;
  dao: any;
  updateDao: Function;
  classes: any;
  theme: any;
};
type State = {};

class DAOGeneralContact extends Component<Props, State> {
  static defaultProps = {
    dao: {},
    updateDao: () => ({}),
  };

  contactForm: any;
  state: any;

  _isSameAsDAOContact = () => {
    const { dao } = this.props;
    if (get(dao, 'data.contacts', []).length === 1) {
      return true;
    } else if (get(dao, 'data.contacts', []).length === 2) {
      const contact1 = get(dao, 'data.contacts[0]', {});
      const contact2 = get(dao, 'data.contacts[1]', {});
      return isEqual(contact1, contact2);
    }
    return false;
  };

  _submitForm = async (values, actions) => {
    try {
      const daoContactData = get(values, 'daoContact') || {};
      const daoContact = {
        name: get(daoContactData, 'contact_name'),
        surname: get(daoContactData, 'contact_surname'),
        email: get(daoContactData, 'email'),
        mobileCode: get(daoContactData, 'mobile.countryCode'),
        mobileNumber: get(daoContactData, 'mobile.number'),
        landlineCode: get(daoContactData, 'landline.countryCode'),
        landlineNumber: get(daoContactData, 'landline.number'),
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
      if (values.sameAsDAOContact) {
        // if dao contact and support contact is same

        // check whether dao contact already exist, if it exists then update that contact
        // or else create new contact
        if (daoContactData.id) {
          contacts = contacts || {};
          // contact is already exist , we will need to update it
          contacts.update = contacts.update || [];
          contacts.update.push({
            where: {
              id: daoContactData.id,
            },
            data: daoContact,
          });
        } else {
          // create new contact
          contacts = {
            create: [daoContact],
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
        if (daoContactData.id) {
          // contact is already exist , we will need to update it
          contacts.update = contacts.update || [];
          contacts.update.push({
            where: {
              id: daoContactData.id,
            },
            data: daoContact,
          });
        } else {
          // create new contact
          contacts.create = contacts.create || [];
          contacts.create.push(daoContact);
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

      const res = await this.props.updateDao({
        where: {
          id: get(this.props, 'match.params.daoId'),
        },
        data: {
          contacts,
        },
      });
      actions.setSubmitting(false);
      if (res.success) {
        showToast(null, 'Contact Updated');
        this.props.dao.refetch();
      } else {
        res.error.map((err) => showToast(err));
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
            classes={{ container: classes.formFields }}
          >
            <Grid item xs={12} sm={6} classes={{ item: classes.formSection }}>
              <div className={classes.sectionHeadingWrapper}>
                <SectionHeader
                  title='DAO Contact Details'
                  classes={{ component: classes.sectionHeading }}
                />
              </div>
              <TextField
                name='daoContact.contact_name'
                id='daoContact.contact_name'
                label='Contact Name'
                placeholder={'Contact Name'}
                value={values.daoContact.contact_name}
                showClearIcon={false}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  get(touched, 'daoContact.contact_name') &&
                  get(errors, 'daoContact.contact_name')
                }
              />
              <TextField
                name='daoContact.contact_surname'
                id='daoContact.contact_surname'
                label='Contact Surname'
                placeholder={'Contact Surname'}
                value={values.daoContact.contact_surname}
                showClearIcon={false}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  get(touched, 'daoContact.contact_surname') &&
                  get(errors, 'daoContact.contact_surname')
                }
              />
              <PhoneNumberField
                areaCodeFieldName='daoContact.mobile.countryCode'
                phoneNumberFieldName='daoContact.mobile.number'
                areaCodeLabel='Area Code'
                phoneNumberLabel={'Mobile Number'}
                showClearIcon={false}
              />
              <PhoneNumberField
                areaCodeFieldName='daoContact.landline.countryCode'
                phoneNumberFieldName='daoContact.landline.number'
                areaCodeLabel='Area Code'
                phoneNumberLabel={'Mobile Number'}
                showClearIcon={false}
              />
              <TextField
                name='daoContact.email'
                id='daoContact.email'
                label='Email'
                placeholder={'Email'}
                value={values.daoContact.email}
                showClearIcon={false}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  get(touched, 'daoContact.email') &&
                  get(errors, 'daoContact.email')
                }
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
                  title='Support Contact Details'
                  classes={{ component: classes.sectionHeading }}
                />
                <Checkbox
                  label='Same as above'
                  value={values.sameAsDAOContact}
                  onChange={(checked) => {
                    setFieldValue('sameAsDAOContact', checked);
                  }}
                />
              </div>
              {!values.sameAsDAOContact && (
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
    const isSameAsDAOContact = this._isSameAsDAOContact();
    const contact1 = get(this.props.dao, 'data.contacts[0]', {});
    let contact2;
    if (isSameAsDAOContact) {
      contact2 = clone(contact1);
      contact2.id = '';
    } else {
      contact2 = get(this.props.dao, 'data.contacts[1]', {});
    }
    return (
      <Formik
        enableReinitialize
        initialValues={{
          daoContact: {
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
          sameAsDAOContact: isSameAsDAOContact,
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
          daoContact: Yup.object({
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
          sameAsDAOContact: Yup.boolean(),
          supportContact: Yup.mixed().when(
            'sameAsDAOContact',
            (sameAsDAOContact) => {
              if (sameAsDAOContact) {
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
            },
          ),
        })}
        onSubmit={this._submitForm}
      >
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
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withDAO((props) => ({
  //   id: idx(props, (_) => _.match.params.daoId),
  // })),
  // withUpdateDAO(),
)(DAOGeneralContact);
