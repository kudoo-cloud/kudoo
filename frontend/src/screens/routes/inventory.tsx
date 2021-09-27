import URL from 'src/helpers/urls';
import { IRoute } from 'src/store/types/security';
import * as Components from '../LoadableComponents';
import {
  inventoryTabs,
  pbsTabs,
  purchaseOrderTabs,
  salesTabs,
  supplierTabs,
  warehouseTabs,
} from './tab';

const paramsOptions = { path: true };

export default [
  // Suppliers
  {
    name: 'Create Supplier',
    path: URL.CREATE_SUPPLIERS(paramsOptions),
    component: Components.CreateSupplier,
  },
  {
    name: 'Edit Supplier',
    path: URL.EDIT_SUPPLIERS(paramsOptions),
    component: Components.CreateSupplier,
  },
  {
    name: 'Suppliers',
    path: URL.SUPPLIERS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: supplierTabs,
  },

  // Reoccuring Expense
  {
    name: 'Create Reoccuring Expense',
    path: URL.CREATE_REOCCURING_EXPENSE(paramsOptions),
    component: Components.CreateReoccuringExpense,
  },
  {
    name: 'Edit Reoccuring Expense',
    path: URL.EDIT_REOCCURING_EXPENSE(paramsOptions),
    component: Components.CreateReoccuringExpense,
  },

  {
    name: 'Reoccuring Expenses',
    path: URL.REOCCURING_EXPENSES(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: supplierTabs,
  },

  // Inventory
  {
    name: 'Create Inventory',
    path: URL.CREATE_INVENTORY(paramsOptions),
    component: Components.CreateInventory,
  },
  {
    name: 'Edit Inventory',
    path: URL.EDIT_INVENTORY(paramsOptions),
    component: Components.CreateInventory,
  },
  {
    name: 'Inventory',
    path: URL.INVENTORY(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: inventoryTabs,
  },
  // Warehouse
  {
    name: 'Create Warehouse',
    path: URL.CREATE_WAREHOUSE(paramsOptions),
    component: Components.CreateWarehouse,
  },
  {
    name: 'Edit Warehouse',
    path: URL.EDIT_WAREHOUSE(paramsOptions),
    component: Components.CreateWarehouse,
  },
  {
    name: 'Warehouse',
    path: URL.WAREHOUSE(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: warehouseTabs,
  },
  // Sales
  {
    name: 'Create Sales Order',
    path: URL.CREATE_SALES_ORDER(paramsOptions),
    component: Components.CreateSalesOrder,
  },
  {
    name: 'Edit Sales Order',
    path: URL.EDIT_SALES_ORDER(paramsOptions),
    component: Components.CreateSalesOrder,
  },
  {
    name: 'Sales',
    path: URL.SALES(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: salesTabs,
  },
  // Manufacturer
  {
    name: 'Edit Manufacturer',
    path: URL.EDIT_MANUFACTURER(paramsOptions),
    component: Components.ManufacturerDetails,
  },
  // PBS
  {
    name: 'PBS',
    path: URL.PBS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: pbsTabs,
  },
  {
    name: 'Create Non PBS Order',
    path: URL.CREATE_NON_PBS_PURCHASE_ORDER(paramsOptions),
    component: Components.CreatePurchaseOrder,
  },
  {
    name: 'Edit Non PBS Order',
    path: URL.EDIT_NON_PBS_PURCHASE_ORDER(paramsOptions),
    component: Components.CreatePurchaseOrder,
  },
  {
    name: 'Create PBS Order',
    path: URL.CREATE_PBS_PURCHASE_ORDER(paramsOptions),
    component: Components.CreatePbsPurchaseOrder,
  },
  {
    name: 'Edit PBS Order',
    path: URL.EDIT_PBS_PURCHASE_ORDER(paramsOptions),
    component: Components.CreatePbsPurchaseOrder,
  },
  {
    name: 'Purchase Orders',
    path: URL.PURCHASE_ORDER(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: purchaseOrderTabs,
  },
  {
    name: 'Preview PO',
    path: URL.PREVIEW_PURCHASE_ORDER(paramsOptions),
    component: Components.PreviewPO,
  },
] as IRoute[];
