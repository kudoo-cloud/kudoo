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
    name: 'Manage Companies',
    path: URL.MANAGE_COMPANIES(paramsOptions),
    component: Components.ManageCompanies,
  },
  {
    name: 'Company Settings',
    path: URL.COMPANY_SETTINGS(paramsOptions),
    component: Components.CompanySettings,
  },
  {
    name: 'Create Company',
    path: URL.CREATE_COMPANY(paramsOptions),
    component: Components.CreateCompany,
  },
  {
    name: 'Configuration',
    path: URL.CONFIGURATION(paramsOptions),
    component: Components.Config,
    configToShow: ['UserAccountSettings', 'CompanySettings'],
  },
  {
    name: 'Account Settings',
    path: URL.ACCOUNT_SETTINGS(paramsOptions),
    component: Components.AccountSettings,
  },
] as IRoute[];
