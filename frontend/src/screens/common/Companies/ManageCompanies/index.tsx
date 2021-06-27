import {
  Button,
  CompanyCard,
  DottedCreateButton,
  withStyles,
} from '@kudoo/components';
import Collapse from '@material-ui/core/Collapse';
import cx from 'classnames';
import idx from 'idx';
// import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { IReduxState } from 'src/store/reducers';
// import { SecurityRole } from 'src/store/types/security';
import JoinModal from './JoinModal';
import styles from './styles';

type Props = {
  actions: any;
  companies: {
    createdCompanies: Array<any>;
    joinedCompanies: Array<any>;
  };
  allCompanies: Record<string, any>;
  updateCompany: Function;
  profile: Record<string, any>;
  theme: any;
  classes: any;
};
type State = {
  isCreatedCompanyOpen: boolean;
  isJoinedCompanyOpen: boolean;
  joinCompanyModalVisible: boolean;
};

class ManageCompanies extends Component<Props, State> {
  static defaultProps = {
    companies: { createdCompanies: [], joinedCompanies: [] },
    allCompanies: {},
    updateCompany: () => ({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      isCreatedCompanyOpen: true,
      isJoinedCompanyOpen: true,
      joinCompanyModalVisible: false,
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Manage Companies');
    this.props.actions.setTemporaryActiveLanguage(undefined);
  }

  componentDidUpdate(prevProps) {
    const profile = this.props.profile;
    if (
      !isEqual(
        get(this.props, 'companies.createdCompanies', []).map(
          (company) => company.id,
        ),
        get(prevProps, 'companies.createdCompanies', []).map(
          (company) => company.id,
        ),
      ) ||
      !isEqual(
        get(profile, 'createdCompanies', []).map((company) => company.id),
        get(prevProps, 'companies.createdCompanies', []).map(
          (company) => company.id,
        ),
      )
    ) {
      this.props.actions.setUserData({
        createdCompanies: get(this.props, 'companies.createdCompanies', []),
      });
    }
  }

  _reactivateCompany = (company) => async () => {
    try {
      this.props.actions.selectCompany({ ...company, owner: true });
      const res = await this.props.updateCompany({
        data: {
          isArchived: false,
        },
        where: {
          id: company.id,
        },
      });
      if (res.success) {
        showToast(null, 'Company Re-activated');
        // Reloading page , as re-activation of company will affect sidebar also
        window.location.reload();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _openJoinCompanyModal = () => {
    this.setState({ joinCompanyModalVisible: true });
  };

  _closeJoinCompanyModal = () => {
    this.setState({ joinCompanyModalVisible: false });
  };

  _renderCreatedCompanies() {
    const { classes, companies, theme } = this.props;
    const { isCreatedCompanyOpen } = this.state;
    return (
      <div className={classes.collapseRoot}>
        <div
          className={classes.collapseTitle}
          onClick={() => {
            this.setState({ isCreatedCompanyOpen: !isCreatedCompanyOpen });
          }}
        >
          <div>Created Companies</div>
          <i
            className={cx('icon icon-chevron-right', classes.collapseIcon, {
              down: isCreatedCompanyOpen,
            })}
          />
        </div>
        <Collapse
          in={this.state.isCreatedCompanyOpen}
          timeout='auto'
          unmountOnExit
          data-test='create-company-wrapper'
          classes={{
            wrapperInner: classes.collapseContent,
          }}
        >
          <Link className={classes.cardComponent} to={URL.CREATE_COMPANY()}>
            <DottedCreateButton id='create-company' text='Create new company' />
          </Link>
          {(idx(companies, (x) => x.createdCompanies) || []).map((company) => (
            <div
              className={classes.companyCardWrapper}
              key={company.id}
              data-test={
                !company.isArchived
                  ? `created-company-${company.name}`
                  : `created-archived-company-${company.name}`
              }
            >
              <Link
                className={classes.companyCard}
                to={URL.COMPANY_SETTINGS({ companyId: company.id })}
                onClick={() => {
                  this.props.actions.selectCompany({
                    ...company,
                    owner: true,
                  });
                }}
              >
                <CompanyCard
                  imageUrl={
                    get(company, 'logo.url')
                      ? get(company, 'logo.url')
                      : undefined
                  }
                  primaryLabel={company.name}
                  secondaryLabel='Owner'
                />
              </Link>
              {company.isArchived && (
                <div className={classes.deletedCompanyMsgWrapper}>
                  <div className={classes.deletedCompanyMsg}>
                    This company has been deleted and will disappear after 7
                    days.
                  </div>
                  <Button
                    title='Re-activate'
                    applyBorderRadius
                    buttonColor={theme.palette.primary.color2}
                    onClick={this._reactivateCompany(company)}
                  />
                </div>
              )}
            </div>
          ))}
        </Collapse>
      </div>
    );
  }

  _renderJoinedCompanies() {
    const { classes, companies, theme } = this.props;
    const { isJoinedCompanyOpen } = this.state;
    return (
      <div className={classes.collapseRoot}>
        <div
          className={classes.collapseTitle}
          onClick={() => {
            this.setState({ isJoinedCompanyOpen: !isJoinedCompanyOpen });
          }}
        >
          <div>Joined Companies</div>
          <i
            className={cx('icon icon-chevron-right', classes.collapseIcon, {
              down: isJoinedCompanyOpen,
            })}
          />
        </div>
        <Collapse
          in={this.state.isJoinedCompanyOpen}
          timeout='auto'
          unmountOnExit
          classes={{
            wrapperInner: classes.collapseContent,
          }}
        >
          {(idx(companies, (x) => x.joinedCompanies) || []).map((company) => (
            <div
              className={classes.companyCardWrapper}
              key={company.id}
              data-test={
                !company.isArchived
                  ? `joined-company-${company.name}`
                  : `joined-archived-company-${company.name}`
              }
            >
              <div
                className={classes.companyCard}
                style={{ cursor: 'initial' }}
              >
                <CompanyCard
                  imageUrl={
                    get(company, 'logo.url')
                      ? get(company, 'logo.url')
                      : undefined
                  }
                  primaryLabel={company.name}
                  secondaryLabel='Employee'
                  borderColor={theme.palette.primary.color3}
                  isJoinedCompany
                />
              </div>
              {company.isArchived && (
                <div className={classes.deletedCompanyMsgWrapper}>
                  <div className={classes.deletedCompanyMsg}>
                    This company has been deleted and will disappear after 7
                    days.
                  </div>
                </div>
              )}
            </div>
          ))}
        </Collapse>
      </div>
    );
  }

  render() {
    const { classes, companies, allCompanies } = this.props;
    const { joinCompanyModalVisible } = this.state;
    return (
      <div className={classes.page}>
        {this._renderCreatedCompanies()}
        {this._renderJoinedCompanies()}
        <JoinModal
          visible={joinCompanyModalVisible}
          createdCompanies={get(companies, 'createdCompanies', [])}
          joinedCompanies={get(companies, 'joinedCompanies', [])}
          allCompanies={allCompanies}
          onClose={this._closeJoinCompanyModal}
        />
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withUpdateCompany(),
  // withCompanies(
  //   () => ({
  //     variables: {
  //       joined: true,
  //       created: true,
  //     },
  //   }),
  //   ({ data, ownProps }) => {
  //     const companies = get(data, 'companies') || [];
  //     const createdCompanies: any = [];
  //     const joinedCompanies: any = [];
  //     for (let index = 0; index < companies.length; index++) {
  //       const company = companies[index] || {};
  //       const companyMember = find(company.companyMembers, {
  //         user: { id: get(ownProps, 'profile.id') },
  //       });
  //       let role = SecurityRole.user;
  //       if (get(ownProps, 'profile.isRoot')) {
  //         role = SecurityRole.root;
  //       } else if (companyMember.role === 'OWNER') {
  //         role = SecurityRole.owner;
  //       } else if (companyMember.role === 'ADMIN') {
  //         role = SecurityRole.admin;
  //       }
  //       if (companyMember.role === 'OWNER' || companyMember.role === 'ADMIN') {
  //         createdCompanies.push({ ...company, role });
  //       } else {
  //         joinedCompanies.push({ ...company, role });
  //       }
  //     }
  //     return {
  //       createdCompanies,
  //       joinedCompanies,
  //     };
  //   },
  // ),
  // withCompanies(() => ({
  //   name: 'allCompanies',
  //   variables: {
  //     joined: true,
  //     created: true,
  //   },
  // })),
)(ManageCompanies);
