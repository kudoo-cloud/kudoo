import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  withStyles,
  composeStyles,
  Button,
  SectionHeader,
  ErrorBoundary,
  Table,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import Grid from '@material-ui/core/Grid';
import styles, { AssetStyles } from '../styles';
import Container from './container';

interface IProps {
  actions: any;
  columns: any;
  assetGroups: any[];
  onSortRequested: () => {};
  assetGroupsLoading: boolean;
  onLoadMore: () => {};
  history: any;
  classes: any;
  theme: any;
}

class AssetGroups extends Component<IProps> {
  public _renderSectionHeading() {
    const { history, theme } = this.props;
    return (
      <SectionHeader
        title='Asset Groups'
        subtitle='Below is a list of all your Asset Groups'
        renderLeftPart={() => (
          <Button
            title='Create Asset Group'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_ASSET_GROUP());
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
            There are no Asset Groups. <br />
            Let’s start by creating a new Asset Groups.
          </div>
        </div>
      </div>
    );
  }

  public _renderAssets() {
    const {
      assetGroups,
      assetGroupsLoading,
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
            data={assetGroups}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={onSortRequested}
            loading={assetGroupsLoading}
            onBottomReachedThreshold={500}
            onBottomReached={() => {
              if (!assetGroupsLoading) {
                onLoadMore();
              }
            }}
            onCellClick={(e, { row }) => {
              history.push(URL.EDIT_ASSET_GROUP({ id: row.id }));
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public render() {
    const { classes, assetGroups, assetGroupsLoading } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderSectionHeading()}
            {!assetGroupsLoading &&
              isEmpty(assetGroups) &&
              this._renderNoItem()}
            {!isEmpty(assetGroups) && this._renderAssets()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const Styled = withStyles(composeStyles(styles, AssetStyles))(AssetGroups);

const EnhancedComponent = (props: any) => (
  <Container {...props} type='active-asset-groups'>
    {childProps => <Styled {...childProps} />}
  </Container>
);

export default EnhancedComponent;
