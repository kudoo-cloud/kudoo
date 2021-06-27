import _ from 'lodash';
import get from 'lodash/get';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { SERVICE_BILLING_TYPE } from 'src/helpers/constants';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';

// Container Component
type ContainerProps = {
  actions: any;
  services: any;
  fetchingServices: boolean;
  styledComponent: any;
  deleteService: Function;
  archiveService: Function;
  unArchiveService: Function;
  setShowingServiceType: Function;
  history: any;
};
type ContainerState = {
  displayedServices: Array<Record<string, any>>;
  columns: any;
};
class TabContainer extends React.Component<ContainerProps, ContainerState> {
  static defaultProps = {
    services: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    deleteService: () => ({}),
    archiveService: () => ({}),
    unArchiveService: () => ({}),
  };

  state = {
    columns: [
      {
        id: 'name',
        label: 'Service',
        sorted: true,
        order: 'asc',
      },
      { id: 'billingType', label: 'Type' },
      { id: 'timeBasedType', label: 'Unit Type' },
      {
        id: 'totalAmount',
        label: 'Amount',
      },
    ],
    displayedServices: [],
  };

  componentDidMount() {
    this._updateServices(this.props.services);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.services, prevProps.services)) {
      this._updateServices(this.props.services);
    }
  }

  _updateServices = (services) => {
    this._transformServiceData(services);
  };

  _transformServiceData = (services) => {
    if (services) {
      const nextServices = get(services, 'data', []).map((node) => {
        const billingType =
          node.billingType === SERVICE_BILLING_TYPE.FIXED
            ? 'Fixed Billing'
            : 'Time Based Billing';
        return {
          ...node,
          name: node.name,
          billingType,
          timeBasedType: node.timeBasedType || '—',
          totalAmount: `${node.totalAmount}`,
        };
      });
      this.setState({ displayedServices: nextServices });
    }
  };

  _goToCreateService = () => {
    this.props.history.push(URL.CREATE_SERVICES());
  };

  _goToEditService = (id) => {
    this.props.history.push(URL.EDIT_SERVICE({ id }));
  };

  _onTypeChange = (label, index) => {
    const { setShowingServiceType } = this.props;
    if (index === 0) {
      setShowingServiceType('ALL');
    } else if (index === 1) {
      setShowingServiceType(SERVICE_BILLING_TYPE.FIXED);
    } else if (index === 2) {
      setShowingServiceType(SERVICE_BILLING_TYPE.TIME_BASED);
    }
  };

  _onSortRequested = async (column) => {
    const columns = this.state.columns;
    const sortedColumn = _.find(columns, { sorted: true });
    const columnGoingToBeSorted = _.find(columns, { id: column.id });

    let sortDirection = 'asc';
    if (sortedColumn.id === columnGoingToBeSorted.id) {
      if (sortedColumn.order === 'asc') {
        sortDirection = 'desc';
      }
    }
    const variables = {
      orderBy: `${columnGoingToBeSorted.id}_${sortDirection.toUpperCase()}`,
    };
    await this.props.services.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  _onArchiveServiceClicked = async (service) => {
    try {
      const res = await this.props.archiveService({
        where: { id: service.id },
        data: { isArchived: true },
      });
      if (res.success) {
        showToast(null, 'Service archived successfully');
        await this.props.services.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _onUnarchiveServiceClicked = async (service) => {
    try {
      const res = await this.props.unArchiveService({
        where: { id: service.id },
        data: { isArchived: false },
      });
      if (res.success) {
        showToast(null, 'Service activated successfully');
        await this.props.services.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _onRemoveServiceClicked = async (service) => {
    try {
      const res = await this.props.deleteService({ where: { id: service.id } });
      if (res.success) {
        showToast(null, 'Service deleted successfully');
        await this.props.services.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  render() {
    const StyledComponent = this.props.styledComponent;
    const { services = {} } = this.props;
    return (
      <SelectedCompany onChange={services.refetch}>
        <StyledComponent
          actions={this.props.actions}
          services={this.state.displayedServices}
          totalServices={get(this.props, 'services.data.length')}
          columns={this.state.columns}
          fetchingServices={get(this.props, 'services.loading')}
          onTypeChange={this._onTypeChange}
          goToCreateService={this._goToCreateService}
          goToEditService={this._goToEditService}
          onArchiveServiceClicked={this._onArchiveServiceClicked}
          onUnarchiveServiceClicked={this._onUnarchiveServiceClicked}
          onRemoveServiceClicked={this._onRemoveServiceClicked}
          onSortRequested={this._onSortRequested}
          onLoadMore={this.props.services.loadNextPage}
        />
      </SelectedCompany>
    );
  }
}

const TabContainerWithGraphQL = compose<any, any>(
  connect((state: any) => ({ profile: state.profile })),
  withState('showingServicesType', 'setShowingServiceType', 'ALL'),
  // withServices((props) => {
  //   const { type } = props;
  //   let isArchived;
  //   if (type === 'active-services') {
  //     isArchived = false;
  //   } else if (type === 'archived-services') {
  //     isArchived = true;
  //   }
  //   let billingType;
  //   if (props.showingServicesType === SERVICE_BILLING_TYPE.FIXED) {
  //     billingType = SERVICE_BILLING_TYPE.FIXED;
  //   } else if (props.showingServicesType === SERVICE_BILLING_TYPE.TIME_BASED) {
  //     billingType = SERVICE_BILLING_TYPE.TIME_BASED;
  //   }
  //   return {
  //     variables: {
  //       first: 20,
  //       where: {
  //         isArchived,
  //         isTemplate: true,
  //         billingType,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
  // withDeleteService(),
  // withUpdateService(() => ({ name: 'archiveService' })),
  // withUpdateService(() => ({ name: 'unArchiveService' })),
)(TabContainer);

export default (injectedProps: any) => (component: any) => {
  const TabContainerHOC = (props: any) => (
    <TabContainerWithGraphQL
      styledComponent={component}
      {...injectedProps}
      {...props}
    />
  );
  return TabContainerHOC;
};
