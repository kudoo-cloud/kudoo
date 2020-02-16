import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import unset from 'lodash/unset';
import { compose, lifecycle, withHandlers } from 'recompose';
import { withRouter, matchPath } from 'react-router';
import { SecurityRole } from '@client/store/types/security';
import { ProfileActions, AppActions } from '@client/store/actions';
import { withStyles } from '@kudoo/components';
import URL from '@client/helpers/urls';
import { withCompanies } from '@kudoo/graphql';
import {
  SUPPORTED_COUNTRIES_COMPANY,
  DEFAULT_LOCALE,
} from '@client/helpers/locale';
import styles from './styles';
import App, { IProps } from './view';

export default withRouter(
  compose(
    withStyles(styles),
    connect(
      (state: any) => ({
        profile: state.profile,
        app: state.app,
      }),
      dispatch => ({
        actions: bindActionCreators(
          {
            ...ProfileActions,
            ...AppActions,
          },
          dispatch
        ),
      })
    ),
    withCompanies(
      ({ profile }) => ({
        skip: !profile.isLoggedIn,
        variables: {
          joined: true,
          created: true,
        },
      }),
      ({ data, ownProps }) => {
        const companies = get(data, 'companies') || [];
        const newCompanies: any = [];
        for (const company of companies) {
          const companyMember: any =
            find(company.companyMembers, {
              user: { id: get(ownProps, 'profile.id') },
            }) || {};
          let role = SecurityRole.user;
          if (get(ownProps, 'profile.isRoot')) {
            role = SecurityRole.root;
          } else if (companyMember.role === 'OWNER') {
            role = SecurityRole.owner;
          } else if (companyMember.role === 'ADMIN') {
            role = SecurityRole.admin;
          }
          if (
            companyMember.role === 'OWNER' ||
            companyMember.role === 'ADMIN'
          ) {
            newCompanies.push({ ...company, owner: true, role });
          } else {
            newCompanies.push({ ...company, role });
          }
        }
        return {
          data: newCompanies,
        };
      }
    ),
    withHandlers<any, any>({
      checkActiveLanguage: ({ actions }) => props => {
        const { profile, app } = props;
        if (!profile.selectedCompany && app.activeLanguage !== DEFAULT_LOCALE) {
          // if no company is selected then set DEFAULT_LOCALE
          actions.setActiveLanguage(DEFAULT_LOCALE);
        } else if (profile.selectedCompany) {
          // if company is selected then get company country and set locale of country
          const companyCountry: any =
            find(SUPPORTED_COUNTRIES_COMPANY, {
              value: get(profile, 'selectedCompany.country') || 'other',
            }) || {};
          if (app.activeLanguage !== companyCountry.locale) {
            actions.setActiveLanguage(companyCountry.locale);
          }
        }
      },
      isPreviewRoute: ({ history }) => () => {
        return (
          matchPath(get(history, 'location.pathname'), {
            path: '/preview/*',
          }) ||
          matchPath(get(history, 'location.pathname'), {
            path: '/email/:type/*',
          }) ||
          matchPath(get(history, 'location.pathname'), {
            path: '/integrations*',
          })
        );
      },
      shouldRedirectToManageCompany: ({ companies, history }) => () => {
        return (
          !get(companies, 'loading') &&
          get(companies, 'data.length') === 0 &&
          !matchPath(get(history, 'location.pathname'), {
            path: URL.ACCOUNT_SETTINGS({ path: true }),
          }) &&
          !matchPath(get(history, 'location.pathname'), {
            path: URL.MANAGE_COMPANIES({ path: true }),
          }) &&
          !matchPath(get(history, 'location.pathname'), {
            path: URL.CREATE_COMPANY({ path: true }),
          })
        );
      },
    }),
    lifecycle<IProps, {}>({
      componentDidMount() {
        this.props.checkActiveLanguage(this.props);
      },
      componentDidUpdate(prevProps: IProps) {
        let { profile, companies } = this.props;
        const prevPropsLoggedIn = get(prevProps, 'profile.isLoggedIn');
        const prevPropsProfile = prevProps.profile || {};
        if (prevPropsLoggedIn && profile.isLoggedIn !== prevPropsLoggedIn) {
          // profile isLoggedIn status changes
        }
        this.props.checkActiveLanguage(this.props);

        companies = get(companies, 'data', []);
        // companies data changes
        if (isEmpty(profile.selectedCompany) && companies.length > 0) {
          // if there is no company selected then select first company by default
          if (companies[0]) {
            this.props.actions.selectCompany(companies[0]);
          }
        } else if (
          !isEmpty(profile.selectedCompany) &&
          !find(companies, { id: get(profile, 'selectedCompany.id', '') })
        ) {
          // if company is selected , but not able to find that company in companies array
          // then select first company by default
          if (companies[0]) {
            this.props.actions.selectCompany(companies[0]);
          }
        } else if (
          !isEmpty(profile.selectedCompany) &&
          find(companies, { id: get(profile, 'selectedCompany.id', '') })
        ) {
          // if company is selected , and also find that company in companies array
          const company = find(companies, {
            id: get(profile, 'selectedCompany.id', ''),
          });
          // clone company object
          const c1 = { ...(company || {}) };
          const c2 = { ...(prevPropsProfile.selectedCompany || {}) };
          // remove `logo.url` key from c1 and c2 because `logo.url` is alaways changed when requested so it will never be equal to previous
          unset(c1, 'logo.url');
          unset(c2, 'logo.url');
          if (!isEqual(c1, c2)) {
            // if c1 and c2 is not equal i.e. company data is updated then update it in redux
            this.props.actions.selectCompany(company);
          }
          if (profile.isLoggedIn !== prevPropsLoggedIn && profile.isLoggedIn) {
            this.props.companies && this.props.companies.refetch();
          }
        }

        // update created companies
        const oldCompaniesId = get(
          prevProps,
          'profile.createdCompanies',
          []
        ).map(company => company.id);
        const newCompaniesId = get(
          this.props,
          'profile.createdCompanies',
          []
        ).map(company => company.id);
        if (!isEqual(oldCompaniesId, newCompaniesId)) {
          if (get(this.props, 'companies.refetch')) {
            this.props.companies.refetch();
          }
        }
      },
    })
  )(App as any) as any
);
