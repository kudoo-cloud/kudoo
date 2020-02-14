import React, { Component } from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import {
  withStyles,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import Grid from '@material-ui/core/Grid';
import SelectedCompany from '@client/helpers/SelectedCompany';
import { withPBSOrganisations } from '@kudoo/graphql';
import { Table, TextField } from '@kudoo/components';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  history: any;
  classes: any;
  pbsOrganisations: {
    count: number;
    data: any[];
    loading: boolean;
    loadNextPage: () => any;
    refetch: (param: any) => any;
  };
  searchedText: string;
  setSearchedText: (param: string) => any;
}

class Manufacturers extends Component<IProps, {}> {
  public state = {
    columns: [
      {
        id: 'id',
        label: '#',
        sorted: true,
        order: 'asc',
      },
      {
        id: 'title',
        label: 'Title',
      },
      { id: 'code', label: 'Code' },
    ],
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Manufacturers');
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
    await this.props.pbsOrganisations.refetch(variables);

    sortedColumn.sorted = false;
    columnGoingToBeSorted.sorted = true;
    columnGoingToBeSorted.order = sortDirection;

    this.setState({
      columns,
    });
  };

  public _onSearchOrgs = debounce(text => {
    const { pbsOrganisations } = this.props;
    pbsOrganisations.refetch({
      where: {
        title: text,
      },
    });
  }, 1000);

  public render() {
    const {
      classes,
      pbsOrganisations,
      searchedText,
      setSearchedText,
      history,
    } = this.props;
    const { columns } = this.state;
    return (
      <SelectedCompany onChange={() => {}}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className={classes.searchBox}>
              <TextField
                value={searchedText}
                placeholder='Search manufacturer...'
                onChangeText={text => {
                  setSearchedText(text);
                  this._onSearchOrgs(text);
                }}
              />
            </div>
            <div className={classes.tableWrapper}>
              <Table
                columnData={columns}
                data={pbsOrganisations.data}
                sortable
                onRequestSort={this._onSortRequested}
                showRemoveIcon={false}
                loading={pbsOrganisations.loading}
                onBottomReachedThreshold={500}
                onBottomReached={() => {
                  if (!pbsOrganisations.loading) {
                    pbsOrganisations.loadNextPage();
                  }
                }}
                onRowClick={(e, row) => {
                  history.push(URL.EDIT_MANUFACTURER({ id: row.id }));
                }}
              />
            </div>
          </Grid>
        </Grid>
      </SelectedCompany>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  withPBSOrganisations(() => {
    return {
      variables: {
        orderBy: 'id_ASC',
        first: 20,
      },
    };
  }),
  withState('searchedText', 'setSearchedText', ''),
  connect((state: any) => ({
    profile: state.profile,
  }))
)(Manufacturers);
