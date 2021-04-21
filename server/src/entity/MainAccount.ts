/*
type MainAccount {
  id: ID! @id
  code: String!
  name: String!
  description: String
  type: MainAccountType!
  ConsTaxFree: Boolean! @default(value: true)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/