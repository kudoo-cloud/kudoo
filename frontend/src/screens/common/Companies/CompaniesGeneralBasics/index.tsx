import {
  Button,
  Checkbox,
  Dropdown,
  ErrorBoundary,
  RadioButton,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { Trans, withI18n } from '@lingui/react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';
import {
  DEFAULT_LOCALE,
  SUPPORTED_COUNTRIES_COMPANY,
} from 'src/helpers/locale';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

interface IProps {
  actions: any;
  isCreateNewCompany: boolean;
  createCompany: (data: any) => any;
  updateCompany: (data: any) => any;
  initialData: any;
  profile: any;
  refetch: () => any;
  removeLogo: (data: any) => any;
  i18n: any;
  history: any;
  theme: any;
  classes: any;
}

interface IState {
  isGSTRegistered: string;
  selectedLogo: File | null;
}

const AUSTRALIYA_COUNTRY_CODE = 'AU';

class CompaniesGeneralBasics extends React.Component<IProps, IState> {
  static defaultProps = {
    isCreateNewCompany: false,
    initialData: {},
    createCompany: () => ({}),
    updateCompany: () => ({}),
    refetch: () => ({}),
    removeLogo: () => ({}),
  };

  state = {
    isGSTRegistered: 'yes',
    selectedLogo: null,
  };

  componentDidMount() {
    this._setTempLocale(this.props);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.initialData, prevProps.initialData)) {
      this._setTempLocale(this.props);
    }
  }

  _setTempLocale = (props) => {
    const { initialData, actions } = props;
    if (!isEmpty(initialData)) {
      const companyCountry: any =
        find(SUPPORTED_COUNTRIES_COMPANY, {
          value: initialData.country || 'other',
        }) || {};
      actions.setTemporaryActiveLanguage(companyCountry.locale);
    } else {
      actions.setTemporaryActiveLanguage(DEFAULT_LOCALE);
    }
  };

  _submitForm = async (values, actions) => {
    const { isCreateNewCompany, initialData, profile } = this.props;
    const {
      name,
      legalNameSameAsName,
      legalName,
      govNumber,
      businessType,
      url,
      isGSTRegistered,
      country,
      currency,
      hpio,
    } = values;
    let data: any = {
      businessType,
      legalName: legalNameSameAsName ? name : legalName,
      name: name,
      salesTax: isGSTRegistered,
      websiteURL: url,
      country: country === 'other' ? null : country,
      currency: currency === '' ? 'AUD' : currency,
      logo: this.state.selectedLogo,
      HPIO: hpio,
    };
    if (govNumber && country === AUSTRALIYA_COUNTRY_CODE) {
      data = {
        ...data,
        govNumber: govNumber.replace('/[^d]/', ''),
      };
    } else if (govNumber) {
      data = {
        ...data,
        govNumber: govNumber.replace(/ /g, ''),
      };
    }

    try {
      if (isCreateNewCompany) {
        // if create new company
        const res = await this.props.createCompany({ data });
        if (res.success) {
          const companyRes = { ...res.result, owner: true };
          await this.props.actions.setUserData({
            selectedCompany: companyRes,
            createdCompanies: [...(profile.createdCompanies || []), companyRes], // this is useful for updating company list when we go back to manage companies
          });
          // await this.props.refetch();
          actions.setSubmitting(false);
          showToast(null, 'Company created');
          this.props.actions.setTemporaryActiveLanguage(undefined);
          this.props.history.push(URL.MANAGE_COMPANIES());
        } else {
          res.error.map((err) => showToast(err));
        }
      } else {
        // if update existing company
        data = {
          data,
          where: {
            id: initialData.id,
          },
        };
        const res = await this.props.updateCompany(data);
        if (res.success) {
          await this.props.refetch();
          actions.setSubmitting(false);
          showToast(null, 'Company Updated');
          this.props.actions.setTemporaryActiveLanguage(undefined);
          this.props.history.push(URL.MANAGE_COMPANIES());
        } else {
          res.error.map((err) => showToast(err));
        }
      }
    } catch (e) {
      actions.setSubmitting(false);
      showToast(e.toString());
      console.log('e===', e);
    }
  };

  _removeLogo = async () => {
    try {
      const { initialData } = this.props;
      const res = await this.props.removeLogo({
        where: {
          id: get(initialData, 'logo.id'),
        },
      });
      if (res.success) {
        await this.props.refetch();
        showToast(null, 'Logo removed successfully');
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _deleteCompany = async () => {
    try {
      const { initialData, history } = this.props;
      const data = {
        data: {
          isArchived: true,
        },
        where: {
          id: initialData.id,
        },
      };
      const res = await this.props.updateCompany(data);
      if (res.success) {
        showToast(null, 'Company archived successfully');
        this.props.actions.setUserData({
          selectedCompany: {},
        });
        history.replace(URL.MANAGE_COMPANIES());
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _showDeleteCompanyModal = async () => {
    const { theme, initialData, classes } = this.props;
    const title = 'Delete this company account?';
    const description = (
      <div>
        <div>
          {`You are trying to delete the company `}
          <span className={classes.deleteCompanyName}>
            {"'" + initialData.name + "'"}
          </span>
        </div>
        <br />
        <div>
          {`Please note that this is a permanent action and it can't be reversed.`}
        </div>
        <div>All users linked to this company will be affected.</div>
        <br />
        <div>Are you sure you want to delete company ?</div>
      </div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Delete Company',
        id: 'modal-delete-company',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this._deleteCompany();
          this.props.actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.secondary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _renderCompanyLogoSection() {
    const { classes, initialData } = this.props;
    const { selectedLogo } = this.state;
    const dropzoneStyle = {
      width: 360,
      height: 130,
      border: '2px dashed #e5e5e5',
      borderRadius: 5,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
    const companyLogo = get(initialData, 'logo.url')
      ? get(initialData, 'logo.url')
      : undefined;
    const selectedLogoPreview = get(selectedLogo, 'preview');
    return (
      <React.Fragment>
        <SectionHeader
          title='Company Logo'
          classes={{ component: classes.sectionHeading }}
        />
        <div className={classes.logoImageWrapper}>
          <div className={classes.dropzoneAreaWrapper}>
            <div>
              {selectedLogoPreview || companyLogo ? (
                <div
                  className={classes.uploadedLogoPreview}
                  style={{
                    backgroundImage: `url(${
                      selectedLogoPreview || companyLogo
                    })`,
                  }}
                >
                  <Dropzone
                    className={classes.selectNewImageText}
                    multiple={false}
                    accept='image/*'
                    onDropAccepted={(file) => {
                      this.setState({ selectedLogo: file[0] });
                    }}
                  >
                    Select new image
                  </Dropzone>
                </div>
              ) : (
                <Dropzone
                  style={dropzoneStyle}
                  multiple={false}
                  accept='image/*'
                  onDropAccepted={(file) => {
                    this.setState({ selectedLogo: file[0] });
                  }}
                >
                  <div className={classes.dropzoneText}>
                    Select or Drop image
                  </div>
                </Dropzone>
              )}
            </div>
            {Boolean(companyLogo) && (
              <ButtonBase
                classes={{ root: classes.deleteIcon }}
                onClick={this._removeLogo}
              >
                <i className='icon icon-trash' />
              </ButtonBase>
            )}
          </div>
          <div className={classes.imageNote}>
            {`This logo appears on your company invoice.`}
            <br />
            {`This logo file can't exceed 5mb`}
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderForm(formProps) {
    const { classes, theme, isCreateNewCompany, i18n, actions } = this.props;
    const {
      values,
      errors,
      touched,
      setFieldValue,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      dirty,
    } = formProps;
    return (
      <React.Fragment>
        <SectionHeader
          title='Basic Details'
          classes={{ component: classes.sectionHeading }}
        />
        <form className={classes.formWrapper} onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <div className={classes.formFields}>
                <div className={classes.fieldRow}>
                  <TextField
                    name='name'
                    id='name'
                    label='Company Name'
                    placeholder={'Company Name'}
                    value={values.name}
                    showClearIcon={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />
                </div>

                <div className={classes.fieldRow}>
                  <TextField
                    name='legalName'
                    id='legalName'
                    label='Company Legal Name'
                    placeholder={'Company Legal Name'}
                    value={
                      values.legalNameSameAsName
                        ? values.name
                        : values.legalName
                    }
                    isReadOnly={values.legalNameSameAsName}
                    showClearIcon={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.legalName && errors.legalName}
                  />
                  <Checkbox
                    label={'Same as above'}
                    classes={{ component: classes.sameAsAboveCheckbox }}
                    value={values.legalNameSameAsName}
                    onChange={(checked) => {
                      setFieldValue('legalNameSameAsName', checked);
                    }}
                  />
                </div>
                <div className={classes.fieldRow}>
                  <Dropdown
                    label='Country'
                    items={SUPPORTED_COUNTRIES_COMPANY}
                    value={values.country}
                    onChange={(item) => {
                      setFieldValue('country', item.value);
                      actions.setTemporaryActiveLanguage(item.locale);
                      setFieldValue('currency', item.currency);
                    }}
                    error={touched.country && errors.country}
                  />
                </div>
                <div className={classes.fieldRow}>
                  <Dropdown
                    label='Currency'
                    items={[{ label: 'AUD', value: 'AUD' }]}
                    value={values.currency}
                    onChange={(item) => {
                      setFieldValue('currency', item.value);
                    }}
                    error={touched.currency && errors.currency}
                  />
                </div>
                <div className={cx(classes.fieldRow, classes.halfFieldWrapper)}>
                  <TextField
                    name='govNumber'
                    id='govNumber'
                    label={i18n._(`ABN`)}
                    placeholder={i18n._(`ABN`)}
                    showClearIcon={false}
                    value={(values.govNumber || '').replace(/ /g, '')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    classes={{
                      component: classes.abnInput,
                    }}
                    error={touched.govNumber && errors.govNumber}
                  />
                  <Dropdown
                    label='Business Type'
                    id='business-type'
                    items={[
                      { label: 'Health', value: 'HEALTH' },
                      { label: 'Other', value: 'OTHER' },
                    ]}
                    value={values.businessType}
                    onChange={(item) => {
                      setFieldValue('businessType', item.value);
                    }}
                    error={touched.businessType && errors.businessType}
                  />
                </div>
                {values.country === AUSTRALIYA_COUNTRY_CODE &&
                  values.businessType === 'HEALTH' && (
                    <div className={classes.fieldRow}>
                      <TextField
                        name='hpio'
                        id='hpio'
                        label='HPIO'
                        placeholder={'HPIO'}
                        value={values.hpio}
                        showClearIcon={false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.hpio && errors.hpio}
                      />
                    </div>
                  )}
                <div className={classes.fieldRow}>
                  <TextField
                    name='url'
                    id='url'
                    label='Website URL'
                    placeholder={'Website URL'}
                    showClearIcon={false}
                    value={values.url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <SectionHeader
                  title={i18n._(`GST`) + ' Settings'}
                  classes={{
                    component: cx(classes.sectionHeading, classes.gstHeading),
                  }}
                />
                <div className={classes.gstLabel}>
                  Are you registered for <Trans id='GST'>GST</Trans>?
                </div>
                <div className={classes.halfFieldWrapper}>
                  <RadioButton
                    id='gst-yes'
                    label='Yes I am registered'
                    value={values.isGSTRegistered === true}
                    onChange={() => {
                      setFieldValue('isGSTRegistered', true);
                    }}
                  />
                  <RadioButton
                    id='gst-no'
                    label='No I am not registered'
                    value={values.isGSTRegistered === false}
                    onChange={() => {
                      setFieldValue('isGSTRegistered', false);
                    }}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          {!isCreateNewCompany && (
            <ButtonBase
              id='delete-company'
              classes={{ root: classes.deleteCompanyText }}
              onClick={this._showDeleteCompanyModal}
            >
              Delete this company account
            </ButtonBase>
          )}
          <Grid container spacing={0}>
            <Grid item xs={12} md={dirty ? 6 : 12}>
              <Button
                title={isCreateNewCompany ? 'Cancel' : 'Go Back'}
                href={URL.MANAGE_COMPANIES()}
                buttonColor={theme.palette.grey['200']}
                classes={{ text: classes.cancelButtonText }}
                target='_self'
              />
            </Grid>
            {dirty && (
              <Grid item xs={12} md={6}>
                <Button
                  id='submit-button'
                  title={isCreateNewCompany ? 'Save' : 'Update'}
                  buttonColor={theme.palette.primary.color2}
                  loading={isSubmitting}
                  type='submit'
                />
              </Grid>
            )}
          </Grid>
        </form>
      </React.Fragment>
    );
  }

  _renderFormSection() {
    const { initialData, i18n } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          name: initialData.name || '',
          legalNameSameAsName: initialData.name === initialData.legalName,
          legalName: initialData.legalName || '',
          country: !isEmpty(initialData)
            ? initialData.country || 'other'
            : AUSTRALIYA_COUNTRY_CODE,
          currency: !isEmpty(initialData.currency)
            ? initialData.currency
            : 'AUD',
          govNumber: `${initialData.govNumber ? initialData.govNumber : ''}`,
          businessType: initialData.businessType || '',
          url: initialData.websiteURL || '',
          isGSTRegistered: initialData.salesTax || false,
          hpio: initialData.HPIO || '',
        }}
        onSubmit={this._submitForm}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          country: Yup.mixed().nullable(),
          legalName: Yup.mixed().when('legalNameSameAsName', {
            is: false,
            then: Yup.string().required('Legal name is required'),
            otherwise: Yup.mixed().nullable(),
          }),
          legalNameSameAsName: Yup.boolean(),
          govNumber: Yup.string()
            .required(i18n._(`ABN`) + ' is required')
            .test('validate-abn', 'Not Valid!', function (value) {
              if (
                this.parent &&
                this.parent.country === AUSTRALIYA_COUNTRY_CODE
              ) {
                const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
                const govNumber = value.replace(/[^\d]/g, '');
                if (govNumber.length === 11) {
                  const sum = weights.reduce((prev, weight, index) => {
                    let internalSum = 0;
                    if (index === 0) {
                      internalSum = weight * (Number(govNumber[index]) - 1);
                    } else {
                      internalSum = weight * Number(govNumber[index]);
                    }
                    return prev + internalSum;
                  }, 0);
                  return sum % 89 === 0;
                }
                return false;
              }
              return true;
            }),
          businessType: Yup.string().required('Please select business type'),
        })}
      >
        {this._renderForm.bind(this)}
      </Formik>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderCompanyLogoSection()}
            {this._renderFormSection()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withI18n(),
  // withCreateCompany(),
  // withUpdateCompany(),
  // withDeleteAttachment(() => ({ name: 'removeLogo' })),
  // withCompany(
  //   (props) => ({ id: get(props, 'match.params.companyId', '') }),
  //   ({ data }) => ({
  //     initialData: get(data, 'company', {}),
  //     refetch: data.refetch,
  //   }),
  // ),
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
)(CompaniesGeneralBasics);
