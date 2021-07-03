import URL from 'src/helpers/urls';
import { IRoute, LicensePlan, SecurityRole } from 'src/store/types/security';
import * as Components from '../LoadableComponents';

const paramsOptions = { path: true };

export default [
  {
    name: 'Dashboard',
    path: URL.DASHBOARD(paramsOptions),
    component: Components.Dashboard,
    previewRoute: true,
    availability: [
      {
        security: [SecurityRole.user, SecurityRole.admin, SecurityRole.owner],
      },
    ],
    licenseRequired: [
      LicensePlan.FREE,
      LicensePlan.PRO,
      LicensePlan.ENTERPRISE,
    ],
  },
  {
    name: 'Manage DAOs',
    path: URL.MANAGE_DAOS(paramsOptions),
    component: Components.ManageDAOs,
  },
  {
    name: 'DAO Settings',
    path: URL.DAO_SETTINGS(paramsOptions),
    component: Components.DAOSettings,
  },
  {
    name: 'Create DAO',
    path: URL.CREATE_DAO(paramsOptions),
    component: Components.CreateDAO,
  },
  {
    name: 'Configuration',
    path: URL.CONFIGURATION(paramsOptions),
    component: Components.Config,
    configToShow: ['UserAccountSettings', 'DAOSettings'],
  },
  {
    name: 'Account Settings',
    path: URL.ACCOUNT_SETTINGS(paramsOptions),
    component: Components.AccountSettings,
  },
] as IRoute[];
