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
import { ICompanyEntity } from 'src/store/types';
import styles, { StyleKeys } from './styles';

type Props = IRouteProps<StyleKeys> & {
  company?: {
    refetch: Function;
    data: ICompanyEntity;
  };
  profile?: IProfileState;
  deleteCompanyMember?: Function;
  resendInvite?: Function;
};

const CompaniesUsers: React.FC<Props> = (props) => {
  const {
    classes,
    theme,
    company,
    match,
    profile,
    resendInvite,
    deleteCompanyMember,
    actions,
  } = props;
  const companyId = get(match, 'params.companyId', '');

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
    updateDisplayedUsers(idx(company, (x) => x.data.companyMembers) || []);
  }, [company.data]);

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
        "You can't remove owner of the company without transfering ownership",
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
      const res = await deleteCompanyMember({
        id: row.companyMemberId,
      });
      if (res.success) {
        showToast(null, 'Member removed successfully');
        company.refetch();
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
    const users = idx(company, (_) => _.data.companyMembers) || [];
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
      companyMemberId: member.id,
    }));
    setDisplayedUsers(newUsers);
  };

  const resendInviteEmail = async (data) => {
    try {
      const res = await resendInvite({
        email: data.email,
        role: data.role,
        companyMemberId: data.companyMemberId,
        baseURL: `${window.location.origin}/#/`,
      });
      if (res.success) {
        showToast(null, 'User Invited successfully');
      } else {
        showToast('User is already in the company');
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
          subtitle='Below is a list of all Users who have access to this company account.'
          classes={{ component: classes.sectionHeadingWrapper }}
          renderLeftPart={() => (
            <Button
              id='invite-user-button'
              title='Invite new user'
              applyBorderRadius
              width={260}
              href={URL.INVITE_USER({ companyId })}
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

CompaniesUsers.defaultProps = {
  company: { data: {} as ICompanyEntity, refetch: () => {} },
  deleteCompanyMember: () => ({}),
  resendInvite: () => ({}),
};

export default compose<Props, Props>(
  withStyles(styles),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withCompany((props) => ({
  //   id: get(props, 'match.params.companyId'),
  // })),
  // withDeleteCompanyMember(),
  // withResendInvite(),
)(CompaniesUsers);
