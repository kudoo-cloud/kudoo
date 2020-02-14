import React, { Component } from 'react';
import cx from 'classnames';
import find from 'lodash/find';
import Grid from '@material-ui/core/Grid';
import { withI18n } from '@lingui/react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  withStyles,
  Button,
  SectionHeader,
  TextField,
  Checkbox,
  Dropdown,
  withStylesProps,
} from '@kudoo/components';
import actions from '@client/store/actions/createNewProject';
import { withServices } from '@kudoo/graphql';
import { SERVICE_BILLING_TYPE } from '@client/helpers/constants';
import { IReduxState } from '@client/store/reducers';
import idx from 'idx';
import styles from './styles';
import ServiceBlock from './ServiceBlock';

type Props = {
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  addService: Function;
  removeService: Function;
  i18n: any;
  services: {
    data: Array<any>;
    loading: boolean;
  };
  createNewProject: any;
  classes: any;
  theme: any;
};

type State = {
  alertVisible: boolean;
  selectedSavedServiceIndex: number;
};

class ServiceStep extends Component<Props, State> {
  savedDropdownRef: any;

  state = {
    alertVisible: true,
    selectedSavedServiceIndex: -1,
  };

  _isThereTimeBasedService = () => {
    const {
      createNewProject: { service },
    } = this.props;
    return Boolean(
      find(service, { billingType: SERVICE_BILLING_TYPE.TIME_BASED })
    );
  };

  _isThereFixedService = () => {
    const {
      createNewProject: { service },
    } = this.props;
    return Boolean(find(service, { billingType: SERVICE_BILLING_TYPE.FIXED }));
  };

