import {
  Button,
  SearchInput,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import get from 'lodash/get';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import * as Yup from 'yup';
import actions from 'src/store/actions/createNewProject';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  updateCustomerInfo: Function;
  customers: Record<string, any>;
  createNewProject: any;
  i18n: any;
  searchText: string;
  setSearchText: any;
  classes: any;
  theme: any;
};

type ComponentState = {};

class CustomerStep extends Component<Props, ComponentState> {
  public static defaultProps = {
    customers: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  state = {};

  _onSearch = (searchText) => {
    const { setSearchText } = this.props;
    setSearchText(searchText);
  };

  _goToNextScreen = () => {
    const { makeStepActive, markedVisited } = this.props;
    makeStepActive(2);
    markedVisited(1);
  };

  _getInitialValue = () => {
    const {
      createNewProject: { customer },
    } = this.props;
    if (customer.isAlreadySaved) {
      return {
        companyName: '',
        name: '',
        surname: '',
        govNumber: '',
        email: '',
      };
    }
    return {
      companyName: customer.companyName || '',
      name: customer.contactName || '',
      surname: customer.contactSurname || '',
      govNumber: customer.govNumber || '',
      email: customer.email || '',
    };
  };

  render() {
    const {
      classes,
      unmarkedVisited,
      theme,
      makeStepActive,
      updateCustomerInfo,
      createNewProject: { customer },
      i18n,
    } = this.props;
    const customers = get(this.props, 'customers.data') || [];
    return (
      <div>
        <SectionHeader
          title='Customers'
          subtitle='Add or create a customer using the form below.'
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
                  makeStepActive(0);
                  unmarkedVisited(0);
                }}
              />
              <Button
                title='Next'
                id='next-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  if (customer.isAlreadySaved) {
                    this._goToNextScreen();
                  } else {
                    // TODO:
                    (this as any).customerForm.submitForm();
                  }
                }}
              />
            </div>
          )}
        />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <SectionHeader
              title='Add an exisitng customer'
              classes={{ component: classes.formHeading }}
            />
            <form className={classes.form}>
              <SearchInput
                placeholder={'Search by typing a customer’s name or company '}
                showClearIcon={false}
                items={customers.map((item) => ({
                  ...item,
                  label: item.name,
                }))}
                onSearch={this._onSearch}
                onInputChange={this._onSearch}
                defaultInputValue={
                  customer.isAlreadySaved ? customer.companyName : ''
                }
                onItemClick={(item) => {
                  updateCustomerInfo({
                    companyName: get(item, 'name') || '',
                    contactName: get(item, 'contacts[0].name') || '',
                    contactSurname: get(item, 'contacts[0].surname') || '',
                    govNumber: get(item, 'govNumber') || '',
                    email: get(item, 'contacts[0].email') || '',
                    id: get(item, 'id') || '',
                    isAlreadySaved: item ? true : false,
                  });
                }}
              />
            </form>
            <SectionHeader
              title='Create a new customer'
              classes={{ component: classes.formHeading }}
            />
            <Formik
              initialValues={this._getInitialValue()}
              validationSchema={Yup.object().shape({
                companyName: Yup.string().required('Company Name is required'),
                name: Yup.string().required('Contact Name is required'),
                surname: Yup.string().required('Surname is required'),
                govNumber: Yup.string().required(
                  i18n._(`ABN`) + ' is required',
                ),
                // .test('is-abn', 'ABN is not valid', utils.validateABN),
                email: Yup.string()
                  .required('Email is required')
                  .email('Email is not valid'),
              })}
              onSubmit={(values) => {
                updateCustomerInfo({
                  companyName: values.companyName,
                  contactName: values.name,
                  contactSurname: values.surname,
                  govNumber: String(values.govNumber.replace(/ /g, '')),
                  email: values.email,
                });
                this._goToNextScreen();
              }}
              render={({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                // isSubmitting,
              }) => (
                <form
                  className={classes.form}
                  autoComplete='off'
                  onSubmit={handleSubmit}
                >
                  <div className={classes.input}>
                    <TextField
                      name='companyName'
                      id='companyName'
                      value={values.companyName}
                      label={'Company name'}
                      placeholder={'E.g: Google'}
                      showClearIcon={false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.companyName && errors.companyName}
                    />
                  </div>
                  <div className={cx(classes.halfFieldWRow, classes.input)}>
                    <TextField
                      label={'Contact name'}
                      placeholder={'E.g: John'}
                      showClearIcon={false}
                      classes={{ component: classes.leftInput }}
                      name='name'
                      id='name'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                    <TextField
                      label={'Contact surname'}
                      placeholder={'E.g: Smith'}
                      showClearIcon={false}
                      name='surname'
                      id='surname'
                      value={values.surname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.surname && errors.surname}
                    />
                  </div>
                  <div className={cx(classes.halfFieldWRow, classes.input)}>
                    <TextField
                      label={i18n._(`ABN`)}
                      placeholder={'E.g: 51824753556'}
                      showClearIcon={false}
                      classes={{ component: classes.leftInput }}
                      name='govNumber'
                      id='govNumber'
                      value={(values.govNumber || '').replace(/ /g, '')}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.govNumber && errors.govNumber}
                    />
                    <TextField
                      label={'Email'}
                      placeholder={'E.g: johndoe@gmail.com'}
                      showClearIcon={false}
                      name='email'
                      id='email'
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                    />
                  </div>
                </form>
              )}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose<any, any>(
  withI18n(),
  withStyles(styles),
  connect(
    (state: IReduxState) => ({
      createNewProject: state.sessionData.newProject,
      profile: state.profile,
    }),
    { ...actions },
  ),
  withState('searchText', 'setSearchText', ''),
  // withCustomers((props) => {
  //   let name;
  //   if (props.searchText) {
  //     name = props.searchText;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived: false,
  //         name_contains: name,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
)(CustomerStep);
