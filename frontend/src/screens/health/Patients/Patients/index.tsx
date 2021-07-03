import { withStyles } from '@kudoo/components';
import idx from 'idx';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import ListPage from 'src/screens/common/ListPage';
import stylesFn, { StyleKeys } from './styles';

type Props = IRouteProps<StyleKeys> & {
  children: React.ReactChildren;
  patients: any;
  archivePatient: Function;
  unArchivePatient: Function;
  deletePatient: Function;
  columns: any;
};
type Variant = 'active' | 'archived';

type State = {
  displayedPatients: any;
  columns: any;
};

class TabContainer extends Component<Props, State> {
  public static defaultProps = {
    archivePatient: () => ({}),
    unArchivePatient: () => ({}),
    deletePatient: () => ({}),
    patients: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      displayedPatients: idx(props, (_) => _.patients.data),
      columns: [],
    };
  }

  componentDidMount() {
    this.setState({
      columns: [
        {
          id: 'title',
          label: 'Title',
          sorted: true,
          order: 'asc',
          renderCell: (row, column) => {
            return (
              <Link
                to={URL.PATIENT_DETAILS({ id: row.id })}
                className={this.props.classes.patientNameCell}
              >
                {row[column.id]}
              </Link>
            );
          },
        },
        { id: 'firstName', label: 'FirstName' },
        { id: 'lastName', label: 'LastName' },
      ],
    });
  }

  componentDidUpdate(prevProps) {
    const oldPatients = idx(prevProps, (_) => _.patients.data) || [];
    const newPatients = idx(this.props, (_) => _.patients.data) || [];
    if (!isEqual(oldPatients, newPatients)) {
      this._updatePatients(newPatients);
    }
  }

  _getType() {
    const match = this.props.match;
    const path = match.path;

    let type: Variant = 'active';
    if (path.indexOf('active') > -1) {
      type = 'active';
    } else if (path.indexOf('archived') > -1) {
      type = 'archived';
    }
    return type;
  }

  _updatePatients(patients) {
    this.setState({
      displayedPatients: patients,
    });
  }

  _onSortRequested = async (newColumns, column, sortDirection) => {
    const variables = {
      orderBy: `${column.id}_${sortDirection.toUpperCase()}`,
    };
    await this.props.patients.refetch(variables);

    this.setState({
      columns: newColumns,
    });
  };

  _onArchivePatient = async (patient) => {
    try {
      const res = await this.props.archivePatient({
        where: { id: patient.id },
        data: { isArchived: true },
      });
      if (res.success) {
        showToast(null, 'Patient archived successfully');
        this.props.patients.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _onUnArchivePatient = async (patient) => {
    try {
      const res = await this.props.unArchivePatient({
        where: { id: patient.id },
        data: { isArchived: false },
      });
      if (res.success) {
        showToast(null, 'Patient activated successfully');
        this.props.patients.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _onRemovePatient = async (patient) => {
    try {
      const res = await this.props.deletePatient({
        where: { id: patient.id },
      });
      if (res.success) {
        showToast(null, 'Patient deleted successfully');
        this.props.patients.refetch();
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  _searchPatient = async (text) => {
    this.props.patients.refetch({
      where: {
        title_contains: text ? text : undefined,
      },
    });
  };

  _getListPageProps = () => {
    const { history, theme } = this.props;
    const type = this._getType();
    const noItemsMessage = (
      <>
        You have not created any patients yet.
        <br />
        Let’s start by creating your first patient.
      </>
    );
    if (type === 'active') {
      return {
        title: 'Patients',
        subtitle: 'Below is a list of all your saved patients.',
        headerButtonProps: {
          title: 'Create Patient',
          onClick: () => {
            history.push(URL.CREATE_PATIENT());
          },
          buttonColor: theme.palette.primary.color2,
        },
        noItemsMessage,
      };
    } else if (type === 'archived') {
      return {
        title: 'Archived Patients',
        subtitle: 'Below is a list of all archived patients.',
        headerButtonProps: {
          title: 'Delete list permanently',
          onClick: () => {
            history.push(URL.ACTIVE_PATIENTS());
          },
          buttonColor: theme.palette.secondary.color2,
        },
        noItemsMessage,
      };
    }
  };

  render() {
    const { displayedPatients, columns } = this.state;
    const { actions, patients = {} } = this.props;
    const listProps = this._getListPageProps();
    const type = this._getType();

    return (
      <SelectedDAO onChange={patients.refetch}>
        <ListPage
          variant={type}
          items={displayedPatients}
          header={{
            title: listProps.title,
            subtitle: listProps.subtitle,
            buttonProps: listProps.headerButtonProps,
            showButton: true,
          }}
          noItemsMessage={listProps.noItemsMessage}
          actions={actions}
          columns={columns}
          onArchiveItem={this._onArchivePatient}
          onSortRequested={this._onSortRequested}
          onUnArchiveItem={this._onUnArchivePatient}
          onRemoveItem={this._onRemovePatient}
          onSearch={this._searchPatient}
        />
      </SelectedDAO>
    );
  }
}

export default compose<Props, Props>(
  withStyles(stylesFn),
  // withPatients(({ match }) => {
  //   const path = match.path;
  //   let isArchived = false;
  //   if (path.indexOf('active') > -1) {
  //     isArchived = false;
  //   } else if (path.indexOf('archived') > -1) {
  //     isArchived = true;
  //   }
  //   return {
  //     name: 'patients',
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'title_ASC',
  //     },
  //   };
  // }),
  // withDeletePatient(),
  // withUpdatePatient(() => ({
  //   name: 'archivePatient',
  // })),
  // withUpdatePatient(() => ({
  //   name: 'unArchivePatient',
  // })),
)(TabContainer);
