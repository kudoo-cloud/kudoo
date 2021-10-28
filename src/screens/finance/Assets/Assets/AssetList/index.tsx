import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  composeStyles,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import URL from 'src/helpers/urls';
import styles, { AssetStyles } from '../styles';
import Container from './container';

interface IProps {
  actions: any;
  columns: any;
  assets: any[];
  onSortRequested: () => {};
  assetsLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
}

class AssetList extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Assets'
        subtitle='Below is a list of all your Assets'
        renderLeftPart={() => (
          <Button
            title='Create Asset'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_ASSET());
            }}
          />
        )}
      />
    );
  }

  public _renderNoItem() {
    const { classes } = this.props;
    return (
      <div className={classes.noItemsWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no Assets. <br />
            Let’s start by creating a new Asset.
          </div>
        </div>
      </div>
    );
  }

  public _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'assetGroup') {
      return (
        <div className={classes.customCell}>
          <div>{row.assetGroup.name}</div>
        </div>
      );
    }
    return ele;
  };

  public _renderAssets() {
    const {
      assets,
      assetsLoading,
      onLoadMore,
      columns,
      onSortRequested,
      history,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={assets}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={assetsLoading}
            cellRenderer={this._renderCell}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!assetsLoading) {
                onLoadMore();
              }
            }}
            onCellClick={(e, { row }) => {
              history.push(URL.EDIT_ASSET({ id: row.id }));
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, assets, assetsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {!assetsLoading && isEmpty(assets) && this._renderNoItem()}
            {!isEmpty(assets) && this._renderAssets()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const Styled = withStyles(composeStyles(styles, AssetStyles))(AssetList);

const EnhancedComponent = (props: any) => (
  <Container {...props} type='active-assets'>
    {(childProps) => <Styled {...childProps} />}
  </Container>
);

export default EnhancedComponent;
