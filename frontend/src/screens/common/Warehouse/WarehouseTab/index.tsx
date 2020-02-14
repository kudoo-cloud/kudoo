import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import {
  withStyles,
  composeStyles,
  Button,
  SectionHeader,
  ErrorBoundary,
  Table,
  Loading,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import Grid from '@material-ui/core/Grid';
import TabContainer from './WarehouseTabContainer';
import styles, { WarehouseStyles } from './styles';

interface IProps {
  actions: any;
  wareHouses: any[];
  onSortRequested: () => {};
  wareHousesLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}

class Warehouse extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Warehouse'
        subtitle='Below is a list of all Warehouses.'
        renderLeftPart={() => (
          <Button
            title='Create New Warehouse'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_WAREHOUSE());
            }}
          />
        )}
      />
    );
  }

  public _renderNoWarehouse() {
    const { classes } = this.props;
    return (
      <div className={classes.noWrapper}>
        <div className={classes.noMessageWrapper}>
          <div className={classes.noMessage}>
            There are no warehouses. <br />
            Let’s start by creating a new Warehouse.
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
          to={URL.EDIT_WAREHOUSE({ id: row.id })}
          className={classes.warehouseNameCell}>
          {ele}
        </Link>
      );
    }
    return ele;
  };

  public _renderWarehouse() {
    const {
      wareHouses,
      wareHousesLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={wareHouses}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={wareHousesLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!wareHousesLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, wareHouses, wareHousesLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {wareHousesLoading && <Loading />}
            {!wareHousesLoading &&
              isEmpty(wareHouses) &&
              this._renderNoWarehouse()}
            {!isEmpty(wareHouses) && this._renderWarehouse()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledWarehouses = withStyles(composeStyles(styles, WarehouseStyles))(
  Warehouse
);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-wareHouses'>
    {childProps => <StyledWarehouses {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
