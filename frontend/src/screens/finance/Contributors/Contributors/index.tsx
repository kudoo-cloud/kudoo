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
  useContributorsQuery,
  useDeleteContributorMutation,
} from 'src/generated/graphql';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  contributors: any;
  contributorsLoading: boolean;
  classes: any;
  theme: any;
}

const Contributors: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const actions = useAllActions();

  const [columns] = useState([
    {
      id: 'firstName',
      label: 'First Name',
      sorted: true,
      order: 'asc',
      notSortable: true,
    },
    {
      id: 'lastName',
      label: 'Last Name',
    },
    {
      id: 'amount',
      label: 'Amount',
    },
    {
      id: 'cChainAddress',
      label: 'C-Chain Address',
      notSortable: true,
    },
    {
      id: 'paymentFrequency',
      label: 'Payment Frequency',
      notSortable: true,
    },

    {
      id: 'startDate',
      label: 'Start Date',
      notSortable: true,
    },
  ]);

  const history = useHistory();

  const [deleteContributor] = useDeleteContributorMutation();

  const { data, loading, refetch } = useContributorsQuery({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const contributors = data?.contributors || [];

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
        title='Contributors'
        subtitle='Below is a list of all your Contributors.'
        renderLeftPart={() => (
          <Button
            title='Create New Contributor'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_CONTRIBUTORS());
            }}
          />
        )}
      />
    );
  };

  const _renderNoContributor = () => {
    return (
      <div className={classes.noContributorWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no contributor. <br />
            Let’s start by creating a new Contributor.
          </div>
        </div>
      </div>
    );
  };

  const _renderCell = (row, cell, ele) => {
    if (cell.id === 'firstName') {
      return (
        <Link
          to={URL.EDIT_CONTRIBUTORS({ id: row.id })}
          className={classes.contributorNameCell}
        >
          {ele}
        </Link>
      );
    }
    return ele;
  };

  const showRemoveAlert = (row) => {
    const title = 'Delete Contributor';
    const description = `Are you sure you want to remove contributor ?`;
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
        onClick: () => removeContributor(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const removeContributor = async (row) => {
    try {
      const res = await deleteContributor({
        variables: { id: row.id },
      });
      if (res?.data?.deleteContributor?.id) {
        showToast(null, 'Contributor removed successfully');
        refetch();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _renderSupplier = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={contributors}
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
          {!loading && contributors.length === 0 && _renderNoContributor()}
          {contributors.length > 0 && _renderSupplier()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(Contributors);
