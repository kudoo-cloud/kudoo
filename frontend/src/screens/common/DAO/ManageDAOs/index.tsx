import {
  Button,
  DAOCard,
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
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { IReduxState } from 'src/store/reducers';
// import { SecurityRole } from 'src/store/types/security';
import JoinModal from './JoinModal';
import styles from './styles';

type Props = {
  actions: any;
  DAOs: {
    createdDAOs: Array<any>;
    joinedDAOs: Array<any>;
  };
  allDAOs: Record<string, any>;
  updateDao: Function;
  profile: Record<string, any>;
  theme: any;
  classes: any;
};
type State = {
  isCreatedDaoOpen: boolean;
  isJoinedDaoOpen: boolean;
  joinDaoModalVisible: boolean;
};

class ManageDAOs extends Component<Props, State> {
  static defaultProps = {
    DAOs: { createdDAOs: [], joinedDAOs: [] },
    allDAOs: {},
    updateDao: () => ({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      isCreatedDaoOpen: true,
      isJoinedDaoOpen: true,
      joinDaoModalVisible: false,
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Manage DAOs');
    this.props.actions.setTemporaryActiveLanguage(undefined);
  }

  componentDidUpdate(prevProps) {
    const profile = this.props.profile;
    if (
      !isEqual(
        get(this.props, 'DAOs.createdDAOs', []).map((dao) => dao.id),
        get(prevProps, 'DAOs.createdDAOs', []).map((dao) => dao.id),
      ) ||
      !isEqual(
        get(profile, 'createdDAOs', []).map((dao) => dao.id),
        get(prevProps, 'DAOs.createdDAOs', []).map((dao) => dao.id),
      )
    ) {
      this.props.actions.setUserData({
        createdDAOs: get(this.props, 'DAOs.createdDAOs', []),
      });
    }
  }

  _reactivateDAO = (dao) => async () => {
    try {
      this.props.actions.selectDAO({ ...dao, owner: true });
      const res = await this.props.updateDao({
        data: {
          isArchived: false,
        },
        where: {
          id: dao.id,
        },
      });
      if (res.success) {
        showToast(null, 'DAO Re-activated');
        // Reloading page , as re-activation of dao will affect sidebar also
        window.location.reload();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _openJoinDAOModal = () => {
    this.setState({ joinDaoModalVisible: true });
  };

  _closeJoinDAOModal = () => {
    this.setState({ joinDaoModalVisible: false });
  };

  _renderCreatedDAOs() {
    const { classes, DAOs, theme } = this.props;
    const { isCreatedDaoOpen } = this.state;
    return (
      <div className={classes.collapseRoot}>
        <div
          className={classes.collapseTitle}
          onClick={() => {
            this.setState({ isCreatedDaoOpen: !isCreatedDaoOpen });
          }}
        >
          <div>Created DAOs</div>
          <i
            className={cx('icon icon-chevron-right', classes.collapseIcon, {
              down: isCreatedDaoOpen,
            })}
          />
        </div>
        <Collapse
          in={this.state.isCreatedDaoOpen}
          timeout='auto'
          unmountOnExit
          data-test='create-dao-wrapper'
          classes={{
            wrapperInner: classes.collapseContent,
          }}
        >
          <Link className={classes.cardComponent} to={URL.CREATE_DAO()}>
            <DottedCreateButton id='create-dao' text='Create new dao' />
          </Link>
          {(idx(DAOs, (x) => x.createdDAOs) || []).map((dao) => (
            <div
              className={classes.daoCardWrapper}
              key={dao.id}
              data-test={
                !dao.isArchived
                  ? `created-dao-${dao.name}`
                  : `created-archived-dao-${dao.name}`
              }
            >
              <Link
                className={classes.daoCard}
                to={URL.DAO_SETTINGS({ daoId: dao.id })}
                onClick={() => {
                  this.props.actions.selectDAO({
                    ...dao,
                    owner: true,
                  });
                }}
              >
                <DAOCard
                  imageUrl={
                    get(dao, 'logo.url') ? get(dao, 'logo.url') : undefined
                  }
                  primaryLabel={dao.name}
                  secondaryLabel='Owner'
                />
              </Link>
              {dao.isArchived && (
                <div className={classes.deletedDAOMsgWrapper}>
                  <div className={classes.deletedDAOMsg}>
                    This dao has been deleted and will disappear after 7 days.
                  </div>
                  <Button
                    title='Re-activate'
                    applyBorderRadius
                    buttonColor={theme.palette.primary.color2}
                    onClick={this._reactivateDAO(dao)}
                  />
                </div>
              )}
            </div>
          ))}
        </Collapse>
      </div>
    );
  }

  _renderJoinedDAOs() {
    const { classes, DAOs, theme } = this.props;
    const { isJoinedDaoOpen } = this.state;
    return (
      <div className={classes.collapseRoot}>
        <div
          className={classes.collapseTitle}
          onClick={() => {
            this.setState({ isJoinedDaoOpen: !isJoinedDaoOpen });
          }}
        >
          <div>Joined DAOs</div>
          <i
            className={cx('icon icon-chevron-right', classes.collapseIcon, {
              down: isJoinedDaoOpen,
            })}
          />
        </div>
        <Collapse
          in={this.state.isJoinedDaoOpen}
          timeout='auto'
          unmountOnExit
          classes={{
            wrapperInner: classes.collapseContent,
          }}
        >
          {(idx(DAOs, (x) => x.joinedDAOs) || []).map((dao) => (
            <div
              className={classes.daoCardWrapper}
              key={dao.id}
              data-test={
                !dao.isArchived
                  ? `joined-dao-${dao.name}`
                  : `joined-archived-dao-${dao.name}`
              }
            >
              <div className={classes.daoCard} style={{ cursor: 'initial' }}>
                <DAOCard
                  imageUrl={
                    get(dao, 'logo.url') ? get(dao, 'logo.url') : undefined
                  }
                  primaryLabel={dao.name}
                  secondaryLabel='Employee'
                  borderColor={theme.palette.primary.color3}
                  isJoinedDAO
                />
              </div>
              {dao.isArchived && (
                <div className={classes.deletedDAOMsgWrapper}>
                  <div className={classes.deletedDAOMsg}>
                    This dao has been deleted and will disappear after 7 days.
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
    const { classes, DAOs, allDAOs } = this.props;
    const { joinDaoModalVisible } = this.state;
    return (
      <div className={classes.page}>
        {this._renderCreatedDAOs()}
        {this._renderJoinedDAOs()}
        <JoinModal
          visible={joinDaoModalVisible}
          createdDAOs={get(DAOs, 'createdDAOs', [])}
          joinedDAOs={get(DAOs, 'joinedDAOs', [])}
          allDAOs={allDAOs}
          onClose={this._closeJoinDAOModal}
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
  // withUpdateDao(),
  // withDAOs(
  //   () => ({
  //     variables: {
  //       joined: true,
  //       created: true,
  //     },
  //   }),
  //   ({ data, ownProps }) => {
  //     const daos = get(data, 'daos') || [];
  //     const createdDAOs: any = [];
  //     const joinedDAOs: any = [];
  //     for (let index = 0; index < daos.length; index++) {
  //       const dao = daos[index] || {};
  //       const daoMember = find(dao.daoMembers, {
  //         user: { id: get(ownProps, 'profile.id') },
  //       });
  //       let role = SecurityRole.user;
  //       if (get(ownProps, 'profile.isRoot')) {
  //         role = SecurityRole.root;
  //       } else if (daoMember.role === 'OWNER') {
  //         role = SecurityRole.owner;
  //       } else if (daoMember.role === 'ADMIN') {
  //         role = SecurityRole.admin;
  //       }
  //       if (daoMember.role === 'OWNER' || daoMember.role === 'ADMIN') {
  //         createdDAOs.push({ ...dao, role });
  //       } else {
  //         joinedDAOs.push({ ...dao, role });
  //       }
  //     }
  //     return {
  //       createdDAOs,
  //       joinedDAOs,
  //     };
  //   },
  // ),
  // withDAOs(() => ({
  //   name: 'allDAOs',
  //   variables: {
  //     joined: true,
  //     created: true,
  //   },
  // })),
)(ManageDAOs);
