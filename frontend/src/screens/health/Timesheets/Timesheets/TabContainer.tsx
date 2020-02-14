import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import merge from 'lodash/merge';
import filter from 'lodash/filter';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStateHandlers, compose } from 'recompose';
import { ErrorBoundary, withStyles, withRouterProps } from '@kudoo/components';
import {
  withTimeSheets,
  withUpdateTimeSheet,
  withCompany,
} from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { TIMESHEET_STATUS } from '@client/helpers/constants';
import styles from './styles';

type Props = {
  actions: any;
  children: Function;
  users: any;
  timeSheets: any;
  updateTimeSheet: Function;
  addFilteredUser: Function;
  removeFilteredUser: Function;
  onlyMyTimesheet: boolean;
  theme: any;
  history: any;
  location: any;
  match: any;
};
type State = {
  timeSheetData: any;
  showViewEntriesModal: boolean;
  showingEntriesInModal: Array<any>;
};

class TabContainer extends Component<Props, State> {
  state = {
    timeSheetData: undefined,
    showViewEntriesModal: false,
    showingEntriesInModal: [],
  };

  componentDidMount() {
    this._updateTimesheetsData(this.props);
  }

  componentDidUpdate(prevProps) {
    const { timeSheets } = this.props;
    if (!isEqual(timeSheets, prevProps.timeSheets)) {
      this._updateTimesheetsData(this.props);
    }
  }

  _onCompanyChange = () => {
    this.props.users && this.props.users.refetch();
    this.props.timeSheets && this.props.timeSheets.refetch();
  };

  _updateTimesheetsData = props => {
    const { timeSheets } = props;
    const data = {};
    const timeSheetsArr = get(timeSheets, 'data', []);
    for (let i = 0; i < timeSheetsArr.length; i++) {
      const timeSheet = timeSheetsArr[i] || {};
      const timeSheetId = timeSheet.id;
      const timeSheetEntries = timeSheet.timeSheetEntries || [];
      for (let j = 0; j < timeSheetEntries.length; j++) {
        const entry = timeSheetEntries[j];
        const projectId = get(entry, 'project.id');
        const customerId = get(entry, 'customer.id');
        const serviceId = get(entry, 'service.id');
        const listItemId = `${projectId || customerId}:${serviceId}`;
        const listItem = data[listItemId] || {};
        const rows = listItem.rows || {};
        const timeSheetRow = get(rows, `${timeSheetId}`) || {
          hours: 0,
          entries: [],
        };
        const hours = timeSheetRow.hours + Number(entry.duration || 0) || 0;
        const entries = [...timeSheetRow.entries, entry];
        const invoicedEntries = filter(entries, { isInvoiced: true }) || [];
        let status = timeSheet.status;
        if (invoicedEntries.length > 0) {
          if (invoicedEntries.length === entries.length) {
            // total entries === total invoiced entries
            status = 'INVOICED';
          } else {
            // total entries != total invoiced entries
            status = 'PARTIALLY INVOICED';
          }
        }
        data[listItemId] = {
          ...listItem,
          id: listItemId,
          service: entry.service,
          customer: entry.customer,
          project: entry.project,
          rows: {
            ...rows,
            [timeSheetId]: {
              id: timeSheetId,
              user: timeSheet.user,
              hours,
              status,
              startsAt: moment(timeSheet.startsAt).format('DD MMM YYYY'),
              endsAt: moment(timeSheet.endsAt).format('DD MMM YYYY'),
              startsAtFormatted: moment(timeSheet.startsAt).format(),
              entries,
            },
          },
        };
      }
    }
    this.setState({
      timeSheetData: data,
    });
  };

