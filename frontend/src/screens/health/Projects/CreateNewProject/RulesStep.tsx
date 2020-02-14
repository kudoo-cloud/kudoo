import React, { Component } from 'react';
import cx from 'classnames';
import idx from 'idx';
import { withI18n } from '@lingui/react';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { Formik } from 'formik';
import { compose } from 'react-apollo';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import {
  withStyles,
  Button,
  SectionHeader,
  TextField,
  Checkbox,
  Dropdown,
  ToggleButton,
  withStylesProps,
} from '@kudoo/components';
import actions from '@client/store/actions/createNewProject';
import { SERVICE_BILLING_TYPE } from '@client/helpers/constants';
import { IReduxState } from '@client/store/reducers';
import styles from './styles';

type Props = {
  profile: any;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  addPaymentRule: Function;
  createNewProject: any;
  history: Record<string, any>;
  i18n: any;
  classes: any;
  theme: any;
};
type State = {
  rules: Array<any> | null;
  selectedService: any;
  alertVisible: boolean;
};

class RulesStep extends Component<Props, State> {
  state = {
    rules: null,
    selectedService: null,
    alertVisible: true,
  };

  componentDidMount() {
    const {
      createNewProject: { service },
    } = this.props;
    this.setState({
      selectedService: service.filter(
        ser => ser.billingType === SERVICE_BILLING_TYPE.FIXED
      )[0],
    });
  }

  _getSelectedServicePaymentRules() {
    const {
      createNewProject: { service },
    }: any = this.props;
    const foundService: any =
      find(service, {
        id: idx(this.state, (_: any) => _.selectedService.id),
      }) || {};
    const rules: any = [];
    for (const rule in foundService.paymentRule) {
      if (foundService.paymentRule.hasOwnProperty(rule)) {
        rules.push({ ...foundService.paymentRule[rule], period: rule });
      }
    }
    return rules;
  }

