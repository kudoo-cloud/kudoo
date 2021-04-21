/*

type Bank {
  id: ID! @id
  name: String
  institution: String
  bsb: String
  accountNumber: String
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/