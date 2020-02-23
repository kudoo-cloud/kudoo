import React, { Component, useState } from 'react';
import cx from 'classnames';
import idx from 'idx';
import get from 'lodash/get';
import { withI18n } from '@lingui/react';
import {
  withStyles,
  Tabs,
  Button,
  CustomerForm,
  ToggleButton,
  Modal,
  helpers as utils,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import * as Yup from 'yup';
import { withCustomer, withUpdateCustomer, withInvoices } from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { I18n } from '@lingui/core';
import { IProfileState } from '@client/store/reducers/profile';
import DetailsTab from './DetailsTab';
import InvoicesTab from './InvoicesTab';
import styles, { StyleKeys } from './styles';
import { CustomerObject } from './types';

type Props = IRouteProps<StyleKeys> & {
  customer: {
    refetch: Function;
    data: CustomerObject;
  };
  updateCustomer: Function;
  profile: IProfileState;
  invoices: Record<string, any>;
  i18n: I18n;
};

const CustomerDetails: React.FC<Props> = props => {
  const {
    classes,
    history,
    i18n,
    customer,
    invoices,
    theme,
    updateCustomer,
  } = props;
  const [activeSection, setActiveSection] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const getCustomerDetails = () => {
    const customerData = get(customer, 'data', {});
    const contact = get(customerData, 'contacts[0]') || {};
    const address = get(customerData, 'addresses[0]') || {};
    return {
      id: get(customerData, 'id', ''),
      name: get(customerData, 'name', ''),
      govNumber: String(get(customerData, 'govNumber', '')),
      contact,
      address,
    };
  };

  const getUpdatedAddressContactData = values => {
    const address = get(customer, 'data.addresses[0]') || {};
    const contact = get(customer, 'data.contacts[0]') || {};
    const isContactUpdate = Boolean(contact.id);
    const isAddressUpdate = Boolean(address.id);

    let contacts: any = {
      name: get(values, 'contact_name') || contact.name,
      surname: get(values, 'contact_surname') || contact.surname,
      email: get(values, 'email') || contact.email,
      mobileCode: get(values, 'mobileCode') || contact.mobileCode,
      mobileNumber: get(values, 'mobileNumber') || contact.mobileNumber,
      landlineCode: get(values, 'landlineCode') || contact.landlineCode,
      landlineNumber: get(values, 'landlineNumber') || contact.landlineNumber,
    };

    if (isContactUpdate) {
      contacts = {
        update: [
          {
            where: { id: contact.id },
            data: contacts,
          },
        ],
      };
    } else {
      contacts = {
        create: [contacts],
      };
    }

    let addresses: any = {
      street: get(values, 'street') || address.street,
      city: get(values, 'city') || address.city,
      state: get(values, 'state') || address.state,
      country: get(values, 'country') || address.country,
      postCode: get(values, 'postCode') || address.postCode,
    };
    if (isAddressUpdate) {
      addresses = {
        update: [
          {
            where: { id: address.id },
            data: addresses,
          },
        ],
      };
    } else {
      addresses = {
        create: [addresses],
      };
    }

    return {
      addresses,
      contacts,
    };
  };

  const submitBasicDetails = async values => {
    try {
      const updatedAddressContactData = getUpdatedAddressContactData(values);
      const res = await updateCustomer({
        data: {
          name: values.customer_name,
          govNumber: String(values.govNumber.replace(/ /g, '')),
          ...updatedAddressContactData,
        },
        where: {
          id: idx(customer, _ => _.data.id),
        },
      });
      if (res.success) {
        // refetch data
        customer.refetch();
        showToast(null, 'Customer updated');
        setShowModal(false);
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  const submitAddressContact = async (values, actions) => {
    try {
      const updatedData = getUpdatedAddressContactData(values);
      const res = await updateCustomer({
        data: updatedData,
        where: {
          id: get(customer, 'data.id'),
        },
      });
      if (res.success) {
        showToast(null, 'Customer updated');
        actions.setSubmitting(false);
        customer.refetch();
      } else {
        res.error.map(err => showToast(err));
        actions.setSubmitting(false);
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  const getTotalAmountMade = () => {
    const invoicesRow = get(invoices, 'data', []);
    const totalMade = invoicesRow.reduce((acc, invoice) => {
      if (invoice.status === 'FULLY_PAID') {
        return acc + invoice.total;
      }
      return acc;
    }, 0);
    return totalMade;
  };

  const getTotalOwed = () => {
    const invoicesRow = get(invoices, 'data', []);
    const totalOwed = invoicesRow.reduce((acc, invoice) => {
      if (invoice.status !== 'FULLY_PAID') {
        return acc + invoice.total;
      }
      return acc;
    }, 0);
    return totalOwed;
  };

  const renderSecondaryTabs = () => {
    return (
      <Tabs
        tabs={[
          {
            label: 'All Customers',
            onClick: () => {
              history.push(URL.ACTIVE_CUSTOMERS());
            },
          },
          {
            label: 'Archived',
            onClick: () => {
              history.push(URL.ARCHIVED_CUSTOMERS());
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={false}
      />
    );
  };

  const renderDetailsCards = () => {
    const { name, contact, govNumber } = getCustomerDetails();
    const totalAmountMade = getTotalAmountMade();
    const totalOwed = getTotalOwed();

    return (
      <div className={classes.detailsCardsWrapper}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'green h1')}>
                {name}
              </div>
              <div className={cx(classes.detailCardContent, 'withBG h2')}>
                <div className={classes.keyValue}>
                  {contact.name} {contact.surname}
                </div>
                <div className={classes.keyValue}>
                  {i18n._(`ABN`)} {govNumber}
                </div>
                <div className={classes.keyValue}>{contact.email}</div>
                <div
                  className={classes.editButton}
                  onClick={() => {
                    setShowModal(true);
                  }}>
                  <i className='ion-edit' />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'blue h2')}>
                Status
              </div>
              <div className={cx(classes.detailCardContent, 'h1')}>-</div>
            </div>
          </Grid>
          <Grid item xs={12} sm={3}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'black h2')}>
                Total money made
              </div>
              <div className={cx(classes.detailCardContent, 'h1')}>
                {i18n._('currency-symbol')}
                {totalAmountMade}
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'black h2')}>
                Owed
              </div>
              <div className={cx(classes.detailCardContent, 'h1')}>
                {i18n._('currency-symbol')}
                {totalOwed}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };

  const renderToggleButton = () => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={3}>
          <ToggleButton
            labels={['Details', 'Invoices']}
            selectedIndex={0}
            activeColor={theme.palette.primary.color1}
            onChange={(label, index) => {
              setActiveSection(index);
            }}
          />
        </Grid>
      </Grid>
    );
  };

  const renderDetailsSection = () => {
    const customer = getCustomerDetails();
    return <DetailsTab customer={customer} onSubmit={submitAddressContact} />;
  };

  const renderInvoiceSection = () => {
    return <InvoicesTab invoices={invoices} />;
  };

  const renderEditCompanyDetailsModal = () => {
    const { name, govNumber, contact } = getCustomerDetails();
    return (
      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        classes={{ description: classes.editCompanyModalDescription }}
        title='Edit Customer Details'
        description={
          <Formik
            enableReinitialize
            initialValues={{
              customer_name: name,
              contact_name: contact.name,
              contact_surname: contact.surname,
              govNumber,
              email: contact.email,
            }}
            validationSchema={Yup.object().shape({
              customer_name: Yup.string().required('Name is required'),
              contact_name: Yup.string().required('Contact name is required'),
              contact_surname: Yup.string().required('Surname is required'),
              govNumber: Yup.string().required(i18n._(`ABN`) + ' is required'),
              // .test('is-abn', 'ABN is not valid', utils.validateABN),
              email: Yup.string()
                .required('Email is required')
                .required('Invalid Email'),
            })}
            onSubmit={submitBasicDetails}>
            {formProps => {
              const isDirty = formProps.dirty;
              return (
                <form
                  className={classes.modalForm}
                  onSubmit={formProps.handleSubmit}>
                  <Grid
                    container
                    spacing={0}
                    classes={{ container: classes.formFields }}>
                    <Grid item xs={12} sm={12}>
                      <CustomerForm
                        keys={{
                          customer_name: 'customer_name',
                          contact_name: 'contact_name',
                          contact_surname: 'contact_surname',
                          abn: 'govNumber',
                          email: 'email',
                        }}
                        labels={{
                          customer_name: 'Customer Name',
                          contact_name: 'Contact Name',
                          contact_surname: 'Contact Surname',
                          abn: i18n._(`ABN`),
                          email: 'Email',
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={isDirty ? 6 : 12}>
                      <Button
                        title='Cancel and go back'
                        onClick={() => {
                          setShowModal(false);
                        }}
                        buttonColor={theme.palette.grey['200']}
                        classes={{
                          text: classes.cancelButtonText,
                          component: classes.modalCancelBtn,
                        }}
                      />
                    </Grid>
                    {isDirty && (
                      <Grid item xs={12} sm={6}>
                        <Button
                          title='Save changes'
                          buttonColor={theme.palette.primary.color2}
                          type='submit'
                          classes={{ component: classes.modalSaveBtn }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </form>
              );
            }}
          </Formik>
        }
      />
    );
  };

  return (
    <SelectedCompany
      onChange={() => {
        history.push(URL.CUSTOMERS());
      }}>
      <div className={classes.page}>
        {renderSecondaryTabs()}
        <div className={classes.content}>
          {renderDetailsCards()}
          {renderToggleButton()}
          {activeSection === 0 && renderDetailsSection()}
          {activeSection === 1 && renderInvoiceSection()}
        </div>
        {renderEditCompanyDetailsModal()}
      </div>
    </SelectedCompany>
  );
};

export default compose<Props, Props>(
  withI18n(),
  withStyles(styles),
  connect(state => ({
    profile: state.profile,
  })),
  withUpdateCustomer(),
  withCustomer(props => ({
    id: get(props, 'match.params.id'),
  })),
  withInvoices(props => {
    return {
      variables: {
        where: {
          buyer: {
            id: get(props, 'match.params.id'),
          },
        },
      },
    };
  })
)(CustomerDetails);
