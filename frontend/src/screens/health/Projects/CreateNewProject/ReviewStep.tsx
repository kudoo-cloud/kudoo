import {
  Button,
  SectionHeader,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import { Trans, withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import idx from 'idx';
import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import {
  PROJECT_SERVICE_RULES_TYPE,
  PROJECT_STATUS,
  SERVICE_BILLING_TYPE,
} from 'src/helpers/constants';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import actions from 'src/store/actions/createNewProject';
import { IReduxState } from 'src/store/reducers';
import styles, { ReviewStepStyles } from './styles';

type Props = {
  profile: any;
  history: any;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  createNewProject: any;
  createCustomer: Function;
  createProject: Function;
  resetNewProjectData: Function;
  i18n: any;
  classes: any;
  theme: any;
};

type State = {};

class ReviewStep extends Component<Props, State> {
  public static defaultProps = {
    createProject: () => ({}),
    createCustomer: () => ({}),
    customer: {},
  };

  state = {};

  _isThereFixedService = () => {
    const {
      createNewProject: { service },
    } = this.props;
    return Boolean(find(service, { billingType: SERVICE_BILLING_TYPE.FIXED }));
  };

  _createProject = async () => {
    try {
      const newProject = this.props.createNewProject || {};
      const { customer, service }: any = newProject || {};
      let customerObj;
      if (customer.isAlreadySaved) {
        customerObj = {
          connect: {
            id: customer.id,
          },
        };
      } else {
        customerObj = {
          create: {
            name: customer.companyName,
            govNumber: customer.govNumber,
            contacts: {
              create: [
                {
                  name: customer.contactName,
                  surname: customer.contactSurname,
                  email: customer.email,
                },
              ],
            },
          },
        };
      }
      const services: any = [];
      for (let index = 0; index < (service || []).length; index++) {
        const serviceObj = service[index];
        let rules: any = [];
        if (serviceObj.billingType === SERVICE_BILLING_TYPE.FIXED) {
          const hasRules = Boolean(get(serviceObj, 'paymentRule'));
          const startRule = get(serviceObj, 'paymentRule.projectBegins');
          const endRule = get(serviceObj, 'paymentRule.projectEnds');
          if (hasRules) {
            rules = [
              {
                amount: Number(get(startRule, 'amount')),
                percent: Number(get(startRule, 'percentage')),
                type: PROJECT_SERVICE_RULES_TYPE.PROJECT_STARTS,
                isPercent: startRule.fixedOrPercent === 'percentage',
              },
              {
                amount: Number(get(endRule, 'amount')),
                percent: Number(get(endRule, 'percentage')),
                type: PROJECT_SERVICE_RULES_TYPE.PROJECT_ENDS,
                isPercent: endRule.fixedOrPercent === 'percentage',
              },
            ];
          } else {
            rules = [
              {
                amount: 0,
                percent: 0,
                type: PROJECT_SERVICE_RULES_TYPE.PROJECT_STARTS,
                isPercent: true,
              },
              {
                amount: Number(get(serviceObj, 'paymentTotal')),
                percent: 100,
                type: PROJECT_SERVICE_RULES_TYPE.PROJECT_ENDS,
                isPercent: true,
              },
            ];
          }
        }

        let newService = {};
        if (serviceObj.isAlreadySaved) {
          newService = {
            amount: Number(serviceObj.paymentTotal),
            service: {
              connect: {
                id: serviceObj.id,
              },
            },
            rules: rules.length > 0 ? { create: rules } : undefined,
          };
        } else {
          newService = {
            amount: Number(serviceObj.paymentTotal),
            rules: rules.length > 0 ? { create: rules } : undefined,
            service: {
              create: {
                name: serviceObj.name,
                billingType: serviceObj.billingType,
                includeConsTax: serviceObj.chargeGST,
                isTemplate: serviceObj.isTemplate,
                timeBasedType: serviceObj.perUnit
                  ? serviceObj.perUnit
                  : undefined,
                totalAmount: Number(serviceObj.paymentTotal),
              },
            },
          };
        }
        services.push(newService);
      }
      const data = {
        name: newProject.name,
        startsAt: moment().toISOString(),
        status: PROJECT_STATUS.STARTED,
        customer: customerObj,
        projectService: services.length > 0 ? { create: services } : undefined,
      };
      const projectRes = await this.props.createProject({ data });
      if (projectRes.success) {
        // Project created successfully
        showToast(null, 'Project created successfully');
        this.props.resetNewProjectData();
        this.props.history.push(URL.PROJECTS());
      } else {
        projectRes.error((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _goToStep = (index) => () => {
    this.props.makeStepActive(index);
  };

  _renderProjectName() {
    const { classes, createNewProject } = this.props;
    return (
      <div className={classes.projectNameWrapper}>
        {createNewProject.name}
        <i
          className={cx('fa fa-pencil', classes.editIcon)}
          style={{ color: 'white' }}
          onClick={this._goToStep(0)}
        />
      </div>
    );
  }

  _renderCustomerSection() {
    const {
      classes,
      createNewProject: { customer },
      i18n,
    } = this.props;
    return (
      <div className={classes.reviewSection}>
        <div className={classes.reviewSectionHeader}>
          Customer Details
          <i
            className={cx('fa fa-pencil', classes.editIcon)}
            onClick={this._goToStep(1)}
          />
        </div>
        <div className={classes.reviewSectionContent}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <div className={classes.customerValue}>
                {customer.companyName}
              </div>
              <div className={classes.customerValue}>
                {customer.contactName} {customer.contactSurname}
              </div>
              <div className={classes.customerValue}>{customer.govNumber}</div>
              <div
                className={classes.customerValue}
                style={{ marginBottom: 0 }}
              >
                {customer.email}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.customerKey}>Company name</div>
              <div className={classes.customerKey}>Contact name</div>
              <div className={classes.customerKey}>{i18n._(`ABN`)}</div>
              <div className={classes.customerKey} style={{ marginBottom: 0 }}>
                Email
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  _renderRulesSection() {
    const {
      classes,
      createNewProject: { service },
      i18n,
    } = this.props;
    return (
      <div className={classes.reviewSection}>
        <div className={classes.reviewSectionHeader}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              Services
              <i
                className={cx('fa fa-pencil', classes.editIcon)}
                onClick={this._goToStep(2)}
              />
            </Grid>
            <Grid item xs={6}>
              Rules Applied
              <i
                className={cx('fa fa-pencil', classes.editIcon)}
                onClick={this._goToStep(3)}
              />
            </Grid>
          </Grid>
        </div>
        {service.map((ser, index) => {
          const isLast = index === service.length - 1;
          const hasRules = Boolean(idx(ser, (_) => _.paymentRule));
          const projectStartRule = idx(ser, (_) => _.paymentRule.projectBegins);
          const projectEndRule = idx(ser, (_) => _.paymentRule.projectEnds);
          return (
            <div
              data-test={`added-service-${ser.name}`}
              className={cx(classes.reviewSectionContent, {
                [classes.sectionWithBottomBorder]: isLast,
              })}
              key={index}
            >
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <div className={classes.value}>{ser.name}</div>
                  <div
                    className={classes.value}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {ser.billingType} Payment
                  </div>
                  <div className={classes.value}>
                    <Trans id='currency-symbol' />
                    {ser.paymentTotal}{' '}
                    {ser.billingType === SERVICE_BILLING_TYPE.TIME_BASED
                      ? `per ${ser.perUnit.toLowerCase() || ''}`
                      : ''}{' '}
                    {ser.chargeGST ? 'incl' : 'excl'} {i18n._('GST')}
                  </div>
                </Grid>
                {ser.billingType === SERVICE_BILLING_TYPE.FIXED ? (
                  <Grid item xs={6}>
                    {hasRules && (
                      <div className={classes.value}>
                        Project Starts:{' '}
                        {idx(projectStartRule, (_) => _.fixedOrPercent) ===
                        'percentage'
                          ? `${idx(projectStartRule, (_) => _.percentage)}%`
                          : i18n._('currency-symbol') +
                            `${idx(projectStartRule, (_) => _.amount)}`}
                      </div>
                    )}
                    {hasRules && (
                      <div className={classes.value}>
                        Project Ends:{' '}
                        {idx(projectEndRule, (_) => _.fixedOrPercent) ===
                        'percentage'
                          ? `${idx(projectEndRule, (_) => _.percentage)}%`
                          : i18n._('currency-symbol') +
                            `${idx(projectEndRule, (_) => _.amount)}`}
                      </div>
                    )}
                    {!hasRules && (
                      <div>
                        <div className={classes.value}>Project Ends: 100%</div>
                        <div className={cx(classes.value, classes.greenValue)}>
                          Becasue you didn’t assign any rules to this service we
                          have applied our default.
                        </div>
                      </div>
                    )}
                  </Grid>
                ) : (
                  <Grid item xs={6}>
                    <div className={cx(classes.value, classes.greenValue)}>
                      Rules can’t be applied to Time-based payments
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { classes, makeStepActive, unmarkedVisited, theme } = this.props;
    return (
      <div>
        <SectionHeader
          title='Review your project'
          subtitle='Check the details below '
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Previous'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                withoutBackground
                onClick={() => {
                  const isThereFixedService = this._isThereFixedService();
                  if (isThereFixedService) {
                    // if there is fixed service go to service step
                    makeStepActive(3);
                    unmarkedVisited(4);
                  } else {
                    // if there is no fixed service skip rules step & go to service step
                    makeStepActive(2);
                    unmarkedVisited(4);
                    unmarkedVisited(3);
                    unmarkedVisited(2);
                  }
                }}
              />
              <Button
                title='Create Project'
                id='create-project-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={this._createProject}
              />
            </div>
          )}
        />
        {this._renderProjectName()}
        <div className={classes.projectInfoWrapper}>
          {this._renderCustomerSection()}
          {this._renderRulesSection()}
        </div>
      </div>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(composeStyles(styles, ReviewStepStyles)),
  connect(
    (state: IReduxState) => ({
      createNewProject: idx(state, (x) => x.sessionData.newProject),
      profile: state.profile,
    }),
    {
      ...actions,
    },
  ),
  // withCreateCustomer(),
  // withCustomer((props) => ({
  //   id: get(props, 'createNewProject.customer.id', ''),
  // })),
  // withCreateProject(),
)(ReviewStep);
