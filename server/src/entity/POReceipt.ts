/*


type PoReceipt {
  id: ID! @id
  receiptNumber: String
  purchaseOrder: PurchaseOrder @relation(link: INLINE)
  receiptDate: DateTime
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/