import {
  Button,
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import URL from 'src/helpers/urls';
import TabContainer from './InventoryTabContainer';
import styles, { InventoryStyles } from './styles';

interface IProps {
  actions: any;
  inventories: any[];
  onSortRequested: () => {};
  inventoriesLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}

class Inventory extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Inventory'
        subtitle='Below is a list of all Inventories.'
        renderLeftPart={() => (
          <Button
            title='Create New Inventory'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_INVENTORY());
            }}
          />
        )}
      />
    );
  }

  public _renderNoInventory() {
    const { classes } = this.props;
    return (
      <div className={classes.noLedgerWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no inventories. <br />
            Let’s start by creating a new Inventory.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'name') {
      return (
        <Link
          to={URL.EDIT_INVENTORY({ id: row.id })}
          className={classes.inventoryNameCell}
        >
          {ele}
        </Link>
      );
    }
    return ele;
  };

  public _renderInventory() {
    const {
      inventories,
      inventoriesLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={inventories}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={inventoriesLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!inventoriesLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, inventories, inventoriesLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {inventoriesLoading && <Loading />}
            {!inventoriesLoading &&
              isEmpty(inventories) &&
              this._renderNoInventory()}
            {!isEmpty(inventories) && this._renderInventory()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledInventories = withStyles(composeStyles(styles, InventoryStyles))(
  Inventory,
);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-inventories'>
    {(childProps) => <StyledInventories {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
