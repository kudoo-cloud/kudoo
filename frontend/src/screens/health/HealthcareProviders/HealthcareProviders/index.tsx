import { withStyles } from '@kudoo/components';
import idx from 'idx';
import React, { useState } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import ListPage from 'src/screens/common/ListPage';
import stylesFn, { ClassesKeys } from './styles';

type Props = IRouteProps<ClassesKeys> & {
  healthcareProviders: {
    refetch: (c?: any) => any;
    data: {
      firstName: string;
      lastName: string;
    }[];
  };
  archiveProvider: Function;
  unArchiveProvider: Function;
  deleteHealthcareProvider: Function;
};

type Variant = 'active' | 'archived';

const HealthcareProviders: React.FC<Props> = (props) => {
  const { healthcareProviders, match, actions, history, theme } = props;

  const [columns, setColumns] = useState([
    { id: 'firstName', label: 'FirstName', sorted: true, order: 'asc' },
    { id: 'lastName', label: 'LastName' },
  ]);

  const getListType = () => {
    const path = match.path;

    let type: Variant = 'active';
    if (path.indexOf('active') > -1) {
      type = 'active';
    } else if (path.indexOf('archived') > -1) {
      type = 'archived';
    }
    return type;
  };

  const getListPageProps = () => {
    const type = getListType();
    const noItemsMessage = (
      <>
        You have not created any provider yet.
        <br />
        Let’s start by creating your first provider.
      </>
    );
    if (type === 'active') {
      return {
        title: 'Healthcare Providers',
        subtitle: 'Below is a list of all your saved providers.',
        headerButtonProps: {
          title: 'Create Provider',
          onClick: () => {
            history.push(URL.CREATE_HEALTH_CARE_PROVIDER());
          },
          buttonColor: theme.palette.primary.color2,
        },
        noItemsMessage,
      };
    } else if (type === 'archived') {
      return {
        title: 'Archived Healthcare Providers',
        subtitle: 'Below is a list of all archived providers.',
        headerButtonProps: {
          title: 'Delete list permanently',
          onClick: () => {
            history.push(URL.CREATE_HEALTH_CARE_PROVIDER());
          },
          buttonColor: theme.palette.secondary.color2,
        },
        noItemsMessage,
      };
    }
  };

  const onSortRequested = async (newColumns, column, sortDirection) => {
    const variables = {
      orderBy: `${column.id}_${sortDirection.toUpperCase()}`,
    };
    await props.healthcareProviders.refetch(variables);

    setColumns(newColumns);
  };

  const onArchiveProvider = async (item) => {
    try {
      const res = await props.archiveProvider({
        where: { id: item.id },
        data: { isArchived: true },
      });
      if (res.success) {
        showToast(null, 'Healthcare Provider archived successfully');
        props.healthcareProviders.refetch();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  const onUnArchiveProvider = async (item) => {
    try {
      const res = await props.unArchiveProvider({
        where: { id: item.id },
        data: { isArchived: false },
      });
      if (res.success) {
        showToast(null, 'Healthcare Provider activated successfully');
        healthcareProviders.refetch();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  const onRemoveProvider = async (item) => {
    try {
      const res = await props.deleteHealthcareProvider({
        where: { id: item.id },
      });
      if (res.success) {
        showToast(null, 'Healthcare Provider deleted successfully');
        healthcareProviders.refetch();
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast('Something went wrong');
      throw new Error(e);
    }
  };

  const searchProvider = async (text) => {
    healthcareProviders.refetch({
      where: {
        firstName_contains: text ? text : undefined,
      },
    });
  };

  const listProps = getListPageProps();

  return (
    <SelectedDAO onChange={healthcareProviders.refetch}>
      <ListPage
        variant={getListType()}
        items={idx(healthcareProviders, (x) => x.data)}
        header={{
          title: listProps.title,
          subtitle: listProps.subtitle,
          buttonProps: listProps.headerButtonProps,
          showButton: true,
        }}
        noItemsMessage={listProps.noItemsMessage}
        actions={actions}
        columns={columns}
        onArchiveItem={onArchiveProvider}
        onSortRequested={onSortRequested}
        onUnArchiveItem={onUnArchiveProvider}
        onRemoveItem={onRemoveProvider}
        onSearch={searchProvider}
      />
    </SelectedDAO>
  );
};

HealthcareProviders.defaultProps = {
  healthcareProviders: { data: {} as any, refetch: () => {} },
  unArchiveProvider: () => ({}),
  archiveProvider: () => ({}),
  deleteHealthcareProvider: () => ({}),
};

export default compose(
  withStyles(stylesFn),
  connect((state: any) => ({ profile: state.profile })),
  // withHealthcareProviders(({ match }) => {
  //   const path = match.path;
  //   let isArchived = false;
  //   if (path.indexOf('active') > -1) {
  //     isArchived = false;
  //   } else if (path.indexOf('archived') > -1) {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'firstName_ASC',
  //     },
  //   };
  // }),
  // withDeleteHealthcareProvider(),
  // withUpdateHealthcareProvider(() => ({
  //   name: 'archiveProvider',
  // })),
  // withUpdateHealthcareProvider(() => ({
  //   name: 'unArchiveProvider',
  // })),
)(HealthcareProviders);
