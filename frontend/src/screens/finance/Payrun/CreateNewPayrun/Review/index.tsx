import {
  Button,
  ErrorBoundary,
  SectionHeader,
  Table,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useAllActions } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  data: any;
  loading: boolean;
  classes: any;
  theme: any;
}

interface Props {
  removePayee: (row: any) => void;
  loading: boolean;
  data: any;
  updateSteps: Function;
  unmarkedVisited: Function;
  createPayrun: Function;
}

const Review: React.FC<IProps & Props> = ({
  removePayee,
  loading,
  data,
  updateSteps,
  unmarkedVisited,
  createPayrun,
  ...props
}) => {
  const { theme, classes } = props;

  const actions = useAllActions();

  const [columns] = useState([
    {
      id: 'name',
      label: 'Name',
    },

    {
      id: 'payeeType',
      label: 'Type',
    },
    {
      id: 'cChainAddress',
      label: 'C-Chain Address',
      notSortable: true,
    },

    {
      id: 'amount',
      label: 'Amount',
    },
  ]);

  const _onRequestSort = async () => {
    // const sortedColumn = find(columns, { sorted: true });
    // const columnGoingToBeSorted = find(columns, { id: column.id });
    // let sortDirection = 'asc';
    // if (sortedColumn.id === columnGoingToBeSorted.id) {
    //   if (sortedColumn.order === 'asc') {
    //     sortDirection = 'desc';
    //   }
    // }
    // const variables = {
    //   orderBy: `${columnGoingToBeSorted.id}_${sortDirection.toUpperCase()}`,
    // };
    // await refetch(variables);
    // sortedColumn.sorted = false;
    // columnGoingToBeSorted.sorted = true;
    // columnGoingToBeSorted.order = sortDirection;
    // setColumns(column);
  };

  const _renderSectionHeading = () => {
    return (
      <SectionHeader
        title='Payee'
        subtitle='Below is a list of all your payee.'
        renderLeftPart={() => (
          <div className={classes.prevNextWrapper}>
            <Button
              title='Prev'
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              buttonColor={theme.palette.primary.color2}
              withoutBackground
              isDisabled={loading}
              onClick={() => {
                updateSteps(0);
                unmarkedVisited(0);
              }}
            />
            <Button
              title='Submit'
              id='next-button'
              classes={{ component: classes.prevNextButton }}
              applyBorderRadius
              compactMode
              loading={loading}
              isDisabled={loading}
              buttonColor={theme.palette.primary.color2}
              onClick={() => {
                createPayrun();
              }}
            />
          </div>
        )}
      />
    );
  };

  const _renderNoPayee = () => {
    return (
      <div className={classes.noServiceWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no payee. <br />
          </div>
        </div>
      </div>
    );
  };

  const _renderCell = (row, cell, ele) => {
    if (cell.id === 'amount') {
      return <div className={classes.amountCell}>{row[cell.id]} PNG</div>;
    }
    return ele;
  };

  const showRemoveAlert = (row) => {
    const title = 'Remove payee?';
    const description = `Are you sure you want to remove this payee?`;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Remove Payee',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          actions.closeAlertDialog();
          removePayee(row);
        },
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const _renderPayee = () => {
    return (
      <div className={classes.servicesContainer}>
        <Grid container>
          <Grid item xs={12}>
            <Table
              columnData={columns}
              data={data}
              stripe={false}
              showRemoveIcon={true}
              sortable
              onRequestSort={_onRequestSort}
              onRemoveClicked={showRemoveAlert}
              loading={loading}
              cellRenderer={_renderCell}
              onBottomReachedThreshold={500}
              onBottomReached={() => {
                if (!loading) {
                  // onLoadMore();
                }
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>
        <div className={classes.content}>
          {_renderSectionHeading()}
          {!loading && data.length === 0 && _renderNoPayee()}
          {data.length > 0 && _renderPayee()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withStyles<Props>(styles)(Review);
