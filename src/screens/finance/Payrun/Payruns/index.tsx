import {
  Button,
  ErrorBoundary,
  Loading,
  SectionHeader,
  Table,
  Tooltip,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { usePayrunsByDaoQuery } from 'src/generated/graphql';
import URL from 'src/helpers/urls';
import { useProfile } from 'src/store/hooks';
import styles from './styles';
import ViewEntriesModal from './ViewEntriesModal';

interface IProps {
  children: ({}) => {};
  payrunsData: any;
  loading: boolean;
  classes: any;
  theme: any;
}

const Payruns: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [columns] = useState([
    { id: 'startsAt', label: 'Start Date', notSortable: true },
    { id: 'endsAt', label: 'Ends Date', notSortable: true },
    {
      id: 'totalAmount',
      label: 'Total Amount',

      notSortable: true,
    },
    { id: 'createdAt', label: 'Payrun Date', notSortable: true },
    {
      id: 'view',
      label: '',
      notSortable: true,
      classes: {
        tableHeaderCellWrapper: props.classes.emailColumn,
      },
    },
  ]);

  const [showViewEntriesModal, setShowViewEntriesModal] = useState(
    false as boolean,
  );
  const [showingEntriesInModal, setShowingEntriesInModal] = useState(
    [] as Array<any>,
  );

  const history = useHistory();

  const { data, loading, refetch } = usePayrunsByDaoQuery({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  const payrunsData = data?.payrunsByDao || [];

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
        title='Payrun'
        subtitle='Below is a list of all your saved payrun.'
        renderLeftPart={() => (
          <Button
            title='Create New Payrun'
            id='create-service'
            applyBorderRadius
            width={260}
            buttonColor={theme.palette.primary.color2}
            onClick={() => {
              history.push(URL.CREATE_PAYRUN());
            }}
          />
        )}
      />
    );
  };

  const _renderNoPayrun = () => {
    return (
      <div className={classes.noServiceWrapper}>
        <div className={classes.noActiveMessageWrapper}>
          <div className={classes.noActiveMessage}>
            There are no payrun. <br />
            Let’s start by creating a new payrun.
          </div>
        </div>
      </div>
    );
  };

  const _toggleViewEntriesModal = (visible, entries = []) => {
    setShowViewEntriesModal(visible);
    setShowingEntriesInModal([...entries]);
  };

  const _renderViewEntriesModal = () => {
    if (!showViewEntriesModal) {
      return null;
    }
    return (
      <ViewEntriesModal
        visible={showViewEntriesModal}
        onClose={() => {
          _toggleViewEntriesModal(false);
        }}
        entries={showingEntriesInModal}
      />
    );
  };

  const _renderCell = (row, cell, ele) => {
    if (cell.id === 'endsAt') {
      return (
        <div className={classes.commonCell}>
          {moment(row?.endsAt).format('DD MMM YYYY')}
        </div>
      );
    } else if (cell.id === 'startsAt') {
      return (
        <div className={classes.commonCell}>
          {moment(row?.startsAt).format('DD MMM YYYY')}
        </div>
      );
    } else if (cell.id === 'createdAt') {
      return (
        <div className={classes.commonCell}>
          {moment(row?.createdAt).format('DD MMM YYYY')}
        </div>
      );
    } else if (cell.id === 'totalAmount') {
      return <div className={classes.commonCell}>{row?.totalAmount} PNG</div>;
    } else if (cell.id === 'view') {
      return (
        <div
          className={classes.emailIconCell}
          onClick={() => _toggleViewEntriesModal(true, row?.payrunDetails)}
        >
          <Tooltip title={'View Payrun Details'}>
            {() => <i className='fa fa-eye' />}
          </Tooltip>
        </div>
      );
    }
    return ele;
  };

  const _renderPayrun = () => {
    return (
      <div className={classes.servicesContainer}>
        <Grid container>
          <Grid item xs={12}>
            <Table
              columnData={columns}
              data={payrunsData}
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
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>
        <div className={classes.content}>
          {_renderSectionHeading()}
          {loading && <Loading />}
          {!loading && payrunsData.length === 0 && _renderNoPayrun()}
          {payrunsData.length > 0 && _renderPayrun()}
        </div>
      </div>
      4{_renderViewEntriesModal()}
    </ErrorBoundary>
  );
};

export default withStyles(styles)(Payruns);
