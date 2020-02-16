import { mergeResolvers } from "merge-graphql-schemas";
import AccountResolver from "./account";
import ApInvoiceResolver from "./apInvoice";
import AssetResolver from "./asset";
import AssetGroupResolver from "./assetGroup";
import AttachmentResolver from "./attachment";
import BankTransaction from "./bankTransaction";
import CompanyResolver from "./company";
import CustomerResolver from "./customer";
import AuthDirective from "./directives/auth";
import HasRolesDirective from "./directives/hasRoles";
import InventoryResolver from "./inventory";
import InventoryOnHandResolver from "./inventoryOnHand";
import InvoiceResolver from "./invoice";
import LedgerJournalResolver from "./ledgerJournal";
import LedgerPostingResolver from "./ledgerPosting";
import LedgerTransactionResolver from "./ledgerTransaction";
import MainAccountResolver from "./mainAccount";
import PbsOrganisation from "./pbsOrganisation";
import PbsTPP from "./pbsTPP";
import PoReceiptResolver from "./poReceipt";
import ProjectResolver from "./project";
import PurchaseOrderResolver from "./purchaseOrder";
import PurchaseOrderLineResolver from "./purchaseOrderLine";
import SalesOrderResolver from "./salesOrder";
import SalesOrderLineResolver from "./salesOrderLine";
import ServiceResolver from "./service";
import SupplierResolver from "./supplier";
import TimesheetResolver from "./timesheet";
import WareHouseResolver from "./warehouse";
import MediCareServiceResolver from "./medicareService";
import PatientResolver from "./patient";
import HealthcareProviderResolver from "./healthcareProvider";

const resolvers: any = mergeResolvers([
  AccountResolver,
  ApInvoiceResolver,
  BankTransaction,
  CompanyResolver,
  CustomerResolver,
  ServiceResolver,
  ProjectResolver,
  AttachmentResolver,
  TimesheetResolver,
  InvoiceResolver,
  MainAccountResolver,
  LedgerTransactionResolver,
  LedgerPostingResolver,
  InventoryResolver,
  WareHouseResolver,
  PurchaseOrderResolver,
  PoReceiptResolver,
  InventoryOnHandResolver,
  PurchaseOrderLineResolver,
  SupplierResolver,
  AssetGroupResolver,
  AssetResolver,
  LedgerJournalResolver,
  PbsOrganisation,
  PbsTPP,
  SalesOrderResolver,
  SalesOrderLineResolver,
  MediCareServiceResolver,
  PatientResolver,
  HealthcareProviderResolver,
]);

const schemaDirectives = {
  requiresAuth: AuthDirective,
  hasRoles: HasRolesDirective,
};

export default resolvers;
export { schemaDirectives };
