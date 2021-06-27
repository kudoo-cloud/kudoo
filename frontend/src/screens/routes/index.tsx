import { Product } from 'src/store/types/security';
import CommonRoutes from './common';
import FinanceRoutes from './finance';
import HealthRoutes from './health';
import InventoryRoutes from './inventory';
import ManufacturingRoutes from './manufacturing';
import ProjectRoutes from './projects';

export default {
  [Product.finance]: FinanceRoutes,
  [Product.health]: HealthRoutes,
  [Product.inventory]: InventoryRoutes,
  [Product.projects]: ProjectRoutes,
  [Product.manufacturing]: ManufacturingRoutes,
  common: CommonRoutes,
};