  _archiveTimesheet = async timesheet => {
    try {
      const res = await this.props.updateTimeSheet({
        where: { id: timesheet.id },
        data: { isArchived: true },
      });
      if (res.success) {
        showToast(null, 'Timesheet archived successfully');
        this.props.timeSheets.refetch();
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong: ' + e.toString());
    }
  };

  _unArchiveTimesheet = async timesheet => {
    try {
      const res = await this.props.updateTimeSheet({
        where: { id: timesheet.id },
        data: { isArchived: false },
      });
      if (res.success) {
        showToast(null, 'Timesheet unarchived successfully');
        this.props.timeSheets.refetch();
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong: ' + e.toString());
    }
  };

  _showArchiveDialog = timesheet => {
    const { theme, actions } = this.props;
    const title = `Archive timesheet?`;
    const description = (
      <div>
        <div>Are you sure you want to archive timesheet?</div>
      </div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Archive',
        onClick: () => {
          actions.closeAlertDialog();
          this._archiveTimesheet(timesheet);
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _showUnarchiveDialog = timesheet => {
    const { theme, actions } = this.props;
    const title = `Unarchive timesheet?`;
    const description = (
      <div>
        <div>Are you sure you want to unarchive timesheet?</div>
      </div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Unarchive',
        onClick: () => {
          actions.closeAlertDialog();
          this._unArchiveTimesheet(timesheet);
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _toggleViewEntriesModal = (visible, entries = []) => {
    this.setState({
      showViewEntriesModal: visible,
      showingEntriesInModal: entries,
    });
  };

  render() {
    const {
      children,
      actions,
      history,
      location,
      match,
      addFilteredUser,
      removeFilteredUser,
      onlyMyTimesheet,
      users,
      timeSheets,
    } = this.props;
    const timeSheetsLoading = get(timeSheets, 'loading');
    return (
      <ErrorBoundary>
        <SelectedCompany onChange={this._onCompanyChange}>
          {children({
            ...this.state,
            actions,
            history,
            location,
            match,
            addFilteredUser,
            removeFilteredUser,
            users: get(users, 'data', []).filter(
              user => user.firstName && user.lastName
            ),
            showArchiveDialog: this._showArchiveDialog,
            showUnarchiveDialog: this._showUnarchiveDialog,
            toggleViewEntriesModal: this._toggleViewEntriesModal,
            onlyMyTimesheet,
            timeSheetsLoading,
            loadMore: get(timeSheets, 'loadNextPage'),
          })}
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  withStateHandlers(
    { filteredUsers: [] },
    {
      addFilteredUser: ({ filteredUsers }) => user => {
        const nextUsers: any = [...filteredUsers];
        nextUsers.push(user.id);
        return { filteredUsers: nextUsers };
      },
      removeFilteredUser: ({ filteredUsers }) => user => {
        const nextUsers: any = [...filteredUsers];
        const pos = nextUsers.indexOf(user.id);
        nextUsers.splice(pos, 1);
        return { filteredUsers: nextUsers };
      },
    }
  ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withUpdateTimeSheet(),
  withTimeSheets(props => {
    const type = props.timesheet_type;
    const profile = props.profile || {};
    let variables: any = {
      first: 10,
      where: {},
      orderBy: 'startsAt_DESC',
    };
    if (type === 'active') {
      variables = merge(variables, {
        where: {
          isArchived: false,
          status_not: TIMESHEET_STATUS.DRAFT,
        },
      });
    } else if (type === 'draft') {
      variables = merge(variables, {
        where: {
          isArchived: false,
          status: TIMESHEET_STATUS.DRAFT,
        },
      });
    } else if (type === 'archived') {
      variables = merge(variables, {
        where: {
          isArchived: true,
        },
      });
    }
    if (props.onlyMyTimesheet) {
      variables = merge(variables, {
        where: {
          user: {
            id: profile.id,
          },
        },
      });
    }
    if (props.filteredUsers && props.filteredUsers.length) {
      variables = merge(variables, {
        where: {
          user: {
            id_in: props.filteredUsers,
          },
        },
      });
    }
    return {
      variables,
    };
  }),
  withCompany(
    props => {
      const company = get(props.profile, 'selectedCompany', '');
      return {
        id: company.id,
      };
    },
    ({ data }) => {
      const companyMembers = get(data, 'company.companyMembers') || [];
      return {
        users: {
          data: companyMembers.map(cm => cm.user),
          loading: data.loading,
          refetch: data.refetch,
        },
      };
    }
  )
)(TabContainer);
