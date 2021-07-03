import { withStyles } from '@kudoo/components';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import unset from 'lodash/unset';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router';
import { compose, lifecycle, withHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import { DEFAULT_LOCALE, SUPPORTED_COUNTRIES_DAO } from 'src/helpers/locale';
import URL from 'src/helpers/urls';
import { AppActions, ProfileActions } from 'src/store/actions';
// import { SecurityRole } from 'src/store/types/security';
import styles from './styles';
import App, { IProps } from './view';

export default withRouter(
  compose(
    withStyles(styles),
    connect(
      (state: any) => ({
        profile: state.profile,
        app: state.app,
        DAOs: {
          data: [{ id: 1, name: 'Kudoo', owner: true }],
          refetch: () => {},
          loading: false,
        },
      }),
      (dispatch) => ({
        actions: bindActionCreators(
          {
            ...ProfileActions,
            ...AppActions,
          },
          dispatch,
        ),
      }),
    ),
    // withDAOs(
    //   ({ profile }) => ({
    //     skip: !profile.isLoggedIn,
    //     variables: {
    //       joined: true,
    //       created: true,
    //     },
    //   }),
    //   ({ data, ownProps }) => {
    //     const DAOs = get(data, 'DAOs') || [];
    //     const newDAOs: any = [];
    //     for (const dao of DAOs) {
    //       const daoMember: any =
    //         find(dao.daoMembers, {
    //           user: { id: get(ownProps, 'profile.id') },
    //         }) || {};
    //       let role = SecurityRole.user;
    //       if (get(ownProps, 'profile.isRoot')) {
    //         role = SecurityRole.root;
    //       } else if (daoMembers.role === 'OWNER') {
    //         role = SecurityRole.owner;
    //       } else if (daoMembers.role === 'ADMIN') {
    //         role = SecurityRole.admin;
    //       }
    //       if (
    //         daoMembers.role === 'OWNER' ||
    //         daoMembers.role === 'ADMIN'
    //       ) {
    //         newDAOs.push({ ...dao, owner: true, role });
    //       } else {
    //         newDAOs.push({ ...dao, role });
    //       }
    //     }
    //     return {
    //       data: newDAOs,
    //     };
    //   },
    // ),
    withHandlers<any, any>({
      checkActiveLanguage:
        ({ actions }) =>
        (props) => {
          const { profile, app } = props;
          if (!profile.selectedDAO && app.activeLanguage !== DEFAULT_LOCALE) {
            // if no dao is selected then set DEFAULT_LOCALE
            actions.setActiveLanguage(DEFAULT_LOCALE);
          } else if (profile.selectedDAO) {
            // if dao is selected then get dao country and set locale of country
            const daoCountry: any =
              find(SUPPORTED_COUNTRIES_DAO, {
                value: get(profile, 'selectedDAO.country') || 'other',
              }) || {};
            if (app.activeLanguage !== daoCountry.locale) {
              actions.setActiveLanguage(daoCountry.locale);
            }
          }
        },
      isPreviewRoute:
        ({ history }) =>
        () => {
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
      shouldRedirectToManageDAO:
        ({ DAOs, history }) =>
        () => {
          return (
            !get(DAOs, 'loading') &&
            get(DAOs, 'data.length') === 0 &&
            !matchPath(get(history, 'location.pathname'), {
              path: URL.ACCOUNT_SETTINGS({ path: true }),
            }) &&
            !matchPath(get(history, 'location.pathname'), {
              path: URL.MANAGE_DAOS({ path: true }),
            }) &&
            !matchPath(get(history, 'location.pathname'), {
              path: URL.CREATE_DAO({ path: true }),
            })
          );
        },
    }),
    lifecycle<IProps, {}>({
      componentDidMount() {
        this.props.checkActiveLanguage(this.props);
      },
      componentDidUpdate(prevProps: IProps) {
        let { profile, DAOs } = this.props;
        const prevPropsLoggedIn = get(prevProps, 'profile.isLoggedIn');
        const prevPropsProfile = prevProps.profile || {};
        if (prevPropsLoggedIn && profile.isLoggedIn !== prevPropsLoggedIn) {
          // profile isLoggedIn status changes
        }
        this.props.checkActiveLanguage(this.props);

        DAOs = get(DAOs, 'data', []);
        // DAOs data changes
        if (isEmpty(profile.selectedDAO) && DAOs.length > 0) {
          // if there is no dao selected then select first dao by default
          if (DAOs[0]) {
            this.props.actions.selectDAO(DAOs[0]);
          }
        } else if (
          !isEmpty(profile.selectedDAO) &&
          !find(DAOs, { id: get(profile, 'selectedDAO.id', '') })
        ) {
          // if dao is selected , but not able to find that dao in DAOs array
          // then select first dao by default
          if (DAOs[0]) {
            this.props.actions.selectDAO(DAOs[0]);
          }
        } else if (
          !isEmpty(profile.selectedDAO) &&
          find(DAOs, { id: get(profile, 'selectedDAO.id', '') })
        ) {
          // if dao is selected , and also find that dao in DAOs array
          const dao = find(DAOs, {
            id: get(profile, 'selectedDAO.id', ''),
          });
          // clone dao object
          const c1 = { ...(dao || {}) };
          const c2 = { ...(prevPropsProfile.selectedDAO || {}) };
          // remove `logo.url` key from c1 and c2 because `logo.url` is alaways changed when requested so it will never be equal to previous
          unset(c1, 'logo.url');
          unset(c2, 'logo.url');
          if (!isEqual(c1, c2)) {
            // if c1 and c2 is not equal i.e. dao data is updated then update it in redux
            this.props.actions.selectDAO(dao);
          }
          if (profile.isLoggedIn !== prevPropsLoggedIn && profile.isLoggedIn) {
            this.props.DAOs && this.props.DAOs.refetch();
          }
        }

        // update created DAOs
        const oldDAOsId = get(prevProps, 'profile.createdDAOs', []).map(
          (dao) => dao.id,
        );
        const newDAOsId = get(this.props, 'profile.createdDAOs', []).map(
          (dao) => dao.id,
        );
        if (!isEqual(oldDAOsId, newDAOsId)) {
          if (get(this.props, 'DAOs.refetch')) {
            this.props.DAOs.refetch();
          }
        }
      },
    }),
  )(App as any) as any,
);
