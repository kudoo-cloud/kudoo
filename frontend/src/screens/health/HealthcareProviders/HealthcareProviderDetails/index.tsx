import {
  Button,
  HealthcareProviderForm,
  Modal,
  Tabs,
  ToggleButton,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import idx from 'idx';
import get from 'lodash/get';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import DetailsTab from './DetailsTab';
import InvoicesTab from './InvoicesTab';
import styles from './styles';

type Props = {
  actions: any;
  healthcareProvider: any;
  updateHealthcareProvider: Function;
  profile: any;
  invoices: any;
  i18n: any;
  classes: any;
  history: any;
  theme: any;
};
type State = {
  activeSection: number;
  showModal: boolean;
};

class HealthcareProviderDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeSection: 0,
      showModal: false,
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('HealthcareProviders');
  }

  _getHealthcareProviderDetails = () => {
    const { healthcareProvider } = this.props;
    const healthcareProviderData = get(healthcareProvider, 'data', {});
    const contact = get(healthcareProviderData, 'contacts[0]') || {};
    const address = get(healthcareProviderData, 'addresses[0]') || {};
    return {
      id: healthcareProviderData.id,
      name: get(healthcareProviderData, 'name', ''),
      govNumber: String(get(healthcareProviderData, 'govNumber', '')),
      contact,
      address,
    };
  };

  _getUpdatedAddressContactData = (values) => {
    const { healthcareProvider } = this.props;
    const address = get(healthcareProvider, 'data.addresses[0]') || {};
    const contact = get(healthcareProvider, 'data.contacts[0]') || {};
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

  _submitBasicDetails = async (values) => {
    const { healthcareProvider } = this.props;
    try {
      const updatedAddressContactData =
        this._getUpdatedAddressContactData(values);
      const res = await this.props.updateHealthcareProvider({
        data: {
          name: values.healthcareProvider_name,
          govNumber: String(values.govNumber.replace(/ /g, '')),
          ...updatedAddressContactData,
        },
        where: {
          id: idx(healthcareProvider, (_) => _.data.id),
        },
      });
      if (res.success) {
        // refetch data
        healthcareProvider.refetch();
        showToast(null, 'HealthcareProvider updated');
        this.setState({ showModal: false });
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _submitAddressContact = async (values, actions) => {
    const { healthcareProvider } = this.props;
    try {
      const updatedData = this._getUpdatedAddressContactData(values);
      const res = await this.props.updateHealthcareProvider({
        data: updatedData,
        where: {
          id: get(healthcareProvider, 'data.id'),
        },
      });
      if (res.success) {
        showToast(null, 'HealthcareProvider updated');
        actions.setSubmitting(false);
        healthcareProvider.refetch();
      } else {
        res.error.map((err) => showToast(err));
        actions.setSubmitting(false);
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _getTotalAmountMade = () => {
    const { invoices } = this.props;
    const invoicesRow = get(invoices, 'data', []);
    const totalMade = invoicesRow.reduce((acc, invoice) => {
      if (invoice.status === 'FULLY_PAID') {
        return acc + invoice.total;
      }
      return acc;
    }, 0);
    return totalMade;
  };

  _getTotalOwed = () => {
    const { invoices } = this.props;
    const invoicesRow = get(invoices, 'data', []);
    const totalOwed = invoicesRow.reduce((acc, invoice) => {
      if (invoice.status !== 'FULLY_PAID') {
        return acc + invoice.total;
      }
      return acc;
    }, 0);
    return totalOwed;
  };

  _renderSecondaryTabs() {
    return (
      <Tabs
        tabs={[
          {
            label: 'All HealthcareProviders',
            onClick: () => {
              this.props.history.push(URL.ACTIVE_CUSTOMERS());
            },
          },
          {
            label: 'Archived',
            onClick: () => {
              this.props.history.push(URL.ARCHIVED_CUSTOMERS());
            },
          },
        ]}
        tabTheme='secondary'
        activeIndex={false}
      />
    );
  }

  _renderDetailsCards() {
    const { classes, i18n } = this.props;
    const { name, contact, govNumber } = this._getHealthcareProviderDetails();
    const totalAmountMade = this._getTotalAmountMade();
    const totalOwed = this._getTotalOwed();
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
                    this.setState({ showModal: true });
                  }}
                >
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
  }

  _renderToggleButton() {
    const { theme } = this.props;
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={3}>
          <ToggleButton
            labels={['Details', 'Invoices']}
            selectedIndex={0}
            activeColor={theme.palette.primary.color1}
            onChange={(label, index) => {
              this.setState({ activeSection: index });
            }}
          />
        </Grid>
      </Grid>
    );
  }

  _renderDetailsSection() {
    const healthcareProvider = this._getHealthcareProviderDetails();
    return (
      <DetailsTab
        healthcareProvider={healthcareProvider}
        onSubmit={this._submitAddressContact}
      />
    );
  }

  _renderInvoiceSection() {
    return <InvoicesTab invoices={this.props.invoices} />;
  }

  _renderEditCompanyDetailsModal() {
    const { classes, theme, i18n } = this.props;
    const { name, govNumber, contact } = this._getHealthcareProviderDetails();
    return (
      <Modal
        visible={this.state.showModal}
        onClose={() => {
          this.setState({ showModal: false });
        }}
        classes={{ description: classes.editCompanyModalDescription }}
        title='Edit HealthcareProvider Details'
        description={
          <Formik
            enableReinitialize
            initialValues={{
              healthcareProvider_name: name,
              contact_name: contact.name,
              contact_surname: contact.surname,
              govNumber,
              email: contact.email,
            }}
            validationSchema={Yup.object().shape({
              healthcareProvider_name:
                Yup.string().required('Name is required'),
              contact_name: Yup.string().required('Contact name is required'),
              contact_surname: Yup.string().required('Surname is required'),
              govNumber: Yup.string().required(i18n._(`ABN`) + ' is required'),
              // .test('is-abn', 'ABN is not valid', utils.validateABN),
              email: Yup.string()
                .required('Email is required')
                .required('Invalid Email'),
            })}
            onSubmit={this._submitBasicDetails}
          >
            {(formProps) => {
              const isDirty = formProps.dirty;
              return (
                <form
                  className={classes.modalForm}
                  onSubmit={formProps.handleSubmit}
                >
                  <Grid
                    container
                    spacing={0}
                    classes={{ container: classes.formFields }}
                  >
                    <Grid item xs={12} sm={12}>
                      <HealthcareProviderForm
                        keys={{
                          healthcareProvider_name: 'healthcareProvider_name',
                          contact_name: 'contact_name',
                          contact_surname: 'contact_surname',
                          abn: 'govNumber',
                          email: 'email',
                        }}
                        labels={{
                          healthcareProvider_name: 'HealthcareProvider Name',
                          contact_name: 'Contact Name',
                          contact_surname: 'Contact Surname',
                          abn: i18n._(`ABN`),
                          email: 'Email',
                        }}
                        values={formProps.values}
                        errors={formProps.errors}
                        touched={formProps.touched}
                        handleChange={formProps.handleChange}
                        handleBlur={formProps.handleBlur}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={isDirty ? 6 : 12}>
                      <Button
                        title='Cancel and go back'
                        onClick={() => {
                          this.setState({ showModal: false });
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
  }

  render() {
    const { classes } = this.props;
    return (
      <SelectedCompany
        onChange={() => {
          this.props.history.push(URL.CUSTOMERS());
        }}
      >
        <div className={classes.page}>
          {this._renderSecondaryTabs()}
          <div className={classes.content}>
            {this._renderDetailsCards()}
            {this._renderToggleButton()}
            {this.state.activeSection === 0 && this._renderDetailsSection()}
            {this.state.activeSection === 1 && this._renderInvoiceSection()}
          </div>
          {this._renderEditCompanyDetailsModal()}
        </div>
      </SelectedCompany>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
)(HealthcareProviderDetails);
