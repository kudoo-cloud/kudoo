import {
  Button,
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
  useDeleteReoccuringExpenseMutation,
  useReoccuringExpensesByDaoQuery,
} from 'src/generated/graphql';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  reoccuringExpensess: any;
  reoccuringExpensessLoading: boolean;
  classes: any;
  theme: any;
}

const ReoccuringExpenses: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const actions = useAllActions();
  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [columns] = useState([
    {
      id: 'supplier',
      label: 'Supplier',
      notSortable: true,
    },
    {
      id: 'amount',
      label: 'Amount',
      sorted: true,
      order: 'asc',
      notSortable: true,
    },

    {
      id: 'reoccuringFrequency',
      label: 'Reoccuring Frequency',
      notSortable: true,
    },
  ]);

  const history = useHistory();

  const [deleteReoccuringExpense] = useDeleteReoccuringExpenseMutation();

  const { data, loading, refetch } = useReoccuringExpensesByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });

  useEffect(() => {
    if (refetch) {
      refetch({
        daoId,
      });
    }
  }, [refetch]);

  const reoccuringExpensess = data?.reoccuringExpensesByDao || [];

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
        title='Reoccuring Expense'
        subtitle='Below is a list of all your Reoccuring Expenses.'
        renderLeftPart={() => (
          <Button
            title='Create New Reoccuring Expense'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_REOCCURING_EXPENSE());
            }}
          />
        )}
      />
    );
  };

  const _renderNoReoccuringExpense = () => {
    return (
      <div className={classes.noReoccuringExpenseWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no Reoccuring Expense. <br />
            Let’s start by creating a new Reoccuring Expense.
          </div>
        </div>
      </div>
    );
  };

  const _renderCell = (row, cell, ele) => {
    if (cell.id === 'supplier') {
      return (
        <Link
          to={URL.EDIT_REOCCURING_EXPENSE({ id: row.id })}
          className={classes.supplierCell}
        >
          <div className={classes.borderCell}>{row?.supplier.name}</div>
        </Link>
      );
    }
    return ele;
  };

  const showRemoveAlert = (row) => {
    const title = 'Delete Reoccuring Expense';
    const description = `Are you sure you want to remove reoccuring expense ?`;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Remove',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => removeReoccuringExpense(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const removeReoccuringExpense = async (row) => {
    try {
      const res = await deleteReoccuringExpense({
        variables: { id: row.id },
      });
      if (res?.data?.deleteReoccuringExpense?.id) {
        showToast(null, 'Reoccuring Expense removed successfully');
        refetch();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _renderReoccuringExpense = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={reoccuringExpensess}
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
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>
        <div className={classes.content}>
          {_renderSectionHeading()}
          {loading && <Loading />}
          {!loading &&
            reoccuringExpensess.length === 0 &&
            _renderNoReoccuringExpense()}
          {reoccuringExpensess.length > 0 && _renderReoccuringExpense()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(ReoccuringExpenses);
