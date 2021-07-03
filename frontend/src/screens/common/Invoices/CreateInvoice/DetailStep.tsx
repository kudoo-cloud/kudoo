import {
  Button,
  DatePicker,
  FieldLabel,
  FileBlock,
  SectionHeader,
  TextField,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import moment from 'moment';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import * as actions from 'src/store/actions/createNewInvoice';
import { IReduxState } from 'src/store/reducers';
import styles, { detailStepStyles } from './styles';

type Props = {
  actions: Record<string, any>;
  createType: 'timesheet' | 'project' | 'text';
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  updatePaymentInfo: Function;
  newInvoice: Record<string, any>;
  dao: Record<string, any>;
  profile: Record<string, any>;
  i18n: any;
  classes: any;
  theme: any;
};
type State = {};

class DetailStep extends Component<Props, State> {
  static defaultProps = {
    dao: { data: {} },
  };

  // form: any;

  state = {};

  _getTitle = () => {
    const { createType } = this.props;
    if (createType === 'text') {
      return {
        title: 'Create a free text invoice',
        subtitle:
          "Let's begin by selecting an option below. If you are unsure select the question mark provided.",
      };
    } else if (createType === 'project') {
      return {
        title: 'Create an invoice using a project',
        subtitle:
          'Creating an invoice from a project is a quick way to easily create an invoice from a project which you have already defined.',
      };
    } else if (createType === 'timesheet') {
      return {
        title: 'Create an invoice using a timesheet',
        subtitle:
          'Creating an invoice from a timesheet is a quick way to easily create an invoice from a timesheet which you have already defined.',
      };
    }
    return {};
  };

  _goToNextStep = () => {
    const { makeStepActive, markedVisited } = this.props;
    makeStepActive(3);
    markedVisited(2);
  };

  _togglePaymentOption = ({ values, setFieldValue, type, setFieldTouched }) => {
    const v = values.options;
    v.push(type);
    setFieldValue('options', uniq(v));
    setFieldTouched('options');
  };

  _onSubmitForm = (values) => {
    const { createType, dao } = this.props;
    if (!get(dao, 'data.bankAccount')) {
      showToast('Please add bank account');
      return;
    }
    this.props.updatePaymentInfo(createType, values);
    this._goToNextStep();
  };

  _calculateDays = (invoiceDate, dueDate) => {
    if (dueDate && invoiceDate) {
      const mDueDate = moment(dueDate);
      const mInvoiceDate = moment(invoiceDate);
      return mDueDate.diff(mInvoiceDate, 'days');
    }
    return false;
  };

  _onFieldChange = (key, value, setFieldValue) => {
    const { createType } = this.props;
    this.props.updatePaymentInfo(createType, {
      [key]: value,
    });
    setFieldValue(key, value);
  };

  _onDropAttachments = (files) => {
    const { createType, newInvoice } = this.props;
    const attachments = get(
      newInvoice,
      `${createType}.payment.attachments`,
      [],
    );
    let finalAttachments = [];
    finalAttachments = attachments.filter(
      (attachment) => attachment instanceof File,
    );
    this.props.updatePaymentInfo(createType, {
      attachments: [...finalAttachments, ...files],
    });
  };

  _removeAttachment = (index) => {
    const { createType, newInvoice } = this.props;
    const attachments = get(
      newInvoice,
      `${createType}.payment.attachments`,
      [],
    );
    attachments.splice(index, 1);
    this.props.updatePaymentInfo(createType, {
      attachments: [...attachments],
    });
  };

  _renderForm(formProps) {
    const { values, errors, touched, handleSubmit, handleBlur, setFieldValue } =
      formProps;

    const { classes, dao, profile, newInvoice, createType, i18n } = this.props;
    const daoId = get(profile, 'selectedDAO.id');
    const customer = get(newInvoice, `${createType}.customer`) || {};
    let attachments = get(newInvoice, `${createType}.payment.attachments`, []);
    attachments = attachments.filter((attch) => attch instanceof File);
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.input}>
          <FieldLabel label='Customer Payment' />
          {!get(dao, 'data.bankAccount') ? (
            <div className={classes.paymentOptions}>
              <div className={classes.addBankText}>
                Please{' '}
                <Link
                  data-test='bank-link'
                  to={
                    URL.DAO_BANKING({ daoId }) +
                    `?redirect=${encodeURIComponent(location.hash.substr(1))}`
                  }
                >
                  add bank
                </Link>{' '}
                information
              </div>
            </div>
          ) : (
            <div>
              <div className={classes.paymentTextValue}>{customer.name}</div>
              <div className={classes.paymentTextValue} data-test='bank-name'>
                {get(dao, 'data.bankAccount.name')}
              </div>
              <div className={classes.paymentTextValue}>
                {i18n._(`BSB`)}: {get(dao, 'data.bankAccount.code')}
              </div>
              <div className={classes.paymentTextValue}>
                {i18n._(`Account Number`)}:{' '}
                {get(dao, 'data.bankAccount.accountNumber')}
              </div>
              <div className={classes.addBankText}>
                <Link
                  data-test='bank-link'
                  style={{ margin: 0 }}
                  to={
                    URL.DAO_BANKING({ daoId }) +
                    `?redirect=${encodeURIComponent(location.hash.substr(1))}`
                  }
                >
                  Update Information
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className={classes.input}>
          <Grid container spacing={8}>
            <Grid item sm={4}>
              <DatePicker
                textFieldProps={{
                  label: 'Invoice Date',
                  error: touched.invoiceDate && errors.invoiceDate,
                  id: 'invoice-date-input',
                }}
                value={values.invoiceDate}
                onDateChange={(date) => {
                  this._onFieldChange('invoiceDate', date, setFieldValue);
                  const days = this._calculateDays(date, values.dueDate);
                  if (days !== false) {
                    this._onFieldChange(
                      'numberOfDays',
                      String(days),
                      setFieldValue,
                    );
                  }
                }}
              />
            </Grid>
            <Grid item sm={4}>
              <DatePicker
                textFieldProps={{
                  label: 'Due Date',
                  error: touched.dueDate && errors.dueDate,
                  id: 'due-date-input',
                }}
                value={values.dueDate}
                onDateChange={(date) => {
                  this._onFieldChange('dueDate', date, setFieldValue);
                  const days = this._calculateDays(values.invoiceDate, date);
                  if (days !== false) {
                    this._onFieldChange(
                      'numberOfDays',
                      String(days),
                      setFieldValue,
                    );
                  }
                }}
              />
            </Grid>
            <Grid item sm={3}>
              <TextField
                placeholder={'0'}
                id='numberOfDays'
                name='numberOfDays'
                isNumber
                onChangeText={(numberOfDays) => {
                  const number = Number(numberOfDays || 0);
                  if (number >= 0) {
                    const dueDate = moment(values.invoiceDate).add(
                      number,
                      'days',
                    );
                    this._onFieldChange(
                      'dueDate',
                      moment(dueDate).format('YYYY-MM-DD'),
                      setFieldValue,
                    );
                  }
                  this._onFieldChange(
                    'numberOfDays',
                    String(number),
                    setFieldValue,
                  );
                }}
                label='Number of Days'
                value={values.numberOfDays}
                error={touched.numberOfDays && errors.numberOfDays}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.input}>
          <Grid container>
            <Grid item sm={8}>
              <TextField
                id='message'
                name='message'
                value={values.message}
                onChangeText={(text) => {
                  this._onFieldChange('message', text, setFieldValue);
                }}
                onBlur={handleBlur}
                placeholder={'Message'}
                label='Message to be displayed on Invoice'
                multiline
                error={touched.message && errors.message}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.input}>
          <Grid container>
            <Grid item sm={8}>
              <Dropzone
                multiple
                className={classes.dragAreaWrapper}
                activeClassName={classes.activeDragArea}
                onDropAccepted={this._onDropAttachments}
              >
                <div className={classes.attachWrapper}>
                  <TextField
                    classes={{ textInputWrapper: classes.searchInput }}
                    placeholder={'Browser from Computer'}
                    label='Attach document'
                    isReadOnly
                  />
                  <div className={classes.attachButton}>
                    <i className='ion-android-attach' />
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div className={classes.attachementBlock}>
                    <div className={classes.attachedFilesBlock}>
                      {attachments.map((attachment, index) => (
                        <FileBlock
                          key={index}
                          file={attachment}
                          variant='interactive'
                          onRemoveClick={(e) => {
                            e.stopPropagation();
                            this._removeAttachment(index);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Dropzone>
            </Grid>
          </Grid>
        </div>
      </form>
    );
  }

  render() {
    const {
      classes,
      makeStepActive,
      unmarkedVisited,
      theme,
      createType,
      newInvoice,
    } = this.props;
    const { title, subtitle } = this._getTitle();
    const paymentData = get(newInvoice, `${createType}.payment`, {});
    return (
      <div>
        <Formik
          enableReinitialize
          initialValues={{
            options: get(paymentData, 'options', []),
            invoiceDate:
              get(paymentData, 'invoiceDate') || moment().format('YYYY-MM-DD'),
            dueDate: get(paymentData, 'dueDate', ''),
            numberOfDays: get(paymentData, 'numberOfDays', ''),
            message: get(paymentData, 'message', ''),
          }}
          validationSchema={Yup.object().shape({
            invoiceDate: Yup.string().required('Invoice date required'),
            dueDate: Yup.string().required('Due date required'),
            numberOfDays: Yup.string().required('Number of days required'),
          })}
          onSubmit={this._onSubmitForm}
        >
          {(formProps) => (
            <>
              <SectionHeader
                title={title}
                subtitle={subtitle}
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
                      id='next-button'
                      title='Next'
                      classes={{ component: classes.prevNextButton }}
                      applyBorderRadius
                      compactMode
                      buttonColor={theme.palette.primary.color2}
                      onClick={formProps.submitForm}
                    />
                  </div>
                )}
              />
              <Grid container>
                <Grid item xs={12} sm={9}>
                  {this._renderForm(formProps)}
                </Grid>
              </Grid>
            </>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(composeStyles(styles, detailStepStyles)),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, (x) => x.sessionData.newInvoice),
    }),
    { ...actions },
  ),
  // withDAO((props) => ({
  //   id: get(props, 'profile.selectedDAO.id'),
  // })),
)(DetailStep);
