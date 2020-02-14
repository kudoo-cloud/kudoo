import { Product, ISecurityConfig, ProductType } from './types';
import {
  financeMenuItems,
  healthMenuItems,
  inventoryMenuItems,
  projectMenuItems,
  manufacturingMenuItems,
} from './menuItems';

import {
  ProjectRoutes,
  ManufacturingRoutes,
  FinanceRoutes,
  HealthRoutes,
  InventoryRoutes,
  CommonRoutes,
} from './routes';

const projectSecurity: ISecurityConfig = {
  product: Product.projects,
  menu: projectMenuItems,
  routes: ProjectRoutes,
};

const manufacturingSecurity: ISecurityConfig = {
  product: Product.manufacturing,
  menu: manufacturingMenuItems,
  routes: ManufacturingRoutes,
};

const financeSecurity: ISecurityConfig = {
  product: Product.finance,
  menu: financeMenuItems,
  routes: FinanceRoutes,
};

const healthSecurity: ISecurityConfig = {
  product: Product.health,
  menu: healthMenuItems,
  routes: HealthRoutes,
};

const inventorySecurity: ISecurityConfig = {
  product: Product.inventory,
  menu: inventoryMenuItems,
  routes: InventoryRoutes,
};

const products: ProductType[] = [
  {
    key: 'Finance',
    value: Product.finance,
    isAvailable: true,
  },
  {
    key: 'Projects',
    value: Product.projects,
    isAvailable: true,
  },
  {
    key: 'Health',
    value: Product.health,
    isAvailable: true,
  },
  {
    key: 'Inventory',
    value: Product.inventory,
    isAvailable: true,
  },
  {
    key: 'Manufacturing',
    value: Product.manufacturing,
    isAvailable: true,
  },
  {
    key: 'Mobile',
    value: Product.mobile,
    isAvailable: false,
  },
];

export {
  financeSecurity,
  healthSecurity,
  inventorySecurity,
  projectSecurity,
  manufacturingSecurity,
  products,
  CommonRoutes,
};

export default {
  [Product.finance]: financeSecurity,
  [Product.health]: healthSecurity,
  [Product.inventory]: inventorySecurity,
  [Product.mobile]: {},
  [Product.projects]: projectSecurity,
  [Product.manufacturing]: manufacturingSecurity,
};
