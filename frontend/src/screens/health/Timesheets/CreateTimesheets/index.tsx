import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import moment from 'moment';
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';
import range from 'lodash/range';
import isEmpty from 'lodash/isEmpty';
import uuid from 'uuid';
import {
  withStyles,
  SectionHeader,
  Modal,
  Button,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import {
  withCustomers,
  withServices,
  withProjects,
  withTimeSheet,
  withTimeSheets,
  withUpdateTimeSheet,
  withCreateTimeSheet,
} from '@kudoo/graphql';
import { generatePDF } from '@client/helpers/jsPDF';
import SelectedCompany from '@client/helpers/SelectedCompany';
import {
  SERVICE_BILLING_TYPE,
  TIMESHEET_STATUS,
  DATE_TIME_API_FORMAT,
} from '@client/helpers/constants';
import { showToast } from '@client/helpers/toast';
import TimesheetApproveModal from './TimesheetApproveModal';
import InputRows from './InputRows';
import Attachments from './Attachments';
import PeriodSelection from './PeriodSelection';
import styles from './styles';

type Props = {
  actions: any;
  isEditMode: any;
  getTimeSheets: any;
  updateTimeSheet: any;
  createTimeSheet: any;
  history: any;
  classes: any;
  theme: any;
};

type State = {};
class CreateTimesheets extends Component<Props, State> {
  yearList: any;
  monthList: any;

  constructor(props) {
    super(props);
    const currentYear = moment().year();
    const currentMonth = moment().month();
    this.yearList = range(currentYear - 2, currentYear + 10).map(yr => ({
      label: String(yr),
      value: yr,
    }));
    this.monthList = range(0, 12).map(index => ({
      label: moment()
        .month(index)
        .format('MMMM'),
      value: index,
    }));
    this.state = {
      currentWeekPeriod: {
        startWeekDay: '',
        endWeekDay: '',
        month: currentMonth,
        year: currentYear,
        week: moment().week(),
      },
      weekPeriodData: {},
      showFinaliseModal: false,
      showApprovalModal: false,
      approvalTimesheets: [],
      savingAsDraft: false,
      finalisingTimesheet: false,
    };
  }

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Timesheets');
  }

  componentDidUpdate(prevProps) {
    if (this.props.isEditMode) {
      const projects = get(this.props, 'projects.data');
      const services = get(this.props, 'services.data');
      const customers = get(this.props, 'customers.data');
      const timesheet = get(this.props, 'timeSheet.data');
      if (
        projects !== get(prevProps, 'projects.data') ||
        services !== get(prevProps, 'services.data') ||
        customers !== get(prevProps, 'customers.data') ||
        timesheet !== get(prevProps, 'timeSheet.data')
      ) {
        this._updateStateForEditMode(this.props);
      }
    }
  }

  _updateStateForEditMode = props => {
    const timesheet = get(props, 'timeSheet.data', {});
    this._updateWeekPeriodDataState(
      props,
      timesheet,
      get(props, 'match.params.id')
    );
  };

  _updateWeekPeriodDataState = (props, timesheet, alreadySavedTimesheetId) => {
    let { weekPeriodData, currentWeekPeriod }: any = this.state;
    weekPeriodData = weekPeriodData || {};
    const timeSheetEntries = get(timesheet, 'timeSheetEntries', []);

    if (timesheet) {
      const startsAt = timesheet.startsAt;
      const endsAt = timesheet.endsAt;
      currentWeekPeriod = {
        ...currentWeekPeriod,
        startWeekDay: moment(startsAt).format(),
        endWeekDay: moment(endsAt).format(),
        month: moment(startsAt).month(),
        year: moment(endsAt).year(),
      };

      const { id, startDay, endDay } = this._getWeekPeriodId(currentWeekPeriod);
      let rows = {};
      for (let index = 0; index < timeSheetEntries.length; index++) {
        const entry = timeSheetEntries[index] || {};
        const serviceId = get(entry, 'service.id');
        const projectId = get(entry, 'project.id');
        const date = moment(entry.date).format('YYYY-MM-DD');
        const customerId = get(entry, 'customer.id');
        const uniqueRowId = `${serviceId}:${projectId || customerId}`;
        let selectedProjectCustomer;
        const selectedService = entry.service;
        if (entry.project) {
          selectedProjectCustomer = entry.project;
        } else {
          selectedProjectCustomer = entry.customer;
        }

        const dayHours = get(rows, `${uniqueRowId}.dayHours`, {});
        dayHours[date] = entry.duration;

        const entries = get(rows, `${uniqueRowId}.entries`, {});
        entries[date] = entry;

        rows[uniqueRowId] = {
          ...rows[uniqueRowId],
          dayHours,
          selectedService,
          selectedProjectCustomer,
          selectedType: projectId ? 'project' : 'customer',
          selectedBtn: projectId ? 0 : 1,
          entries,
        };
      }

      if (timeSheetEntries.length === 0) {
        rows = {
          ...rows,
          [uuid.v4()]: {},
        };
      }
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
      const stateObj = {
        currentWeekPeriod,
        weekPeriodData: nextWpData,
      };
      this.setState(stateObj);
    }
  };

  _getWeekPeriodId = weekPeriod => {
    const startDay = moment(weekPeriod.startWeekDay).format('YYYY-MM-DD');
    const endDay = moment(weekPeriod.endWeekDay).format('YYYY-MM-DD');
    const id = `${startDay}__${endDay}`;
    return { id, startDay, endDay };
  };

  _onWeekPeriodChange = async currentWeekPeriod => {
    const { weekPeriodData }: any = this.state;
    const { id, startDay, endDay } = this._getWeekPeriodId(currentWeekPeriod);
    const { profile }: any = this.props;
    const timesheets = await this.props.getTimeSheets({
      variables: {
        where: {
          startsAt: moment(startDay).format(DATE_TIME_API_FORMAT),
          endsAt: moment(endDay).format(DATE_TIME_API_FORMAT),
          isArchived: false,
          user: {
            id: profile.id,
          },
        },
      },
    });
    const timesheetData = get(timesheets, 'data.timeSheets.edges.0.node');
    if (get(timesheetData, 'id')) {
      this._updateWeekPeriodDataState(this.props, timesheetData);
    } else {
      this.setState({
        currentWeekPeriod,
        weekPeriodData: {
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
        },
      });
    }
  };

  _doesUserEnteredData = () => {
    const { weekPeriodData }: any = this.state;
    let hasData = false;
    for (const key1 in weekPeriodData) {
      if (weekPeriodData.hasOwnProperty(key1)) {
        const weekPeriod = weekPeriodData[key1];
        const isWeekPeriodEmpty = this._isWeekPeriodEmpty(weekPeriod);
        if (!isWeekPeriodEmpty) {
          const timesheetRows = get(weekPeriod, 'timesheetRows', {});
          for (const key2 in timesheetRows) {
            if (timesheetRows.hasOwnProperty(key2)) {
              const timesheet = get(timesheetRows, key2, {});
              const isTimesheetEmpty = this._isTimesheetEmpty(timesheet);
              if (!isTimesheetEmpty) {
                hasData = true;
                break;
              }
            }
          }
        }
      }
    }
    return hasData;
  };

  _isWeekPeriodEmpty = weekPeriod => {
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

  _isTimesheetEmpty = (timesheet: any = {}) => {
    return (
      isEmpty(timesheet.dayHours) ||
      isEmpty(timesheet.selectedProjectCustomer) ||
      isEmpty(timesheet.selectedService)
    );
  };

  _generatePDF = async () => {
    return await generatePDF('pdf-content');
  };

  _finaliseTimeSheet = async (isDraft = false) => {
    try {
      const { profile, isEditMode }: any = this.props;
      const { selectedCompany } = profile;
      const { weekPeriodData }: any = this.state;
      const timeSheetsId: any = [];
      this.setState({ finalisingTimesheet: true });
      // iterate through all week periods
      for (const key1 in weekPeriodData) {
        if (weekPeriodData.hasOwnProperty(key1)) {
          const weekPeriod = weekPeriodData[key1];
          const isWeekPeriodEmpty = this._isWeekPeriodEmpty(weekPeriod);
          if (!isWeekPeriodEmpty && weekPeriod.allowedToEdit) {
            let parsedTimeSheetRes;
            // we only need to upload file which is object of File i.e. which user uploaded in this session
            const attachments = get(weekPeriod, 'attachedFiles', [])
              .filter(file => file instanceof File)
              .map(file => file);
            // Prepare timesheet data to save
            let dataToSave: any = {
              endsAt: moment(weekPeriod.endWeekDay).format(
                DATE_TIME_API_FORMAT
              ),
              startsAt: moment(weekPeriod.startWeekDay).format(
                DATE_TIME_API_FORMAT
              ),
              status: isDraft
                ? TIMESHEET_STATUS.DRAFT
                : TIMESHEET_STATUS.FINALISED,
              attachments: attachments.length > 0 ? attachments : undefined,
            };

            if (!isDraft) {
              // if user is finalizing timesheet then create pdf
              const pdfBlob = await this._generatePDF();
              const pdfFile = new File([pdfBlob], 'timesheet.pdf');
              dataToSave.preview = pdfFile;
            }

            // prepare timesheet entry for every rows under this week period
            const createEntryArr: any = [];
            const updateEntryArr: any = [];
            // if there are timesheet rows in weekperiod
            if (!isEmpty(weekPeriod.timesheetRows)) {
              const timesheetRows: any = Object.values(
                weekPeriod.timesheetRows
              );
              // iterate through all timesheet row
              for (let i = 0; i < timesheetRows.length; i++) {
                const timeSheetRow = timesheetRows[i];
                // if timesheet row is not empty
                if (!this._isTimesheetEmpty(timeSheetRow)) {
                  const dayHours = timeSheetRow.dayHours;
                  const selectedType = timeSheetRow.selectedType;
                  const selectedProjectCustomer =
                    timeSheetRow.selectedProjectCustomer;
                  const selectedService = timeSheetRow.selectedService;
                  const alreadySavedEntries = get(timeSheetRow, `entries`, {});
                  if (
                    !isEmpty(dayHours) &&
                    !isEmpty(selectedProjectCustomer) &&
                    !isEmpty(selectedService)
                  ) {
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

                        const entryData = {
                          date: moment(date).format(DATE_TIME_API_FORMAT),
                          duration: Number(dayHours[date]),
                          service: {
                            connect: {
                              id: selectedService.id,
                            },
                          },
                          [selectedType]: {
                            connect: {
                              id: selectedProjectCustomer.id,
                            },
                          },
                        };

                        if (entryId) {
                          // if we already have saved entry id , then update that entry
                          updateEntryArr.push({
                            data: entryData,
                            where: {
                              id: entryId,
                            },
                          });
                        } else {
                          // if we dont have saved entry id , then create that entry
                          createEntryArr.push({
                            ...entryData,
                          });
                        }
                      }
                    }
                  }
                }
              }
            }

            dataToSave = {
              ...dataToSave,
              timeSheetEntries: {
                create: createEntryArr.length > 0 ? createEntryArr : undefined,
                update: updateEntryArr.length > 0 ? updateEntryArr : undefined,
              },
            };
            if (weekPeriod.alreadySavedTimesheetId) {
              // if already saved then update it
              parsedTimeSheetRes = await this.props.updateTimeSheet({
                where: {
                  id: weekPeriod.alreadySavedTimesheetId,
                },
                data: dataToSave,
              });
            } else {
              // if user has added new weekperiod then create new
              parsedTimeSheetRes = await this.props.createTimeSheet({
                data: dataToSave,
              });
            }

            if (parsedTimeSheetRes.success) {
              const timesheetData = parsedTimeSheetRes.result || {};
              timeSheetsId.push(timesheetData.id);
              this.setState({
                finalisingTimesheet: false,
                showFinaliseModal: false,
              });
            } else {
              this.setState({
                finalisingTimesheet: false,
                showFinaliseModal: false,
              });
              parsedTimeSheetRes.error.map(err => showToast(err));
              return;
            }
          }
        }
      }
      if (!isDraft) {
        showToast(
          null,
          `Timesheets ${isEditMode ? 'updated' : 'saved'} successfully`
        );
        if (get(selectedCompany, 'timeSheetSettings.approvalsEnabled')) {
          this._showApprovalModal(timeSheetsId);
        } else {
          this.props.history.push(URL.TIMESHEETS());
        }
      } else {
        showToast(
          null,
          !isEditMode ? 'Timesheet saved as a draft' : `Timesheet draft updated`
        );
        this.props.history.push(URL.MY_DRAFT_TIMESHEETS());
      }
    } catch (e) {
      this.setState({ finalisingTimesheet: false, showFinaliseModal: false });
      console.error(e);
    }
  };

  _showFinaliseAlert = () => {
    this.setState({
      showFinaliseModal: true,
    });
  };

  _closeFinaliseAlert = () => {
    this.setState({
      showFinaliseModal: false,
    });
  };

  _showApprovalModal = timeSheetsId => {
    this.setState({
      showApprovalModal: true,
      approvalTimesheets: timeSheetsId,
    });
  };

  _closeApprovalModal = () => {
    this.setState({
      showApprovalModal: false,
    });
    this.props.history.push(URL.TIMESHEETS());
  };

  _getWeekNumberFromMonth = (month, year) => {
    return moment()
      .month(month)
      .year(year)
      .date(1)
      .week();
  };

  _updateWeekPeriod = data => {
    const { currentWeekPeriod, weekPeriodData }: any = this.state;
    const { id } = this._getWeekPeriodId(currentWeekPeriod);
    if (data.timesheetRows) {
      // if we want to update timesheetRows then first clean current timesheetRows then update with coming timesheetRows
      set(weekPeriodData, `${id}.timesheetRows`, {});
    }
    this.setState({
      weekPeriodData: merge(weekPeriodData, {
        [id]: {
          ...data,
        },
      }),
    });
  };

  _getWeekPeriod = () => {
    const { weekPeriodData, currentWeekPeriod }: any = this.state;
    const { id } = this._getWeekPeriodId(currentWeekPeriod);
    return get(weekPeriodData, `${id}`, {});
  };

  _renderSectionHeading() {
    const { theme, isEditMode, classes }: any = this.props;
    const hasData = this._doesUserEnteredData();
    return (
      <SectionHeader
        classes={{ component: classes.sectionHeader }}
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
              this._finaliseTimeSheet(true);
            }}
          />
        )}
      />
    );
  }

  _renderTimesheetApprovalModal() {
    const { approvalTimesheets, showApprovalModal }: any = this.state;
    return (
      <TimesheetApproveModal
        visible={showApprovalModal}
        timesheets={approvalTimesheets}
        onClose={this._closeApprovalModal}
      />
    );
  }

  _renderFinaliseAlert() {
    const { theme, classes, isEditMode }: any = this.props;
    const hasData = this._doesUserEnteredData();
    return (
      <Modal
        classes={{ description: classes.finaliseDesc }}
        visible={this.state.showFinaliseModal}
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
              this._closeFinaliseAlert();
            },
          },
          {
            title: isEditMode ? 'Update Draft' : 'Save as draft',
            isDisabled: !hasData,
            id: 'modal-save-draft',
            onClick: () => {
              this._closeFinaliseAlert();
              this._finaliseTimeSheet(true);
            },
            buttonColor: theme.palette.primary.color3,
          },
          {
            title: 'Finalise',
            isDisabled: !hasData,
            id: 'modal-finalise-timesheet',
            onClick: () => {
              this._closeFinaliseAlert();
              this._finaliseTimeSheet(false);
            },
          },
        ]}
      />
    );
  }

  _renderBottomButtons = () => {
    const { classes, theme } = this.props;
    const hasData = this._doesUserEnteredData();

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
              loading={this.state.finalisingTimesheet}
              title='Finalise timesheet'
              buttonColor={theme.palette.primary.color2}
              onClick={this._showFinaliseAlert}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  render() {
    const { classes, projects, customers, services, actions }: any = this.props;
    const { currentWeekPeriod }: any = this.state;
    const weekPeriod = this._getWeekPeriod();
    return (
      <SelectedCompany
        onChange={() => {
          this.props.history.push(URL.TIMESHEETS());
        }}>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            <div className={classes.pdfContent} id='pdf-content'>
              <PeriodSelection
                currentWeekPeriod={currentWeekPeriod}
                onWeekPeriodChange={this._onWeekPeriodChange}
                onUpdateCurrentWeekPeriod={currentWeekPeriod => {
                  this.setState({
                    currentWeekPeriod,
                  });
                }}
              />
              <InputRows
                projects={projects}
                customers={customers}
                services={services}
                allowedToEdit={weekPeriod.allowedToEdit}
                timesheetRows={weekPeriod.timesheetRows}
                currentWeekPeriod={currentWeekPeriod}
                onUpdateRows={this._updateWeekPeriod}
                actions={actions}
                timeSheetId={weekPeriod.alreadySavedTimesheetId}
              />
              <Attachments
                allowedToEdit={weekPeriod.allowedToEdit}
                attachedFiles={weekPeriod.attachedFiles || []}
                onUpdateAttachments={this._updateWeekPeriod}
              />
            </div>
          </div>
          {this._renderBottomButtons()}
          {this._renderFinaliseAlert()}
          {this._renderTimesheetApprovalModal()}
        </div>
      </SelectedCompany>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withProps(props => ({
    isEditMode: Boolean(get(props, 'match.params.id')),
  })),
  withUpdateTimeSheet(),
  withCreateTimeSheet(),
  withCustomers(() => ({
    variables: {
      where: {
        isArchived: false,
      },
      orderBy: 'name_ASC',
    },
  })),
  withServices(() => ({
    variables: {
      where: {
        isArchived: false,
        isTemplate: true,
        billingType: SERVICE_BILLING_TYPE.TIME_BASED,
      },
      orderBy: 'name_ASC',
    },
  })),
  withProjects(() => ({
    variables: {
      where: {
        isArchived: false,
      },
    },
  })),
  withTimeSheet(props => ({
    id: get(props, 'match.params.id'),
  })),
  withTimeSheets(() => ({
    skip: true,
  }))
)(CreateTimesheets);
