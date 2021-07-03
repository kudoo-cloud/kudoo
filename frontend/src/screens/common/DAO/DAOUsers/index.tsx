import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  Tooltip,
  withStyles,
} from '@kudoo/components';
import idx from 'idx';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import useDeepCompareEffect from 'src/helpers/useDeepCompareEffect';
import { IReduxState } from 'src/store/reducers';
import { IProfileState } from 'src/store/reducers/profile';
import { IDAOEntity } from 'src/store/types';
import styles, { StyleKeys } from './styles';

type Props = IRouteProps<StyleKeys> & {
  dao?: {
    refetch: Function;
    data: IDAOEntity;
  };
  profile?: IProfileState;
  deleteDaoMember?: Function;
  resendInvite?: Function;
};

const DAOUsers: React.FC<Props> = (props) => {
  const {
    classes,
    theme,
    dao,
    match,
    profile,
    resendInvite,
    deleteDaoMember,
    actions,
  } = props;
  const daoId = get(match, 'params.daoId', '');

  const [displayedUser, setDisplayedUsers] = useState([]);
  const [columnData, setColumnsData] = useState([
    { id: 'firstName', label: 'Name', sorted: true, order: 'asc' },
    { id: 'lastName', label: 'Surname' },
    { id: 'email', label: 'Email' },
    { id: 'access_level', label: 'Access Level' },
    { id: 'status', label: 'Status' },
    { id: 'sendEmail', label: 'Resend Email', notSortable: true },
  ]);

  useDeepCompareEffect(() => {
    updateDisplayedUsers(idx(dao, (x) => x.data.daoMembers) || []);
  }, [dao.data]);

  const renderCell = (row, column, ele) => {
    if (column.id === 'sendEmail' && row.status !== 'ACTIVE') {
      return (
        <div className={classes.resendEmailIconCell}>
          <Tooltip title={'Resend Invitation'}>
            {() => <i className='fa fa-envelope-o' />}
          </Tooltip>
        </div>
      );
    }
    return ele;
  };

  const showRemoveAlert = (row) => {
    if (row.role === 'OWNER') {
      showToast(
        "You can't remove owner of the dao without transfering ownership",
      );
      return;
    }
    const title = 'Delete member';
    const description = `Are you sure you want to remove ${
      row.firstName || ''
    } ${row.lastName || ''}?`;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Remove',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => removeMember(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const removeMember = async (row) => {
    try {
      const res = await deleteDaoMember({
        id: row.daoMemberId,
      });
      if (res.success) {
        showToast(null, 'Member removed successfully');
        dao.refetch();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const onRequestSort = (column) => {
    const users = idx(dao, (_) => _.data.daoMembers) || [];
    const sortedColumn = find(columnData, { sorted: true });
    const columnGoingToBeSorted = find(columnData, {
      id: column.id,
    });
    let order = 'asc';
    const orderBy = column.id;

    if (sortedColumn.id === columnGoingToBeSorted.id) {
      if (sortedColumn.order === 'asc') {
        order = 'desc';
      }
    } else {
      sortedColumn.sorted = false;
      sortedColumn.order = undefined;
    }

    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = order;

    const pos1 = findIndex(columnData, { id: columnGoingToBeSorted.id });
    columnData[pos1] = columnGoingToBeSorted;

    const pos2 = findIndex(columnData, { id: sortedColumn.id });
    columnData[pos2] = sortedColumn;

    const sortedUsers =
      order === 'desc'
        ? users.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : users.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    updateDisplayedUsers(sortedUsers);
    setColumnsData(columnData);
  };

  const updateDisplayedUsers = (users = []) => {
    const newUsers = users.map((member) => ({
      ...member,
      ...member.user,
      access_level: member.role,
      daoMemberId: member.id,
    }));
    setDisplayedUsers(newUsers);
  };

  const resendInviteEmail = async (data) => {
    try {
      const res = await resendInvite({
        email: data.email,
        role: data.role,
        daoMemberId: data.daoMemberId,
        baseURL: `${window.location.origin}/#/`,
      });
      if (res.success) {
        showToast(null, 'User Invited successfully');
      } else {
        showToast('User is already in the dao');
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  const renderUserTable = () => {
    const loggedInUserId = idx(profile, (_) => _.id);
    const user = find(displayedUser, { id: loggedInUserId }) || {};
    return (
      <Table
        columnData={columnData}
        data={displayedUser}
        sortable
        onRequestSort={onRequestSort}
        cellRenderer={renderCell}
        onRemoveClicked={showRemoveAlert}
        onCellClick={(e, { row, column }) => {
          if (column.id === 'sendEmail' && row.status !== 'ACTIVE') {
            resendInviteEmail(row);
          }
        }}
        showRemoveIcon={
          get(user, 'role') === 'OWNER' || get(user, 'role') === 'ADMIN'
        }
      />
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>
        <SectionHeader
          title='Users List'
          subtitle='Below is a list of all Users who have access to this dao account.'
          classes={{ component: classes.sectionHeadingWrapper }}
          renderLeftPart={() => (
            <Button
              id='invite-user-button'
              title='Invite new user'
              applyBorderRadius
              width={260}
              href={URL.INVITE_USER({ daoId })}
              target='_self'
              buttonColor={theme.palette.primary.color2}
            />
          )}
        />
        {renderUserTable()}
      </div>
    </ErrorBoundary>
  );
};

DAOUsers.defaultProps = {
  dao: { data: {} as IDAOEntity, refetch: () => {} },
  deleteDaoMember: () => ({}),
  resendInvite: () => ({}),
};

export default compose<Props, Props>(
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withDAO((props) => ({
  //   id: get(props, 'match.params.daoId'),
  // })),
  // withDeleteDaoMember(),
  // withResendInvite(),
)(DAOUsers);
