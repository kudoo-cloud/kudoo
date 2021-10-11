import {
  Dropdown,
  TextField,
  helpers as utils,
  withStyles,
} from '@kudoo/components';
import ceil from 'lodash/ceil';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import React, { Component } from 'react';
import { showToast } from 'src/helpers/toast';
import { timesheetRowStyles } from './styles';

type Props = {
  initialData: any;
  startWeekDay: any;
  endWeekDay: any;
  onChange: any;
  hideRemoveIcon?: boolean;
  hideDaysLabel?: boolean;
  services?: any[];
  onRemoveClick: () => void;
  allowedToEdit: boolean;
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
      selectedService: {},
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
        this.props.endWeekDay,
      );
    }
    if (!isEqual(initialData, prevProps.initialData)) {
      this._updateUsingInitialData(this.props.initialData);
    }
  }

  _updateUsingInitialData = (initialData) => {
    if (!isEmpty(initialData)) {
      this.setState({
        selectedService: initialData.selectedService,
        dayHours: initialData.dayHours,
      });
    }
  };

  _calculateRangeOfDates = (startWeekDay, endWeekDay) => {
    const dates = utils.getRangeDates(startWeekDay, endWeekDay);
    this.setState({ dates });
  };

  // _changeSelectedButton = (index) => () => {
  //   this.setState(
  //     {
  //       selectedService: null,
  //       dayHours: {},
  //     },
  //     () => {
  //       this._onChange();
  //     },
  //   );
  // };

  _checkDirty = () => {
    const { selectedService, dayHours }: any = this.state;
    const isDirty = !isEqual(this.initialInputState, {
      selectedService,
      dayHours,
    });
    return isDirty;
  };

  _onChange = () => {
    const { dayHours, selectedService }: any = this.state;
    this.props.onChange({
      dayHours,
      selectedService,
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
          `You are trying to add the number ${hour}. The service you are using has been predefined as a '${serviceType}' unit. A ${serviceType.toLowerCase()} is represented as the number ${REPRESENT_NUMBER}. Please insert a number that results to below ${MAX_BELOW}.`,
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

  _onDayHourBlur = (date) => {
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

  _onSelectionChange = (key) => (item) => {
    let newState: any = {
      [key]: item.value,
      dayHours: {},
    };

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
    forEach(dayHours, (val) => {
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
                  onChangeText={(val) => {
                    this._onDayHourChange(formattedDate, val);
                  }}
                  onBlur={() => {
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
              data-test={`total-hours-${totalHours}`}
            >
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
    const { classes, services, allowedToEdit }: any = this.props;
    const { selectedService }: any = this.state;

    let secondDropdownData = [];

    // prepare service items to show in 2nd dropdown
    secondDropdownData = (services || []).map((service) => ({
      label: service.name,
      value: service,
    }));

    return (
      <div className={classes.wrapper}>
        <div className={classes.selectionWrapper}>
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

export default withStyles<Props>(timesheetRowStyles)(TimehsheetInputRow);
