import { Table, TextField, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import SelectedDAO from 'src/helpers/SelectedDAO';

import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  classes: any;
  pbsTPPs: {
    count: number;
    data: any[];
    loading: boolean;
    loadNextPage: () => any;
    refetch: (param: any) => any;
  };
  searchedText: string;
  setSearchedText: (param: string) => any;
}

class Drugs extends Component<IProps, {}> {
  public static defaultProps = {
    pbsTPPs: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  public state = {
    columns: [
      {
        id: 'id',
        label: '#',
        sorted: true,
        order: 'asc',
      },
      {
        id: 'brandName',
        label: 'Name',
      },
      { id: 'snomedCode', label: 'Snomed Code' },
    ],
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('PBS');
  }

  public _onSortRequested = async (column: any) => {
    const columns = this.state.columns;
    const sortedColumn = find(columns, { sorted: true });
    const columnGoingToBeSorted = find(columns, { id: column.id });

    let sortDirection = 'asc';
    if (sortedColumn.id === columnGoingToBeSorted.id) {
      if (sortedColumn.order === 'asc') {
        sortDirection = 'desc';
      }
    }
    const variables = {
      orderBy: `${columnGoingToBeSorted.id}_${sortDirection.toUpperCase()}`,
    };
    await this.props.pbsTPPs.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public _onSearchDrugs = debounce((text) => {
    const { pbsTPPs } = this.props;
    pbsTPPs.refetch({
      where: {
        brandName: text,
      },
    });
  }, 1000);

  public render() {
    const { classes, pbsTPPs, searchedText, setSearchedText } = this.props;
    const { columns } = this.state;
    return (
      <SelectedDAO onChange={() => {}}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className={classes.searchBox}>
              <TextField
                value={searchedText}
                placeholder='Search brand name...'
                onChangeText={(text) => {
                  setSearchedText(text);
                  this._onSearchDrugs(text);
                }}
              />
            </div>
            <div className={classes.tableWrapper}>
              <Table
                columnData={columns}
                data={pbsTPPs.data}
                sortable
                onRequestSort={this._onSortRequested}
                showRemoveIcon={false}
                loading={pbsTPPs.loading}
                onBottomReachedThreshold={500}
                onBottomReached={() => {
                  if (!pbsTPPs.loading) {
                    pbsTPPs.loadNextPage();
                  }
                }}
              />
            </div>
          </Grid>
        </Grid>
      </SelectedDAO>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  // withPbsTPPs(() => {
  //   return {
  //     variables: {
  //       orderBy: 'id_ASC',
  //       first: 20,
  //     },
  //   };
  // }),
  withState('searchedText', 'setSearchedText', ''),
  connect((state: any) => ({
    profile: state.profile,
  })),
)(Drugs);
