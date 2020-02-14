import * as React from 'react';
import URL from '@client/helpers/urls';
import { IMenuItem, SecurityRole } from './types';

const projectMenuItems: Array<IMenuItem> = [
  {
    name: 'Dashboard',
    order: 1,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Projects',
    order: 2,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.PROJECTS(),
    isActive: pathname => pathname.indexOf('projects') > -1,
  },
  {
    name: 'Invoices',
    order: 3,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.INVOICES(),
    isActive: pathname => pathname.indexOf('invoices') > -1,
  },
  {
    name: 'Timesheets',
    order: 4,
    availability: [
      {
        security: [SecurityRole.admin, SecurityRole.owner, SecurityRole.user],
      },
    ],
    icon: () => <i className='icon icon-projects' />,
    url: URL.TIMESHEETS(),
    isActive: pathname => pathname.indexOf('timesheets') > -1,
  },
  {
    name: 'Customers',
    order: 5,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.CUSTOMERS(),
    isActive: pathname => pathname.indexOf('customers') > -1,
  },
  {
    name: 'Services',
    order: 6,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.SERVICES(),
    isActive: pathname => pathname.indexOf('services') > -1,
  },
];

const manufacturingMenuItems: Array<IMenuItem> = [
  {
    name: 'Dashboard',
    order: 1,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Bill of Materials',
    order: 2,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Formulas',
    order: 3,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Production Orders',
    order: 4,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Routes',
    order: 5,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
];

const financeMenuItems: Array<IMenuItem> = [
  {
    name: 'Dashboard',
    order: 1,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Ledger',
    order: 2,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.LEDGER(),
    isActive: pathname => pathname.indexOf('ledger') > -1,
  },
  {
    name: 'Banking',
    order: 3,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.BANKING(),
    isActive: pathname => pathname.indexOf('banking') > -1,
  },
  {
    name: 'Assets',
    order: 4,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.ASSETS(),
    isActive: pathname => pathname.indexOf('assets') > -1,
  },

  {
    name: 'Reporting',
    order: 5,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.REPORTING(),
    isActive: pathname => pathname.indexOf('reporting') > -1,
  },
];

const inventoryMenuItems: Array<IMenuItem> = [
  {
    name: 'Dashboard',
    order: 1,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Purchase Orders',
    order: 2,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.PURCHASE_ORDER(),
    isActive: pathname => pathname.indexOf('po') > -1,
  },
  /*
  {
    name: 'PBS',
    order: 3,
    availability: [
      {
        security: [SecurityRole.admin, SecurityRole.owner],
        country: ['AU'],
        businessType: ['HEALTH'],
      },
    ],
    icon: () => <i className='icon icon-projects' />,
    url: URL.PBS(),
    isActive: pathname => pathname.indexOf('pbs') > -1,
  },
  */
  {
    name: 'Suppliers',
    order: 4,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.SUPPLIERS(),
    isActive: pathname => pathname.indexOf('suppliers') > -1,
  },
  {
    name: 'Inventory',
    order: 5,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.INVENTORY(),
    isActive: pathname => pathname.indexOf('inventory') > -1,
  },
  {
    name: 'Warehouse',
    order: 6,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.WAREHOUSE(),
    isActive: pathname => pathname.indexOf('warehouse') > -1,
  },
  {
    name: 'Sales',
    order: 7,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.SALES(),
    isActive: pathname => pathname.indexOf('sales') > -1,
  },
];

const healthMenuItems: Array<IMenuItem> = [
  {
    name: 'Dashboard',
    order: 1,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-dashboard' />,
    url: URL.DASHBOARD(),
    isActive: pathname => pathname.indexOf('dashboard') > -1,
  },
  {
    name: 'Invoices',
    order: 3,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.INVOICES(),
    isActive: pathname => pathname.indexOf('invoices') > -1,
  },
  {
    name: 'Customers',
    order: 5,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.CUSTOMERS(),
    isActive: pathname => pathname.indexOf('customers') > -1,
  },
  {
    name: 'Patients',
    order: 6,
    availability: [
      {
        security: [
          SecurityRole.admin,
          SecurityRole.owner,
          SecurityRole.healthcareProvider,
        ],
      },
    ],
    icon: () => <i className='icon icon-projects' />,
    url: URL.PATIENTS(),
    isActive: pathname => pathname.indexOf('patients') > -1,
  },
  {
    name: 'Healthcare Providers',
    order: 7,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.HEALTH_CARE_PROVIDERS(),
    isActive: pathname => pathname.indexOf('healthcareProviders') > -1,
  },
  {
    name: 'Services',
    order: 8,
    availability: [{ security: [SecurityRole.admin, SecurityRole.owner] }],
    icon: () => <i className='icon icon-projects' />,
    url: URL.SERVICES(),
    isActive: pathname => pathname.indexOf('services') > -1,
  },
];

export {
  financeMenuItems,
  inventoryMenuItems,
  healthMenuItems,
  manufacturingMenuItems,
  projectMenuItems,
};
