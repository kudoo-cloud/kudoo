import { importSchema } from "graphql-import";
import { mergeTypes } from "merge-graphql-schemas";
import path from "path";

const typesArray = [
  importSchema(path.resolve(__dirname, "./account.graphql")),
  importSchema(path.resolve(__dirname, "./user.graphql")),
  importSchema(path.resolve(__dirname, "./attachment.graphql")),
  importSchema(path.resolve(__dirname, "./company.graphql")),
  importSchema(path.resolve(__dirname, "./service.graphql")),
  importSchema(path.resolve(__dirname, "./customer.graphql")),
  importSchema(path.resolve(__dirname, "./project.graphql")),
  importSchema(path.resolve(__dirname, "./timesheet.graphql")),
  importSchema(path.resolve(__dirname, "./invoice.graphql")),
  importSchema(path.resolve(__dirname, "./mainAccount.graphql")),
  importSchema(path.resolve(__dirname, "./ledgerJournal.graphql")),
  importSchema(path.resolve(__dirname, "./bankTransaction.graphql")),
  importSchema(path.resolve(__dirname, "./ledgerTransaction.graphql")),
  importSchema(path.resolve(__dirname, "./ledgerPosting.graphql")),
  importSchema(path.resolve(__dirname, "./inventory.graphql")),
  importSchema(path.resolve(__dirname, "./warehouse.graphql")),
  importSchema(path.resolve(__dirname, "./purchaseOrder.graphql")),
  importSchema(path.resolve(__dirname, "./poReceipt.graphql")),
  importSchema(path.resolve(__dirname, "./inventoryOnHand.graphql")),
  importSchema(path.resolve(__dirname, "./purchaseOrderLine.graphql")),
  importSchema(path.resolve(__dirname, "./supplier.graphql")),
  importSchema(path.resolve(__dirname, "./assetGroup.graphql")),
  importSchema(path.resolve(__dirname, "./asset.graphql")),
  importSchema(path.resolve(__dirname, "./pbsOrganisation.graphql")),
  importSchema(path.resolve(__dirname, "./pbsTPP.graphql")),
  importSchema(path.resolve(__dirname, "./apInvoice.graphql")),
  importSchema(path.resolve(__dirname, "./salesOrder.graphql")),
  importSchema(path.resolve(__dirname, "./salesOrderLine.graphql")),
  importSchema(path.resolve(__dirname, "./medicareService.graphql")),
  importSchema(path.resolve(__dirname, "./patient.graphql")),
  importSchema(path.resolve(__dirname, "./healthcareProvider.graphql")),
];

export default mergeTypes(typesArray, { all: true });
