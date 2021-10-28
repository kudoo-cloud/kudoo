import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  Tooltip,
  withStyles,
} from '@kudoo/components';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import React, { useState } from 'react';
import {
  DaomemberFragment,
  useArchiveDaoMemberMutation,
  useDaomembersByDaoQuery,
} from 'src/generated/graphql';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import useDeepCompareEffect from 'src/helpers/useDeepCompareEffect';
import { useAllActions } from 'src/store/hooks';
import styles, { StyleKeys } from './styles';

type Props = IRouteProps<StyleKeys> & {
  deleteDaoMember?: Function;
};

const DAOUsers: React.FC<Props> = (props) => {
  const { classes, theme, match } = props;

  const actions = useAllActions();

  const daoId = (match?.params as any)?.daoId;
  const { data, refetch } = useDaomembersByDaoQuery({
    variables: {
      daoId,
    },
  });
  const [archiveDaoMemeber] = useArchiveDaoMemberMutation();
  const members = data?.daomembersByDao || [];

  const [displayedUser, setDisplayedUsers] = useState(
    [] as DaomemberFragment[],
  );
  const [columnData, setColumnsData] = useState([
    {
      id: 'firstName',
      label: 'Firstname',
      notSortable: true,
      sorted: true,
      order: 'asc',
    },
    { id: 'lastName', label: 'Lastname', notSortable: true },
    { id: 'email', label: 'Email', notSortable: true },
    { id: 'role', label: 'Role', notSortable: true },
    { id: 'status', label: 'Status', notSortable: true },
    // { id: 'sendEmail', label: 'Resend Email', notSortable: true },
  ]);

  useDeepCompareEffect(() => {
    updateDisplayedUsers(members);
  }, [members]);

  const getTableData = () => {
    return displayedUser.map((item) => ({
      id: item?.id,
      firstName: item?.user?.firstName || '-',
      lastName: item?.user?.lastName || '-',
      email: item?.user?.email,
      role: item?.role,
      status: item?.status,
    }));
  };

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
    const title = 'Delete member';
    const description = `Are you sure you want to remove member ?`;
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
      const res = await archiveDaoMemeber({
        variables: { id: row.id },
      });
      if (res?.data?.archiveDaomember?.id) {
        showToast(null, 'Member removed successfully');
        refetch();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const onRequestSort = (column) => {
    // const users = members || [];
    const sortedColumn = find(columnData, { sorted: true });
    const columnGoingToBeSorted = find(columnData, {
      id: column.id,
    });
    let order = 'asc';
    // const orderBy = column.id;

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

    // const sortedUsers =
    //   order === 'desc'
    //     ? users.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
    //     : users.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    // updateDisplayedUsers(sortedUsers);
    setColumnsData(columnData);
  };

  const updateDisplayedUsers = (users: DaomemberFragment[] = []) => {
    const newUsers = users.map((member) => ({
      ...member,
      role: member.role,
      daoMemberId: member.id,
    }));
    setDisplayedUsers(newUsers);
  };

  const resendInviteEmail = async () => {
    try {
      // const res = await resendInvite({
      //   email: data.email,
      //   role: data.role,
      //   daoMemberId: data.daoMemberId,
      //   baseURL: `${window.location.origin}/#/`,
      // });
      // if (res.success) {
      //   showToast(null, 'User Invited successfully');
      // } else {
      //   showToast('User is already in the dao');
      // }
    } catch (e) {
      showToast(e.toString());
    }
  };

  const renderUserTable = () => {
    return (
      <Table
        columnData={columnData}
        data={getTableData()}
        sortable
        onRequestSort={onRequestSort}
        cellRenderer={renderCell}
        onRemoveClicked={showRemoveAlert}
        onCellClick={(e, { row, column }) => {
          if (column.id === 'sendEmail' && row.status !== 'ACTIVE') {
            resendInviteEmail();
          }
        }}
        showRemoveIcon
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

export default withStyles(styles)(DAOUsers);
