
/*
type SalesOrder {
    id: ID! @id
    customer: Customer @relation(link: INLINE)
    transactionDate: DateTime
    currency: Currency
    company: Company! @relation(link: INLINE, onDelete: CASCADE)
    isArchived: Boolean @default(value: false)
    isDeleted: Boolean @default(value: false)
    createdAt: DateTime! @createdAt
    updatedAt: DateTime! @updatedAt
  }
  */