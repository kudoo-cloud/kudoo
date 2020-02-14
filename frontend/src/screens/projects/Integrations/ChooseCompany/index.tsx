import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { graphql, compose } from 'react-apollo';
import {
  withStyles,
  Button,
  SearchInput,
  withRouterProps,
  withStylesProps,
  helpers as utils,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import * as accountQuery from '@kudoo/graphql/typedefs/account.gql';
import withIntegrations from '@kudoo/graphql/hoc/integration/withIntegrations';
import styles from './styles';

type Props = {
  actions: any;
  companies: Array<any>;
  profile: any;
  integrations: any;
  classes: any;
  theme: any;
};

type State = {
  isFormSubmitting: boolean;
  filteredCompanies: Array<any>;
  loading: false;
  selectedCompanyId: string | null;
};

class ChooseCompany extends Component<Props, State> {
  form: any;

  state = {
    isFormSubmitting: false,
    filteredCompanies: [],
    loading: false,
    selectedCompanyId: null,
  };

  componentDidCatch(prevProps) {
    if (!isEqual(get(this.props, 'companies'), get(prevProps, 'companies'))) {
      this.props.actions.setUserData({
        companies: get(this.props, 'companies', []),
      });
    }
  }

  filterCompany(company, type, value) {
    const list = this.props.integrations.data.filter(
      integration =>
        integration.company_id === company.id && integration.type === type
    );
    return (
      company.legalName.toLowerCase().includes(value.toLowerCase()) &&
      list.length === 0
    );
  }

  _redirectTo() {
    const query = queryString.parse(get(this.props, 'location.search', ''));
    return query.redirect || 'https://kudoo.io';
  }

  _integrationType() {
    return get(this.props, 'match.params.type', undefined);
  }

  _integrate = () => {
    if (this.state.selectedCompanyId) {
      const baseUrl = process.env.SKELM_BASE_URL,
        url =
          baseUrl +
          'integration/' +
          this._integrationType().toLowerCase() +
          '/init',
        params = {
          'company-auth': 'Menshen ' + this.state.selectedCompanyId,
          'redirect-to': this._redirectTo(),
          'user-auth': 'Menshen ' + this.props.profile.token,
        },
        queryParams = queryString.stringify(params),
        fullUrl = url + '?' + queryParams;
      location.href = fullUrl;
    }
  };

  _onCancelButtonClick = () => {
    location.href = this._redirectTo();
  };

  _onItemClick = async item => {
    this.setState({ selectedCompanyId: item.id });
  };

  _onSearch = debounce(async value => {
    this.setState({ loading: true });
    // const query = queryString.parse(get(this.props, 'location.search', ''));
    // const type = query.type;
    const type = 'SLACK';
    const items = this.props.companies.filter(company =>
      this.filterCompany(company, type, value)
    );
    this.setState({ filteredCompanies: items });
    this.setState({ loading: false });
  }, 300);

  _renderForm() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.form}>
        <SearchInput
          labelKey='legalName'
          items={this.state.filteredCompanies}
          placeholder={'Choose company …'}
          renderItem={item => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {!item.logo && (
                <div className={cx(classes.letterImage)}>
                  {utils.getFirstLetters(item.legalName || '')}
                </div>
              )}
              {item.logo && (
                <img
                  src={item.logo.url}
                  style={{
                    borderRadius: '50%',
                    marginRight: 10,
                    height: 30,
                    width: 30,
                  }}
                />
              )}
              <div>{item.legalName}</div>
            </div>
          )}
          onItemClick={this._onItemClick}
          onInputChange={this._onSearch}
        />
        <Button
          applyBorderRadius
          buttonColor={theme.palette.primary.color2}
          classes={{ component: classes.submitBtn }}
          id='choose_button'
          loading={this.state.isFormSubmitting}
          onClick={this._integrate}
          title='Choose'
          type='button'
        />
        <Button
          applyBorderRadius
          buttonColor={theme.palette.primary.color1}
          classes={{ component: classes.submitBtn }}
          id='cancel_button'
          loading={this.state.isFormSubmitting}
          onClick={this._onCancelButtonClick}
          title='Cancel'
          type='button'
        />
      </div>
    );
  }

  render() {
    const { classes, profile } = this.props;
    if (!get(profile, 'isLoggedIn')) {
      return (
        <Redirect
          from={URL.INTEGRATION_CHOOSE_COMPANY({ path: true })}
          to={
            URL.INTEGRATION_LOGIN({ path: true }) +
            `?redirect=${this._redirectTo()}` +
            `&type=${this._integrationType()}`
          }
        />
      );
    }
    return <div className={classes.page}>{this._renderForm()}</div>;
  }
}

export default compose(
  withStyles(styles),
  connect(state => ({
    profile: state.profile,
  })),
  graphql(accountQuery.me, {
    options: props => ({
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const userMembers = get(data, 'me.userMembers', []);
      return {
        companies: userMembers
          .filter(({ company, role }) => role === 'OWNER' || role === 'ADMIN')
          .map(({ company }) => company),
      };
    },
  }),
  withIntegrations(props => {
    return {
      name: 'integrations',
      variables: {
        filters: {
          companyId: { anyOf: props.companies.map(company => company.id) },
        },
      },
    };
  })
)(ChooseCompany);
