import {
  Button,
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  ToggleButton,
  withStyles,
} from '@kudoo/components';
import { Trans } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
  useDeleteRegisteredServiceMutation,
  useRegisteredServiceByDaoQuery,
  useUnarchiveRegisteredServiceMutation,
} from 'src/generated/graphql';
import { SERVICE_BILLING_TYPE } from 'src/helpers/constants';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  registeredServices: any;
  registeredServicesLoading: boolean;
  classes: any;
  theme: any;
}

const ArchivedServiceTab: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const actions = useAllActions();
  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [columns] = useState([
    {
      id: 'name',
      label: 'Service',
      sorted: true,
      order: 'asc',
      notSortable: true,
    },
    { id: 'billingType', label: 'Type', notSortable: true },
    { id: 'timeBasedType', label: 'Unit Type', notSortable: true },
  ]);

  const [filterServices, setFilterServices] = useState([]);
  const [serviceType, setShowingServiceType] = useState('ALL');

  const history = useHistory();

  const [deleteRegisteredService] = useDeleteRegisteredServiceMutation();
  const [unarchiveRegisteredService] = useUnarchiveRegisteredServiceMutation();

  const { data, loading, refetch } = useRegisteredServiceByDaoQuery({
    variables: {
      daoId,
      archived: true,
    },
    skip: !daoId,
  });

  useEffect(() => {
    if (refetch) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  const registeredServices = data?.registeredServiceByDao || [];

  useEffect(() => {
    if ((data?.registeredServiceByDao || []).length > 0) {
      setFilterServices(data?.registeredServiceByDao || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.registeredServiceByDao]);

  useEffect(() => {
    if (serviceType === 'ALL') {
      setFilterServices(registeredServices);
    } else if (serviceType === SERVICE_BILLING_TYPE.FIXED) {
      const newFilterService = (registeredServices || []).filter(
        (v) => v.billingType === SERVICE_BILLING_TYPE.FIXED,
      );

      setFilterServices(newFilterService);
    } else if (serviceType === SERVICE_BILLING_TYPE.TIME_BASED) {
      const newFilterService = (registeredServices || []).filter(
        (v) => v.billingType === SERVICE_BILLING_TYPE.TIME_BASED,
      );

      setFilterServices(newFilterService);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  const _onRequestSort = async () => {
    // const sortedColumn = find(columns, { sorted: true });
    // const columnGoingToBeSorted = find(columns, { id: column.id });
    // let sortDirection = 'asc';
    // if (sortedColumn.id === columnGoingToBeSorted.id) {
    //   if (sortedColumn.order === 'asc') {
    //     sortDirection = 'desc';
    //   }
    // }
    // const variables = {
    //   orderBy: `${columnGoingToBeSorted.id}_${sortDirection.toUpperCase()}`,
    // };
    // await refetch(variables);
    // sortedColumn.sorted = false;
    // columnGoingToBeSorted.sorted = true;
    // columnGoingToBeSorted.order = sortDirection;
    // setColumns(column);
  };

  const _renderSectionHeading = () => {
    return (
      <SectionHeader
        title='Service Templates'
        subtitle='Below is a list of all your saved services. These services can be used to quickly create projects, invoices and timesheets.'
        renderLeftPart={() => (
          <Button
            title='Create New Service'
            id='create-service'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_SERVICES());
            }}
          />
        )}
      />
    );
  };

  const _onTypeChange = (label, index) => {
    if (index === 0) {
      setShowingServiceType('ALL');
    } else if (index === 1) {
      setShowingServiceType(SERVICE_BILLING_TYPE.FIXED);
    } else if (index === 2) {
      setShowingServiceType(SERVICE_BILLING_TYPE.TIME_BASED);
    }
  };

  const _renderNoService = () => {
    return (
      <div className={classes.noServiceWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no service. <br />
            Let’s start by creating a new service.
          </div>
        </div>
      </div>
    );
  };

  const _renderCell = (row, cell, ele) => {
    if (cell.id === 'name') {
      return (
        <Link
          to={URL.EDIT_SERVICE({ id: row.id })}
          className={classes.nameValueCell}
        >
          {ele}
        </Link>
      );
    } else if (cell.id === 'totalAmount') {
      return (
        <div className={classes.amountCell}>
          <Trans id='currency-symbol' /> {row[cell.id]}
        </div>
      );
    }
    return ele;
  };

  const _showDeleteDialog = (row) => {
    const title = 'Permanently delete service?';
    const description = `Are you sure you want to delete this service?`;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Delete Service',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => deleteService(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const deleteService = async (row) => {
    try {
      const res = await deleteRegisteredService({
        variables: { id: row.id },
      });
      if (res?.data?.deleteRegisteredService.id) {
        showToast(null, 'Service deleted successfully');
        refetch({
          daoId,
        });
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _showUnarchivedDialog = (row) => {
    const title = 'Activate service?';
    const description = `Are you sure you want to re-active this service?`;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Activate Service',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => activateService(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const activateService = async (row) => {
    try {
      const res = await unarchiveRegisteredService({
        variables: { id: row.id },
      });
      if (res?.data?.unarchiveRegisteredService.id) {
        showToast(null, 'Service activated successfully');
        refetch();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _renderService = () => {
    return (
      <div className={classes.servicesContainer}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <ToggleButton
              labels={['All', 'Fixed Billing', 'Timed Billing']}
              selectedIndex={0}
              activeColor={theme.palette.primary.color1}
              onChange={_onTypeChange}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Table
              columnData={columns}
              data={filterServices}
              stripe={false}
              showRemoveIcon={true}
              showAddIcon={true}
              sortable
              onRequestSort={_onRequestSort}
              onRemoveClicked={_showDeleteDialog}
              onAddClicked={_showUnarchivedDialog}
              loading={loading}
              cellRenderer={_renderCell}
              onBottomReachedThreshold={500}
              onBottomReached={() => {
                if (!loading) {
                  // onLoadMore();
                }
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>
        <div className={classes.content}>
          {_renderSectionHeading()}
          {loading && <Loading />}
          {!loading && registeredServices.length === 0 && _renderNoService()}
          {registeredServices.length > 0 && _renderService()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(ArchivedServiceTab);
