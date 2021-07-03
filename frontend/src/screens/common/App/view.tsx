import {
  Drawer,
  ErrorBoundary,
  Footer,
  HeaderBar,
  Modal,
} from '@kudoo/components';
import cx from 'classnames';
import idx from 'idx';
import { get } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
// import { Redirect, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { isFeatureAvailable } from 'src/helpers/security';
import URL from 'src/helpers/urls';
import Configuration from 'src/kudoo.json';
import Screen from 'src/screens';
import {
  IMenuItem,
  ISecurityConfig,
  Product,
  ProductType,
} from 'src/store/types/security';
import { toastStyle } from './styles';

export interface IProps {
  DAOs: any;
  profile: any;
  app: any;
  classes: any;
  actions: any;
  history: any;
  location: any;
  checkActiveLanguage: (props) => void;
  isPreviewRoute: () => boolean;
  shouldRedirectToManageDAO: () => boolean;
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
          active: idx(menuItem, (x) => x.isActive(pathname)),
        })}
        to={menuItem.url}
        key={menuItem.name}
      >
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
      DAOs,
      profile: { selectedDAO = {} },
    } = this.props;
    const totalDAOs = get(DAOs, 'data', []).length;
    const menuConfig: ISecurityConfig =
      Configuration?.apps?.[
        (app?.kudoo_product || Product.inventory || '').toLowerCase()
      ];

    const products: {
      key: string;
      value: string;
      isAvailable: boolean;
    }[] = Object.values(Configuration.apps);
    const filteredProducts = products
      .filter((product) => product.isAvailable)
      .map((product) => ({ key: product.key, value: product.value }));
    const menuItems = Object.values(menuConfig.menu || {});
    let filteredItems: any = menuItems.filter(
      (menuItem) =>
        // TODO: for now make all items available
        true || isFeatureAvailable(profile.selectedDAO, menuItem.availability),
    );
    filteredItems = filteredItems.map((item) => {
      return {
        ...item,
        isActive: () => false,
        icon: () => <i className={item.icon as any} />,
      };
    });
    let initialSelectedProductIndex = 0;
    if (app.kudoo_product === Product.projects) {
      initialSelectedProductIndex = 0;
    } else if (app.kudoo_product === Product.finance) {
      initialSelectedProductIndex = 1;
    } else if (app.kudoo_product === Product.inventory) {
      initialSelectedProductIndex = 2;
    } else if (app.kudoo_product === Product.health) {
      initialSelectedProductIndex = 3;
    } else if (app.kudoo_product === Product.manufacturing) {
      initialSelectedProductIndex = 4;
    }
    return (
      <div className={classes.loggedInWrapper}>
        {totalDAOs > 0 && (
          <div className={classes.drawerWrapper}>
            <Drawer
              companies={get(DAOs, 'data', []).filter((dao) => !dao.isArchived)}
              selectedCompany={
                !isEmpty(selectedDAO)
                  ? selectedDAO || { name: '' }
                  : DAOs?.data?.[0] || { name: '' }
              }
              onClose={() => {
                this.setState({ isDrawerClosed: true });
              }}
              onOpen={() => {
                this.setState({ isDrawerClosed: false });
              }}
              onCompanyClick={(dao) => {
                this.props.actions.selectDAO(dao);
              }}
              menuItems={filteredItems}
              renderMenuItem={this._renderDrawerMenuItem}
            />
          </div>
        )}
        <div
          className={cx(classes.loggedInRightContent, {
            'is-drawer-closed': this.state.isDrawerClosed,
            'is-drawer-hidden': totalDAOs === 0,
          })}
        >
          <div className={classes.noInternet}>
            App is not connected to server
          </div>
          <HeaderBar
            headerLabel={app.headerTitle}
            actions={actions}
            logout={() => {}}
            profile={profile}
            noOfCompanies={totalDAOs}
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
      // if (this.props.shouldRedirectToManageDAO()) {
      //   return (
      //     <Switch>
      //       <Redirect to={URL.MANAGE_DAOS({ path: true })} />
      //     </Switch>
      //   );
      // }
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
            toastStyle={toastStyle as any}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