  render() {
    const {
      classes,
      makeStepActive,
      markedVisited,
      unmarkedVisited,
      theme,
      addService,
      removeService,
      createNewProject: { service },
      services,
      i18n,
    } = this.props;
    return (
      <div>
        <SectionHeader
          title='Services'
          subtitle='Add or create a service using the form below.'
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Prev'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                withoutBackground
                onClick={() => {
                  makeStepActive(1);
                  unmarkedVisited(1);
                }}
              />
              <Button
                title='Next'
                id='next-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                isDisabled={service.length === 0}
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  const isThereFixedService = this._isThereFixedService();
                  if (isThereFixedService) {
                    // if there is fixed service go to rules step
                    makeStepActive(3);
                    markedVisited(2);
                  } else {
                    // if there is no fixed service skip rules step & go to review
                    makeStepActive(4);
                    markedVisited(2);
                    markedVisited(3);
                  }
                }}
              />
            </div>
          )}
        />
        <Grid container spacing={40}>
          <Grid item xs={12} sm={6}>
            <SectionHeader
              title='Add a saved service'
              classes={{ component: classes.formHeading }}
            />
            <form className={classes.form}>
              <Dropdown
                label='Saved services'
                placeholder={'Select a service'}
                items={services.data.map(service => ({
                  label: service.name,
                  value: service,
                }))}
                selectedIndex={this.state.selectedSavedServiceIndex}
                onChange={(item, index) => {
                  const values = item.value;
                  this.setState({ selectedSavedServiceIndex: index }, () => {
                    addService({
                      name: values.name,
                      billingType: values.billingType,
                      paymentTotal: String(values.totalAmount),
                      chargeGST: values.includeConsTax,
                      perUnit: values.timeBasedType,
                      isTemplate: false,
                      isAlreadySaved: true,
                      alreadySavedId: values.id,
                    });
                    this.setState({ selectedSavedServiceIndex: -1 });
                  });
                }}
              />
            </form>
            <SectionHeader
              title='Create a new service'
              classes={{ component: classes.formHeading }}
            />
            <Formik
              initialValues={{
                name: '',
                billingType: '',
                paymentTotal: '',
                chargeGST: false,
                perUnit: '',
                isTemplate: false,
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required('Service Name is required'),
                billingType: Yup.string().required('Billing Type is required'),
                paymentTotal: Yup.string().required(
                  'Payment Total is required'
                ),
              })}
              onSubmit={values => {
                addService({
                  name: values.name,
                  billingType: values.billingType,
                  paymentTotal: values.paymentTotal,
                  chargeGST: values.chargeGST,
                  perUnit: values.perUnit,
                  isTemplate: values.isTemplate,
                });
              }}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => (
                <form className={classes.form} onSubmit={handleSubmit}>
                  <div className={classes.input}>
                    <TextField
                      label={'Service name'}
                      placeholder={'E.g: Website development'}
                      showClearIcon={false}
                      name='name'
                      id='name'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                  </div>
                  <div className={cx(classes.input)}>
                    <Dropdown
                      id='billing-type'
                      label='Billing Type'
                      placeholder={'Select type'}
                      onChange={item => {
                        setFieldValue('billingType', item.value);
                      }}
                      items={[
                        { label: 'Fixed', value: SERVICE_BILLING_TYPE.FIXED },
                        {
                          label: 'Time Based',
                          value: SERVICE_BILLING_TYPE.TIME_BASED,
                        },
                      ]}
                    />
                  </div>
                  {values.billingType === SERVICE_BILLING_TYPE.FIXED && (
                    <div className={cx(classes.halfFieldWRow, classes.input)}>
                      <TextField
                        label={'Payment Total'}
                        placeholder={'E.g: 200'}
                        classes={{ textInputWrapper: classes.leftInput }}
                        showClearIcon={false}
                        name='paymentTotal'
                        id='paymentTotal'
                        value={values.paymentTotal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.paymentTotal && errors.paymentTotal}
                      />
                      <Checkbox
                        id='charge-gst'
                        label={'Charge ' + i18n._(`GST`)}
                        value={values.chargeGST}
                        classes={{ component: classes.chargeGSTCheckbox }}
                        onChange={checked =>
                          setFieldValue('chargeGST', checked)
                        }
                      />
                    </div>
                  )}
                  {values.billingType === SERVICE_BILLING_TYPE.TIME_BASED && (
                    <div>
                      <div className={cx(classes.halfFieldWRow, classes.input)}>
                        <TextField
                          label={'Payment Amount'}
                          placeholder={'E.g: 200'}
                          classes={{ textInputWrapper: classes.leftInput }}
                          showClearIcon={false}
                          name='paymentTotal'
                          id='paymentTotal'
                          value={values.paymentTotal}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.paymentTotal && errors.paymentTotal}
                        />
                        <Checkbox
                          id='charge-gst'
                          label={'Charge ' + i18n._(`GST`)}
                          value={values.chargeGST}
                          classes={{ component: classes.chargeGSTCheckbox }}
                          onChange={checked =>
                            setFieldValue('chargeGST', checked)
                          }
                        />
                      </div>
                      <div className={cx(classes.input)}>
                        <Dropdown
                          id='per-unit'
                          label='Per Unit'
                          placeholder={'Select Unit'}
                          items={[
                            { label: 'Hour', value: 'HOUR' },
                            { label: 'Half Hour', value: 'HALFHOUR' },
                            { label: 'Quater Hour', value: 'QUARTERHOUR' },
                          ]}
                          onChange={item => {
                            setFieldValue('perUnit', item.value);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className={classes.input}>
                    <Checkbox
                      classes={{ wrapper: classes.checkbox }}
                      value={values.isTemplate}
                      label='Save this service to templates'
                      onChange={checked => {
                        setFieldValue('isTemplate', checked);
                      }}
                    />
                  </div>
                  <div className={classes.input}>
                    <Button
                      id='add-service'
                      title='Add Service'
                      buttonColor={theme.palette.primary.color2}
                      width='200px'
                      compactMode
                      applyBorderRadius
                      type='submit'
                    />
                  </div>
                </form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} sm={6}>
            <SectionHeader
              title='Added Services'
              classes={{ component: classes.formHeading }}
            />
            {service.length === 0 && (
              <div className={classes.noServices}>
                <div className={classes.noServicesText}>
                  You have not added any services to this Project!
                </div>
              </div>
            )}
            {service.length > 0 && (
              <div>
                {this.state.alertVisible && this._isThereTimeBasedService() && (
                  <div
                    className={classes.serviceAlert}
                    data-test='timebased-service-message'>
                    <div className={classes.serviceAlertText}>
                      Services based on time will be linked to timesheets.{' '}
                      <br />
                      You can link this service when you create a timesheet.
                    </div>
                    <div
                      className={classes.alertRemoveIcon}
                      onClick={() => {
                        this.setState({ alertVisible: false });
                      }}>
                      <i className='ion-android-close' />
                    </div>
                  </div>
                )}
                <div className={classes.services}>
                  {service.map((ser, index) => {
                    return (
                      <ServiceBlock
                        key={index}
                        name={ser.name}
                        type={ser.billingType}
                        price={ser.paymentTotal}
                        perUnit={ser.perUnit}
                        chargeGST={ser.chargeGST}
                        onRemoveClick={() => {
                          removeService(ser.id);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withI18n(),
  connect(
    (state: IReduxState) => ({
      createNewProject: idx(state, x => x.sessionData.newProject),
      profile: state.profile,
    }),
    {
      ...actions,
    }
  ),
  withServices(() => ({
    variables: {
      where: {
        isArchived: false,
        isTemplate: true,
      },
      orderBy: 'name_ASC',
    },
  }))
)(ServiceStep);
