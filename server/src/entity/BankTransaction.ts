/*
type BankTransaction {
  id: ID! @id
  transactionDate: DateTime!
  amount: Float!
  description: String
  posted: Boolean! @default(value: false)
  ledgerJournal: LedgerJournal @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/