  render() {
    const {
      classes,
      makeStepActive,
      unmarkedVisited,
      markedVisited,
      theme,
      createNewProject: { service },
      addPaymentRule,
      i18n,
    } = this.props;
    const { selectedService, alertVisible } = this.state;
    const paymentRules = this._getSelectedServicePaymentRules();
    return (
      <div>
        <SectionHeader
          title='Payment Rules'
          subtitle='Rules allow you to assign parameters to each service.'
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
                  makeStepActive(2);
                  unmarkedVisited(2);
                }}
              />
              <Button
                title='Review Project'
                id='review-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  makeStepActive(4);
                  markedVisited(3);
                }}
              />
            </div>
          )}
        />
        <Grid container classes={{ container: classes.content }} spacing={40}>
          <Grid item xs={12} sm={4}>
            <SectionHeader title='Select a Service' />
            <div className={classes.rulesServices}>
              {service.map((ser, index) => {
                if (ser.billingType === SERVICE_BILLING_TYPE.TIME_BASED) {
                  return null;
                }
                return (
                  <div
                    className={cx(classes.rulesService, {
                      active: idx(selectedService, (_: any) => _.id) === ser.id,
                    })}
                    data-test={`added-services-${ser.name}`}
                    key={index}
                    onClick={() => {
                      this.setState({ selectedService: ser });
                    }}>
                    <div className={classes.rulesServiceName}>{ser.name}</div>
                    <div className={classes.rulesServiceAssign}>
                      {i18n._('currency-symbol')}
                      {ser.paymentTotal}
                    </div>
                  </div>
                );
              })}
            </div>
            {alertVisible && (
              <div className={classes.serviceAlert}>
                <div className={classes.serviceAlertText}>
                  Only fixed payment services can be assigned to a rule.
                </div>
                <div
                  className={classes.alertRemoveIcon}
                  onClick={() => this.setState({ alertVisible: false })}>
                  <i className='ion-android-close' />
                </div>
              </div>
            )}
          </Grid>
          <Grid item xs={12} sm={8}>
            <Formik
              initialValues={{
                period: '',
                fixedOrPercent: 'fixed',
                amount: '',
                // sendInvoiceToCustomer: false,
              }}
              validationSchema={Yup.object().shape({
                period: Yup.string().required('Please select time'),
                amount: Yup.string().required('Amount is required'),
              })}
              onSubmit={values => {
                const { selectedService } = this.state;
                addPaymentRule({
                  serviceId: idx(selectedService, (_: any) => _.id),
                  period: values.period,
                  type: values.fixedOrPercent,
                  amount: values.amount,
                  // sendInvoiceToCustomer: values.sendInvoiceToCustomer,
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
                <Grid
                  container
                  component='form'
                  onSubmit={handleSubmit as any}
                  spacing={16}
                  classes={{ container: classes.newRuleContainer }}>
                  <Grid item xs={12}>
                    <SectionHeader title='Create a new Rule' />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <div className={cx(classes.input)}>
                      <Dropdown
                        id='new-rule-when'
                        label='When'
                        placeholder={'Select a status'}
                        items={[
                          {
                            label: 'Project starts',
                            value: 'projectBegins',
                          },
                          { label: 'Project ends', value: 'projectEnds' },
                        ]}
                        selectedIndex={
                          values.period === 'projectBegins'
                            ? 0
                            : values.period === 'projectEnds'
                            ? 1
                            : null
                        }
                        onChange={item => {
                          setFieldValue('period', item.value);
                        }}
                      />
                    </div>
                    {/*<div className={classes.input}>*/}
                    {/*<Checkbox*/}
                    {/*classes={{ wrapper: classes.checkbox }}*/}
                    {/*label="Send invoice to customer"*/}
                    {/*onChange={checked => {*/}
                    {/*setFieldValue('sendInvoiceToCustomer', checked);*/}
                    {/*}}*/}
                    {/*value={values.sendInvoiceToCustomer}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    <div className={classes.input}>
                      <Button
                        id='add-rule'
                        title='Add Rule'
                        buttonColor={theme.palette.primary.color2}
                        width='200px'
                        compactMode
                        applyBorderRadius
                        type='submit'
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div className={cx(classes.input)}>
                      <ToggleButton
                        id='rule-type'
                        title='Type'
                        selectedIndex={
                          values.fixedOrPercent === 'fixed' ? 0 : 1
                        }
                        labels={[i18n._('currency-symbol'), '%']}
                        activeColor={theme.palette.primary.color3}
                        onChange={(item, index) => {
                          setFieldValue(
                            'fixedOrPercent',
                            index === 0 ? 'fixed' : 'percentage'
                          );
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <div className={cx(classes.input)}>
                      <TextField
                        label={'Amount'}
                        placeholder={'E.g: 200'}
                        showClearIcon={false}
                        name='amount'
                        id='amount'
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.amount && errors.amount}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.rulesList}>
                      {isEmpty(paymentRules) && (
                        <div className={classes.noRules}>
                          You haven’t assigned any rules
                        </div>
                      )}
                      {!isEmpty(paymentRules) && (
                        <div>
                          {paymentRules.map((rule, index) => (
                            <div
                              className={classes.rule}
                              key={index}
                              data-test='added-rules'>
                              <div className={classes.ruleDescription}>
                                <div className={classes.ruleLabel}>
                                  <span className={classes.highlightRuleText}>
                                    {rule.period === 'projectBegins'
                                      ? 'Project starts'
                                      : 'Project ends'}
                                  </span>
                                  {/*{rule.sendInvoiceToCustomer &&*/}
                                  {/*' send invoice to customer'}*/}
                                </div>
                                <div
                                  className={cx(
                                    classes.rulePercentage,
                                    classes.highlightRuleText
                                  )}>
                                  {rule.percentage}%
                                </div>
                                <div className={classes.ruleAmount}>
                                  {i18n._('currency-symbol')}
                                  {rule.amount}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={classes.serviceTotal}>
                      <div className={classes.serviceTotalLabel}>
                        Service Total:
                      </div>
                      <div className={classes.serviceTotalLabel}>
                        {i18n._('currency-symbol')}
                        {idx(selectedService, (_: any) => _.paymentTotal)}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              )}
            </Formik>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(styles),
  connect(
    (state: IReduxState) => ({
      createNewProject: idx(state, x => x.sessionData.newProject),
      profile: state.profile,
    }),
    {
      ...actions,
    }
  )
)(RulesStep);
