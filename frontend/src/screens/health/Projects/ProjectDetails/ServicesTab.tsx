import React, { Component } from 'react';
import idx from 'idx';
import cx from 'classnames';
import moment from 'moment';
import get from 'lodash/get';
import find from 'lodash/find';
import { connect } from 'react-redux';
import { withI18n } from '@lingui/react';
import { compose } from 'react-apollo';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  Button,
  SectionHeader,
  ErrorBoundary,
  TriangleArrow,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { withProject } from '@kudoo/graphql';
import {
  PROJECT_SERVICE_RULES_TYPE,
  SERVICE_BILLING_TYPE,
} from '@client/helpers/constants';
import ProjectProgress from './ProjectProgress';
import styles, { ServiceListItemStyles } from './styles';

type Props = {
  onMarkAsComplete: Function;
  projectCompleted: boolean;
  project: Record<string, any>;
  progressSteps: Array<any>;
  client: Record<string, any>;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
};

type State = {};

class ServicesTab extends Component<Props, State> {
  state = {};

  _isTypeService = type => projectService => {
    return get(projectService, 'service.billingType') === type;
  };

  _getServicesLength = type => {
    const { project } = this.props;
    return get(project, 'data.projectService', []).filter(
      this._isTypeService(type)
    ).length;
  };

  _renderServices = type => {
    const { history, project, i18n } = this.props;
    const startsAt = get(project, 'data.startsAt');
    const endsAt = get(project, 'data.endsAt');

    return get(project, 'data.projectService', [])
      .filter(this._isTypeService(type))
      .map(({ service, rules, amount }, index) => {
        const name = get(service, 'name', '');
        const includeConsTax = get(service, 'includeConsTax', false);
        const startRule =
          find(rules, { type: PROJECT_SERVICE_RULES_TYPE.PROJECT_STARTS }) ||
          {};
        const endRule =
          find(rules, { type: PROJECT_SERVICE_RULES_TYPE.PROJECT_ENDS }) || {};
        const startPercent = startRule.percent;
        const endPercent = endRule.percent;
        const startAmount = startRule.amount;
        const endAmount = endRule.amount;

        return (
          <ServiceItem
            type={type}
            key={index}
            name={name}
            price={i18n._('currency-symbol')`` + `${amount}`}
            id={idx(service, _ => _.id)}
            includeConsTax={includeConsTax}
            onEditClick={id => {
              history.push(URL.EDIT_SERVICE({ id }));
            }}
            data={
              type === SERVICE_BILLING_TYPE.FIXED
                ? [
                    {
                      agreement: 'Project Starts',
                      date: moment(startsAt).format('DD/MM/YYYY'),
                      status: 'Invoiced',
                      type: `${startPercent}%`,
                      amount: i18n._('currency-symbol')`` + `${startAmount}`,
                    },
                    {
                      agreement: 'Project Ends',
                      date: endsAt
                        ? moment(endsAt).format('DD/MM/YYYY')
                        : 'Undefined',
                      status: 'In Progress',
                      type: `${endPercent}%`,
                      amount: i18n._('currency-symbol')`` + `${endAmount}`,
                    },
                  ]
                : undefined
            }
          />
        );
      });
  };

