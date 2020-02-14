import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import isEmpty from 'lodash/isEmpty';
import {
  withStyles,
  Table,
  Button,
  SectionHeader,
  ErrorBoundary,
  SearchInput,
} from '@kudoo/components';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import find from 'lodash/find';
import styles, { ClassKeys } from './styles';

type Props = IRouteProps<ClassKeys> & {
  variant: 'active' | 'archived';
  items: Array<any>;
  columns: any;
  header: {
    title: string;
    subtitle: string;
    showButton: boolean;
    buttonProps?: {
      title: string;
      onClick: Function;
      buttonColor?: string;
    };
  };
  noItemsMessage: React.ReactNode;
  alertMessages?: {
    archiveItem?: string | React.ReactNode;
    deleteAllItem?: string | React.ReactNode;
    deleteItem?: string | React.ReactNode;
    unarchiveItem?: string | React.ReactNode;
  };

  showSearch?: boolean;
  onSearch?: any;
  onSortRequested?: Function;
  onArchiveItem?: Function;
  onUnArchiveItem?: Function;
  onRemoveItem?: Function;
  onBottomReached?: Function;
  loading?: boolean;
};

type State = {};

class ListPage extends Component<Props, State> {
  static defaultProps = {
    header: {
      title: '',
      subtitle: '',
      showButton: false,
      buttonProps: {
        onClick: () => {},
        title: '',
      },
    },
    showSearch: true,
    alertMessages: {
      archiveItem: <div>Are you sure you want to archive?</div>,
      deleteAllItem: (
        <div>
          <div>
            You are trying to permanently delete all archived items from this
            account. This action is not reversable.
          </div>
          <br />
          <div>Are you sure you want to delete all archived items?</div>
        </div>
      ),
      deleteItem: (
        <div>
          <div>
            You are trying to permanently delete an item from this account. This
            action is not reversable.
          </div>
          <br />
          <div>Are you sure you want to delete this item?</div>
        </div>
      ),
      unarchiveItem: (
        <div>
          <div>
            You are trying to activate a item from the archived list. This will
            add the item to your items list.
          </div>
          <br />
          <div>Are you sure you want to activate this item?</div>
        </div>
      ),
    },
    onBottomReached: () => {},
  };

  _renderSectionHeading() {
    const { header } = this.props;
    return (
      <SectionHeader
        title={header.title}
        subtitle={header.subtitle}
        renderLeftPart={() => {
          return header.showButton ? (
            <Button
              title={header.buttonProps.title}
              applyBorderRadius
              width={260}
              buttonColor={header.buttonProps.buttonColor}
              onClick={this._onHeaderButtonClick}
            />
          ) : null;
        }}
      />
    );
  }

  _onHeaderButtonClick = () => {
    const { variant, header } = this.props;
    if (variant === 'archived') {
      // if page variant is archived then we will show delete all dialog first
      this._showDeleteAllItemsDialog();
    } else {
      // else we will simply call onClick method
      header.buttonProps.onClick();
    }
  };

  _renderNoItems() {
    const { classes, noItemsMessage } = this.props;
    return (
      <div className={classes.noItemsWrapper}>
        <div className={classes.noItemMessageWrapper}>
          <div className={classes.noItemMessage}>{noItemsMessage}</div>
        </div>
      </div>
    );
  }

  _showArchiveDialog = item => {
    const { theme, alertMessages } = this.props;
    const title = `Archive ?`;
    const description = alertMessages.archiveItem;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Archive',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onArchiveItem(item);
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _showDeleteAllItemsDialog = () => {
    const { theme, alertMessages, header } = this.props;
    const title = 'Permanently delete?';
    const description = alertMessages.deleteAllItem;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Delete All',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          // after user confirms, we will call
          header.buttonProps.onClick();
        },
      },
    ];
    const titleColor = theme.palette.secondary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _showDeleteItemDialog = item => {
    const { theme, alertMessages } = this.props;
    const title = 'Permanently delete?';
    const description = alertMessages.deleteItem;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Delete',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onRemoveItem(item);
        },
      },
    ];
    const titleColor = theme.palette.secondary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _showUnarchiveItemDialog = item => {
    const { theme, alertMessages } = this.props;
    const title = 'Activate?';
    const description = alertMessages.unarchiveItem;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Activate',
        onClick: () => {
          this.props.actions.closeAlertDialog();
          this.props.onUnArchiveItem(item);
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  _onRemoveClicked = args => {
    const { variant } = this.props;
    if (variant === 'active') {
      this._showArchiveDialog(args);
    } else if (variant === 'archived') {
      this._showDeleteItemDialog(args);
    }
  };

  _onSortRequested = column => {
    const columns = [...this.props.columns];
    const sortedColumn = find(columns, { sorted: true });
    const columnGoingToBeSorted = find(columns, { id: column.id });

    let sortDirection = 'asc';
    if (sortedColumn.id === columnGoingToBeSorted.id) {
      if (sortedColumn.order === 'asc') {
        sortDirection = 'desc';
      }
    }

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.props.onSortRequested(columns, columnGoingToBeSorted, sortDirection);
  };

  _renderItems() {
    const {
      classes,
      items,
      columns,
      onSearch,
      variant,
      header,
      noItemsMessage,
      alertMessages,
      onSortRequested,
      onArchiveItem,
      onUnArchiveItem,
      onRemoveItem,
      showSearch,
      onBottomReached,
      loading,
      ...rest
    } = this.props;

    return (
      <div className={classes.itemsContainer}>
        {showSearch && (
          <Grid item xs={12} sm={6}>
            <SearchInput
              classes={{ component: classes.searchInput }}
              placeholder={'Search'}
              items={[]}
              onSearch={onSearch}
            />
          </Grid>
        )}
        <Table
          columnData={columns}
          data={items}
          sortable
          stripe={false}
          onRequestSort={this._onSortRequested}
          showRemoveIcon={true}
          onRemoveClicked={this._onRemoveClicked}
          showAddIcon={variant === 'archived' ? true : false}
          onAddClicked={this._showUnarchiveItemDialog}
          onBottomReachedThreshold={500}
          onBottomReached={onBottomReached}
          loading={loading}
          {...rest}
        />
      </div>
    );
  }

  render() {
    const { classes, items } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.tabContent}>
          {this._renderSectionHeading()}
          {isEmpty(items) && this._renderNoItems()}
          {!isEmpty(items) && this._renderItems()}
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<Props, Props>(withRouter, withStyles(styles))(ListPage);
