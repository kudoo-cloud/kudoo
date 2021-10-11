import {
  Button,
  Dropdown,
  ErrorBoundary,
  Loading,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import {
  useArchiveTimesheetMutation,
  useSuppliersByDaoQuery,
  useTimesheetsByDaoQuery,
  useUnarchiveTimesheetMutation,
} from 'src/generated/graphql';
import { TIMESHEET_STATUS } from 'src/helpers/constants';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import ActiveTimesheets from './ActiveTimesheetsTab';
import ArchivedTimesheets from './ArchivedTimesheetsTab';
import DraftTimesheetsTab from './DraftTimesheetsTab';
import { ActiveTimesheetsStyles } from './styles';
import TimesheetNotificationModal from './TimesheetNotificationModal';
import ViewEntriesModal from './ViewEntriesModal';

interface IProps {
  children: ({}) => {};
  registeredServices: any;
  loading: boolean;
  classes: any;
  theme: any;
}

const TabContainer: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const actions = useAllActions();
  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [filteredSuppliers, setFilterSuppliers] = useState([]);
  const [timeSheetData, setTimesheetData] = useState({});
  const [timesheetType, setTimesheetType] = useState('active');

  const [showViewEntriesModal, setShowViewEntriesModal] = useState(
    false as boolean,
  );
  const [showingEntriesInModal, setShowingEntriesInModal] = useState(
    [] as Array<any>,
  );

  const [showNotificationModal, setShowNotificationModal] = useState(
    false as boolean,
  );

  const [notifiedTimesheetId, setNotifiedTimesheetId] = useState(null);

  const history = useHistory();

  const match = useRouteMatch<{ type: string }>();
  const [archiveTimesheet] = useArchiveTimesheetMutation();
  const [unarchiveTimesheet] = useUnarchiveTimesheetMutation();

  const { data, loading, refetch } = useTimesheetsByDaoQuery({
    variables: {
      data: { daoId: daoId },
    },
    skip: !daoId,
  });

  const suppliers = useSuppliersByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });

  const allSuppliers = (suppliers?.data?.suppliersByDao || []).map((item) => {
    let container = {};
    container['value'] = item?.id;
    container['label'] = item?.name;
    return container;
  });

  // useEffect(() => {
  //   if (refetch) {
  //     refetch({
  //       data: { daoId: daoId },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [refetch]);

  useEffect(() => {
    const url = match?.url;
    if (url.includes('active')) {
      setTimesheetType('active');
    } else if (url.includes('draft')) {
      setTimesheetType('draft');
    } else if (url.includes('archived')) {
      setTimesheetType('archived');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.url]);

  useEffect(() => {
    refetchTimesheetByType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheetType]);

  // const allTimesheet = data?.timesheetsByDao || [];

  useEffect(() => {
    if ((data?.timesheetsByDao || []).length > 0) {
      _updateTimesheetsData(data?.timesheetsByDao);
    } else {
      setTimesheetData({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.timesheetsByDao]);

  useEffect(() => {
    refetchTimesheetByType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSuppliers]);

  const _onDaoChange = () => {
    suppliers?.refetch();
    refetchTimesheetByType();
  };

  const refetchTimesheetByType = () => {
    let where = {
      daoId: daoId,
    } as any;

    if (timesheetType === 'active') {
      where = { ...where };
    } else if (timesheetType === 'draft') {
      where = { ...where, status: TIMESHEET_STATUS.DRAFT as any };
    } else if (timesheetType === 'archived') {
      where = { ...where, archived: true };
    }

    if ((filteredSuppliers || []).length > 0) {
      where = { ...where, supplierIds: filteredSuppliers };
    }

    refetch({
      data: where,
    });
  };

  const _updateTimesheetsData = (timeSheets) => {
    const data = {};
    // const timeSheetsArr = get(timeSheets, 'data', []);
    const timeSheetsArr = timeSheets || [];

    for (let i = 0; i < timeSheetsArr.length; i++) {
      const timeSheet = timeSheetsArr[i] || {};
      const timeSheetId = timeSheet?.id;
      const timeSheetEntries = timeSheet.timeSheetEntries || [];
      for (let j = 0; j < timeSheetEntries.length; j++) {
        const entry = timeSheetEntries[j];
        const serviceId = get(entry, 'service.id');
        const listItemId = `${serviceId}`;
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

          rows: {
            ...rows,
            [timeSheetId]: {
              id: timeSheetId,
              supplier: timeSheet.supplier,
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
    setTimesheetData({ ...data });
  };

  const _renderSectionHeading = () => {
    return (
      <SectionHeader
        title='Timesheets'
        subtitle={`Below is a list of all your ${timesheetType} timesheets.`}
        renderLeftPart={() => {
          if (timesheetType === 'archived') {
            return;
          } else {
            return (
              <Button
                title='Create new timesheet'
                applyBorderRadius
                width={260}
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  history.push(URL.CREATE_TIMESHEETS());
                }}
              />
            );
          }
        }}
      />
    );
  };

  const _renderNoTimesheets = () => {
    return (
      <div className={classes.noTimesheetsWrapper}>
        <div className={classes.noTimesheetsMessageWrapper}>
          <div className={classes.noTimesheetsMessage}>
            {`There are no ${timesheetType} Timesheets.`} <br />
            {timesheetType !== 'archived' && (
              <div>Let’s start by creating a new Timesheet.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const addFilteredSupplier = (supplier) => {
    const nextSuppliers: any = [...filteredSuppliers];
    nextSuppliers.push(supplier);

    setFilterSuppliers(nextSuppliers);
  };
  const removeFilteredSupplier = (supplier) => {
    const nextSuppliers: any = [...filteredSuppliers];
    const pos = nextSuppliers.indexOf(supplier);
    nextSuppliers.splice(pos, 1);
    setFilterSuppliers(nextSuppliers);
  };

  const _renderFilterSupplierDropdown = () => {
    return (
      <div className={classes.dropdownWrapper}>
        <Dropdown
          label='Filter Supplier'
          items={allSuppliers}
          multiple
          onChange={(item, index, isSelected) => {
            if (isSelected) {
              addFilteredSupplier(item.value);
            } else {
              removeFilteredSupplier(item.value);
            }
          }}
        />
      </div>
    );
  };

  const _toggleViewEntriesModal = (visible, entries = []) => {
    setShowViewEntriesModal(visible);
    setShowingEntriesInModal([...entries]);
  };

  const _renderViewEntriesModal = () => {
    if (!showViewEntriesModal) {
      return null;
    }
    return (
      <ViewEntriesModal
        visible={showViewEntriesModal}
        onClose={() => {
          _toggleViewEntriesModal(false);
        }}
        entries={showingEntriesInModal}
      />
    );
  };

  const _renderTimesheetNotificationModal = () => {
    return (
      <TimesheetNotificationModal
        visible={showNotificationModal}
        timesheetId={notifiedTimesheetId}
        onClose={_closeTimesheetNotificationModal}
      />
    );
  };

  const _showTimesheetNotificationModal = (timesheetId) => {
    setShowNotificationModal(true);
    setNotifiedTimesheetId(timesheetId);
  };

  const _closeTimesheetNotificationModal = () => {
    setShowNotificationModal(false);
    setNotifiedTimesheetId(null);
  };

  const _showArchiveDialog = (timesheet) => {
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
          _archiveTimesheet(timesheet);
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  const _archiveTimesheet = async (row) => {
    try {
      const res = await archiveTimesheet({
        variables: { id: row.id },
      });
      if (res?.data?.archiveTimesheet?.id) {
        showToast(null, 'Timesheet archived successfully');
        refetchTimesheetByType();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _showUnarchiveDialog = (timesheet) => {
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
          _unArchiveTimesheet(timesheet);
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  const _unArchiveTimesheet = async (row) => {
    try {
      const res = await unarchiveTimesheet({
        variables: { id: row.id },
      });
      if (res?.data?.unarchiveTimesheet?.id) {
        showToast(null, 'Timesheet unarchived successfully');
        refetchTimesheetByType();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  return (
    <ErrorBoundary>
      <SelectedDAO onChange={_onDaoChange}>
        <div className={classes.page}>
          {_renderSectionHeading()}
          {_renderFilterSupplierDropdown()}
          {loading && <Loading />}

          {!loading && isEmpty(timeSheetData) && _renderNoTimesheets()}

          {!isEmpty(timeSheetData) && timesheetType === 'active' && (
            <ActiveTimesheets
              timeSheetData={timeSheetData}
              toggleViewEntriesModal={_toggleViewEntriesModal}
              showTimesheetNotificationModal={_showTimesheetNotificationModal}
            />
          )}

          {!isEmpty(timeSheetData) && timesheetType === 'draft' && (
            <DraftTimesheetsTab
              timeSheetData={timeSheetData}
              showArchiveDialog={_showArchiveDialog}
            />
          )}

          {!isEmpty(timeSheetData) && timesheetType === 'archived' && (
            <ArchivedTimesheets
              timeSheetData={timeSheetData}
              showUnarchiveDialog={_showUnarchiveDialog}
            />
          )}
        </div>
      </SelectedDAO>

      {timesheetType === 'active' && _renderTimesheetNotificationModal()}
      {timesheetType === 'active' && _renderViewEntriesModal()}
    </ErrorBoundary>
  );
};

export default withStyles(ActiveTimesheetsStyles)(TabContainer);