  render() {
    const { classes, projectCompleted, theme, progressSteps } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.tabContentWrapper}>
          <SectionHeader
            title='Services'
            subtitle='Check the details below'
            renderLeftPart={() =>
              !projectCompleted ? (
                <Button
                  title='Mark as Complete'
                  applyBorderRadius
                  width={250}
                  buttonColor={theme.palette.primary.color2}
                  onClick={this.props.onMarkAsComplete}
                />
              ) : (
                <Button
                  title='Customer has paid'
                  applyBorderRadius
                  width={250}
                  buttonColor={theme.palette.primary.color2}
                  onClick={() => {}}
                />
              )
            }
          />
          <div className={classes.progressWrapper}>
            <ProjectProgress steps={progressSteps} />
          </div>
          <div className={classes.servicesList}>
            {this._getServicesLength(SERVICE_BILLING_TYPE.FIXED) > 0 && (
              <div className={classes.servicesListHeader}>
                <SectionHeader title='Fixed Payment' />
              </div>
            )}
            {this._renderServices(SERVICE_BILLING_TYPE.FIXED)}
            {this._getServicesLength(SERVICE_BILLING_TYPE.TIME_BASED) > 0 && (
              <div className={classes.servicesListHeader}>
                <SectionHeader title='Time-based Payment' />
              </div>
            )}
            {this._renderServices(SERVICE_BILLING_TYPE.TIME_BASED)}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withProject(props => ({
    id: get(props, 'match.params.id', ''),
  }))
)(ServicesTab);

type RowFlowType = {
  agreement: string;
  date: string;
  status: string;
  type: string;
  amount: string;
};

type ServiceItemProps = {
  classes: any;
  type: any;
  data: Array<RowFlowType>;
  isClosed: boolean;
  name: string;
  price: string;
  id: string;
  includeConsTax: boolean;
  onEditClick: Function;
  i18n: any;
};

type ServiceItemState = {
  isClosed: boolean;
};

class ServiceListItem extends Component<ServiceItemProps, ServiceItemState> {
  static defaultProps = {
    isClosed: false,
    onEditClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isClosed: props.isClosed || false,
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (props.isClosed !== prevProps.isClosed) {
      this.setState({ isClosed: props.isClosed });
    }
  }

  render() {
    const {
      classes,
      name,
      price,
      type,
      data,
      includeConsTax,
      id,
      onEditClick,
      i18n,
    } = this.props;
    const { isClosed } = this.state;
    const isFixed = type === SERVICE_BILLING_TYPE.FIXED;
    return (
      <ErrorBoundary>
        <div className={classes.wrapper}>
          <div className={classes.headerWrapper}>
            <div className={classes.headerTitle}>{name}</div>
            <div className={classes.priceWrapper}>
              <div className={classes.price}>{price}</div>
              <div className={classes.gstLabel}>
                {includeConsTax ? 'incl' : 'excl'} {i18n._(`GST`)}
              </div>
            </div>
            <div
              className={cx(classes.arrowWrapper, 'edit')}
              onClick={() => {
                onEditClick(id);
              }}>
              <i className={cx('fa fa-edit', classes.editIcon)} />
            </div>
            {isFixed && (
              <div
                className={classes.arrowWrapper}
                onClick={() => {
                  isFixed && this.setState({ isClosed: !isClosed });
                }}>
                <TriangleArrow
                  color={'white'}
                  size={10}
                  direction={isClosed ? 'right' : 'down'}
                />
              </div>
            )}
          </div>
          {isFixed && (
            <Collapse
              component='div'
              className={classes.collapse}
              in={!isClosed}
              timeout='auto'
              unmountOnExit>
              <div className={classes.collapseContent}>
                <Grid container>
                  <Grid item xs={12} sm={3}>
                    <div className={classes.cellHeader}>Service agreement</div>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div className={classes.cellHeader}>Date</div>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div className={classes.cellHeader}>Status</div>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div className={classes.cellHeader}>Type</div>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div className={classes.cellHeader}>Amount</div>
                  </Grid>
                </Grid>
                {data.map((row, index) => (
                  <Grid
                    container
                    classes={{ container: classes.row }}
                    key={index}>
                    <Grid item xs={12} sm={3}>
                      <div className={classes.cellValue}>{row.agreement}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className={classes.cellValue}>{row.date}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className={classes.cellValue}>{row.status}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className={classes.cellValue}>{row.type}</div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div className={classes.cellValue}>{row.amount}</div>
                    </Grid>
                  </Grid>
                ))}
              </div>
            </Collapse>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}
const ServiceItem = compose(
  withStyles(ServiceListItemStyles),
  withI18n()
)(ServiceListItem);
