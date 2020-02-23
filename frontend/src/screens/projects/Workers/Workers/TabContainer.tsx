import React, { Component } from 'react';
import get from 'lodash/get';
import { withI18n } from '@lingui/react';
import compact from 'lodash/compact';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouterProps } from '@kudoo/components';
import {
  withCompany,
  withUpdateCompanyMember,
  withDeleteCompanyMember,
} from '@kudoo/graphql';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { showToast } from '@client/helpers/toast';

type Props = {
  actions: any;
  children: any;
  workers: any;
  updateCompanyMember: Function;
  deleteCompanyMember: Function;
  i18n: any;
  columns: any;
  profile: any;
};
type State = {
  columns: any;
};

class TabContainer extends Component<Props, State> {
  data: Array<Record<string, any>>;

  constructor(props: Props) {
    super(props);
    this.state = {
      columns: [
        {
          id: 'name',
          label: 'Worker name',
          sorted: true,
          order: 'asc',
        },
        { id: 'email', label: 'Email' },
        {
          id: 'money_made',
          label: 'Money Made',
        },
        {
          id: 'money_owed',
          label: 'Money Owed',
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    const oldCompanyId = get(prevProps, 'profile.selectedCompany.id');
    const newCompanyId = get(this.props, 'profile.selectedCompany.id');
    if (oldCompanyId !== newCompanyId) {
      this.props.workers.refetch();
    }
  }

  _onSortRequested = () => {};

  _onArchiveWorker = async worker => {
    try {
      if (worker.role === 'OWNER' || worker.role === 'ADMIN') {
        showToast("Can't archive owner");
        return;
      }
      const res = await this.props.updateCompanyMember({
        where: { id: worker.memberId },
        data: {
          isArchived: true,
        },
      });
      if (res.success) {
        showToast(null, 'Worker archived successfully');
        this.props.workers.refetch();
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _onUnarchiveWorker = async worker => {
    try {
      const res = await this.props.updateCompanyMember({
        where: { id: worker.memberId },
        data: {
          isArchived: false,
        },
      });
      if (res.success) {
        showToast(null, 'Worker un-archived successfully');
        this.props.workers.refetch();
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _onRemoveWorker = async worker => {
    try {
      if (worker.role === 'OWNER' || worker.role === 'ADMIN') {
        showToast("Can't remove owner");
        return;
      }
      const res = await this.props.deleteCompanyMember({ id: worker.memberId });
      if (res.success) {
        showToast(null, 'Worker removed successfully');
        this.props.workers.refetch();
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  render() {
    const { columns } = this.state;
    const { workers = {}, i18n } = this.props;
    const workerRows = get(workers, 'data', []).map(worker => ({
      ...worker,
      id: worker.id,
      name: `${worker.firstName} ${worker.lastName}`,
      email: worker.email,
      money_made: i18n._('currency-symbol') + '0',
      money_owed: i18n._('currency-symbol') + '0',
      role: worker.role,
    }));
    return (
      <SelectedCompany onChange={workers.refetch}>
        {this.props.children({
          ...this.props,
          workers: workerRows,
          columns,
          onSortRequested: this._onSortRequested,
          onArchiveWorker: this._onArchiveWorker,
          onUnarchiveWorker: this._onUnarchiveWorker,
          onRemoveWorker: this._onRemoveWorker,
          workersLoading: get(workers, 'loading'),
        })}
      </SelectedCompany>
    );
  }
}

export default compose(
  withI18n(),
  connect(state => ({ profile: state.profile })),
  withCompany(
    props => {
      const company = get(props, 'profile.selectedCompany') || {};
      return {
        id: company.id,
      };
    },
    ({ data, ownProps }) => {
      const companyMemebers = get(data, 'company.companyMembers') || [];
      let users = [];
      if (companyMemebers) {
        users = companyMemebers
          .filter(({ isDeleted }) => isDeleted === false)
          .map(({ id, user, role, isArchived }) => {
            if (ownProps.type === 'active-workers' && isArchived) {
              // if we want active workers but user is arcvhied
              return null;
            } else if (ownProps.type === 'archived-workers' && !isArchived) {
              // if we want archived workers but user is active
              return null;
            }
            return { ...user, role, memberId: id };
          });
      }
      return {
        workers: {
          data: compact(users),
          loading: data.loading,
          refetch: data.refetch,
        },
      };
    }
  ),
  withUpdateCompanyMember(),
  withDeleteCompanyMember()
)(TabContainer);
