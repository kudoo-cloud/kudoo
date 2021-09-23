import {
  Drawer,
  ErrorBoundary,
  Footer,
  HeaderBar,
  Modal,
} from '@kudoo/components';
import cx from 'classnames';
import idx from 'idx';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
import { Link, Redirect, Switch, useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDaosQuery } from 'src/generated/graphql';
import { isFeatureAvailable } from 'src/helpers/security';
import URL from 'src/helpers/urls';
import Configuration from 'src/kudoo.json';
import Screen from 'src/screens';
import { useAllActions } from 'src/store/hooks';
import {
  IMenuItem,
  ISecurityConfig,
  Product,
  ProductType,
} from 'src/store/types/security';
import { toastStyle } from './styles';
import { isPreviewRoute, shouldRedirectToManageDAO, useData } from './useData';

export interface IProps {
  classes: any;
  location: any;
}

const App: React.FC<IProps> = (props) => {
  const { classes } = props;

  const [isDrawerClosed, setIsDrawerClosed] = React.useState(false);
  const history = useHistory();
  const actions = useAllActions();
  const { data, loading } = useDaosQuery();
  const { app, profile } = useData();
  const alertDialog = app.alertDialog;
  const selectedDAO = profile.selectedDAO;
  const daos = (data?.daos || []).filter((dao) => !dao.deletedAt);

  React.useEffect(() => {
    const firstDao = daos[0];

    if (isEmpty(profile.selectedDAO) && daos.length > 0) {
      // if there is no dao selected then select first dao by default
      if (firstDao) {
        actions.selectDAO(firstDao);
      }
    } else if (
      !isEmpty(profile.selectedDAO) &&
      !find(daos, { id: profile?.selectedDAO?.id || '' })
    ) {
      // if dao is selected , but not able to find that dao in DAOs array
      // then select first dao by default
      if (firstDao) {
        actions.selectDAO(firstDao);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daos]);

  const renderDrawerMenuItem = (menuItem: IMenuItem = {} as IMenuItem) => {
    const pathname = history?.location?.pathname;
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

  const renderIfGuestUser = () => {
    return (
      <React.Fragment>
        <div className='kudoo-app-main'>
          <Screen />
        </div>
        <Footer />
      </React.Fragment>
    );
  };

  const renderIfUserLoggedIn = () => {
    const totalDAOs = daos.length;
    const menuConfig: ISecurityConfig =
      Configuration?.apps?.[
        (app?.kudoo_product || Product.finance || '').toLowerCase()
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
        true || isFeatureAvailable(selectedDAO, menuItem.availability),
    );
    filteredItems = filteredItems.map((item) => {
      return {
        ...item,
        isActive: () => false,
        icon: () => <i className={item.icon as any} />,
      };
    });
    let initialSelectedProductIndex = 0;
    // if (app.kudoo_product === Product.projects) {
    //   initialSelectedProductIndex = 0;
    // } else if (app.kudoo_product === Product.finance) {
    //   initialSelectedProductIndex = 1;
    // } else if (app.kudoo_product === Product.inventory) {
    //   initialSelectedProductIndex = 2;
    // } else if (app.kudoo_product === Product.health) {
    //   initialSelectedProductIndex = 3;
    // } else if (app.kudoo_product === Product.manufacturing) {
    //   initialSelectedProductIndex = 4;
    // }

    return (
      <div className={classes.loggedInWrapper}>
        {totalDAOs > 0 && (
          <div className={classes.drawerWrapper}>
            <Drawer
              daos={daos.filter((dao) => !dao?.deletedAt)}
              selectedDAO={
                !isEmpty(selectedDAO)
                  ? selectedDAO || { name: '' }
                  : daos?.[0] || { name: '' }
              }
              manageDAOUrl={URL.MANAGE_DAOS()}
              onClose={() => {
                setIsDrawerClosed(false);
              }}
              onOpen={() => {
                setIsDrawerClosed(false);
              }}
              onDAOClick={(dao) => {
                actions.selectDAO(dao);
              }}
              menuItems={filteredItems}
              renderMenuItem={renderDrawerMenuItem}
            />
          </div>
        )}
        <div
          className={cx(classes.loggedInRightContent, {
            'is-drawer-closed': isDrawerClosed,
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
            noOfDAOs={totalDAOs}
            onSelectProduct={(_, data: ProductType) => {
              history.push(URL.DASHBOARD());
              actions.setKudooProduct(data.value || '');
            }}
            products={filteredProducts}
            initialSelectedProductIndex={initialSelectedProductIndex}
            accountSettingsUrl={URL.ACCOUNT_SETTINGS()}
            loginUrl={URL.LOGIN()}
            configurationUrl={URL.CONFIGURATION()}
          />
          <Screen />
        </div>
      </div>
    );
  };

  const renderScene = () => {
    const user = profile.isLoggedIn ? profile : null;
    if (isPreviewRoute(history)) {
      return (
        <React.Fragment>
          <Screen />
        </React.Fragment>
      );
    } else if (user) {
      if (shouldRedirectToManageDAO(history, data, loading)) {
        return (
          <Switch>
            <Redirect to={URL.MANAGE_DAOS({ path: true })} />
          </Switch>
        );
      }
      return renderIfUserLoggedIn();
    }
    return renderIfGuestUser();
  };

  return (
    <ErrorBoundary>
      <div className='kudoo-app'>
        {renderScene()}
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
};

export default App;
