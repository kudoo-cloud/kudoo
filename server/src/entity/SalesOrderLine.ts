/*
type SalesOrderLine {
    id: ID! @id
    salesOrder: SalesOrder @relation(link: INLINE)
    inventory: Inventory @relation(link: INLINE)
    qty: Int
    price: Float
    isArchived: Boolean @default(value: false)
    isDeleted: Boolean @default(value: false)
    createdAt: DateTime! @createdAt
    updatedAt: DateTime! @updatedAt
  }
  */