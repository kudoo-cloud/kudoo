/*

type AssetGroup {
  id: ID! @id
  name: String
  depreciationType: AssetGroupDepreciationType
  usefulLife: Int
  deprMainAccount: MainAccount @relation(link: INLINE)
  #accumDeprMainAccount: MainAccount @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/