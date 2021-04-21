/*


type ApInvoice {
  id: ID! @id
  status: ApInvoiceStatus
  invoiceNumber: String
  purchaseOrder: PurchaseOrder @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/