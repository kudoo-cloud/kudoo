import React, { Component } from 'react';
import { compose } from 'recompose';
import moment from 'moment';
import pluralize from 'pluralize';
import { withStyles, Modal, Table, withStylesProps } from '@kudoo/components';
import { any } from 'prop-types';
import { ViewEntriesModalStyles } from './styles';

type Props = {
  onClose: Function;
  visible: boolean;
  entries: Array<any>;
  classes: any;
};
type State = {};

class ViewEntriesModal extends Component<Props, State> {
  static defaultProps = {
    onClose: () => {},
  };

  _renderCell = (row, column, ele) => {
    const { classes } = this.props;
    if (column.id === 'date') {
      const date = row[column.id];
      return (
        <div className={classes.commonCell}>
          {moment(date).format('DD MMM YYYY')}
        </div>
      );
    } else if (column.id === 'invoiced') {
      const isInvoiced = row.isInvoiced;
      return (
        <div className={classes.commonCell}>{isInvoiced ? 'YES' : 'NO'}</div>
      );
    } else if (column.id === 'hours') {
      const duration = row.duration || 0;
      return (
        <div className={classes.commonCell}>
          {duration} {pluralize('hour', duration)}
        </div>
      );
    }
    return ele;
  };

  render() {
    const { onClose, visible, entries, classes } = this.props;
    const columns = [
      { id: 'date', label: 'Date' },
      { id: 'invoiced', label: 'Invoiced' },
      { id: 'hours', label: 'Duration' },
    ];
    const sortedEntries = [...entries];
    sortedEntries.sort((a, b) => {
      if (moment(a.date).isBefore(b.date)) {
        return -1;
      } else if (moment(a.date).isAfter(b.date)) {
        return 1;
      }
      return 0;
    });
    return (
      <Modal
        classes={{
          description: classes.modalDescription,
        }}
        visible={visible}
        onClose={onClose}
        showCloseButton={false}
        title='Timesheet Entries'
        description={
          <Table
            columnData={columns}
            data={sortedEntries}
            showRemoveIcon={false}
            showAddIcon={false}
            stripe={false}
            sortable={false}
            cellRenderer={this._renderCell}
          />
        }
        buttons={[
          {
            title: 'Close',
            onClick: onClose,
          },
        ]}
      />
    );
  }
}

export default compose<any, any>(withStyles(ViewEntriesModalStyles))(
  ViewEntriesModal
);
