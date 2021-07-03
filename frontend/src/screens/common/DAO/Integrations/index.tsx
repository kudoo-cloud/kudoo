import {
  ErrorBoundary,
  SectionHeader,
  helpers as utils,
  withStyles,
} from '@kudoo/components';
// import idx from 'idx';
import queryString from 'query-string';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import URL from 'src/helpers/urls';
import ComingSoon from 'src/screens/common/ComingSoon';
import styles from './styles';

type Props = {
  actions: Record<string, any>;
  integrations: Record<string, any>;
  profile: any;
  location: any;
  classes: any;
};
type State = {};

class Integrations extends Component<Props, State> {
  static defaultProps = {
    integrations: { data: [] },
  };

  allIntegrations = [{ type: 'SLACK' }];

  columns = [
    { id: 'type', label: 'Name' },
    { id: 'integration', label: 'Integration' },
  ];

  componentDidMount() {
    const { location } = this.props;
    const search_params = queryString.parse(location.search),
      successful = search_params.successful;
    if (successful === 'false') {
      utils.showToast('Error occured while trying to integrate');
    }
    if (successful === 'true') {
      utils.showToast(null, 'Successfully integrated');
    }
    return null;
  }

  _renderSectionHeader() {
    return (
      <SectionHeader
        title='Integrations'
        subtitle='Below is a list of all supported integrations.'
      />
    );
  }

  _mergeByType(enumerable, enumerable2) {
    const data = enumerable.reduce((acc, element) => {
      acc[element.type] = Object.assign({ connected: true }, element);
      return acc;
    }, {});
    return enumerable2.reduce((acc, element) => {
      element.connected = false;
      if (acc[element.type] === undefined) {
        acc[element.type] = element;
      }
      return acc;
    }, data);
  }

  _renderIntegrated() {
    return <span className={'fa fa-check'} />;
  }

  _integrationImage(type) {
    if (type === 'slack') {
      return 'https://platform.slack-edge.com/img/add_to_slack.png';
    }
    return '';
  }

  _renderIntegrationCell(row) {
    const { classes } = this.props;
    if (row.connected) {
      return this._renderIntegrated();
    }
    const type = row.type.toLowerCase();
    //url = baseUrl + 'integration/' + type + '/init',
    // params = {
    //   'dao-auth': 'Menshen ' + get(profile, 'selectedDAO.id'),
    //   'redirect-to': location.href.split('?')[0],
    //   'user-auth': 'Menshen ' + profile.token,
    // };
    return (
      <div>
        <Link
          to={URL.INTEGRATION_LOGIN()}
          target='_blank'
          className={classes.integrationImage}
        >
          <img src={this._integrationImage(type)} />
        </Link>
      </div>
    );
  }

  _renderTypeCell(row, cell) {
    const content = row[cell.id];
    return content.charAt(0).toUpperCase() + content.substr(1).toLowerCase();
  }

  _renderCell = (row, cell, ele) => {
    const { classes } = this.props;
    if (cell.id === 'type') {
      return (
        <div className={classes.borderCell}>
          {this._renderTypeCell(row, cell)}
        </div>
      );
    }
    if (cell.id === 'integration') {
      return (
        <div className={classes.borderCell}>
          {this._renderIntegrationCell(row)}
        </div>
      );
    }
    return ele;
  };

  _renderTable() {
    // const data = get(this.props, 'integrations.data', []);
    return <ComingSoon />;
    // return (
    //   <Table
    //     cellRenderer={this._renderCell}
    //     columnData={this.columns}
    //     data={Object.values(objectData)}
    //     showRemoveIcon={false}
    //   />
    // );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.content}>
            {/* {this._renderSectionHeader()} */}
            {this._renderTable()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withIntegrations((props: any) => {
  //   const daoId = idx(props, (_) => _.profile.selectedDAO.id);
  //   return {
  //     name: 'integrations',
  //     variables: {
  //       filters: {
  //         daoId: { eq: daoId },
  //       },
  //     },
  //   };
  // }),
)(Integrations);
