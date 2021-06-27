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
import TabContainer from './container';
import styles, { SupplierStyles } from './styles';

interface IProps {
  actions: any;
  suppliers: any[];
  onSortRequested: () => {};
  suppliersLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
  columns: any;
}

class Suppliers extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Suppliers'
        subtitle='Below is a list of all your Suppliers.'
        renderLeftPart={() => (
          <Button
            title='Create New Supplier'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_SUPPLIERS());
            }}
          />
        )}
      />
    );
  }

  public _renderNoSupplier() {
    const { classes } = this.props;
    return (
      <div className={classes.noSupplierWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no suppliers. <br />
            Let’s start by creating a new Supplier.
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
          to={URL.EDIT_SUPPLIERS({ id: row.id })}
          className={classes.supplierNameCell}
        >
          {ele}
        </Link>
      );
    }
    return ele;
  };

  public _renderSupplier() {
    const {
      suppliers,
      suppliersLoading,
      onLoadMore,
      columns,
      onSortRequested,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={suppliers}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={suppliersLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!suppliersLoading) {
                onLoadMore();
              }
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, suppliers, suppliersLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {suppliersLoading && <Loading />}
            {!suppliersLoading &&
              isEmpty(suppliers) &&
              this._renderNoSupplier()}
            {!isEmpty(suppliers) && this._renderSupplier()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const StyledSuppliers = withStyles(composeStyles(styles, SupplierStyles))(
  Suppliers,
);

const EnhancedComponent = (props: any) => (
  <TabContainer {...props} type='active-suppliers'>
    {(childProps) => <StyledSuppliers {...childProps} />}
  </TabContainer>
);

export default EnhancedComponent;
