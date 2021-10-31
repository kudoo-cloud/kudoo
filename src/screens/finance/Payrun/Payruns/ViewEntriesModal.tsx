import { Modal, Table, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { ViewEntriesModalStyles } from './styles';
import { Currency } from 'src/generated/graphql';

type Props = {
  onClose?: any;
  visible: boolean;
  entries: Array<any>;
  classes: any;
  currency: Currency;
};
type State = {};

class ViewEntriesModal extends Component<Props, State> {
  static defaultProps = {
    onClose: () => {},
  };

  _renderCell = (row, column, ele) => {
    const { classes, currency } = this.props;

    if (column.id === 'amount') {
      const amount = row.amount || 0;
      return (
        <div className={classes.commonCell}>
          {amount} {currency}
        </div>
      );
    }
    return ele;
  };

  render() {
    const { onClose, visible, entries, classes } = this.props;
    const columns = [
      { id: 'name', label: 'Name' },
      { id: 'payeeType', label: 'Type' },
      { id: 'cChainAddress', label: 'C-Chain Address' },
      { id: 'amount', label: 'Amount' },
    ];

    const sortedEntries = [...entries];

    return (
      <Modal
        classes={{
          description: classes.modalDescription,
        }}
        visible={visible}
        onClose={onClose}
        showCloseButton={false}
        title='Payrun Details'
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
  ViewEntriesModal,
);
