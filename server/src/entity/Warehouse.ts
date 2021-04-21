/*

type WareHouse {
  id: ID! @id
  name: String
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/