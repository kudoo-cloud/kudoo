import { Table, Tooltip, withStyles } from '@kudoo/components';
import Collapse from '@material-ui/core/Collapse';
import cx from 'classnames';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import React, { Component } from 'react';
import { timesheetBlockStyles } from './styles';

type Props = {
  type: 'project' | 'dao';
  serviceName: string;
  daoName: string;
  project?: string;
  rows: Array<Record<string, any>>;
  collapsed?: boolean;
  onCellClick?: Function;
  showEmailIcon?: boolean;
  showViewIcon?: boolean;
  showRemoveIcon?: boolean;
  showAddIcon?: boolean;
  onRemoveClicked?: Function;
  onAddClicked?: Function;
  classes?: any;
};
type State = {
  collapsed: boolean;
  tableData: Array<Record<string, any>>;
  tableColumns: any;
};

class TimesheetBlock extends Component<Props, State> {
  static defaultProps = {
    collapsed: false,
    type: 'project',
    showEmailIcon: true,
    showViewIcon: true,
    showRemoveIcon: false,
    onRemoveClicked: () => {},
    showAddIcon: false,
    onAddClicked: () => {},
  };

  constructor(props) {
    super(props);

    let columns: any = [
      { id: 'user', label: 'User' },
      { id: 'period', label: 'Period' },
      { id: 'status', label: 'Status' },
      { id: 'hours', label: 'Unit' },
    ];
    if (props.showEmailIcon) {
      columns = [
        ...columns,
        {
          id: 'email',
          label: '',
          notSortable: true,
          classes: {
            tableHeaderCellWrapper: props.classes.emailColumn,
          },
        },
      ];
    }
    if (props.showViewIcon) {
      columns = [
        ...columns,
        {
          id: 'view',
          label: '',
          notSortable: true,
          classes: {
            tableHeaderCellWrapper: props.classes.emailColumn,
          },
        },
      ];
    }

    this.state = {
      tableColumns: columns,
      collapsed: props.collapsed || false,
      tableData: props.rows || [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.collapsed !== prevProps.collapsed) {
      this.setState({ collapsed: this.props.collapsed });
    }
    if (!isEqual(this.props.rows, prevProps.rows)) {
      this.setState({ tableData: this.props.rows });
    }
  }

  _onRequestSort = (column) => {
    const { tableColumns, tableData }: any = this.state;

    // find request column index and column
    const foundColumnIndex = findIndex(tableColumns, { id: column.id });
    const foundColumn = tableColumns[foundColumnIndex];

    // find already sorted column if any
    const alreadySortedColumnIndex = findIndex(tableColumns, { sorted: true });
    const alreadySortedColumn = tableColumns[alreadySortedColumnIndex];
    if (alreadySortedColumn && alreadySortedColumnIndex !== foundColumnIndex) {
      // if there is already sorted column and which is different than foundColumn
      // then make it false
      alreadySortedColumn.sorted = false;
      tableColumns[alreadySortedColumnIndex] = alreadySortedColumn;
    }

    if (!foundColumn.sorted) {
      // if not sorted
      foundColumn.sorted = true;
      foundColumn.order = 'asc';
      tableColumns[foundColumnIndex] = foundColumn;
    } else {
      // if sorted
      foundColumn.order = foundColumn.order === 'asc' ? 'desc' : 'asc';
      tableColumns[foundColumnIndex] = foundColumn;
    }

    const order = foundColumn.order;

    // sort data now
    if (column.id === 'user' || column.id === 'status') {
      // normal sorting
      tableData.sort((a, b) => {
        if (order === 'asc') {
          return a[column.id] - b[column.id];
        }
        return b[column.id] - a[column.id];
      });
    } else if (column.id === 'period') {
      // sort date
      tableData.sort((a, b) => {
        if (moment(a.startsAt).isBefore(b.startsAt)) {
          return order === 'asc' ? -1 : 1;
        } else if (moment(a.startsAt).isAfter(b.startsAt)) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else if (column.id === 'hours') {
      // sort hours
      tableData.sort((a, b) => {
        if (order === 'asc') {
          return a.totalHours - b.totalHours;
        }
        return b.totalHours - a.totalHours;
      });
    }

    this.setState({
      tableColumns,
      tableData,
    });
  };

  _renderCell = (row, column, ele) => {
    const { classes } = this.props;
    if (column.id === 'status') {
      const status = row[column.id];
      return <div className={cx(classes.statusCell, 'green')}>{status}</div>;
    } else if (column.id === 'email') {
      return (
        <div className={classes.emailIconCell}>
          <Tooltip title={'Send timesheet notification email'}>
            {() => <i className='fa fa-envelope-o' />}
          </Tooltip>
        </div>
      );
    } else if (column.id === 'view') {
      return (
        <div className={classes.emailIconCell}>
          <Tooltip title={'View Timesheet Details'}>
            {() => <i className='fa fa-eye' />}
          </Tooltip>
        </div>
      );
    }
    return ele;
  };

  render() {
    const {
      classes,
      type,
      serviceName,
      daoName,
      project,
      showRemoveIcon,
      showAddIcon,
    } = this.props;
    const { collapsed } = this.state;
    return (
      <div className={classes.wrapper} data-test='timesheet-block'>
        <div
          className={cx(classes.titleWrapper, {
            'is-dao': type === 'dao',
            'is-collapsed': collapsed,
          })}
          onClick={() => {
            this.setState({ collapsed: !collapsed });
          }}
        >
          <div className={classes.title}>
            {type === 'project' ? project : 'Linked to DAO'}
          </div>
          {type === 'project' && <div className={classes.type}>Project</div>}
          <i
            className={cx(classes.arrowIcon, 'ion-chevron-right', {
              'is-open': !collapsed,
            })}
          />
        </div>
        <Collapse in={!this.state.collapsed} timeout='auto' unmountOnExit>
          <div className={classes.serviceInfoWrapper}>
            <div className={classes.serviceName}>{serviceName}</div>
            <div className={classes.daoName}>{daoName}</div>
          </div>
          <Table
            columnData={this.state.tableColumns}
            data={this.state.tableData}
            showRemoveIcon={showRemoveIcon}
            showAddIcon={showAddIcon}
            stripe={false}
            sortable={true}
            onRequestSort={this._onRequestSort}
            cellRenderer={this._renderCell}
            onCellClick={this.props.onCellClick}
            onRemoveClicked={this.props.onRemoveClicked}
            onAddClicked={this.props.onAddClicked}
            classes={{
              tableRowRoot: classes.tableRowRoot,
            }}
          />
        </Collapse>
      </div>
    );
  }
}

export default withStyles<Props>(timesheetBlockStyles)(TimesheetBlock as any);
