import * as React from 'react';
import { Switch, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { get } from 'lodash';
import { ToastContainer } from 'react-toastify';
import Screen from 'src/screens';
import {
  ISecurityConfig,
  IMenuItem,
  Product,
  ProductType,
} from '@client/security/types';
import AppSecurity, { products } from '@client/security/index';
import {
  HeaderBar,
  Drawer,
  Footer,
  ErrorBoundary,
  Modal,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import idx from 'idx';
import { isFeatureAvailable } from '@client/security/helper';
import { toastStyle } from './styles';

export interface IProps {
  companies: any;
  profile: any;
  app: any;
  classes: any;
  actions: any;
  history: any;
  location: any;
  logRocketIdentify: (props) => void;
  checkActiveLanguage: (props) => void;
  isPreviewRoute: () => boolean;
  shouldRedirectToManageCompany: () => boolean;
}

interface IState {
  isDrawerClosed: boolean;
}

class App extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerClosed: false,
    };
  }

  public _renderDrawerMenuItem = (menuItem: IMenuItem = {} as IMenuItem) => {
    const { classes, history } = this.props;
    const pathname = get(history, 'location.pathname');
    return (
      <Link
        className={cx(classes.drawerMenuItem, {
          active: idx(menuItem, x => x.isActive(pathname)),
        })}
        to={menuItem.url}
        key={menuItem.name}>
        <div className={classes.itemIcon}>{(menuItem as any).icon()}</div>
        <div className={classes.itemTitle}>{menuItem.name}</div>
      </Link>
    );
  };

  public _renderIfGuestUser() {
    return (
      <React.Fragment>
        <div className='kudoo-app-main'>
          <Screen />
        </div>
        <Footer />
      </React.Fragment>
    );
  }

  public _renderIfUserLoggedIn() {
    const {
      classes,
      app,
      actions,
      profile,
      companies,
      profile: { selectedCompany = {} },
    } = this.props;
    const totalCompanies = get(companies, 'data', []).length;
    const businessType = get(selectedCompany, 'businessType');
    const country = get(selectedCompany, 'country');
    const menuConfig: ISecurityConfig =
      AppSecurity[app.kudoo_product || Product.inventory];
    const filteredProducts = products
      .filter(product => product.isAvailable)
      .map(product => ({ key: product.key, value: product.value }));
    const menuItems = menuConfig.menu || [];
    const filteredItems = menuItems.filter(menuItem =>
      isFeatureAvailable(profile.selectedCompany, menuItem.availability)
    );
    let initialSelectedProductIndex = 0;
    if (app.kudoo_product === Product.finance) {
      initialSelectedProductIndex = 0;
    } else if (app.kudoo_product === Product.health) {
      initialSelectedProductIndex = 1;
    } else if (app.kudoo_product === Product.inventory) {
      initialSelectedProductIndex = 2;
    }
    return (
      <div className={classes.loggedInWrapper}>
        {totalCompanies > 0 && (
          <div className={classes.drawerWrapper}>
            <Drawer
              companies={get(companies, 'data', []).filter(
                company => !company.isArchived
              )}
              selectedCompany={
                !isEmpty(selectedCompany) ? selectedCompany : companies.data[0]
              }
              onClose={() => {
                this.setState({ isDrawerClosed: true });
              }}
              onOpen={() => {
                this.setState({ isDrawerClosed: false });
              }}
              onCompanyClick={company => {
                this.props.actions.selectCompany(company);
              }}
              menuItems={filteredItems}
              renderMenuItem={this._renderDrawerMenuItem}
            />
          </div>
        )}
        <div
          className={cx(classes.loggedInRightContent, {
            'is-drawer-closed': this.state.isDrawerClosed,
            'is-drawer-hidden': totalCompanies === 0,
          })}>
          <HeaderBar
            headerLabel={app.headerTitle}
            actions={actions}
            logout={() => {}}
            profile={profile}
            noOfCompanies={totalCompanies}
            onSelectProduct={(_, data: ProductType) => {
              this.props.history.push(URL.DASHBOARD());
              this.props.actions.setKudooProduct(data.value || '');
            }}
            products={filteredProducts}
            initialSelectedProductIndex={initialSelectedProductIndex}
          />
          <Screen />
        </div>
      </div>
    );
  }

  public _renderScene() {
    const { profile } = this.props;
    const user = profile.isLoggedIn ? profile : null;
    if (this.props.isPreviewRoute()) {
      return (
        <React.Fragment>
          <Screen />
        </React.Fragment>
      );
    } else if (user) {
      if (this.props.shouldRedirectToManageCompany()) {
        return (
          <Switch>
            <Redirect to={URL.MANAGE_COMPANIES({ path: true })} />
          </Switch>
        );
      }
      return this._renderIfUserLoggedIn();
    }
    return this._renderIfGuestUser();
  }

  public render() {
    const { alertDialog } = this.props.app;
    return (
      <ErrorBoundary>
        <div className='kudoo-app'>
          {this._renderScene()}
          <Modal
            visible={alertDialog.visible}
            title={alertDialog.title}
            description={alertDialog.description}
            buttons={alertDialog.buttons}
            titleColor={alertDialog.titleColor}
            classes={alertDialog.classes}
          />
          <ToastContainer
            closeButton={false}
            hideProgressBar={true}
            toastClassName={toastStyle}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
