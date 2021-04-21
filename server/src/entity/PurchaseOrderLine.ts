/*


type PurchaseOrderLine {
  id: ID! @id
  item: Inventory @relation(link: INLINE)
  pbsDrug: String
  qty: Int
  unit: UOM
  unitPrice: Float
  site: WareHouse @relation(link: INLINE)
  purchaseOrder: PurchaseOrder @relation(link: INLINE)
  poReceipt: PoReceipt @relation(link: INLINE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/