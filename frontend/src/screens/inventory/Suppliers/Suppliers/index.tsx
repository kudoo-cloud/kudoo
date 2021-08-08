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
import { useSuppliersByDaoQuery } from 'src/generated/graphql';
import URL from 'src/helpers/urls';
import { useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  children: ({}) => {};
  suppliers: any;
  suppliersLoading: boolean;
  classes: any;
  theme: any;
}

const Suppliers: React.FC<IProps> = (props) => {
  const { theme, classes } = props;
  const [columns] = useState([
    {
      id: 'name',
      label: 'Name',
      sorted: true,
      order: 'asc',
      notSortable: true,
    },
    {
      id: 'termsOfPayment',
      label: 'Terms Of Payment',
      notSortable: true,
    },
    {
      id: 'emailAddressForRemittance',
      label: 'Email For Remittance',
      notSortable: true,
    },
  ]);

  const history = useHistory();
  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const { data, loading, refetch } = useSuppliersByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });

  useEffect(() => {
    if (refetch && daoId) {
      refetch({
        daoId,
      });
    }
  }, [daoId, refetch]);

  const suppliers = data?.suppliersByDao || [];

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
  };

  const _renderNoSupplier = () => {
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
  };

  const _renderCell = (row, cell, ele) => {
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

  const _renderSupplier = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table
            columnData={columns}
            data={suppliers}
            stripe={false}
            showRemoveIcon={false}
            sortable
            onRequestSort={_onRequestSort}
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
          {!loading && suppliers.length === 0 && _renderNoSupplier()}
          {suppliers.length > 0 && _renderSupplier()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(Suppliers);
