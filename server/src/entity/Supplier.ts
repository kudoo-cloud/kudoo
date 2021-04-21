/*


type Supplier {
  id: ID! @id
  name: String
  address: [Address]
  termsOfPayment: SupplierTermsOfPayment
  bankAccount: Json
  emailAddressForRemittance: String
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/