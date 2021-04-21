/*


type Asset {
  id: ID! @id
  name: String
  assetGroup: AssetGroup @relation(link: INLINE)
  dateOfAquisition: DateTime
  aquisitionPrice: Float
  netBookValue: Float
  depreciation: Float
  salvageValue: Float
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/