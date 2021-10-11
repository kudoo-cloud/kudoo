import {
  Button,
  Dropdown,
  ErrorBoundary,
  FieldLabel,
  Modal,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
// import range from 'lodash/range';
import set from 'lodash/set';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import uuid from 'uuid';
// import { generatePDF } from 'src/helpers/jsPDF';
import {
  useCreateTimesheetMutation,
  useRegisteredServiceByDaoQuery,
  useSuppliersByDaoQuery,
  useTimesheetQuery,
  useUpdateTimesheetMutation,
} from 'src/generated/graphql';
import { DATE_FORMAT, TIMESHEET_STATUS } from 'src/helpers/constants';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import InputRows from './InputRows';
import PeriodSelection from './PeriodSelection';
import styles from './styles';
import TimesheetApproveModal from './TimesheetApproveModal';

interface IProps {
  classes: any;
  theme: any;
}

const CreateTimesheets: React.FC<IProps> = (props) => {
  const currentYear = moment().year();
  const currentMonth = moment().month();

  const { classes, theme } = props;

  const actions = useAllActions();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const timesheetId = match?.params?.id;

  const [isEditMode, setIsEditMode] = useState(!!timesheetId);

  const [currentWeekPeriod, setCurrentWeekPeriod] = useState({
    startWeekDay: '',
    endWeekDay: '',
    month: currentMonth,
    year: currentYear,
    week: moment().week(),
  });

  const [selectedSupplier, setSelectedSupplier] = useState('');

  const [weekPeriodData, setWeekPeriodData] = useState({});

  const [finalisingTimesheet, setFinalisingTimesheet] = useState(false);

  const [showFinaliseModal, setShowFinaliseModal] = useState(false);

  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [approvalTimesheets, setApprovalTimesheets] = useState([]);

  const { data } = useTimesheetQuery({
    variables: {
      id: timesheetId,
    },
    skip: !timesheetId,
  });
  const timesheetDetail = data?.timesheet || ({} as any);

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [createTimesheet] = useCreateTimesheetMutation();
  const [updateTimesheet] = useUpdateTimesheetMutation();
  const services = useRegisteredServiceByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });
  const registeredServices = services?.data?.registeredServiceByDao || [];

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

  useEffect(() => {
    actions.updateHeaderTitle('Timesheet');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(timesheetDetail)) {
      setIsEditMode(!!timesheetDetail);
      if (timesheetDetail) {
        _updateWeekPeriodDataState(timesheetDetail, timesheetId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheetDetail]);

  const _updateWeekPeriodDataState = (
    timesheet,
    alreadySavedTimesheetId = '',
  ) => {
    // let { weekPeriodData, currentWeekPeriod }: any = this.state;
    // let newWeekPeriodData = weekPeriodData || {};
    // let newCurrentWeekPeriod = currentWeekPeriod;
    const timeSheetEntries = get(timesheet, 'timeSheetEntries', []);

    if (timesheet) {
      const startsAt = timesheet.startsAt;
      const endsAt = timesheet.endsAt;
      let newCurrentWeekPeriod = {
        startWeekDay: moment(startsAt).format(),
        endWeekDay: moment(endsAt).format(),
        month: moment(startsAt).month(),
        year: moment(endsAt).year(),
        week: moment(startsAt).week(),
      };

      const { id, startDay, endDay } = _getWeekPeriodId(newCurrentWeekPeriod);
      let rows = {};
      for (let index = 0; index < timeSheetEntries.length; index++) {
        const entry = timeSheetEntries[index] || {};

        const serviceId = get(entry, 'service.id');

        const date = moment(entry.date).format('YYYY-MM-DD');

        const uniqueRowId = `${serviceId}`;

        const selectedService = entry.service;

        const dayHours = get(rows, `${uniqueRowId}.dayHours`, {});
        dayHours[date] = entry.duration;

        const entries = get(rows, `${uniqueRowId}.entries`, {});
        entries[date] = entry;

        rows[uniqueRowId] = {
          ...rows[uniqueRowId],
          dayHours,
          selectedService,
          entries,
        };
      }

      // if (timeSheetEntries.length === 0) {
      //   rows = {
      //     ...rows,
      //     [uuid.v4()]: {},
      //   };
      // }

      const nextWpData = merge(weekPeriodData, {
        [id]: {
          startWeekDay: startDay,
          endWeekDay: endDay,
          alreadySavedTimesheetId: alreadySavedTimesheetId
            ? alreadySavedTimesheetId
            : timesheet.id,
          allowedToEdit:
            timesheet.status !== TIMESHEET_STATUS.FINALISED &&
            timesheet.status !== TIMESHEET_STATUS.APPROVED,
          timesheetRows: rows,
          attachedFiles: timesheet.attachments,
        },
      });

      setSelectedSupplier(timesheet?.supplierId);

      setCurrentWeekPeriod({ ...newCurrentWeekPeriod });
      setWeekPeriodData({ ...nextWpData });
    }
  };

  const _getWeekPeriodId = (weekPeriod) => {
    const startDay = moment(weekPeriod.startWeekDay).format('YYYY-MM-DD');
    const endDay = moment(weekPeriod.endWeekDay).format('YYYY-MM-DD');
    const id = `${startDay}__${endDay}`;
    return { id, startDay, endDay };
  };

  const _onWeekPeriodChange = async (currentWeekPeriod) => {
    const { id, startDay, endDay } = _getWeekPeriodId(currentWeekPeriod);

    if (!isEditMode) {
      setCurrentWeekPeriod(currentWeekPeriod);

      setWeekPeriodData({
        ...weekPeriodData,
        [id]: weekPeriodData[id] || {
          startWeekDay: startDay,
          endWeekDay: endDay,
          attachedFiles: [],
          allowedToEdit: true,
          timesheetRows: {
            [uuid.v4()]: {},
          },
        },
      });
    }
  };

  const _updateWeekPeriod = (data) => {
    const { id } = _getWeekPeriodId(currentWeekPeriod);

    if (data.timesheetRows) {
      // if we want to update timesheetRows then first clean current timesheetRows then update with coming timesheetRows
      set(weekPeriodData, `${id}.timesheetRows`, {});
    }

    const mergeData = merge(weekPeriodData, {
      [id]: {
        ...data,
      },
    });

    setWeekPeriodData({ ...mergeData });
  };

  const _doesUserEnteredData = () => {
    let hasData = false;
    if (selectedSupplier) {
      for (const key1 in weekPeriodData) {
        if (weekPeriodData.hasOwnProperty(key1)) {
          const weekPeriod = weekPeriodData[key1];
          const isWeekPeriodEmpty = _isWeekPeriodEmpty(weekPeriod);

          if (!isWeekPeriodEmpty) {
            const timesheetRows = get(weekPeriod, 'timesheetRows', {});

            for (const key2 in timesheetRows) {
              if (timesheetRows.hasOwnProperty(key2)) {
                const timesheet = get(timesheetRows, key2, {});
                const isTimesheetEmpty = _isTimesheetEmpty(timesheet);

                if (!isTimesheetEmpty) {
                  hasData = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    return hasData;
  };

  const _isWeekPeriodEmpty = (weekPeriod) => {
    const timesheetRows = get(weekPeriod, 'timesheetRows', {});
    const values = Object.values(timesheetRows);
    let hasData = false;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (!isEmpty(value)) {
        hasData = true;
        break;
      }
    }
    return !hasData;
  };

  const _isTimesheetEmpty = (timesheet: any = {}) => {
    return isEmpty(timesheet.dayHours) || isEmpty(timesheet.selectedService);
  };

  const _renderSectionHeading = () => {
    const hasData = _doesUserEnteredData();

    return (
      <SectionHeader
        title={`Bulk ${!isEditMode ? 'create' : 'update'} timesheets`}
        subtitle={
          !isEditMode
            ? 'Create a timesheet to track work done on a project. When you create a new timesheet you are able to create multiple timesheets for a period in time.'
            : 'Update Timesheet to track work done on a project'
        }
        renderLeftPart={() => (
          <Button
            id='save-draft'
            title={!isEditMode ? `Save draft` : 'Update Draft'}
            applyBorderRadius
            width={260}
            isDisabled={!hasData}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              _finaliseTimeSheet(true);
            }}
          />
        )}
      />
    );
  };

  const _showApprovalModal = (timeSheetsId) => {
    setShowApprovalModal(true);
    setApprovalTimesheets(timeSheetsId);
  };

  const _closeApprovalModal = () => {
    setShowApprovalModal(false);

    history.push(URL.TIMESHEETS());
  };

  // const _generatePDF = async () => {
  //   return await generatePDF('pdf-content');
  // };

  const _finaliseTimeSheet = async (isDraft = false) => {
    try {
      const timeSheetsId: any = [];
      setFinalisingTimesheet(true);

      // iterate through all week periods
      for (const key1 in weekPeriodData) {
        if (weekPeriodData.hasOwnProperty(key1)) {
          const weekPeriod = weekPeriodData[key1];
          const isWeekPeriodEmpty = _isWeekPeriodEmpty(weekPeriod);
          if (!isWeekPeriodEmpty && weekPeriod.allowedToEdit) {
            // let parsedTimeSheetRes;
            // we only need to upload file which is object of File i.e. which user uploaded in this session
            // const attachments = get(weekPeriod, 'attachedFiles', [])
            //   .filter((file) => file instanceof File)
            //   .map((file) => file);
            // Prepare timesheet data to save
            let dataToSave: any = {
              endsAt: moment(weekPeriod.endWeekDay).format(DATE_FORMAT),
              startsAt: moment(weekPeriod.startWeekDay).format(DATE_FORMAT),
              status: isDraft
                ? TIMESHEET_STATUS.DRAFT
                : TIMESHEET_STATUS.FINALISED,
              //attachments: attachments.length > 0 ? attachments : undefined,
              daoId: daoId,
              supplierId: selectedSupplier,
            };

            // if (!isDraft) {
            //   // if user is finalizing timesheet then create pdf
            //   const pdfBlob = await _generatePDF();
            //   const pdfFile = new File([pdfBlob], 'timesheet.pdf');
            //   dataToSave.preview = pdfFile;
            // }

            // prepare timesheet entry for every rows under this week period
            const createEntryArr: any = [];
            // const updateEntryArr: any = [];
            // if there are timesheet rows in weekperiod
            if (!isEmpty(weekPeriod.timesheetRows)) {
              const timesheetRows: any = Object.values(
                weekPeriod.timesheetRows,
              );
              // iterate through all timesheet row
              for (let i = 0; i < timesheetRows.length; i++) {
                const timeSheetRow = timesheetRows[i];

                // if timesheet row is not empty
                if (!_isTimesheetEmpty(timeSheetRow)) {
                  const dayHours = timeSheetRow.dayHours;

                  const selectedService = timeSheetRow.selectedService;
                  const alreadySavedEntries = get(timeSheetRow, `entries`, {});

                  if (!isEmpty(dayHours) && !isEmpty(selectedService)) {
                    // iterate through all hours
                    for (const date in dayHours) {
                      if (dayHours.hasOwnProperty(date)) {
                        const entryId = get(alreadySavedEntries, `${date}.id`);

                        const duration = dayHours[date];
                        if (
                          typeof duration === 'undefined' ||
                          duration === null
                        ) {
                          continue;
                        }

                        let entryData = {
                          date: moment(date).format(DATE_FORMAT),
                          duration: Number(dayHours[date]),
                          serviceId: selectedService.id,
                        } as any;

                        if (entryId) {
                          entryData = { ...entryData, id: entryId };
                        }

                        createEntryArr.push({
                          ...entryData,
                        });
                      }
                    }
                  }
                }
              }
            }

            dataToSave = {
              ...dataToSave,
              timeSheetEntries:
                createEntryArr.length > 0 ? createEntryArr : undefined,
            };

            if (!isEditMode) {
              const res = await createTimesheet({
                variables: {
                  data: dataToSave,
                },
              });
              if (res?.data?.createTimesheet?.id) {
                setFinalisingTimesheet(false);
                setShowFinaliseModal(false);
              } else {
                res?.errors?.map((err) => showToast(err.message));
                setFinalisingTimesheet(false);
                setShowFinaliseModal(false);
                return;
              }
            } else {
              const res = await updateTimesheet({
                variables: {
                  data: {
                    id: timesheetId,
                    ...dataToSave,
                  },
                },
              });
              if (res?.data?.updateTimesheet?.id) {
                setFinalisingTimesheet(false);
                setShowFinaliseModal(false);
              } else {
                res?.errors?.map((err) => showToast(err.message));
                setFinalisingTimesheet(false);
                setShowFinaliseModal(false);
                return;
              }
            }
          }
        }
      }
      if (!isDraft) {
        showToast(
          null,
          `Timesheets ${isEditMode ? 'updated' : 'saved'} successfully`,
        );
        if (get(SelectedDAO, 'timeSheetSettings.approvalsEnabled')) {
          _showApprovalModal(timeSheetsId);
        } else {
          history.push(URL.TIMESHEETS());
        }
      } else {
        showToast(
          null,
          !isEditMode
            ? 'Timesheet saved as a draft'
            : `Timesheet draft updated`,
        );
        history.push(URL.MY_DRAFT_TIMESHEETS());
      }
    } catch (e) {
      setFinalisingTimesheet(false);
      setShowFinaliseModal(false);
      console.error(e);
    }
  };

  const _renderTimesheetApprovalModal = () => {
    return (
      <TimesheetApproveModal
        visible={showApprovalModal}
        timesheets={approvalTimesheets}
        onClose={_closeApprovalModal}
      />
    );
  };

  const _renderFinaliseAlert = () => {
    const hasData = _doesUserEnteredData();
    return (
      <Modal
        classes={{ description: classes.finaliseDesc }}
        visible={showFinaliseModal}
        title='Finalise Timesheet?'
        description={
          <div>
            <div>
              When you finalise a timesheet you change the status from draft to
              finalised therefore it can not be edited.
            </div>
            <br />
            <div>Are you sure you want to finalise this timesheet?</div>
          </div>
        }
        buttons={[
          {
            title: 'Cancel',
            type: 'cancel',
            onClick: () => {
              setShowFinaliseModal(false);
            },
          },
          {
            title: isEditMode ? 'Update Draft' : 'Save as draft',
            isDisabled: !hasData,
            id: 'modal-save-draft',
            onClick: () => {
              setShowFinaliseModal(false);
              _finaliseTimeSheet(true);
            },
            buttonColor: theme.palette.primary.color3,
          },
          {
            title: 'Finalise',
            isDisabled: !hasData,
            id: 'modal-finalise-timesheet',
            onClick: () => {
              setShowFinaliseModal(false);
              _finaliseTimeSheet(false);
            },
          },
        ]}
      />
    );
  };

  const _renderBottomButtons = () => {
    const hasData = _doesUserEnteredData();

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={hasData}>
          <Button
            title='Cancel'
            href={URL.TIMESHEETS()}
            buttonColor={theme.palette.grey['200']}
            classes={{ text: classes.cancelButtonText }}
          />
        </Grid>
        {hasData && (
          <Grid item xs={12} sm={6}>
            <Button
              id='finalise-timesheet-bottom-button'
              loading={finalisingTimesheet}
              title='Finalise timesheet'
              buttonColor={theme.palette.primary.color2}
              onClick={() => {
                setShowFinaliseModal(true);
              }}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  const _getWeekPeriod = () => {
    const { id } = _getWeekPeriodId(currentWeekPeriod);
    return get(weekPeriodData, `${id}`, {});
  };
  const weekPeriod = _getWeekPeriod();

  const _renderPeriodSelection = () => {
    return (
      <div className={classes.periodSelectionWrapper}>
        <Grid container justify='space-between' spacing={0}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <div>
                  <FieldLabel label='Month' />
                  <div className={classes.textValueBox}>
                    {moment(timesheetDetail?.startsAt).format('MMMM')}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <FieldLabel label='Year' />
                  <div className={classes.textValueBox}>
                    {moment(timesheetDetail?.startsAt).format('YYYY')}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container justify='flex-end'>
              <Grid item xs={12} sm={8}>
                <div>
                  <FieldLabel label='Week Period' />
                  <div className={classes.textValueBox}>
                    {moment(timesheetDetail?.startsAt).format('DD MMM')} -{' '}
                    {moment(timesheetDetail?.endsAt).format('DD MMM')}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <SelectedDAO
        onChange={() => {
          history.push(URL.TIMESHEETS());
        }}
      >
        <div className={classes.page}>
          <div className={classes.content}>
            {_renderSectionHeading()}
            <div className={classes.pdfContent} id='pdf-content'>
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <Dropdown
                    label='Supplier'
                    id='timesheet-supplier'
                    classes={{
                      component: classes.sDropdown,
                      select: classes.sDropdownSelect,
                      menuItemText: classes.dropdownItemText,
                    }}
                    onChange={(item) => {
                      setSelectedSupplier(item?.value);
                    }}
                    placeholder='Select a supplier'
                    items={allSuppliers}
                    value={selectedSupplier}
                  />
                </Grid>
              </Grid>
              {!isEditMode ? (
                <PeriodSelection
                  currentWeekPeriod={currentWeekPeriod}
                  onWeekPeriodChange={_onWeekPeriodChange}
                  onUpdateCurrentWeekPeriod={(currentWeekPeriod) => {
                    setCurrentWeekPeriod(currentWeekPeriod);
                  }}
                />
              ) : (
                _renderPeriodSelection()
              )}

              <InputRows
                services={registeredServices}
                allowedToEdit={weekPeriod.allowedToEdit}
                timesheetRows={weekPeriod.timesheetRows}
                currentWeekPeriod={currentWeekPeriod}
                onUpdateRows={_updateWeekPeriod}
                // timeSheetId={weekPeriod.alreadySavedTimesheetId}
              />

              {/* <Attachments
                allowedToEdit={weekPeriod.allowedToEdit}
                attachedFiles={weekPeriod.attachedFiles || []}
                onUpdateAttachments={_updateWeekPeriod}
              /> */}
            </div>
          </div>

          {_renderBottomButtons()}
          {_renderFinaliseAlert()}
          {_renderTimesheetApprovalModal()}
        </div>
      </SelectedDAO>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(CreateTimesheets);
