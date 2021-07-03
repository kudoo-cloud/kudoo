import {
  Button,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import get from 'lodash/get';
import queryString from 'query-string';
import React, { Component } from 'react';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import styles from './styles';

interface IProps {
  actions: object;
  updateDao: (data: any) => any;
  dao: object;
  i18n: any;
  location: any;
  history: any;
  classes: any;
  theme: any;
}

interface IState {}

class Banking extends Component<IProps, IState> {
  static defaultProps = {
    updateDao: () => ({}),
    dao: {},
  };

  state = {};

  _onSubmit = async (values) => {
    try {
      const { dao, location, history } = this.props;
      const res = await this.props.updateDao({
        data: {
          bankAccount: {
            code: values.code,
            name: values.name,
            accountNumber: values.accountNumber,
            description: values.description,
          },
        },
        where: {
          id: get(dao, 'data.id'),
        },
      });
      if (res.success) {
        showToast(null, 'Bank information updated');
        const parsedObj: any = queryString.parse(location.search);
        if (parsedObj.redirect) {
          history.push(decodeURIComponent(parsedObj.redirect));
        }
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _renderSectionHeader() {
    const { classes } = this.props;
    return (
      <div>
        <SectionHeader
          title='Banking Details'
          classes={{ component: classes.sectionHeader }}
        />
      </div>
    );
  }

  _renderFormFields(formProps) {
    const { values, touched, errors, dirty } = formProps;
    const { classes, theme } = this.props;
    const isFormDirty = dirty;
    return (
      <form onSubmit={formProps.handleSubmit} className={classes.form}>
        <Grid container classes={{ container: classes.formFields }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name='stripeApiKey'
              id='stripeApiKey'
              label={`Stripe Api Key`}
              placeholder={`Stripe Api Key`}
              value={values.stripeApiKey}
              onChange={formProps.handleChange}
              onBlur={formProps.handleBlur}
              error={touched.stripeApiKey && errors.stripeApiKey}
            />
            {/* <TextField
              name='name'
              id='name'
              label={i18n._(`Bank Client`)}
              placeholder={i18n._(`Bank Client`)}
              value={values.name}
              onChange={formProps.handleChange}
              onBlur={formProps.handleBlur}
              error={touched.name && errors.name}
            />
            {i18n._(`BSB`) !== 'Blank' && (
              <TextField
                name='code'
                id='code'
                label={i18n._(`BSB`)}
                placeholder={i18n._(`BSB`)}
                value={values.code}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
                error={touched.code && errors.code}
              />
            )}
            <TextField
              name='accountNumber'
              id='accountNumber'
              label={i18n._(`Account Number`)}
              placeholder={i18n._(`Account Number`)}
              value={values.accountNumber}
              onChange={formProps.handleChange}
              onBlur={formProps.handleBlur}
              error={touched.accountNumber && errors.accountNumber}
            />
            <TextField
              name='description'
              id='description'
              label='Description'
              placeholder={'Description'}
              value={values.description}
              onChange={formProps.handleChange}
              onBlur={formProps.handleBlur}
              error={touched.description && errors.description}
            /> */}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
            <Button
              title='Cancel'
              buttonColor={theme.palette.grey['200']}
              classes={{ text: classes.cancelButtonText }}
            />
          </Grid>
          {isFormDirty && (
            <Grid item xs={12} sm={6}>
              <Button
                id='submit-button'
                title='Save'
                buttonColor={theme.palette.primary.color2}
                type='submit'
              />
            </Grid>
          )}
        </Grid>
      </form>
    );
  }

  _renderForm() {
    // const { dao, i18n } = this.props;
    return (
      <Formik
        initialValues={{
          stripeApiKey: '',
          // name: get(dao, 'data.bankAccount.name', ''),
          // code: get(dao, 'data.bankAccount.code', ''),
          // accountNumber: get(dao, 'data.bankAccount.accountNumber', ''),
          // description: get(dao, 'data.bankAccount.description', ''),
        }}
        onSubmit={this._onSubmit}
        enableReinitialize
        validationSchema={Yup.object({
          stripeApiKey: Yup.string().required(),
          // name: Yup.string().required(i18n._(`Bank Client`) + ' is required'),
          // code: Yup.string().required(i18n._(`BSB`) + ' is required'),
          // accountNumber: Yup.string().required(
          //   i18n._(`Account Number`) + ' is required',
          // ),
          // description: Yup.string().required('Description is required'),
        })}
      >
        {this._renderFormFields.bind(this)}
      </Formik>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeader()}
            {this._renderForm()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withI18n(),
  withStyles(styles),
  // withDao((props) => ({
  //   id: get(props, 'match.params.daoId'),
  // })),
  // withUpdateDao(),
)(Banking);
