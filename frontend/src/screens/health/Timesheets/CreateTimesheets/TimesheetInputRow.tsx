import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import ceil from 'lodash/ceil';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import {
  withStyles,
  Dropdown,
  TextField,
  withStylesProps,
  helpers as utils,
} from '@kudoo/components';
import { SERVICE_BILLING_TYPE } from '@client/helpers/constants';
import { showToast } from '@client/helpers/toast';
import { timesheetRowStyles } from './styles';

type Props = {
  initialData: any;
  startWeekDay: any;
  endWeekDay: any;
  onChange: any;
};

type State = {};

class TimehsheetInputRow extends Component<Props, State> {
  initialInputState: any;

  static defaultProps = {
    onRemoveClick: () => {},
    onChange: () => {},
    hideRemoveIcon: false,
    hideDaysLabel: false,
  };

  constructor(props) {
    super(props);
    this.initialInputState = {
      selectedBtn: 0,
      selectedService: {},
      selectedProjectCustomer: {},
      dayHours: {},
    };
    this.state = {
      dates: [],
      ...this.initialInputState,
    };
  }

  componentDidMount() {
    const { startWeekDay, endWeekDay }: any = this.props;
    if (startWeekDay && endWeekDay) {
      this._calculateRangeOfDates(startWeekDay, endWeekDay);
    }
    this._updateUsingInitialData(this.props.initialData);
  }

  componentDidUpdate(prevProps) {
    const { startWeekDay, endWeekDay, initialData }: any = this.props;
    if (
      prevProps.startWeekDay !== startWeekDay ||
      prevProps.endWeekDay !== endWeekDay
    ) {
      this._calculateRangeOfDates(
        this.props.startWeekDay,
        this.props.endWeekDay
      );
    }
    if (!isEqual(initialData, prevProps.initialData)) {
      this._updateUsingInitialData(this.props.initialData);
    }
  }

  _updateUsingInitialData = initialData => {
    if (!isEmpty(initialData)) {
      this.setState({
        selectedBtn: initialData.selectedBtn,
        selectedService: initialData.selectedService,
        selectedProjectCustomer: initialData.selectedProjectCustomer,
        dayHours: initialData.dayHours,
      });
    }
  };

  _calculateRangeOfDates = (startWeekDay, endWeekDay) => {
    const dates = utils.getRangeDates(startWeekDay, endWeekDay);
    this.setState({ dates });
  };

  _changeSelectedButton = index => e => {
    this.setState(
      {
        selectedBtn: index,
        selectedProjectCustomer: null,
        selectedService: null,
        dayHours: {},
      },
      () => {
        this._onChange();
      }
    );
  };

  _checkDirty = () => {
    const {
      selectedBtn,
      selectedService,
      selectedProjectCustomer,
      dayHours,
    }: any = this.state;
    const isDirty = !isEqual(this.initialInputState, {
      selectedBtn,
      selectedService,
      selectedProjectCustomer,
      dayHours,
    });
    return isDirty;
  };

  _onChange = () => {
    const {
      dayHours,
      selectedProjectCustomer,
      selectedService,
      selectedBtn,
    }: any = this.state;
    this.props.onChange({
      dayHours,
      selectedProjectCustomer,
      selectedService,
      selectedType: selectedBtn === 0 ? 'project' : 'customer',
      selectedBtn,
    });
  };

  _onDayHourChange = (date, hour) => {
    const { dayHours, selectedService }: any = this.state;
    const serviceType = get(selectedService, 'timeBasedType', 'HOUR') || '';
    let MAX_UNIT = 24;
    let MAX_BELOW = 25;
    let REPRESENT_NUMBER = 24;
    if (serviceType === 'DAY') {
      MAX_UNIT = 1.9;
      MAX_BELOW = 2;
      REPRESENT_NUMBER = 1;
    }
    if (hour) {
      if (parseFloat(hour) > MAX_UNIT) {
        // if value is more than MAX_UNIT , don't allow it
        showToast(
          `You are trying to add the number ${hour}. The service you are using has been predefined as a '${serviceType}' unit. A ${serviceType.toLowerCase()} is represented as the number ${REPRESENT_NUMBER}. Please insert a number that results to below ${MAX_BELOW}.`
        );
        dayHours[date] = hour.substr(0, hour.length - 1);
      } else {
        dayHours[date] = hour;
      }
    } else {
      delete dayHours[date];
    }
    this.setState({ dayHours }, () => {
      this._checkDirty();
      this._onChange();
    });
  };

  _onDayHourBlur = date => {
    const { dayHours }: any = this.state;
    const dateHour = dayHours[date];
    if (typeof dateHour === 'undefined' || dateHour === null) {
      return;
    }
    dayHours[date] = ceil(dateHour, 2);
    this.setState({ dayHours }, () => {
      this._checkDirty();
      this._onChange();
    });
  };

  _onSelectionChange = key => (item, index) => {
    let newState: any = {
      [key]: item.value,
      dayHours: {},
    };
    if (key === 'selectedProjectCustomer') {
      newState = {
        ...newState,
        selectedService: null,
      };
    }
    this.setState(newState, () => {
      this._checkDirty();
      this._onChange();
    });
  };

