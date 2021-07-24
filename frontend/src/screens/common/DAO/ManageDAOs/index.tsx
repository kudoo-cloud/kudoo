import { DAOCard, DottedCreateButton, withStyles } from '@kudoo/components';
import Collapse from '@material-ui/core/Collapse';
import cx from 'classnames';
import get from 'lodash/get';
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { useDaosQuery } from 'src/generated/graphql';
import URL from 'src/helpers/urls';
import { useAllActions } from 'src/store/hooks';
import JoinModal from './JoinModal';
import styles from './styles';

type Props = {
  theme: any;
  classes: any;
};

const ManageDAOs: React.FC<Props> = (props) => {
  const { classes, theme } = props;

  const [isCreatedDaoOpen, setIsCreatedDaoOpen] = useState(true);
  const [isJoinedDaoOpen, setIsJoinedDaoOpen] = useState(false);
  const [joinDaoModalVisible, setJoinDaoModalVisible] = useState(false);
  // const [] = useUpdateDaoMutation();
  const { data } = useDaosQuery();
  const daos = data?.daos;

  const { updateHeaderTitle, setTemporaryActiveLanguage, selectDAO } =
    useAllActions();

  useEffect(() => {
    updateHeaderTitle('Manage DAOs');
    setTemporaryActiveLanguage(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const _reactivateDAO = (dao) => async () => {
  //   try {
  //     selectDAO({ ...dao, owner: true });
  //     const res = await this.props.updateDao({
  //       data: {
  //         isArchived: false,
  //       },
  //       where: {
  //         id: dao.id,
  //       },
  //     });
  //     if (res.success) {
  //       showToast(null, 'DAO Re-activated');
  //       // Reloading page , as re-activation of dao will affect sidebar also
  //       window.location.reload();
  //     } else {
  //       res.error.map((err) => showToast(err));
  //     }
  //   } catch (e) {
  //     showToast(e.toString());
  //   }
  // };

  // const _openJoinDAOModal = () => {
  //   setIsJoinedDaoOpen(true);
  // };

  const closeJoinDAOModal = () => {
    setJoinDaoModalVisible(false);
  };

  const renderCreatedDAOs = () => {
    return (
      <div className={classes.collapseRoot}>
        <div
          className={classes.collapseTitle}
          onClick={() => {
            setIsCreatedDaoOpen((val) => !val);
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
          in={isCreatedDaoOpen}
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
          {(daos || []).map((dao) => (
            <div className={classes.daoCardWrapper} key={dao.id}>
              <Link
                className={classes.daoCard}
                to={URL.DAO_SETTINGS({ daoId: dao.id })}
                onClick={() => {
                  selectDAO({
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
              {/* {dao.isArchived && (
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
              )} */}
            </div>
          ))}
        </Collapse>
      </div>
    );
  };

  const renderJoinedDAOs = () => {
    return (
      <div className={classes.collapseRoot}>
        <div
          className={classes.collapseTitle}
          onClick={() => {
            setIsJoinedDaoOpen((val) => !val);
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
          in={isJoinedDaoOpen}
          timeout='auto'
          unmountOnExit
          classes={{
            wrapperInner: classes.collapseContent,
          }}
        >
          {[].map((dao) => (
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
  };

  return (
    <div className={classes.page}>
      {renderCreatedDAOs()}
      {renderJoinedDAOs()}
      <JoinModal
        visible={joinDaoModalVisible}
        createdDAOs={daos || []}
        joinedDAOs={[]}
        allDAOs={daos}
        onClose={closeJoinDAOModal}
      />
    </div>
  );
};

export default compose(withStyles(styles))(ManageDAOs);
