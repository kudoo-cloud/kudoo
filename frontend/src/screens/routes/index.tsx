import FinanceRoutes from './finance';
import HealthRoutes from './health';
import InventoryRoutes from './inventory';
import ProjectRoutes from './projects';
import ManufacturingRoutes from './manufacturing';
import CommonRoutes from './common';
import { Product } from '@client/store/types/security';

export default {
  [Product.finance]: FinanceRoutes,
  [Product.health]: HealthRoutes,
  [Product.inventory]: InventoryRoutes,
  [Product.projects]: ProjectRoutes,
  [Product.manufacturing]: ManufacturingRoutes,
  common: CommonRoutes,
};