  _renderInputWrapper() {
    const {
      classes,
      hideRemoveIcon,
      onRemoveClick,
      hideDaysLabel,
      allowedToEdit,
    }: any = this.props;
    const { dates, dayHours, selectedService }: any = this.state;
    let unitToDisplay = 'h';
    if (get(selectedService, 'timeBasedType') === 'DAY') {
      unitToDisplay = 'd';
    }
    let totalHours = 0;
    forEach(dayHours, (val, key) => {
      totalHours += parseFloat(val) || 0;
    });
    totalHours = ceil(totalHours, 2);

    return (
      <div className={classes.inputWrapper}>
        {dates.map((date, index) => {
          const momentDate = moment(date);
          const formattedDate = momentDate.format('YYYY-MM-DD');
          return (
            <div className={classes.dayWrapper} key={index}>
              {!hideDaysLabel && (
                <div className={classes.dayInitial}>
                  {momentDate.format('dd')}
                </div>
              )}
              {!hideDaysLabel && (
                <div className={classes.dayNumber}>
                  {momentDate.format('DD')}
                </div>
              )}
              <div className={classes.dayInput}>
                <TextField
                  showClearIcon={false}
                  isNumber
                  placeholder='0'
                  id={`hour-input-${index}`}
                  classes={{
                    textInputWrapper: classes.dayInputWapper,
                    textInput: classes.dayInputField,
                  }}
                  value={`${dayHours[formattedDate] || ''}`}
                  onChangeText={val => {
                    this._onDayHourChange(formattedDate, val);
                  }}
                  onBlur={e => {
                    this._onDayHourBlur(formattedDate);
                  }}
                  isReadOnly={!allowedToEdit}
                />
              </div>
            </div>
          );
        })}
        <div className={classes.dayWrapper}>
          {!hideDaysLabel && <div className={classes.totalLabel}>Total</div>}
          <div className={classes.totalHoursWrapper}>
            <div
              className={classes.totalHours}
              data-test={`total-hours-${totalHours}`}>
              {totalHours}
            </div>
            <div className={classes.hoursSymbol}>{unitToDisplay}</div>
          </div>
        </div>
        {!hideRemoveIcon && allowedToEdit && (
          <div className={classes.removeIcon} onClick={onRemoveClick}>
            <i className='icon icon-close' />
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      classes,
      projects,
      customers,
      services,
      allowedToEdit,
    }: any = this.props;
    const {
      selectedBtn,
      selectedProjectCustomer,
      selectedService,
    }: any = this.state;
    let firstDropdownData = [];
    let secondDropdownData = [];
    let firstDropdownPlaceholder = '';
    if (selectedBtn === 0) {
      // If user has selected project
      firstDropdownPlaceholder = 'Select a project';
      // prepare project items to show in first dropdown
      firstDropdownData = projects.data.map(project => ({
        label: project.name,
        value: project,
      }));
      if (!isEmpty(selectedProjectCustomer)) {
        // if user has selected project then find all timebased project services
        const projectServices = get(
          selectedProjectCustomer,
          'projectService',
          []
        );
        const filteredServices = projectServices.filter(
          pService =>
            get(pService, 'service.billingType') ===
            SERVICE_BILLING_TYPE.TIME_BASED
        );
        // prepare service items to show in 2nd dropdown
        secondDropdownData = filteredServices.map(pService => ({
          label: pService.service.name,
          value: pService.service,
        }));
      }
    } else if (selectedBtn === 1) {
      // If user has selected customer option
      firstDropdownPlaceholder = 'Select a customer';
      // prepare customer items to show in first dropdown
      firstDropdownData = customers.data.map(customer => ({
        label: customer.name,
        value: customer,
      }));
      // prepare service items to show in 2nd dropdown
      secondDropdownData = services.data.map(service => ({
        label: service.name,
        value: service,
      }));
    }

    return (
      <div className={classes.wrapper}>
        <div className={classes.selectionWrapper}>
          <div
            onClick={this._changeSelectedButton(0)}
            className={cx(classes.selectBtn, classes.projectBtn, {
              active: selectedBtn === 0,
              disabled: !allowedToEdit,
            })}>
            <i className='icon icon-projects' />
          </div>
          <div
            onClick={this._changeSelectedButton(1)}
            className={cx(classes.selectBtn, classes.userBtn, {
              active: selectedBtn === 1,
              disabled: !allowedToEdit,
            })}>
            <i className='icon icon-user-account' />
          </div>
          <Dropdown
            id='timesheet-project-customer'
            classes={{
              component: classes.pDropdown,
              select: classes.pDropdownSelect,
              menuItemText: classes.dropdownItemText,
            }}
            onChange={this._onSelectionChange('selectedProjectCustomer')}
            placeholder={firstDropdownPlaceholder}
            items={firstDropdownData}
            value={selectedProjectCustomer}
            comparator={(items, value) => {
              if (value && value.id) {
                const index = findIndex(items, { id: value.id });
                const item = items[index];
                return { index, item };
              }
              return { index: undefined };
            }}
            disabled={!allowedToEdit}
          />
          <Dropdown
            id='timesheet-service'
            classes={{
              component: classes.sDropdown,
              select: classes.sDropdownSelect,
              menuItemText: classes.dropdownItemText,
            }}
            onChange={this._onSelectionChange('selectedService')}
            placeholder='Select a service'
            items={secondDropdownData}
            value={selectedService || {}}
            comparator={(items, value) => {
              if (value && value.id) {
                const index = findIndex(items, { id: value.id });
                const item = items[index];
                return { index, item };
              }
              return { index: undefined };
            }}
            disabled={!allowedToEdit}
          />
        </div>
        {this._renderInputWrapper()}
      </div>
    );
  }
}

export default withStyles(timesheetRowStyles)(TimehsheetInputRow);
