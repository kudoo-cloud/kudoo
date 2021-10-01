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
  useDeletePolicyMutation,
  usePoliciesByDaoQuery,
} from 'src/generated/graphql';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  policies: any;
  policiesLoading: boolean;
  classes: any;
  theme: any;
}

const Policies: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const actions = useAllActions();
  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [columns] = useState([
    {
      id: 'amount',
      label: 'Amount',
      sorted: true,
      order: 'asc',
      notSortable: true,
    },
    {
      id: 'token',
      label: 'Token',
      notSortable: true,
    },
    {
      id: 'paymentFrequency',
      label: 'Payment Frequency',
      notSortable: true,
    },
  ]);

  const history = useHistory();

  const [deletePolicy] = useDeletePolicyMutation();

  const { data, loading, refetch } = usePoliciesByDaoQuery({
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

  const policies = data?.policiesByDao || [];

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
        title='Policies'
        subtitle='Below is a list of all your Policies.'
        renderLeftPart={() => (
          <Button
            title='Create New Policy'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_POLICIES());
            }}
          />
        )}
      />
    );
  };

  const _renderNoPolicy = () => {
    return (
      <div className={classes.noPolicyWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no policy. <br />
            Let’s start by creating a new Policy.
          </div>
        </div>
      </div>
    );
  };

  const _renderCell = (row, cell, ele) => {
    if (cell.id === 'amount') {
      return (
        <Link
          to={URL.EDIT_POLICIES({ id: row.id })}
          className={classes.policyAmountCell}
        >
          {ele}
        </Link>
      );
    }
    return ele;
  };

  const showRemoveAlert = (row) => {
    const title = 'Delete Policy';
    const description = `Are you sure you want to remove policy ?`;
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
        onClick: () => removePolicy(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const removePolicy = async (row) => {
    try {
      const res = await deletePolicy({
        variables: { id: row.id },
      });
      if (res?.data?.deletePolicy?.id) {
        showToast(null, 'Policy removed successfully');
        refetch();
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _renderPolicy = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={policies}
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
          {!loading && policies.length === 0 && _renderNoPolicy()}
          {policies.length > 0 && _renderPolicy()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(Policies);
